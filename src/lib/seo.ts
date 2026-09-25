import type { Metadata } from 'next'
import { absoluteUrl, SITE, SITE_NOINDEX } from './site'

type MetaOptions = {
  title: string
  description: string
  path: string
  keywords?: string
  image?: string
  type?: 'website' | 'article'
  noindex?: boolean
  ogTitle?: string
  ogDescription?: string
  twitterTitle?: string
  twitterDescription?: string
  publishedTime?: string | null
  modifiedTime?: string | null
  section?: string | null
  tags?: string[]
}

/**
 * Complete metadata for one page. Next.js merges metadata shallowly, so each
 * page returns the full Open Graph / Twitter objects rather than relying on
 * the root layout.
 */
export function buildMetadata(o: MetaOptions): Metadata {
  const url = absoluteUrl(o.path)
  const image = absoluteUrl(o.image || SITE.ogImage)
  const robots = o.noindex || SITE_NOINDEX
    ? { index: false, follow: true, googleBot: { index: false, follow: true } }
    : { index: true, follow: true }

  return {
    title: { absolute: o.title },
    description: o.description,
    keywords: o.keywords,
    alternates: { canonical: url },
    robots,
    openGraph: {
      title: o.ogTitle ?? o.title,
      description: o.ogDescription ?? o.description,
      url,
      siteName: SITE.brand,
      type: o.type ?? 'website',
      images: [{ url: image }],
      ...(o.type === 'article'
        ? {
            publishedTime: o.publishedTime ?? undefined,
            modifiedTime: o.modifiedTime ?? undefined,
            section: o.section ?? undefined,
            tags: o.tags,
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: o.twitterTitle ?? o.ogTitle ?? o.title,
      description: o.twitterDescription ?? o.ogDescription ?? o.description,
      images: [image],
    },
  }
}

export function breadcrumbLd(items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  }
}

export const PUBLISHER_LD = {
  '@type': 'Organization',
  name: SITE.brand,
  logo: { '@type': 'ImageObject', url: absoluteUrl(SITE.logo) },
}
