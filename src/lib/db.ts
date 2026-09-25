import fs from 'node:fs'
import path from 'node:path'
import type { Client, InArgs, InStatement, ResultSet } from '@libsql/client'
import { seedDatabase } from './seed'

/**
 * CMS storage. In production the database is Turso (hosted SQLite): set
 * TURSO_DATABASE_URL and TURSO_AUTH_TOKEN, because serverless hosts such as
 * Vercel have no persistent disk. Without TURSO_DATABASE_URL the database is a
 * local SQLite file in DATA_DIR (default ./data), and uploaded media is stored
 * next to it.
 */
// Runtime-only location: the ignore hint stops the bundler from tracing the whole project into the build output.
export const DATA_DIR = path.resolve(/*turbopackIgnore: true*/ process.env.DATA_DIR || path.join(process.cwd(), 'data'))
export const UPLOAD_DIR = path.join(DATA_DIR, 'uploads')

export type DB = Client
/** Positional (`?`) or named (`@name`) statement arguments. */
export type Args = unknown[] | Record<string, unknown>

const globalForDb = globalThis as unknown as { __fwfDbClient?: Promise<DB> }

const NOW_SQL = `(strftime('%Y-%m-%dT%H:%M:%fZ','now'))`

// Each entry upgrades the schema by one version. Never edit a shipped entry —
// append a new one instead. Statements are split on ";", so keep semicolons
// out of string literals.
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

/** TURSO_DATABASE_URL (libsql://… or file:…), else the SQLite file in DATA_DIR. */
function databaseUrl(): string {
  return process.env.TURSO_DATABASE_URL || `file:${path.join(DATA_DIR, 'cms.db').split(path.sep).join('/')}`
}

/** True when the database is a local file, so uploads are kept on the same disk (UPLOAD_DIR). */
export function isLocalDatabase(): boolean {
  return databaseUrl().startsWith('file:')
}

async function connect(): Promise<DB> {
  const url = databaseUrl()
  if (!url.startsWith('file:')) {
    // The HTTP client has no native code, so it loads in any serverless function.
    const { createClient } = await import('@libsql/client/web')
    return createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN })
  }
  if (process.env.VERCEL) {
    throw new Error(
      'TURSO_DATABASE_URL is not set. Vercel has no persistent disk, so connect a Turso database to this project (see README → Deploying).',
    )
  }
  fs.mkdirSync(path.dirname(path.resolve(url.slice('file:'.length))), { recursive: true })
  const { createClient } = await import('@libsql/client')
  const db = createClient({ url })
  await db.execute('PRAGMA journal_mode = WAL')
  await db.execute('PRAGMA busy_timeout = 5000')
  await db.execute('PRAGMA foreign_keys = ON')
  return db
}

async function appliedVersion(db: DB): Promise<number> {
  const rs = await db.execute('SELECT MAX(version) AS v FROM schema_migrations')
  return Number(rs.rows[0]?.v ?? 0)
}

async function migrate(db: DB) {
  await db.execute(
    `CREATE TABLE IF NOT EXISTS schema_migrations (version INTEGER PRIMARY KEY, applied_at TEXT NOT NULL DEFAULT ${NOW_SQL})`,
  )
  let current = await appliedVersion(db)
  if (current === 0) {
    // Databases created before schema_migrations existed kept their version in PRAGMA user_version.
    const legacy = await db.execute('PRAGMA user_version').then((rs) => Number(rs.rows[0]?.[0] ?? 0), () => 0)
    for (let v = 1; v <= Math.min(legacy, MIGRATIONS.length); v++) {
      await db.execute({ sql: 'INSERT OR IGNORE INTO schema_migrations (version) VALUES (?)', args: [v] })
    }
    current = await appliedVersion(db)
  }
  for (let v = current; v < MIGRATIONS.length; v++) {
    const statements = MIGRATIONS[v].split(';').map((s) => s.trim()).filter(Boolean)
    try {
      // Recording the version first makes a second server instance that migrates at the same moment fail and roll back.
      await db.batch([{ sql: 'INSERT INTO schema_migrations (version) VALUES (?)', args: [v + 1] }, ...statements], 'write')
    } catch (e) {
      if ((await appliedVersion(db)) <= v) throw e
    }
  }
}

async function open(): Promise<DB> {
  const db = await connect()
  try {
    await migrate(db)
    await seedDatabase(db)
  } catch (e) {
    db.close()
    throw e
  }
  return db
}

/** The database, migrated and seeded on first use. */
export function getDb(): Promise<DB> {
  globalForDb.__fwfDbClient ??= open().catch((e: unknown) => {
    globalForDb.__fwfDbClient = undefined // try again on the next request
    throw e
  })
  return globalForDb.__fwfDbClient
}

/**
 * Named arguments keyed exactly as the SQL spells them ({ now } → "@now"), and only
 * those it uses: SQLite's own parameter names, which local and hosted databases both bind.
 */
function bind(sql: string, args: Args = []): InArgs {
  if (Array.isArray(args)) return args as InArgs
  const spelled = new Map(Array.from(sql.matchAll(/([@:$])([A-Za-z_]\w*)/g), (m) => [m[2], m[1] + m[2]]))
  return Object.fromEntries(
    Object.entries(args).flatMap(([name, value]) => (spelled.has(name) ? [[spelled.get(name)!, value]] : [])),
  ) as InArgs
}

/** A statement for batch(). */
export function stmt(sql: string, args?: Args): InStatement {
  return { sql, args: bind(sql, args) }
}

function toObjects<T>(rs: ResultSet): T[] {
  return rs.rows.map((row) => Object.fromEntries(rs.columns.map((col, i) => [col, row[i]])) as T)
}

/** All matching rows, as plain objects. */
export async function all<T>(sql: string, args?: Args): Promise<T[]> {
  const db = await getDb()
  return toObjects<T>(await db.execute(stmt(sql, args)))
}

/** The first matching row, or undefined. */
export async function get<T>(sql: string, args?: Args): Promise<T | undefined> {
  return (await all<T>(sql, args))[0]
}

export async function run(sql: string, args?: Args): Promise<{ changes: number; lastInsertRowid: number }> {
  const db = await getDb()
  const rs = await db.execute(stmt(sql, args))
  return { changes: rs.rowsAffected, lastInsertRowid: Number(rs.lastInsertRowid ?? 0) }
}

/** Run several write statements in one transaction. */
export async function batch(statements: InStatement[]): Promise<ResultSet[]> {
  const db = await getDb()
  return db.batch(statements, 'write')
}
