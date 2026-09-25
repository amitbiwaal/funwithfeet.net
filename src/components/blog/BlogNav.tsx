import Link from 'next/link'
import { listCategories } from '@/lib/categories'
import { CtaButton } from '@/components/site/ui'
import { cx } from '@/lib/utils'

/** Category filter chips shown on the blog index and category pages. */
export async function CategoryChips({ active }: { active?: string }) {
  const categories = (await listCategories()).filter((c) => c.live_count > 0)
  if (categories.length === 0) return null
  return (
    <nav className="chips" aria-label="Blog categories">
      <Link className={cx('chip', !active && 'active')} href="/blog" aria-current={!active ? 'page' : undefined}>
        All articles
      </Link>
      {categories.map((c) => (
        <Link
          key={c.id}
          className={cx('chip', active === c.slug && 'active')}
          href={`/blog/category/${c.slug}`}
          aria-current={active === c.slug ? 'page' : undefined}
        >
          {c.name} ({c.live_count})
        </Link>
      ))}
    </nav>
  )
}

/** Right-hand column on the blog index and category pages. */
export async function BlogSidebar({ active }: { active?: string }) {
  const categories = (await listCategories()).filter((c) => c.live_count > 0)
  return (
    <aside className="blog-sidebar" aria-label="Blog sidebar">
      {categories.length > 0 && (
        <nav className="side-card side-categories" aria-label="Categories">
          <p className="side-card-head">Categories</p>
          <ul className="side-list">
            <li>
              <Link href="/blog" className={cx(!active && 'active')} aria-current={!active ? 'page' : undefined}>
                <span>All articles</span>
                <span className="count">{categories.reduce((n, c) => n + c.live_count, 0)}</span>
              </Link>
            </li>
            {categories.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/blog/category/${c.slug}`}
                  className={cx(active === c.slug && 'active')}
                  aria-current={active === c.slug ? 'page' : undefined}
                >
                  <span>{c.name}</span>
                  <span className="count">{c.live_count}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <div className="side-cta">
        <h3>Start selling safely</h3>
        <p>Anonymous profile, verified buyers and payments held by the platform.</p>
        <CtaButton>Create a Free Profile</CtaButton>
      </div>

      <nav className="side-card" aria-label="Start here">
        <p className="side-card-head">Start here</p>
        <ul className="side-list">
          <li><Link href="/how-to-sell-feet-pics"><span>How to Sell Feet Pics — the complete guide</span></Link></li>
          <li><Link href="/sell-feet-pics"><span>Selling safely &amp; anonymously</span></Link></li>
          <li><Link href="/about"><span>About our editorial standards</span></Link></li>
        </ul>
      </nav>
    </aside>
  )
}

export function Pager({ page, totalPages, basePath, q }: { page: number; totalPages: number; basePath: string; q?: string }) {
  if (totalPages <= 1) return null
  const href = (n: number) => {
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (n > 1) params.set('page', String(n))
    const qs = params.toString()
    return qs ? `${basePath}?${qs}` : basePath
  }
  return (
    <nav className="pager" aria-label="Pagination">
      {page > 1 ? <Link href={href(page - 1)} rel="prev">← Newer</Link> : <span className="disabled">← Newer</span>}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) =>
        n === page ? (
          <span key={n} className="current" aria-current="page">{n}</span>
        ) : (
          <Link key={n} href={href(n)}>{n}</Link>
        ),
      )}
      {page < totalPages ? <Link href={href(page + 1)} rel="next">Older →</Link> : <span className="disabled">Older →</span>}
    </nav>
  )
}

export function parsePage(raw: string | string[] | undefined): number {
  const n = Number(Array.isArray(raw) ? raw[0] : raw)
  return Number.isInteger(n) && n > 1 ? Math.min(n, 1000) : 1
}

export function firstParam(raw: string | string[] | undefined): string {
  return (Array.isArray(raw) ? raw[0] : raw ?? '').trim()
}
