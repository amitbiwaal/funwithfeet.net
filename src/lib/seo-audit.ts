import { listCategories } from './categories'
import { LANDING_PAGES } from './link-targets'
import { listPages } from './pages'
import { isLive, listPostsForAdmin } from './posts'
import { SITE } from './site'
import { stripHtml } from './utils'

export type AuditIssue = { level: 'error' | 'warn'; text: string }

export type AuditRow = {
  kind: 'post' | 'page'
  id: number
  title: string
  path: string
  editPath: string
  live: boolean
  words: number
  internalOut: number
  incoming: number
  external: number
  issues: AuditIssue[]
}

export type BrokenLink = { sourceTitle: string; editPath: string; href: string; reason: string }

/** Files and machine-readable routes that are valid link targets but not pages. */
const OTHER_VALID = new Set(['/feed.xml', '/sitemap.xml', '/llms.txt', '/robots.txt'])

function extractHrefs(html: string): string[] {
  return [...html.matchAll(/<a\s[^>]*href="([^"]+)"/gi)].map((m) => m[1].replace(/&amp;/g, '&'))
}

/** Site-relative path for an internal link, or null for external / mailto / tel links. */
export function internalPath(href: string): string | null {
  let path: string
  if (href.startsWith('/') && !href.startsWith('//')) path = href
  else if (href.toLowerCase().startsWith(SITE.url)) path = href.slice(SITE.url.length) || '/'
  else return null
  path = path.split('#')[0].split('?')[0] || '/'
  try {
    path = decodeURIComponent(path)
  } catch {
    // keep as-is
  }
  return path.length > 1 ? path.replace(/\/+$/, '') : path
}

/**
 * Link and content-quality audit of every post and CMS page: internal links in and out,
 * orphans, broken internal links, thin content and missing SEO fields.
 */
export function runSeoAudit() {
  const posts = listPostsForAdmin('all')
  const pages = listPages()

  const valid = new Set<string>([...LANDING_PAGES.map((l) => l.path), ...OTHER_VALID])
  for (const p of posts) if (isLive(p)) valid.add(`/blog/${p.slug}`)
  for (const p of pages) if (p.status === 'published') valid.add(`/${p.slug}`)
  for (const c of listCategories()) valid.add(`/blog/category/${c.slug}`)

  type Source = { kind: 'post' | 'page'; id: number; title: string; path: string; editPath: string; live: boolean; html: string }
  const sources: Source[] = [
    ...posts.map<Source>((p) => ({ kind: 'post', id: p.id, title: p.title, path: `/blog/${p.slug}`, editPath: `/admin/posts/${p.id}`, live: isLive(p), html: p.content })),
    ...pages.map<Source>((p) => ({ kind: 'page', id: p.id, title: p.title, path: `/${p.slug}`, editPath: `/admin/pages/${p.id}`, live: p.status === 'published', html: p.content })),
  ]

  // Incoming contextual links: only links written inside live content count (menus and listings don't).
  const incoming = new Map<string, Set<string>>()
  const broken: BrokenLink[] = []
  const linkStats = new Map<string, { internal: number; external: number; broken: number }>()

  for (const src of sources) {
    const stats = { internal: 0, external: 0, broken: 0 }
    for (const href of extractHrefs(src.html)) {
      const path = internalPath(href)
      if (path === null) {
        if (/^https?:\/\//i.test(href)) stats.external++
        continue
      }
      if (path.startsWith('/assets/') || path.startsWith('/uploads/')) continue
      stats.internal++
      if (!valid.has(path)) {
        stats.broken++
        const reason = path.startsWith('/blog/') ? 'Post is missing, a draft or scheduled' : 'Page does not exist'
        broken.push({ sourceTitle: src.title, editPath: src.editPath, href, reason })
      } else if (src.live && path !== src.path) {
        if (!incoming.has(path)) incoming.set(path, new Set())
        incoming.get(path)!.add(`${src.kind}:${src.id}`)
      }
    }
    linkStats.set(`${src.kind}:${src.id}`, stats)
  }

  const rows: AuditRow[] = sources.map((src) => {
    const stats = linkStats.get(`${src.kind}:${src.id}`)!
    const text = stripHtml(src.html)
    const words = text ? text.split(' ').length : 0
    const inCount = incoming.get(src.path)?.size ?? 0
    const issues: AuditIssue[] = []

    if (stats.broken) issues.push({ level: 'error', text: `${stats.broken} broken internal link${stats.broken > 1 ? 's' : ''}` })
    const imgs = [...src.html.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0])
    const noAlt = imgs.filter((tag) => !/\balt="[^"]+"/i.test(tag)).length
    if (noAlt) issues.push({ level: 'error', text: `${noAlt} image${noAlt > 1 ? 's' : ''} without alt text` })

    if (src.kind === 'post') {
      const post = posts.find((p) => p.id === src.id)!
      const title = post.meta_title || `${post.title} | Fun With Feet`
      if (words < 300) issues.push({ level: 'warn', text: `Thin content (${words} words)` })
      if (!/<h2[\s>]/i.test(src.html)) issues.push({ level: 'warn', text: 'No H2 headings' })
      if (!post.meta_description) issues.push({ level: 'warn', text: 'No meta description' })
      else if (post.meta_description.length > 160) issues.push({ level: 'warn', text: 'Meta description over 160 characters' })
      if (title.length > 65) issues.push({ level: 'warn', text: `Title is ${title.length} characters (aim for ≤ 60)` })
      if (!post.excerpt) issues.push({ level: 'warn', text: 'No excerpt' })
      if (!post.cover_image) issues.push({ level: 'warn', text: 'No cover image' })
      else if (!post.cover_alt) issues.push({ level: 'error', text: 'Cover image has no alt text' })
      if (!post.category_id) issues.push({ level: 'warn', text: 'No category' })
      if (stats.internal === 0) issues.push({ level: 'warn', text: 'No internal links to other pages' })
      if (src.live && inCount === 0) issues.push({ level: 'warn', text: 'Orphan: no other article links here' })
      if (post.noindex) issues.push({ level: 'warn', text: 'Hidden from search (noindex)' })
    }

    return {
      kind: src.kind,
      id: src.id,
      title: src.title,
      path: src.path,
      editPath: src.editPath,
      live: src.live,
      words,
      internalOut: stats.internal,
      incoming: inCount,
      external: stats.external,
      issues,
    }
  })

  const liveRows = rows.filter((r) => r.live)
  return {
    rows,
    broken,
    summary: {
      live: liveRows.length,
      orphans: liveRows.filter((r) => r.kind === 'post' && r.incoming === 0).length,
      broken: broken.length,
      errors: rows.reduce((n, r) => n + r.issues.filter((i) => i.level === 'error').length, 0),
      warnings: rows.reduce((n, r) => n + r.issues.filter((i) => i.level === 'warn').length, 0),
    },
  }
}
