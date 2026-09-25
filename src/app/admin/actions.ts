'use server'

import { redirect } from 'next/navigation'
import { attemptLogin, destroySession } from '@/lib/auth'

// `email` is sent back on failure so the form can keep it filled in.
export type LoginState = { error?: string; email?: string }

function safeNext(raw: FormDataEntryValue | null): string {
  const next = typeof raw === 'string' ? raw : ''
  return /^\/admin(\/[a-z0-9/_-]*)?$/i.test(next) ? next : '/admin'
}

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')
  if (!email || !password) return { error: 'Enter your email and password.', email }

  const result = await attemptLogin(email, password)
  if (!result.ok) return { error: result.error, email }
  redirect(safeNext(formData.get('next')))
}

export async function logoutAction() {
  await destroySession()
  redirect('/admin/login')
}
