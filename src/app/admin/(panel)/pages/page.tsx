import type { Metadata } from 'next'
import Link from 'next/link'
import { Flash, param } from '@/components/admin/Flash'
import { ConfirmButton } from '@/components/admin/ui'
import { requireAdmin } from '@/lib/auth'
import { listPages } from '@/lib/pages'
import { formatDateTime } from '@/lib/utils'
import { deletePageAction } from './actions'

export const metadata: Metadata = { title: 'Pages' }

export default async function PagesListPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireAdmin()
  const sp = await searchParams
  const pages = await listPages()

  return (
    <>
      <div className="adm-head">
        <div>
          <h1>Pages</h1>
          <p>Simple content pages such as the Privacy Policy, Terms and Disclaimer. Each page lives at funwithfeet.net/slug.</p>
        </div>
        <Link className="btn" href="/admin/pages/new">New page</Link>
      </div>
      <Flash ok={param(sp.deleted) ? 'Page deleted.' : null} />
      <div className="adm-table-wrap">
        {pages.length === 0 ? (
          <p className="adm-empty">No pages yet.</p>
        ) : (
          <table className="adm-table">
            <thead><tr><th>Title</th><th>Status</th><th>Updated</th><th>Actions</th></tr></thead>
            <tbody>
              {pages.map((p) => (
                <tr key={p.id}>
                  <td className="title-cell">
                    <Link href={`/admin/pages/${p.id}`}>{p.title}</Link>
                    <span className="sub">/{p.slug}</span>
                  </td>
                  <td><span className={`pill pill-${p.status}`}>{p.status === 'published' ? 'Published' : 'Draft'}</span></td>
                  <td data-label="Updated">{formatDateTime(p.updated_at)}</td>
                  <td className="actions-cell">
                    <div className="adm-row-actions">
                      <Link className="btn btn-sm btn-plain" href={`/admin/pages/${p.id}`}>Edit</Link>
                      <a className="btn btn-sm btn-plain" href={`/${p.slug}`} target="_blank" rel="noopener">View</a>
                      <form action={deletePageAction}>
                        <input type="hidden" name="id" value={p.id} />
                        <ConfirmButton message={`Delete the page “${p.title}”?`}>Delete</ConfirmButton>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <p className="adm-hint">
        The Home, How to Sell, Sell Feet Pics, About and Contact pages are hand-designed landing pages and live in the code.
      </p>
    </>
  )
}
