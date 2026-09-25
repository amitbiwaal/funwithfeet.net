import crypto from 'node:crypto'
import { cache } from 'react'
import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getDb } from './db'
import { verifyPassword } from './password'

export const SESSION_COOKIE = 'fwf_session'
const SESSION_DAYS = 14

export type AdminUser = { id: number; email: string; name: string }

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex')
}

function cookieSecure(): boolean {
  if (process.env.COOKIE_SECURE === 'false') return false
  return process.env.NODE_ENV === 'production'
}

export async function createSession(userId: number) {
  const db = getDb()
  const token = crypto.randomBytes(32).toString('base64url')
  const expires = new Date(Date.now() + SESSION_DAYS * 86_400_000)
  db.prepare(`DELETE FROM sessions WHERE expires_at < ?`).run(new Date().toISOString())
  db.prepare('INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)').run(
    hashToken(token),
    userId,
    expires.toISOString(),
  )
  const jar = await cookies()
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: cookieSecure(),
    path: '/',
    expires,
  })
}

export async function destroySession() {
  const jar = await cookies()
  const token = jar.get(SESSION_COOKIE)?.value
  if (token) getDb().prepare('DELETE FROM sessions WHERE id = ?').run(hashToken(token))
  jar.delete(SESSION_COOKIE)
}

/** The signed-in admin for this request, or null. Cached per request. */
export const getCurrentUser = cache(async (): Promise<AdminUser | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value
  if (!token) return null
  const row = getDb()
    .prepare(
      `SELECT u.id, u.email, u.name, s.expires_at
         FROM sessions s JOIN users u ON u.id = s.user_id
        WHERE s.id = ?`,
    )
    .get(hashToken(token)) as (AdminUser & { expires_at: string }) | undefined
  if (!row || row.expires_at < new Date().toISOString()) return null
  return { id: row.id, email: row.email, name: row.name }
})

/** Use at the top of every admin page and every admin Server Action. */
export async function requireAdmin(): Promise<AdminUser> {
  const user = await getCurrentUser()
  if (!user) redirect('/admin/login')
  return user
}

// ---------- login with a small in-memory rate limit ----------

const attempts = new Map<string, { count: number; first: number }>()
const WINDOW_MS = 15 * 60_000
const MAX_ATTEMPTS = 8

async function clientKey(email: string) {
  const h = await headers()
  const ip = (h.get('x-forwarded-for') || h.get('x-real-ip') || 'local').split(',')[0].trim()
  return `${ip}|${email}`
}

export async function attemptLogin(emailRaw: string, password: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const email = emailRaw.trim().toLowerCase()
  const key = await clientKey(email)
  const now = Date.now()
  const entry = attempts.get(key)
  if (entry && now - entry.first < WINDOW_MS && entry.count >= MAX_ATTEMPTS) {
    return { ok: false, error: 'Too many sign-in attempts. Please wait 15 minutes and try again.' }
  }

  const user = getDb()
    .prepare('SELECT id, password_hash FROM users WHERE email = ?')
    .get(email) as { id: number; password_hash: string } | undefined

  if (!user || !verifyPassword(password, user.password_hash)) {
    if (!entry || now - entry.first >= WINDOW_MS) attempts.set(key, { count: 1, first: now })
    else entry.count++
    return { ok: false, error: 'Incorrect email or password.' }
  }

  attempts.delete(key)
  await createSession(user.id)
  return { ok: true }
}
