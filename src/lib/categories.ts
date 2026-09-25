import { all, batch, get, run, stmt } from './db'
import { nowIso, slugify } from './utils'

export type Category = {
  id: number
  name: string
  slug: string
  description: string
  created_at: string
}

export type CategoryWithCount = Category & { post_count: number; live_count: number; last_updated: string | null }

export async function listCategories(): Promise<CategoryWithCount[]> {
  const rows = await all<CategoryWithCount>(
    `SELECT c.*,
            COUNT(p.id) AS post_count,
            SUM(CASE WHEN p.status = 'published' AND p.published_at <= @now THEN 1 ELSE 0 END) AS live_count,
            MAX(CASE WHEN p.status = 'published' AND p.published_at <= @now THEN p.updated_at END) AS last_updated
       FROM categories c
       LEFT JOIN posts p ON p.category_id = c.id
      GROUP BY c.id
      ORDER BY c.name`,
    { now: nowIso() },
  )
  return rows.map((row) => ({ ...row, live_count: row.live_count ?? 0 }))
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  return get<Category>('SELECT * FROM categories WHERE slug = ?', [slug])
}

export async function getCategoryById(id: number): Promise<Category | undefined> {
  return get<Category>('SELECT * FROM categories WHERE id = ?', [id])
}

export async function uniqueCategorySlug(wanted: string, excludeId?: number): Promise<string> {
  const base = slugify(wanted) || 'category'
  let slug = base
  let n = 2
  while (await get('SELECT id FROM categories WHERE slug = ? AND id != ?', [slug, excludeId ?? -1])) slug = `${base}-${n++}`
  return slug
}

export async function createCategory(input: { name: string; slug: string; description: string }): Promise<number> {
  const res = await run('INSERT INTO categories (name, slug, description) VALUES (@name, @slug, @description)', input)
  return res.lastInsertRowid
}

export async function updateCategory(id: number, input: { name: string; slug: string; description: string }) {
  await run('UPDATE categories SET name = @name, slug = @slug, description = @description WHERE id = @id', { ...input, id })
}

export async function deleteCategory(id: number) {
  // Its posts stay, without a category. Done here rather than by the foreign key,
  // which only acts on connections that have foreign keys switched on.
  await batch([
    stmt('UPDATE posts SET category_id = NULL WHERE category_id = ?', [id]),
    stmt('DELETE FROM categories WHERE id = ?', [id]),
  ])
}
