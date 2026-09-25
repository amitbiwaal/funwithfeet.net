import { getDb } from './db'
import { nowIso, slugify } from './utils'

export type Category = {
  id: number
  name: string
  slug: string
  description: string
  created_at: string
}

export type CategoryWithCount = Category & { post_count: number; live_count: number; last_updated: string | null }

export function listCategories(): CategoryWithCount[] {
  return getDb()
    .prepare(
      `SELECT c.*,
              COUNT(p.id) AS post_count,
              SUM(CASE WHEN p.status = 'published' AND p.published_at <= @now THEN 1 ELSE 0 END) AS live_count,
              MAX(CASE WHEN p.status = 'published' AND p.published_at <= @now THEN p.updated_at END) AS last_updated
         FROM categories c
         LEFT JOIN posts p ON p.category_id = c.id
        GROUP BY c.id
        ORDER BY c.name`,
    )
    .all({ now: nowIso() })
    .map((r) => {
      const row = r as CategoryWithCount
      return { ...row, live_count: row.live_count ?? 0 }
    })
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return getDb().prepare('SELECT * FROM categories WHERE slug = ?').get(slug) as Category | undefined
}

export function getCategoryById(id: number): Category | undefined {
  return getDb().prepare('SELECT * FROM categories WHERE id = ?').get(id) as Category | undefined
}

export function uniqueCategorySlug(wanted: string, excludeId?: number): string {
  const base = slugify(wanted) || 'category'
  const exists = getDb().prepare('SELECT id FROM categories WHERE slug = ? AND id != ?')
  let slug = base
  let n = 2
  while (exists.get(slug, excludeId ?? -1)) slug = `${base}-${n++}`
  return slug
}

export function createCategory(input: { name: string; slug: string; description: string }): number {
  const res = getDb()
    .prepare('INSERT INTO categories (name, slug, description) VALUES (@name, @slug, @description)')
    .run(input)
  return Number(res.lastInsertRowid)
}

export function updateCategory(id: number, input: { name: string; slug: string; description: string }) {
  getDb()
    .prepare('UPDATE categories SET name = @name, slug = @slug, description = @description WHERE id = @id')
    .run({ ...input, id })
}

export function deleteCategory(id: number) {
  getDb().prepare('DELETE FROM categories WHERE id = ?').run(id)
}
