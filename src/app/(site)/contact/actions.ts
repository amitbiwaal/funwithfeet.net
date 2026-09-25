'use server'

import { headers } from 'next/headers'
import { createMessage } from '@/lib/messages'
import { CONTACT_SUBJECTS } from './subjects'

export type ContactState = { ok: boolean; error?: string; fieldErrors?: Record<string, string> }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

// Small per-IP limit so the form can't be used to flood the inbox.
const recent = new Map<string, number[]>()
const WINDOW_MS = 60 * 60_000
const MAX_PER_WINDOW = 5

export async function sendContactMessage(_prev: ContactState, formData: FormData): Promise<ContactState> {
  // Honeypot: real visitors never see or fill this field.
  if (String(formData.get('website') ?? '').trim()) return { ok: true }

  const name = String(formData.get('name') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()
  const subject = String(formData.get('subject') ?? '').trim()
  const message = String(formData.get('message') ?? '').trim()

  const fieldErrors: Record<string, string> = {}
  if (name.length < 2 || name.length > 100) fieldErrors.name = 'Please enter your name.'
  if (!EMAIL_RE.test(email) || email.length > 200) fieldErrors.email = 'Please enter a valid email address.'
  if (!(CONTACT_SUBJECTS as readonly string[]).includes(subject)) fieldErrors.subject = 'Please choose a subject.'
  if (message.length < 10) fieldErrors.message = 'Please write at least a sentence or two.'
  if (message.length > 5000) fieldErrors.message = 'Please keep your message under 5,000 characters.'
  if (Object.keys(fieldErrors).length) return { ok: false, error: 'Please fix the highlighted fields.', fieldErrors }

  const h = await headers()
  const ip = (h.get('x-forwarded-for') || h.get('x-real-ip') || 'local').split(',')[0].trim()
  const now = Date.now()
  const times = (recent.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  if (times.length >= MAX_PER_WINDOW) {
    return { ok: false, error: 'You have sent several messages recently. Please try again in an hour.' }
  }
  recent.set(ip, [...times, now])

  await createMessage({ name, email, subject, message })
  return { ok: true }
}
