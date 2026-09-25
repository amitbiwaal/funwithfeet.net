import type { MetadataRoute } from 'next'
import { listCategories } from '@/lib/categories'
import { listPublishedPages } from '@/lib/pages'
import { listAllLiveForSitemap } from '@/lib/posts'
import { absoluteUrl, SITE } from '@/lib/site'

// Built from the database on every request so new posts appear immediately.
export const dynamic = 'force-dynamic'

// Images shown on the hand-built guide (listed for Google Images).
const HOW_TO_IMAGES = [
  'feet-pic-lighting-setup.jpg', 'niche-red-pedicure.jpg', 'niche-soles-arches.jpg', 'niche-cozy-socks.jpg',
  'niche-high-heels.jpg', 'niche-beach-sand.jpg', 'niche-anklets-jewellery.jpg', 'is-selling-feet-pics-legal.jpg',
].map((f) => absoluteUrl(`/assets/how-to-sell-feet-pics/${f}`))

/** Cover image plus images used inside the article, as absolute URLs. */
function postImages(cover: string, html: string): string[] {
  const inline = [...html.matchAll(/<img[^>]+src="([^"]+)"/g)].map((m) => m[1])
  return Array.from(new Set([cover, ...inline].filter(Boolean).map((src) => absoluteUrl(src)))).slice(0, 20)
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticDate = new Date(SITE.staticPagesUpdated)
  const posts = listAllLiveForSitemap().filter((p) => !p.noindex)
  const newestPost = posts[0] ? new Date(posts[0].updated_at) : staticDate

  const entries: MetadataRoute.Sitemap = [
    { url: absoluteUrl('/'), lastModified: newestPost > staticDate ? newestPost : staticDate, changeFrequency: 'weekly', priority: 1, images: [absoluteUrl(SITE.ogImage)] },
    { url: absoluteUrl('/how-to-sell-feet-pics'), lastModified: staticDate, changeFrequency: 'weekly', priority: 0.9, images: HOW_TO_IMAGES },
    // /sell-feet-pics is intentionally noindex, so it is left out.
    { url: absoluteUrl('/blog'), lastModified: newestPost, changeFrequency: 'daily', priority: 0.8 },
    { url: absoluteUrl('/about'), lastModified: staticDate, changeFrequency: 'monthly', priority: 0.5 },
    { url: absoluteUrl('/contact'), lastModified: staticDate, changeFrequency: 'yearly', priority: 0.3 },
  ]

  for (const p of posts) {
    entries.push({
      url: absoluteUrl(`/blog/${p.slug}`),
      lastModified: new Date(p.updated_at),
      changeFrequency: 'monthly',
      priority: 0.7,
      images: postImages(p.cover_image, p.content),
    })
  }
  for (const c of listCategories().filter((c) => c.live_count > 0)) {
    entries.push({
      url: absoluteUrl(`/blog/category/${c.slug}`),
      lastModified: c.last_updated ? new Date(c.last_updated) : undefined,
      changeFrequency: 'weekly',
      priority: 0.5,
    })
  }
  for (const pg of listPublishedPages().filter((pg) => !pg.noindex)) {
    entries.push({ url: absoluteUrl(`/${pg.slug}`), lastModified: new Date(pg.updated_at), changeFrequency: 'yearly', priority: 0.3 })
  }
  return entries
}
