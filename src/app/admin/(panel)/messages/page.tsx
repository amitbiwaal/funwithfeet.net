import type { Metadata } from 'next'
import { ConfirmButton } from '@/components/admin/ui'
import { requireAdmin } from '@/lib/auth'
import { listMessages } from '@/lib/messages'
import { formatDateTime } from '@/lib/utils'
import { deleteMessageAction, toggleReadAction } from './actions'

export const metadata: Metadata = { title: 'Messages' }

export default async function MessagesPage() {
  await requireAdmin()
  const messages = await listMessages()
  const unread = messages.filter((m) => !m.is_read).length

  return (
    <>
      <div className="adm-head">
        <div>
          <h1>Messages</h1>
          <p>Submissions from the contact form · {unread} unread</p>
        </div>
      </div>
      {messages.length === 0 ? (
        <div className="adm-card adm-empty">No messages yet.</div>
      ) : (
        messages.map((m) => (
          <article key={m.id} className={`adm-msg${m.is_read ? '' : ' unread'}`} data-testid="message">
            <div className="adm-msg-head">
              <div className="from">
                {!m.is_read && <span className="pill pill-unread">New</span>} {m.name} <span>&lt;{m.email}&gt;</span>
              </div>
              <div>
                <strong>{m.subject}</strong> · <span className="adm-hint">{formatDateTime(m.created_at)}</span>
              </div>
            </div>
            <div className="adm-msg-body">{m.message}</div>
            <div className="adm-msg-foot">
              <a className="btn btn-sm btn-teal" href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject}`)}`}>
                Reply by email
              </a>
              <form action={toggleReadAction}>
                <input type="hidden" name="id" value={m.id} />
                <input type="hidden" name="read" value={m.is_read ? '0' : '1'} />
                <button className="btn btn-sm btn-plain" type="submit">{m.is_read ? 'Mark as unread' : 'Mark as read'}</button>
              </form>
              <form action={deleteMessageAction}>
                <input type="hidden" name="id" value={m.id} />
                <ConfirmButton message="Delete this message?">Delete</ConfirmButton>
              </form>
            </div>
          </article>
        ))
      )}
    </>
  )
}
