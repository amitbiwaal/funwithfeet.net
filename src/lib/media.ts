import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { imageSize } from 'image-size'
import { getDb, UPLOAD_DIR } from './db'
import { slugify } from './utils'

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024

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
  if (file.size > MAX_UPLOAD_BYTES) throw new Error('Images must be 5 MB or smaller.')

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
  const abs = path.join(UPLOAD_DIR, ...rel.split('/'))
  fs.mkdirSync(path.dirname(abs), { recursive: true })
  fs.writeFileSync(abs, buf)

  const res = getDb()
    .prepare('INSERT INTO media (path, original_name, mime, size, width, height, alt) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .run(rel, file.name.slice(0, 200), mime, buf.length, width, height, alt.slice(0, 200))

  return {
    id: Number(res.lastInsertRowid),
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

export function listMedia(): MediaItem[] {
  return (getDb().prepare('SELECT * FROM media ORDER BY created_at DESC, id DESC').all() as Media[]).map((m) => ({
    ...m,
    url: mediaUrl(m.path),
  }))
}

export function countMedia(): number {
  return (getDb().prepare('SELECT COUNT(*) AS c FROM media').get() as { c: number }).c
}

export function updateMediaAlt(id: number, alt: string) {
  getDb().prepare('UPDATE media SET alt = ? WHERE id = ?').run(alt.slice(0, 200), id)
}

export function deleteMedia(id: number) {
  const db = getDb()
  const row = db.prepare('SELECT path FROM media WHERE id = ?').get(id) as { path: string } | undefined
  if (!row) return
  const abs = resolveUploadPath(row.path)
  if (abs) fs.rmSync(abs, { force: true })
  db.prepare('DELETE FROM media WHERE id = ?').run(id)
}

/** Map a URL path under /uploads to a file on disk, refusing anything outside UPLOAD_DIR. */
export function resolveUploadPath(rel: string): string | null {
  const abs = path.resolve(UPLOAD_DIR, ...rel.split('/'))
  const root = path.resolve(UPLOAD_DIR) + path.sep
  return abs.startsWith(root) ? abs : null
}
