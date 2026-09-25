import { getDb } from './db'
import { RESERVED_SLUGS } from './site'
import { nowIso, slugify } from './utils'

export type Page = {
  id: number
  title: string
  slug: string
  content: string
  status: 'draft' | 'published'
  meta_title: string
  meta_description: string
  noindex: number
  created_at: string
  updated_at: string
}

export type PageInput = {
  title: string
  slug: string
  content: string
  status: 'draft' | 'published'
  meta_title: string
  meta_description: string
  noindex: boolean
}

export function listPages(): Page[] {
  return getDb().prepare('SELECT * FROM pages ORDER BY title').all() as Page[]
}

export function listPublishedPages(): Page[] {
  return getDb().prepare(`SELECT * FROM pages WHERE status = 'published' ORDER BY title`).all() as Page[]
}

export function getPageBySlug(slug: string): Page | undefined {
  return getDb().prepare('SELECT * FROM pages WHERE slug = ?').get(slug) as Page | undefined
}

export function getPageById(id: number): Page | undefined {
  return getDb().prepare('SELECT * FROM pages WHERE id = ?').get(id) as Page | undefined
}

export function uniquePageSlug(wanted: string, excludeId?: number): string {
  const base = slugify(wanted) || 'page'
  const exists = getDb().prepare('SELECT id FROM pages WHERE slug = ? AND id != ?')
  let slug = RESERVED_SLUGS.has(base) ? `${base}-page` : base
  const root = slug
  let n = 2
  while (exists.get(slug, excludeId ?? -1)) slug = `${root}-${n++}`
  return slug
}

export function createPage(input: PageInput): number {
  const res = getDb()
    .prepare(
      `INSERT INTO pages (title, slug, content, status, meta_title, meta_description, noindex)
       VALUES (@title, @slug, @content, @status, @meta_title, @meta_description, @noindex)`,
    )
    .run({ ...input, noindex: input.noindex ? 1 : 0 })
  return Number(res.lastInsertRowid)
}

export function updatePage(id: number, input: PageInput) {
  getDb()
    .prepare(
      `UPDATE pages SET title = @title, slug = @slug, content = @content, status = @status,
              meta_title = @meta_title, meta_description = @meta_description, noindex = @noindex,
              updated_at = @updated_at
        WHERE id = @id`,
    )
    .run({ ...input, noindex: input.noindex ? 1 : 0, id, updated_at: nowIso() })
}

export function deletePage(id: number) {
  getDb().prepare('DELETE FROM pages WHERE id = ?').run(id)
}
