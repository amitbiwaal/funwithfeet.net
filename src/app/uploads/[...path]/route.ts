import path from 'node:path'
import { MIME_BY_EXT, readUpload } from '@/lib/media'

// Uploaded media is written at runtime, so it can't live in /public (only files
// present at build time are served from there). This route streams it instead,
// from disk or from Vercel Blob (see lib/media).
export async function GET(_req: Request, ctx: { params: Promise<{ path: string[] }> }) {
  const { path: parts } = await ctx.params
  const rel = parts.map((p) => decodeURIComponent(p)).join('/')
  if (!/^[a-z0-9/_.-]+$/i.test(rel) || rel.includes('..')) return new Response('Not found', { status: 404 })

  const mime = MIME_BY_EXT[path.extname(rel).slice(1).toLowerCase()]
  const file = mime ? await readUpload(rel) : null
  if (!file) return new Response('Not found', { status: 404 })

  return new Response(file.body, {
    headers: {
      'Content-Type': mime,
      'Content-Length': String(file.size),
      // File names contain a random suffix and are never reused, so browsers and the CDN (s-maxage) keep them.
      'Cache-Control': 'public, max-age=31536000, s-maxage=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
