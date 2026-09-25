import fs from 'node:fs'
import path from 'node:path'
import { MIME_BY_EXT, resolveUploadPath } from '@/lib/media'

// Uploaded media is written at runtime, so it can't live in /public (only files
// present at build time are served from there). This route streams it instead.
export async function GET(_req: Request, ctx: { params: Promise<{ path: string[] }> }) {
  const { path: parts } = await ctx.params
  const rel = parts.map((p) => decodeURIComponent(p)).join('/')
  if (!/^[a-z0-9/_.-]+$/i.test(rel) || rel.includes('..')) return new Response('Not found', { status: 404 })

  const abs = resolveUploadPath(rel)
  const mime = MIME_BY_EXT[path.extname(rel).slice(1).toLowerCase()]
  if (!abs || !mime || !fs.existsSync(abs)) return new Response('Not found', { status: 404 })

  const data = await fs.promises.readFile(abs)
  return new Response(new Uint8Array(data), {
    headers: {
      'Content-Type': mime,
      'Content-Length': String(data.length),
      // File names contain a random suffix and are never reused.
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
