/**
 * Create an admin user, or reset the password of an existing one.
 *
 *   npm run admin:create -- you@example.com "a-long-new-password" ["Display Name"]
 *
 * Uses the local database in ./data. For the live (Turso) database, run it with
 * TURSO_DATABASE_URL and TURSO_AUTH_TOKEN set in the environment.
 */
import { batch, get, getDb, run, stmt } from '../src/lib/db'
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

async function main() {
  const normalized = email.trim().toLowerCase()
  const existing = await get<{ id: number }>('SELECT id FROM users WHERE email = ?', [normalized])

  if (existing) {
    await batch([
      stmt('UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?', [hashPassword(password), new Date().toISOString(), existing.id]),
      stmt('DELETE FROM sessions WHERE user_id = ?', [existing.id]),
    ])
    console.log(`Password reset for ${normalized}.`)
  } else {
    await run('INSERT INTO users (email, name, password_hash) VALUES (?, ?, ?)', [normalized, name, hashPassword(password)])
    console.log(`Admin ${normalized} created.`)
  }
  ;(await getDb()).close()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
