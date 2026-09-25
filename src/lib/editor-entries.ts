import type { EditorEntry } from './editor-types'
import type { Page } from './pages'
import { isLive, type Post } from './posts'

export function postToEntry(p: Post): EditorEntry {
  return {
    id: p.id,
    kind: 'post',
    title: p.title,
    slug: p.slug,
    content: p.content,
    excerpt: p.excerpt,
    cover_image: p.cover_image,
    cover_alt: p.cover_alt,
    category_id: p.category_id,
    tags: p.tags,
    featured: p.featured === 1,
    status: p.status,
    meta_title: p.meta_title,
    meta_description: p.meta_description,
    noindex: p.noindex === 1,
    author_name: p.author_name,
    published_at: p.published_at,
    updated_at: p.updated_at,
    live: isLive(p),
    publicPath: `/blog/${p.slug}`,
  }
}

export function pageToEntry(p: Page): EditorEntry {
  return {
    id: p.id,
    kind: 'page',
    title: p.title,
    slug: p.slug,
    content: p.content,
    excerpt: '',
    cover_image: '',
    cover_alt: '',
    category_id: null,
    tags: '',
    featured: false,
    status: p.status,
    meta_title: p.meta_title,
    meta_description: p.meta_description,
    noindex: p.noindex === 1,
    author_name: '',
    published_at: null,
    updated_at: p.updated_at,
    live: p.status === 'published',
    publicPath: `/${p.slug}`,
  }
}

/** Accept only site-relative image paths or http(s) URLs. */
export function cleanImageUrl(raw: string): string {
  const v = raw.trim()
  if (/^\/(uploads|assets)\/[\w\-./]+$/i.test(v)) return v
  if (/^https?:\/\/[^\s"'<>]+$/i.test(v)) return v
  return ''
}

export function cleanIsoDate(raw: string): string | null {
  if (!raw) return null
  const d = new Date(raw)
  return Number.isNaN(d.getTime()) ? null : d.toISOString()
}

export function str(fd: FormData, key: string, max = 500): string {
  return String(fd.get(key) ?? '').trim().slice(0, max)
}
