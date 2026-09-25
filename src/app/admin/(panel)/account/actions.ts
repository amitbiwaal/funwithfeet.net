'use server'

import { redirect } from 'next/navigation'
import { createSession, requireAdmin } from '@/lib/auth'
import { getDb } from '@/lib/db'
import { str } from '@/lib/editor-entries'
import { hashPassword, MIN_PASSWORD_LENGTH, verifyPassword } from '@/lib/password'

function back(q: string): never {
  redirect(`/admin/account?${q}`)
}

export async function updateProfileAction(fd: FormData) {
  const user = await requireAdmin()
  const name = str(fd, 'name', 80)
  getDb().prepare('UPDATE users SET name = ?, updated_at = ? WHERE id = ?').run(name, new Date().toISOString(), user.id)
  back('saved=profile')
}

export async function changePasswordAction(fd: FormData) {
  const user = await requireAdmin()
  const current = String(fd.get('current') ?? '')
  const next = String(fd.get('next') ?? '')
  const confirm = String(fd.get('confirm') ?? '')

  const row = getDb().prepare('SELECT password_hash FROM users WHERE id = ?').get(user.id) as { password_hash: string }
  if (!verifyPassword(current, row.password_hash)) back(`error=${encodeURIComponent('Your current password is incorrect.')}`)
  if (next.length < MIN_PASSWORD_LENGTH) back(`error=${encodeURIComponent(`The new password must be at least ${MIN_PASSWORD_LENGTH} characters.`)}`)
  if (next !== confirm) back(`error=${encodeURIComponent('The new passwords do not match.')}`)

  const db = getDb()
  db.prepare('UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?').run(hashPassword(next), new Date().toISOString(), user.id)
  // Sign out every other device, then start a fresh session here.
  db.prepare('DELETE FROM sessions WHERE user_id = ?').run(user.id)
  await createSession(user.id)
  back('saved=password')
}
