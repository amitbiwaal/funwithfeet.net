import type { Metadata } from 'next'
import Link from 'next/link'
import { NoindexNotice } from '@/components/admin/NoindexNotice'
import { StatusPill } from '@/components/admin/StatusPill'
import { requireAdmin } from '@/lib/auth'
import { countMedia } from '@/lib/media'
import { listMessages } from '@/lib/messages'
import { listPostsForAdmin, postCounts } from '@/lib/posts'
import { formatDateTime, truncate } from '@/lib/utils'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const user = await requireAdmin()
  const [counts, posts, messages, mediaCount] = await Promise.all([postCounts(), listPostsForAdmin('all'), listMessages(), countMedia()])
  const recent = posts.slice(0, 6)
  const unread = messages.filter((m) => !m.is_read).length

  return (
    <>
      <div className="adm-head">
        <div>
          <h1>Welcome back{user.name ? `, ${user.name}` : ''}</h1>
          <p>Here&apos;s what&apos;s happening on FunWithFeet.net.</p>
        </div>
        <div className="adm-actions">
          <a className="btn btn-plain" href="/" target="_blank" rel="noopener">View site ↗</a>
          <Link className="btn" href="/admin/posts/new">Write a new post</Link>
        </div>
      </div>

      <NoindexNotice />

      <div className="adm-stats">
        <Link className="adm-stat" href="/admin/posts?status=published"><strong>{counts.published ?? 0}</strong><span>Published posts</span></Link>
        <Link className="adm-stat" href="/admin/posts?status=draft"><strong>{counts.drafts ?? 0}</strong><span>Drafts</span></Link>
        <Link className="adm-stat" href="/admin/posts?status=scheduled"><strong>{counts.scheduled ?? 0}</strong><span>Scheduled</span></Link>
        <Link className="adm-stat" href="/admin/messages"><strong>{unread}</strong><span>Unread messages</span></Link>
        <Link className="adm-stat" href="/admin/media"><strong>{mediaCount}</strong><span>Media files</span></Link>
      </div>

      <div className="adm-grid-2">
        <div className="adm-card">
          <div className="adm-card-head">
            <h2>Recent posts</h2>
            <Link href="/admin/posts">All posts →</Link>
          </div>
          {recent.length === 0 ? (
            <p className="adm-empty">No posts yet. <Link href="/admin/posts/new">Write your first one</Link>.</p>
          ) : (
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead><tr><th>Title</th><th>Status</th><th>Updated</th></tr></thead>
                <tbody>
                  {recent.map((p) => (
                    <tr key={p.id}>
                      <td className="title-cell"><Link href={`/admin/posts/${p.id}`}>{p.title}</Link></td>
                      <td><StatusPill status={p.status} publishedAt={p.published_at} /></td>
                      <td data-label="Updated">{formatDateTime(p.updated_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div>
          <div className="adm-card">
            <div className="adm-card-head">
              <h2>Latest messages</h2>
              <Link href="/admin/messages">Inbox →</Link>
            </div>
            {messages.length === 0 ? (
              <p className="adm-hint">No messages yet. Contact form submissions appear here.</p>
            ) : (
              <ul className="adm-links">
                {messages.slice(0, 4).map((m) => (
                  <li key={m.id}>
                    {!m.is_read && <span className="pill pill-unread">New</span>} <strong>{m.name}</strong> — {truncate(m.subject || m.message, 50)}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="adm-card">
            <h2>Site links</h2>
            <ul className="adm-links">
              <li><a href="/blog" target="_blank" rel="noopener">Blog ↗</a></li>
              <li><a href="/sitemap.xml" target="_blank" rel="noopener">sitemap.xml ↗</a></li>
              <li><a href="/feed.xml" target="_blank" rel="noopener">RSS feed ↗</a></li>
              <li><a href="/robots.txt" target="_blank" rel="noopener">robots.txt ↗</a></li>
              <li><a href="/llms.txt" target="_blank" rel="noopener">llms.txt ↗</a></li>
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}
