import type { MetadataRoute } from 'next'
import { absoluteUrl, SITE_NOINDEX } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Admin, APIs and internal search result pages are not for search engines.
        disallow: ['/admin', '/api/', '/blog?q='],
      },
    ],
    // Crawling stays allowed so search engines can see the noindex; only the sitemap is withheld.
    sitemap: SITE_NOINDEX ? undefined : absoluteUrl('/sitemap.xml'),
  }
}
