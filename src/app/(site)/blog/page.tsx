import type { Metadata } from 'next'
import Link from 'next/link'
import { BlogSidebar, CategoryChips, firstParam, Pager, parsePage } from '@/components/blog/BlogNav'
import { PostFeature, PostList } from '@/components/blog/PostCard'
import { Breadcrumb, CtaButton, JsonLd } from '@/components/site/ui'
import { getFeaturedPost, listLivePosts } from '@/lib/posts'
import { breadcrumbLd, buildMetadata, PUBLISHER_LD } from '@/lib/seo'
import { absoluteUrl } from '@/lib/site'

export const dynamic = 'force-dynamic'

const PER_PAGE = 9

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> }

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const sp = await searchParams
  const page = parsePage(sp.page)
  const q = firstParam(sp.q)
  return buildMetadata({
    title: q
      ? `Search: ${q} | Fun With Feet Blog`
      : page > 1
        ? `Feet Pics Blog — Page ${page} | Fun With Feet`
        : 'Feet Pics Blog: Selling Tips, Pricing & Safety Guides | Fun With Feet',
    description:
      'Practical guides for feet pic sellers: pricing, photography, privacy, scam protection and growing your sales on a dedicated marketplace.',
    path: page > 1 && !q ? `/blog?page=${page}` : '/blog',
    // Search result pages should not be indexed.
    noindex: !!q,
  })
}

export default async function BlogIndexPage({ searchParams }: Props) {
  const sp = await searchParams
  const q = firstParam(sp.q).slice(0, 80)
  const page = parsePage(sp.page)

  const featured = q ? undefined : getFeaturedPost()
  const { posts, total } = listLivePosts({
    limit: PER_PAGE,
    offset: (page - 1) * PER_PAGE,
    q: q || undefined,
    excludeId: featured?.id,
  })
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE))
  const listed = [...(featured && page === 1 ? [featured] : []), ...posts]

  const blogLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Fun With Feet Blog',
    url: absoluteUrl('/blog'),
    description: 'Practical guides for feet pic sellers: pricing, photography, privacy and scam protection.',
    publisher: PUBLISHER_LD,
    blogPost: listed.map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      url: absoluteUrl(`/blog/${p.slug}`),
      datePublished: p.published_at ?? undefined,
      image: p.cover_image ? absoluteUrl(p.cover_image) : undefined,
    })),
  }

  return (
    <main id="top">
      <JsonLd data={breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Blog', path: '/blog' }])} />
      {!q && <JsonLd data={blogLd} />}

      <section className="hero">
        <div className="wrap">
          <Breadcrumb items={[{ name: 'Home', href: '/' }, { name: 'Blog' }]} />
          <p className="eyebrow">The Fun With Feet Blog</p>
          <h1>
            Guides &amp; Tips for <mark>Feet Pic Sellers</mark>
          </h1>
          <p className="lead">
            Honest, practical advice on pricing, photography, privacy and staying safe — written for creators who want to sell
            feet pics the smart way.
          </p>
          <form className="search-form" action="/blog" method="get" role="search">
            <label htmlFor="blog-search" className="visually-hidden">Search articles</label>
            <input id="blog-search" type="search" name="q" placeholder="Search articles…" defaultValue={q} maxLength={80} />
            <button type="submit">Search</button>
          </form>
        </div>
      </section>

      <section className="blog-body">
        <div className="wrap">
          {/* On phones the sidebar sits below the list, so show the category filter up top. */}
          <div className="blog-chips-mobile">
            <CategoryChips />
          </div>

          <div className="blog-layout">
            <div className="blog-main">
              {q && (
                <p className="blog-results">
                  {total === 0 ? 'No articles' : `${total} article${total === 1 ? '' : 's'}`} found for{' '}
                  <strong>&ldquo;{q}&rdquo;</strong>. <Link href="/blog">Clear search</Link>
                </p>
              )}

              {featured && page === 1 && <PostFeature post={featured} />}

              {posts.length > 0 ? (
                <>
                  <div className="blog-list-head">
                    <h2>{q ? 'Search results' : featured && page === 1 ? 'More articles' : 'Latest articles'}</h2>
                  </div>
                  <PostList posts={posts} />
                </>
              ) : (
                !featured && (
                  <div className="empty-state">
                    <h2>{q ? 'Nothing matched your search' : 'New articles are on the way'}</h2>
                    <p>{q ? 'Try a different word, or browse all articles.' : 'Check back soon for fresh guides.'}</p>
                    <Link className="btn btn-ghost" href="/how-to-sell-feet-pics">Read the complete selling guide</Link>
                  </div>
                )
              )}

              <Pager page={page} totalPages={totalPages} basePath="/blog" q={q || undefined} />
            </div>

            <BlogSidebar />
          </div>
        </div>
      </section>

      <section className="alt">
        <div className="wrap">
          <div className="cta-band">
            <p className="eyebrow">Put It Into Practice</p>
            <h2>Ready to Start Selling Feet Pics?</h2>
            <p>Create a free, anonymous seller profile on a dedicated marketplace and apply what you&apos;ve learned today.</p>
            <div className="mt-22"><CtaButton>Start Selling Feet Pics</CtaButton></div>
          </div>
        </div>
      </section>
    </main>
  )
}
