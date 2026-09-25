import crypto from 'node:crypto'
import type { DB } from './db'
import { hashPassword } from './password'
import { SEED_CATEGORIES, SEED_PAGES, SEED_POSTS } from './seed-content'

/**
 * First-run setup: admin account, starter categories, legal pages and (unless
 * SEED_DEMO_CONTENT=false) two starter articles. Runs once per database.
 */
export function seedDatabase(db: DB) {
  const seed = db.transaction(() => {
    const done = db.prepare(`SELECT value FROM meta WHERE key = 'seeded'`).get()
    if (done) return

    const { c: userCount } = db.prepare('SELECT COUNT(*) AS c FROM users').get() as { c: number }
    if (userCount === 0) {
      const email = (process.env.ADMIN_EMAIL || 'admin@funwithfeet.net').trim().toLowerCase()
      let password = process.env.ADMIN_PASSWORD || ''
      if (!password) {
        password = crypto.randomBytes(12).toString('base64url')
        console.warn(
          `\n[cms] No ADMIN_PASSWORD set. Created admin "${email}" with password: ${password}\n` +
            '[cms] Change it in Admin → Account after signing in.\n',
        )
      }
      db.prepare('INSERT INTO users (email, name, password_hash) VALUES (?, ?, ?)').run(
        email,
        'Site Admin',
        hashPassword(password),
      )
    }

    const insertCategory = db.prepare(
      'INSERT OR IGNORE INTO categories (name, slug, description) VALUES (@name, @slug, @description)',
    )
    for (const c of SEED_CATEGORIES) insertCategory.run(c)

    const insertPage = db.prepare(`
      INSERT OR IGNORE INTO pages (title, slug, content, status, meta_title, meta_description)
      VALUES (@title, @slug, @content, 'published', @meta_title, @meta_description)
    `)
    for (const p of SEED_PAGES) insertPage.run(p)

    if (process.env.SEED_DEMO_CONTENT !== 'false') {
      const categoryId = db.prepare('SELECT id FROM categories WHERE slug = ?')
      const insertPost = db.prepare(`
        INSERT OR IGNORE INTO posts
          (title, slug, excerpt, content, cover_image, cover_alt, category_id, tags, status, featured,
           meta_title, meta_description, author_name, published_at)
        VALUES
          (@title, @slug, @excerpt, @content, @cover_image, @cover_alt, @category_id, @tags, 'published', @featured,
           @meta_title, @meta_description, @author_name, @published_at)
      `)
      SEED_POSTS.forEach((p, i) => {
        const cat = categoryId.get(p.category) as { id: number } | undefined
        insertPost.run({
          ...p,
          category_id: cat?.id ?? null,
          featured: p.featured ? 1 : 0,
          published_at: new Date(Date.now() - (SEED_POSTS.length - i) * 86_400_000).toISOString(),
        })
      })
    }

    db.prepare(`INSERT INTO meta (key, value) VALUES ('seeded', ?)`).run(new Date().toISOString())
  })
  seed.immediate()
}
