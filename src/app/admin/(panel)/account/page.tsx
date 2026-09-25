import type { Metadata } from 'next'
import { Flash, param } from '@/components/admin/Flash'
import { requireAdmin } from '@/lib/auth'
import { MIN_PASSWORD_LENGTH } from '@/lib/password'
import { changePasswordAction, updateProfileAction } from './actions'

export const metadata: Metadata = { title: 'Account' }

const SAVED: Record<string, string> = {
  profile: 'Profile saved.',
  password: 'Password changed. Other devices have been signed out.',
}

export default async function AccountPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const user = await requireAdmin()
  const sp = await searchParams

  return (
    <>
      <div className="adm-head">
        <div>
          <h1>Account</h1>
          <p>Signed in as {user.email}</p>
        </div>
      </div>
      <Flash ok={SAVED[param(sp.saved)]} error={param(sp.error) || null} />
      <div className="adm-grid-2">
        <div className="adm-card">
          <h2>Change password</h2>
          <form className="adm-form" action={changePasswordAction}>
            <div className="adm-field">
              <label htmlFor="pw-current">Current password</label>
              <input id="pw-current" name="current" type="password" className="adm-input" autoComplete="current-password" required />
            </div>
            <div className="adm-field">
              <label htmlFor="pw-next">New password</label>
              <input id="pw-next" name="next" type="password" className="adm-input" autoComplete="new-password" minLength={MIN_PASSWORD_LENGTH} required />
              <p className="adm-hint">At least {MIN_PASSWORD_LENGTH} characters. A short phrase is easier to remember.</p>
            </div>
            <div className="adm-field">
              <label htmlFor="pw-confirm">Confirm new password</label>
              <input id="pw-confirm" name="confirm" type="password" className="adm-input" autoComplete="new-password" required />
            </div>
            <div><button className="btn btn-teal" type="submit">Change password</button></div>
          </form>
        </div>
        <div className="adm-card">
          <h2>Profile</h2>
          <form className="adm-form" action={updateProfileAction}>
            <div className="adm-field">
              <label htmlFor="acc-name">Display name</label>
              <input id="acc-name" name="name" className="adm-input" defaultValue={user.name} maxLength={80} />
            </div>
            <div><button className="btn btn-plain" type="submit">Save profile</button></div>
          </form>
        </div>
      </div>
    </>
  )
}
