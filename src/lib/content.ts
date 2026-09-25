import sanitizeHtml from 'sanitize-html'
import { SITE } from './site'
import { decodeEntities, slugify, stripHtml } from './utils'

/**
 * Whitelist for article/page HTML produced by the CMS editor. Anything outside
 * this list (scripts, iframes, inline styles, event handlers) is removed.
 */
const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    'h2', 'h3', 'h4', 'p', 'br', 'hr', 'strong', 'b', 'em', 'i', 'u', 's', 'del', 'mark', 'sub', 'sup',
    'code', 'pre', 'blockquote', 'ul', 'ol', 'li', 'a', 'img', 'figure', 'figcaption',
    'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'colgroup', 'col',
  ],
  allowedAttributes: {
    a: ['href', 'target', 'rel', 'title'],
    img: ['src', 'alt', 'title', 'width', 'height'],
    th: ['colspan', 'rowspan'],
    td: ['colspan', 'rowspan'],
    col: ['span'],
  },
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  allowedSchemesByTag: { img: ['http', 'https'] },
  allowProtocolRelative: false,
  transformTags: {
    h1: 'h2',
    b: 'strong',
    i: 'em',
    a: (tagName, attribs) => {
      const out: Record<string, string> = { href: attribs.href ?? '' }
      if (attribs.title) out.title = attribs.title
      const rel = new Set((attribs.rel ?? '').split(/\s+/).filter((r) => ['noopener', 'noreferrer', 'nofollow', 'sponsored', 'ugc'].includes(r)))
      if (attribs.target === '_blank') {
        out.target = '_blank'
        rel.add('noopener')
      }
      if (rel.size) out.rel = Array.from(rel).join(' ')
      return { tagName, attribs: out }
    },
  },
  exclusiveFilter: (frame) => frame.tag === 'a' && !frame.attribs.href,
}

export function sanitizeContent(html: string): string {
  return sanitizeHtml(html ?? '', SANITIZE_OPTIONS)
    .replace(/<p>\s*<\/p>\s*$/g, '')
    .trim()
}

export type TocItem = { id: string; text: string; level: 2 | 3 }

/**
 * Prepare stored HTML for display: sanitize, add heading anchors, wrap tables
 * for horizontal scrolling, lazy-load images and (optionally) inject a CTA box.
 */
export function renderContent(html: string, opts: { inlineCta?: boolean } = {}): { html: string; toc: TocItem[] } {
  let out = sanitizeContent(html)
  const toc: TocItem[] = []
  const used = new Set<string>()

  out = out.replace(/<(h2|h3)>([\s\S]*?)<\/\1>/g, (_m, tag: string, inner: string) => {
    const text = decodeEntities(stripHtml(inner))
    let id = slugify(text) || 'section'
    let n = 2
    while (used.has(id)) id = `${slugify(text) || 'section'}-${n++}`
    used.add(id)
    toc.push({ id, text, level: tag === 'h2' ? 2 : 3 })
    return `<${tag} id="${id}" class="anchor">${inner}</${tag}>`
  })

  out = out
    .replace(/<table>/g, '<div class="table-scroll"><table>')
    .replace(/<\/table>/g, '</table></div>')
    .replace(/<img /g, '<img loading="lazy" decoding="async" ')

  if (opts.inlineCta) {
    // Place a call-to-action before the 3rd section heading of longer articles.
    const h2Positions = [...out.matchAll(/<h2 /g)].map((m) => m.index ?? 0)
    if (h2Positions.length >= 4) {
      const at = h2Positions[2]
      const cta =
        `<aside class="inline-cta" aria-label="Start selling"><p>Ready to put this into practice? Create a free, anonymous seller profile on a dedicated feet pics marketplace.</p>` +
        `<a class="btn" href="${SITE.affiliateUrl}" target="_blank" rel="noopener sponsored">Start Selling Feet Pics</a></aside>`
      out = out.slice(0, at) + cta + out.slice(at)
    }
  }

  return { html: out, toc }
}
