import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { del, get as getBlob, put } from '@vercel/blob'
import { imageSize } from 'image-size'
import { all, get, isLocalDatabase, run, UPLOAD_DIR } from './db'
import { slugify } from './utils'

// Vercel rejects request bodies over 4.5 MB, so uploads stay below that.
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024

export type Media = {
  id: number
  path: string
  original_name: string
  mime: string
  size: number
  width: number | null
  height: number | null
  alt: string
  created_at: string
}

export type MediaItem = Media & { url: string }

const TYPES: Record<string, { mime: string; ext: string }> = {
  jpeg: { mime: 'image/jpeg', ext: 'jpg' },
  png: { mime: 'image/png', ext: 'png' },
  gif: { mime: 'image/gif', ext: 'gif' },
  webp: { mime: 'image/webp', ext: 'webp' },
  avif: { mime: 'image/avif', ext: 'avif' },
}

export const MIME_BY_EXT: Record<string, string> = {
  jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', gif: 'image/gif', webp: 'image/webp', avif: 'image/avif',
}

/*
 * Files live on disk in UPLOAD_DIR next to a local database, and in Vercel Blob
 * (at uploads/<path>) when the database is hosted, since serverless functions
 * have no persistent disk. Either way they are served from /uploads/<path>.
 */
const blobPath = (rel: string) => `uploads/${rel}`
const blobAccess = () => (process.env.BLOB_ACCESS === 'private' ? 'private' : 'public')

/** Detect the real image type from the file's first bytes (never trust the name). */
function sniff(buf: Buffer): keyof typeof TYPES | null {
  if (buf.length < 12) return null
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'jpeg'
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'png'
  if (buf.subarray(0, 4).toString('ascii') === 'GIF8') return 'gif'
  if (buf.subarray(0, 4).toString('ascii') === 'RIFF' && buf.subarray(8, 12).toString('ascii') === 'WEBP') return 'webp'
  if (buf.subarray(4, 8).toString('ascii') === 'ftyp' && /^avi[fs]$/.test(buf.subarray(8, 12).toString('ascii'))) return 'avif'
  return null
}

export function mediaUrl(relPath: string): string {
  return `/uploads/${relPath}`
}

export async function saveUpload(file: File, alt = ''): Promise<MediaItem> {
  if (!file || typeof file.arrayBuffer !== 'function') throw new Error('No file received.')
  if (file.size === 0) throw new Error('The file is empty.')
  if (file.size > MAX_UPLOAD_BYTES) throw new Error('Images must be 4 MB or smaller.')

  const buf = Buffer.from(await file.arrayBuffer())
  const kind = sniff(buf)
  if (!kind) throw new Error('Only JPG, PNG, WebP, GIF or AVIF images are allowed.')
  const { mime, ext } = TYPES[kind]

  let width: number | null = null
  let height: number | null = null
  try {
    const dims = imageSize(buf)
    width = dims.width ?? null
    height = dims.height ?? null
  } catch {
    // Dimensions are optional; the image is still valid.
  }

  const now = new Date()
  const dir = `${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, '0')}`
  const base = slugify(file.name.replace(/\.[^.]+$/, '')) || 'image'
  const rel = `${dir}/${base.slice(0, 60)}-${crypto.randomBytes(4).toString('hex')}.${ext}`
  if (isLocalDatabase()) {
    const abs = path.join(UPLOAD_DIR, ...rel.split('/'))
    fs.mkdirSync(path.dirname(abs), { recursive: true })
    fs.writeFileSync(abs, buf)
  } else {
    try {
      await put(blobPath(rel), buf, { access: blobAccess(), contentType: mime, cacheControlMaxAge: 31_536_000 })
    } catch (e) {
      console.error('[media] Vercel Blob upload failed:', e)
      throw new Error(
        'Could not save the image to Vercel Blob. Check that a Blob store is connected to this project' +
          (blobAccess() === 'public' ? ' (for a private store, also set BLOB_ACCESS=private).' : '.'),
      )
    }
  }

  const res = await run(
    'INSERT INTO media (path, original_name, mime, size, width, height, alt) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [rel, file.name.slice(0, 200), mime, buf.length, width, height, alt.slice(0, 200)],
  )

  return {
    id: res.lastInsertRowid,
    path: rel,
    original_name: file.name,
    mime,
    size: buf.length,
    width,
    height,
    alt,
    created_at: now.toISOString(),
    url: mediaUrl(rel),
  }
}

export async function listMedia(): Promise<MediaItem[]> {
  const rows = await all<Media>('SELECT * FROM media ORDER BY created_at DESC, id DESC')
  return rows.map((m) => ({ ...m, url: mediaUrl(m.path) }))
}

export async function countMedia(): Promise<number> {
  return (await get<{ c: number }>('SELECT COUNT(*) AS c FROM media'))?.c ?? 0
}

export async function updateMediaAlt(id: number, alt: string) {
  await run('UPDATE media SET alt = ? WHERE id = ?', [alt.slice(0, 200), id])
}

export async function deleteMedia(id: number) {
  const row = await get<{ path: string }>('SELECT path FROM media WHERE id = ?', [id])
  if (!row) return
  if (isLocalDatabase()) {
    const abs = resolveUploadPath(row.path)
    if (abs) fs.rmSync(abs, { force: true })
  } else {
    await del(blobPath(row.path))
  }
  await run('DELETE FROM media WHERE id = ?', [id])
}

/** An uploaded file's contents and size, or null if it does not exist. `rel` must already be validated. */
export async function readUpload(rel: string): Promise<{ body: BodyInit; size: number } | null> {
  if (isLocalDatabase()) {
    const abs = resolveUploadPath(rel)
    if (!abs || !fs.existsSync(abs)) return null
    const data = await fs.promises.readFile(abs)
    return { body: new Uint8Array(data), size: data.length }
  }
  const blob = await getBlob(blobPath(rel), { access: blobAccess() })
  return blob?.statusCode === 200 ? { body: blob.stream, size: blob.blob.size } : null
}

/** Map a URL path under /uploads to a file on disk, refusing anything outside UPLOAD_DIR. */
export function resolveUploadPath(rel: string): string | null {
  const abs = path.resolve(UPLOAD_DIR, ...rel.split('/'))
  const root = path.resolve(UPLOAD_DIR) + path.sep
  return abs.startsWith(root) ? abs : null
}
