/**
 * Site-wide constants. Everything that was repeated across the old static
 * pages (affiliate link, brand, disclaimer, verification) lives here once.
 */
export const SITE = {
  name: 'Fun With Feet',
  brand: 'FunWithFeet.net',
  url: 'https://funwithfeet.net',
  locale: 'en_US',
  themeColor: '#0f766e',
  googleVerification: 'c_TdSMOCLqsh91Hb9TPpDR0NpTA0VurAHY61AOD1In4',
  ogImage: '/assets/fun-with-feet-marketplace-og.png',
  logo: '/assets/fun-with-feet-logo.png',
  favicon: '/assets/favicon.png',
  affiliateUrl:
    'https://app.feetfinder.com/affiliate/link?af_id=97c365207f4d8-615933c06e600f70fe8-024240575f3229cc-1909bce247abe2cc48',
  editorialAuthor: 'FunWithFeet Editorial Team',
  disclaimer:
    'This page is an independent informational guide and may include affiliate links. We are not officially affiliated with Fun With Feet unless clearly stated. All brand names, logos, and trademarks belong to their respective owners. Content is intended for adults aged 18+ only.',
  // Fixed "last modified" date for the hand-built landing pages in the sitemap.
  staticPagesUpdated: '2026-09-24',
} as const

export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/how-to-sell-feet-pics', label: 'How to Sell Feet Pics' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
] as const

export const FOOTER_LINKS = {
  guides: [
    { href: '/how-to-sell-feet-pics', label: 'How to Sell Feet Pics' },
    { href: '/sell-feet-pics', label: 'Sell Feet Pics Online' },
    { href: '/blog', label: 'Blog & Guides' },
    { href: '/#faq', label: 'Fun With Feet FAQ' },
  ],
  company: [
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact' },
    { href: '/feed.xml', label: 'RSS Feed' },
  ],
  legal: [
    { href: '/privacy-policy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Use' },
    { href: '/disclaimer', label: 'Affiliate Disclosure' },
  ],
} as const

/** Absolute URL for a site path. */
export function absoluteUrl(path = '/'): string {
  if (/^https?:\/\//i.test(path)) return path
  return `${SITE.url}${path.startsWith('/') ? '' : '/'}${path}`
}

/**
 * Route segments that already exist as real pages. CMS pages may not use
 * these slugs, otherwise they could never be reached.
 */
export const RESERVED_SLUGS = new Set([
  'admin', 'api', 'blog', 'uploads', 'assets', 'about', 'contact',
  'sell-feet-pics', 'how-to-sell-feet-pics', 'sitemap.xml', 'robots.txt',
  'llms.txt', 'feed.xml', 'favicon.ico', '_next',
])
