import type { Metadata } from 'next'
import Link from 'next/link'
import { Flash, param } from '@/components/admin/Flash'
import { StatusPill } from '@/components/admin/StatusPill'
import { ConfirmButton } from '@/components/admin/ui'
import { requireAdmin } from '@/lib/auth'
import { isLive, listPostsForAdmin, postCounts, type AdminPostFilter } from '@/lib/posts'
import { formatDateTime } from '@/lib/utils'
import { deletePostAction } from './actions'

export const metadata: Metadata = { title: 'Posts' }

const FILTERS: Array<{ key: AdminPostFilter; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'published', label: 'Published' },
  { key: 'draft', label: 'Drafts' },
  { key: 'scheduled', label: 'Scheduled' },
]

export default async function PostsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireAdmin()
  const sp = await searchParams
  const statusParam = param(sp.status)
  const filter = (FILTERS.some((f) => f.key === statusParam) ? statusParam : 'all') as AdminPostFilter
  const q = param(sp.q).trim().slice(0, 80)
  const posts = listPostsForAdmin(filter, q)
  const counts = postCounts()
  const countFor: Record<AdminPostFilter, number> = {
    all: counts.total,
    published: counts.published ?? 0,
    draft: counts.drafts ?? 0,
    scheduled: counts.scheduled ?? 0,
  }

  return (
    <>
      <div className="adm-head">
        <div>
          <h1>Posts</h1>
          <p>Write, edit, schedule and publish blog articles.</p>
        </div>
        <Link className="btn" href="/admin/posts/new">New post</Link>
      </div>

      <Flash ok={param(sp.deleted) ? 'Post deleted.' : null} />

      <div className="adm-toolbar">
        <nav className="adm-tabs" aria-label="Filter posts">
          {FILTERS.map((f) => (
            <Link
              key={f.key}
              href={f.key === 'all' ? '/admin/posts' : `/admin/posts?status=${f.key}`}
              className={filter === f.key ? 'active' : undefined}
              aria-current={filter === f.key ? 'page' : undefined}
            >
              {f.label} ({countFor[f.key]})
            </Link>
          ))}
        </nav>
        <form className="adm-search" action="/admin/posts" role="search">
          {filter !== 'all' && <input type="hidden" name="status" value={filter} />}
          <input type="search" name="q" defaultValue={q} placeholder="Search posts…" aria-label="Search posts" />
          <button type="submit">Search</button>
        </form>
      </div>

      <div className="adm-table-wrap">
        {posts.length === 0 ? (
          <p className="adm-empty">
            {q ? `No posts match “${q}”.` : 'No posts here yet.'} <Link href="/admin/posts/new">Write a post</Link>
          </p>
        ) : (
          <table className="adm-table" data-testid="posts-table">
            <thead>
              <tr><th>Title</th><th>Category</th><th>Status</th><th>Date</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id}>
                  <td className="title-cell">
                    <Link href={`/admin/posts/${p.id}`}>{p.title}</Link>
                    <span className="sub">/blog/{p.slug}</span>
                  </td>
                  <td>{p.category_name ?? '—'}</td>
                  <td><StatusPill status={p.status} publishedAt={p.published_at} /></td>
                  <td>
                    {p.status === 'published' && p.published_at ? formatDateTime(p.published_at) : `Edited ${formatDateTime(p.updated_at)}`}
                  </td>
                  <td>
                    <div className="adm-row-actions">
                      <Link className="btn btn-sm btn-plain" href={`/admin/posts/${p.id}`}>Edit</Link>
                      <a className="btn btn-sm btn-plain" href={`/blog/${p.slug}`} target="_blank" rel="noopener">
                        {isLive(p) ? 'View' : 'Preview'}
                      </a>
                      <form action={deletePostAction}>
                        <input type="hidden" name="id" value={p.id} />
                        <ConfirmButton message={`Delete “${p.title}” permanently?`} label={`Delete ${p.title}`}>Delete</ConfirmButton>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  )
}
