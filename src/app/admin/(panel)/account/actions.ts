'use server'

import { redirect } from 'next/navigation'
import { createSession, requireAdmin } from '@/lib/auth'
import { batch, get, run, stmt } from '@/lib/db'
import { str } from '@/lib/editor-entries'
import { hashPassword, MIN_PASSWORD_LENGTH, verifyPassword } from '@/lib/password'

function back(q: string): never {
  redirect(`/admin/account?${q}`)
}

export async function updateProfileAction(fd: FormData) {
  const user = await requireAdmin()
  const name = str(fd, 'name', 80)
  await run('UPDATE users SET name = ?, updated_at = ? WHERE id = ?', [name, new Date().toISOString(), user.id])
  back('saved=profile')
}

export async function changePasswordAction(fd: FormData) {
  const user = await requireAdmin()
  const current = String(fd.get('current') ?? '')
  const next = String(fd.get('next') ?? '')
  const confirm = String(fd.get('confirm') ?? '')

  const row = (await get<{ password_hash: string }>('SELECT password_hash FROM users WHERE id = ?', [user.id]))!
  if (!verifyPassword(current, row.password_hash)) back(`error=${encodeURIComponent('Your current password is incorrect.')}`)
  if (next.length < MIN_PASSWORD_LENGTH) back(`error=${encodeURIComponent(`The new password must be at least ${MIN_PASSWORD_LENGTH} characters.`)}`)
  if (next !== confirm) back(`error=${encodeURIComponent('The new passwords do not match.')}`)

  await batch([
    stmt('UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?', [hashPassword(next), new Date().toISOString(), user.id]),
    // Sign out every other device, then start a fresh session here.
    stmt('DELETE FROM sessions WHERE user_id = ?', [user.id]),
  ])
  await createSession(user.id)
  back('saved=password')
}
