import crypto from 'node:crypto'
import type { InStatement } from '@libsql/client'
import type { DB } from './db'
import { hashPassword } from './password'
import { SEED_CATEGORIES, SEED_PAGES, SEED_POSTS } from './seed-content'

const SEEDED = `SELECT value FROM meta WHERE key = 'seeded'`

/**
 * First-run setup: admin account, starter categories, legal pages and (unless
 * SEED_DEMO_CONTENT=false) two starter articles. Runs once per database.
 */
export async function seedDatabase(db: DB) {
  if ((await db.execute(SEEDED)).rows.length) return

  const email = (process.env.ADMIN_EMAIL || 'admin@funwithfeet.net').trim().toLowerCase()
  const generated = !process.env.ADMIN_PASSWORD
  const password = process.env.ADMIN_PASSWORD || crypto.randomBytes(12).toString('base64url')

  const statements: InStatement[] = [
    // Written first, so a second server instance seeding at the same moment fails and rolls back.
    { sql: `INSERT INTO meta (key, value) VALUES ('seeded', ?)`, args: [new Date().toISOString()] },
    {
      sql: `INSERT INTO users (email, name, password_hash) SELECT ?, 'Site Admin', ? WHERE NOT EXISTS (SELECT 1 FROM users)`,
      args: [email, hashPassword(password)],
    },
    ...SEED_CATEGORIES.map((c) => ({
      sql: 'INSERT OR IGNORE INTO categories (name, slug, description) VALUES (?, ?, ?)',
      args: [c.name, c.slug, c.description],
    })),
    ...SEED_PAGES.map((p) => ({
      sql: `INSERT OR IGNORE INTO pages (title, slug, content, status, meta_title, meta_description)
            VALUES (?, ?, ?, 'published', ?, ?)`,
      args: [p.title, p.slug, p.content, p.meta_title, p.meta_description],
    })),
  ]

  if (process.env.SEED_DEMO_CONTENT !== 'false') {
    SEED_POSTS.forEach((p, i) => {
      statements.push({
        sql: `INSERT OR IGNORE INTO posts
                (title, slug, excerpt, content, cover_image, cover_alt, category_id, tags, status, featured,
                 meta_title, meta_description, author_name, published_at)
              VALUES
                (?, ?, ?, ?, ?, ?, (SELECT id FROM categories WHERE slug = ?), ?, 'published', ?,
                 ?, ?, ?, ?)`,
        args: [
          p.title, p.slug, p.excerpt, p.content, p.cover_image, p.cover_alt, p.category, p.tags, p.featured ? 1 : 0,
          p.meta_title, p.meta_description, p.author_name,
          new Date(Date.now() - (SEED_POSTS.length - i) * 86_400_000).toISOString(),
        ],
      })
    })
  }

  let results
  try {
    results = await db.batch(statements, 'write')
  } catch (e) {
    if ((await db.execute(SEEDED)).rows.length) return // seeded by another instance
    throw e
  }

  if (generated && results[1].rowsAffected) {
    console.warn(
      `\n[cms] No ADMIN_PASSWORD set. Created admin "${email}" with password: ${password}\n` +
        '[cms] Change it in Admin → Account after signing in.\n',
    )
  }
}
