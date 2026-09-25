import type { Metadata } from 'next'
import Link from 'next/link'
import { requireAdmin } from '@/lib/auth'
import { runSeoAudit } from '@/lib/seo-audit'

export const metadata: Metadata = { title: 'SEO & Links' }

export default async function SeoAuditPage() {
  await requireAdmin()
  const { rows, broken, summary } = runSeoAudit()
  const posts = rows.filter((r) => r.kind === 'post')
  const pages = rows.filter((r) => r.kind === 'page')

  return (
    <>
      <div className="adm-head">
        <div>
          <h1>SEO &amp; Links</h1>
          <p>Internal linking and content health for every post and page. Fix red items first.</p>
        </div>
        <div className="adm-actions">
          <a className="btn btn-plain" href="/sitemap.xml" target="_blank" rel="noopener">sitemap.xml ↗</a>
          <a className="btn btn-plain" href="/robots.txt" target="_blank" rel="noopener">robots.txt ↗</a>
        </div>
      </div>

      <div className="adm-stats" data-testid="seo-summary">
        <div className="adm-stat"><strong>{summary.live}</strong><span>Live posts &amp; pages</span></div>
        <div className="adm-stat"><strong>{summary.broken}</strong><span>Broken internal links</span></div>
        <div className="adm-stat"><strong>{summary.orphans}</strong><span>Orphan posts</span></div>
        <div className="adm-stat"><strong>{summary.errors}</strong><span>Errors</span></div>
        <div className="adm-stat"><strong>{summary.warnings}</strong><span>Warnings</span></div>
      </div>

      {broken.length > 0 && (
        <div className="adm-card">
          <h2>Broken internal links</h2>
          <div className="adm-table-wrap">
            <table className="adm-table" data-testid="broken-links">
              <thead><tr><th>In</th><th>Link</th><th>Problem</th></tr></thead>
              <tbody>
                {broken.map((b, i) => (
                  <tr key={i}>
                    <td className="title-cell"><Link href={b.editPath}>{b.sourceTitle}</Link></td>
                    <td><code>{b.href}</code></td>
                    <td><span className="pill pill-scheduled">{b.reason}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="adm-card">
        <div className="adm-card-head">
          <h2>Posts</h2>
          <span className="adm-hint">
            <strong>Links out</strong> = links to your own pages inside the article · <strong>Linked from</strong> = other
            articles/pages linking here (menus and blog listings not counted)
          </span>
        </div>
        <AuditTable rows={posts} testId="seo-posts" />
      </div>

      <div className="adm-card">
        <h2>Pages</h2>
        <AuditTable rows={pages} testId="seo-pages" />
      </div>
    </>
  )
}

function AuditTable({ rows, testId }: { rows: ReturnType<typeof runSeoAudit>['rows']; testId: string }) {
  if (rows.length === 0) return <p className="adm-empty">Nothing here yet.</p>
  return (
    <div className="adm-table-wrap">
      <table className="adm-table" data-testid={testId}>
        <thead>
          <tr><th>Title</th><th>Words</th><th>Links out</th><th>Linked from</th><th>External</th><th>Checks</th></tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={`${r.kind}-${r.id}`}>
              <td className="title-cell">
                <Link href={r.editPath}>{r.title}</Link>
                <span className="sub">{r.path}{r.live ? '' : ' · not live'}</span>
              </td>
              <td>{r.words}</td>
              <td>{r.internalOut}</td>
              <td>{r.live ? r.incoming : '—'}</td>
              <td>{r.external}</td>
              <td>
                {r.issues.length === 0 ? (
                  <span className="pill pill-published">All good</span>
                ) : (
                  <ul className="seo-issues">
                    {r.issues.map((i) => (
                      <li key={i.text} className={i.level}>{i.text}</li>
                    ))}
                  </ul>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
