'use client'

import Link from 'next/link'
import { useActionState, useState } from 'react'
import { LogoMark } from '@/components/site/LogoMark'
import { loginAction, type LoginState } from '../actions'

export function LoginForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(loginAction, {})
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="adm-login-card">
      <Link className="brand-mark" href="/">
        <LogoMark />
        <span>Fun With Feet</span>
      </Link>
      <h1>Sign in to the CMS</h1>
      <p>Manage blog posts, pages, media and messages.</p>
      <form className="adm-form" action={formAction}>
        {state.error && (
          <p className="adm-alert error" role="alert">
            {state.error}
          </p>
        )}
        <input type="hidden" name="next" value={next} />
        <div className="adm-field">
          <label htmlFor="email">Email</label>
          <input
            className="adm-input"
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            required
            autoFocus
            defaultValue={state.email}
          />
        </div>
        <div className="adm-field">
          <label htmlFor="password">Password</label>
          <div className="adm-password">
            <input
              className="adm-input"
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="adm-password-toggle"
              aria-pressed={showPassword}
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>
        <button className="btn" type="submit" disabled={pending}>
          {pending ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
