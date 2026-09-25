'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { sendContactMessage, type ContactState } from './actions'
import { CONTACT_SUBJECTS } from './subjects'

const initial: ContactState = { ok: false }

export function ContactForm() {
  const [state, formAction, pending] = useActionState(sendContactMessage, initial)

  if (state.ok) {
    return (
      <div className="alert alert-success" role="status">
        Thanks — your message has been sent. We usually reply within 2–3 business days.
      </div>
    )
  }

  const err = state.fieldErrors ?? {}

  return (
    <form className="form" action={formAction} noValidate>
      {state.error && (
        <p className="alert alert-error" role="alert">
          {state.error}
        </p>
      )}
      <div className="form-row">
        <div className="field">
          <label htmlFor="c-name">Your name</label>
          <input className="input" id="c-name" name="name" autoComplete="name" required maxLength={100} aria-invalid={!!err.name} />
          {err.name && <p className="field-hint">{err.name}</p>}
        </div>
        <div className="field">
          <label htmlFor="c-email">Email address</label>
          <input className="input" id="c-email" name="email" type="email" autoComplete="email" required maxLength={200} aria-invalid={!!err.email} />
          {err.email && <p className="field-hint">{err.email}</p>}
        </div>
      </div>
      <div className="field">
        <label htmlFor="c-subject">Subject</label>
        <select className="select" id="c-subject" name="subject" defaultValue={CONTACT_SUBJECTS[0]} aria-invalid={!!err.subject}>
          {CONTACT_SUBJECTS.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor="c-message">Message</label>
        <textarea className="textarea" id="c-message" name="message" required maxLength={5000} aria-invalid={!!err.message} />
        {err.message && <p className="field-hint">{err.message}</p>}
      </div>
      <div className="hp-field" aria-hidden="true">
        <label htmlFor="c-website">Leave this field empty</label>
        <input id="c-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div>
        <button className="btn" type="submit" disabled={pending}>
          {pending ? 'Sending…' : 'Send Message'}
        </button>
      </div>
      <p className="small-note">
        We only use your details to reply to you. See our <Link href="/privacy-policy">Privacy Policy</Link>.
      </p>
    </form>
  )
}
