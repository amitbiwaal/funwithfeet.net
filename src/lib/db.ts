import Database from 'better-sqlite3'
import fs from 'node:fs'
import path from 'node:path'
import { seedDatabase } from './seed'

/**
 * SQLite storage for the CMS. The database file and uploaded media live in
 * DATA_DIR (default ./data), which must be on a persistent disk in production.
 */
// Runtime-only location: the ignore hint stops the bundler from tracing the whole project into the build output.
export const DATA_DIR = path.resolve(/*turbopackIgnore: true*/ process.env.DATA_DIR || path.join(process.cwd(), 'data'))
export const UPLOAD_DIR = path.join(DATA_DIR, 'uploads')

export type DB = Database.Database

const globalForDb = globalThis as unknown as { __fwfDb?: DB }

const NOW_SQL = `(strftime('%Y-%m-%dT%H:%M:%fZ','now'))`

// Each entry upgrades the schema by one version. Never edit a shipped entry —
// append a new one instead.
const MIGRATIONS: string[] = [
  `
  CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    email TEXT NOT NULL UNIQUE COLLATE NOCASE,
    name TEXT NOT NULL DEFAULT '',
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT ${NOW_SQL},
    updated_at TEXT NOT NULL DEFAULT ${NOW_SQL}
  );
  CREATE TABLE sessions (
    id TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT ${NOW_SQL}
  );
  CREATE TABLE categories (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT ${NOW_SQL}
  );
  CREATE TABLE posts (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT NOT NULL DEFAULT '',
    content TEXT NOT NULL DEFAULT '',
    cover_image TEXT NOT NULL DEFAULT '',
    cover_alt TEXT NOT NULL DEFAULT '',
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    tags TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    featured INTEGER NOT NULL DEFAULT 0,
    meta_title TEXT NOT NULL DEFAULT '',
    meta_description TEXT NOT NULL DEFAULT '',
    noindex INTEGER NOT NULL DEFAULT 0,
    author_name TEXT NOT NULL DEFAULT '',
    published_at TEXT,
    created_at TEXT NOT NULL DEFAULT ${NOW_SQL},
    updated_at TEXT NOT NULL DEFAULT ${NOW_SQL}
  );
  CREATE INDEX idx_posts_status_published ON posts(status, published_at);
  CREATE INDEX idx_posts_category ON posts(category_id);
  CREATE TABLE pages (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    meta_title TEXT NOT NULL DEFAULT '',
    meta_description TEXT NOT NULL DEFAULT '',
    noindex INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT ${NOW_SQL},
    updated_at TEXT NOT NULL DEFAULT ${NOW_SQL}
  );
  CREATE TABLE media (
    id INTEGER PRIMARY KEY,
    path TEXT NOT NULL UNIQUE,
    original_name TEXT NOT NULL,
    mime TEXT NOT NULL,
    size INTEGER NOT NULL,
    width INTEGER,
    height INTEGER,
    alt TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT ${NOW_SQL}
  );
  CREATE TABLE messages (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL DEFAULT '',
    message TEXT NOT NULL,
    is_read INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT ${NOW_SQL}
  );
  CREATE TABLE meta (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
  `,
]

function migrate(db: DB) {
  const current = db.pragma('user_version', { simple: true }) as number
  for (let v = current; v < MIGRATIONS.length; v++) {
    db.transaction(() => {
      db.exec(MIGRATIONS[v])
      db.pragma(`user_version = ${v + 1}`)
    }).immediate()
  }
}

export function getDb(): DB {
  if (globalForDb.__fwfDb) return globalForDb.__fwfDb

  fs.mkdirSync(UPLOAD_DIR, { recursive: true })
  const db = new Database(path.join(DATA_DIR, 'cms.db'))
  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')
  db.pragma('busy_timeout = 5000')

  migrate(db)
  seedDatabase(db)

  globalForDb.__fwfDb = db
  return db
}
