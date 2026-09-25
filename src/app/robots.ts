import type { MetadataRoute } from 'next'
import { absoluteUrl } from '@/lib/site'

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
    sitemap: absoluteUrl('/sitemap.xml'),
  }
}
