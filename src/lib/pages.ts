import { all, get, run } from './db'
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

export async function listPages(): Promise<Page[]> {
  return all<Page>('SELECT * FROM pages ORDER BY title')
}

export async function listPublishedPages(): Promise<Page[]> {
  return all<Page>(`SELECT * FROM pages WHERE status = 'published' ORDER BY title`)
}

export async function getPageBySlug(slug: string): Promise<Page | undefined> {
  return get<Page>('SELECT * FROM pages WHERE slug = ?', [slug])
}

export async function getPageById(id: number): Promise<Page | undefined> {
  return get<Page>('SELECT * FROM pages WHERE id = ?', [id])
}

export async function uniquePageSlug(wanted: string, excludeId?: number): Promise<string> {
  const base = slugify(wanted) || 'page'
  let slug = RESERVED_SLUGS.has(base) ? `${base}-page` : base
  const root = slug
  let n = 2
  while (await get('SELECT id FROM pages WHERE slug = ? AND id != ?', [slug, excludeId ?? -1])) slug = `${root}-${n++}`
  return slug
}

export async function createPage(input: PageInput): Promise<number> {
  const res = await run(
    `INSERT INTO pages (title, slug, content, status, meta_title, meta_description, noindex)
     VALUES (@title, @slug, @content, @status, @meta_title, @meta_description, @noindex)`,
    { ...input, noindex: input.noindex ? 1 : 0 },
  )
  return res.lastInsertRowid
}

export async function updatePage(id: number, input: PageInput) {
  await run(
    `UPDATE pages SET title = @title, slug = @slug, content = @content, status = @status,
            meta_title = @meta_title, meta_description = @meta_description, noindex = @noindex,
            updated_at = @updated_at
      WHERE id = @id`,
    { ...input, noindex: input.noindex ? 1 : 0, id, updated_at: nowIso() },
  )
}

export async function deletePage(id: number) {
  await run('DELETE FROM pages WHERE id = ?', [id])
}
