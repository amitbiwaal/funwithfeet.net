import { listLivePosts, postSummary } from '@/lib/posts'
import { absoluteUrl, SITE } from '@/lib/site'

export const dynamic = 'force-dynamic'

function esc(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

export async function GET() {
  const { posts } = await listLivePosts({ limit: 30 })
  const items = posts
    .map((p) => {
      const url = absoluteUrl(`/blog/${p.slug}`)
      return `    <item>
      <title>${esc(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(p.published_at ?? p.created_at).toUTCString()}</pubDate>
      ${p.category_name ? `<category>${esc(p.category_name)}</category>` : ''}
      <description>${esc(postSummary(p, 300))}</description>
    </item>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(SITE.brand)} Blog</title>
    <link>${absoluteUrl('/blog')}</link>
    <atom:link href="${absoluteUrl('/feed.xml')}" rel="self" type="application/rss+xml" />
    <description>Guides and tips for selling feet pics safely: pricing, photography, privacy and scam protection.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8', 'Cache-Control': 'public, max-age=600' },
  })
}
