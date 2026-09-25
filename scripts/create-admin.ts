/**
 * Create an admin user, or reset the password of an existing one.
 *
 *   npm run admin:create -- you@example.com "a-long-new-password" ["Display Name"]
 */
import { getDb } from '../src/lib/db'
import { hashPassword, MIN_PASSWORD_LENGTH } from '../src/lib/password'

const [email, password, name = 'Site Admin'] = process.argv.slice(2)

if (!email || !password) {
  console.error('Usage: npm run admin:create -- <email> <password> [name]')
  process.exit(1)
}
if (password.length < MIN_PASSWORD_LENGTH) {
  console.error(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`)
  process.exit(1)
}

const db = getDb()
const normalized = email.trim().toLowerCase()
const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(normalized) as { id: number } | undefined

if (existing) {
  db.prepare('UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?').run(hashPassword(password), new Date().toISOString(), existing.id)
  db.prepare('DELETE FROM sessions WHERE user_id = ?').run(existing.id)
  console.log(`Password reset for ${normalized}.`)
} else {
  db.prepare('INSERT INTO users (email, name, password_hash) VALUES (?, ?, ?)').run(normalized, name, hashPassword(password))
  console.log(`Admin ${normalized} created.`)
}
