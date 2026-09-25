import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { LoginForm } from './LoginForm'

export const metadata: Metadata = { title: 'Sign in' }

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  if (await getCurrentUser()) redirect('/admin')
  const { next } = await searchParams
  return (
    <div className="adm-login">
      <LoginForm next={typeof next === 'string' ? next : ''} />
    </div>
  )
}
