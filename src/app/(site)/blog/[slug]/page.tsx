import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PostGrid } from '@/components/blog/PostCard'
import { LogoMark } from '@/components/site/LogoMark'
import { Breadcrumb, CtaButton, JsonLd } from '@/components/site/ui'
import { getCurrentUser } from '@/lib/auth'
import { renderContent, type TocItem } from '@/lib/content'
import { getAdjacentPosts, getPostBySlug, getRelatedPosts, isLive, postSummary, type Post } from '@/lib/posts'
import { breadcrumbLd, buildMetadata, PUBLISHER_LD } from '@/lib/seo'
import { absoluteUrl, SITE } from '@/lib/site'
import { formatDate, parseTags, readingMinutes, stripHtml } from '@/lib/utils'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ slug: string }> }

/** Published posts are public; drafts and scheduled posts are visible only to signed-in admins. */
async function loadPost(slug: string): Promise<{ post: Post; live: boolean } | null> {
  const post = getPostBySlug(slug)
  if (!post) return null
  const live = isLive(post)
  if (!live && !(await getCurrentUser())) return null
  return { post, live }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const found = await loadPost(slug)
  if (!found) return { title: 'Article not found', robots: { index: false } }
  const { post, live } = found
  return buildMetadata({
    title: post.meta_title || `${post.title} | Fun With Feet`,
    description: post.meta_description || postSummary(post, 158),
    path: `/blog/${post.slug}`,
    type: 'article',
    image: post.cover_image || undefined,
    noindex: !live || post.noindex === 1,
    publishedTime: post.published_at,
    modifiedTime: post.updated_at,
    section: post.category_name,
    tags: parseTags(post.tags),
  })
}

function TocList({ toc }: { toc: TocItem[] }) {
  return (
    <ol>
      {toc.map((t) => (
        <li key={t.id} className={`lvl-${t.level}`}>
          <a href={`#${t.id}`}>{t.text}</a>
        </li>
      ))}
    </ol>
  )
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const found = await loadPost(slug)
  if (!found) notFound()
  const { post, live } = found

  const { html, toc } = renderContent(post.content, { inlineCta: true })
  const tags = parseTags(post.tags)
  const author = post.author_name || SITE.editorialAuthor
  const minutes = readingMinutes(post.content)
  const related = live ? getRelatedPosts(post, 3) : []
  const { older, newer } = live ? getAdjacentPosts(post) : {}
  const url = absoluteUrl(`/blog/${post.slug}`)
  const wasUpdated =
    post.published_at && new Date(post.updated_at).getTime() - new Date(post.published_at).getTime() > 86_400_000

  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog' },
    ...(post.category_slug ? [{ name: post.category_name ?? '', path: `/blog/category/${post.category_slug}` }] : []),
    { name: post.title, path: `/blog/${post.slug}` },
  ]

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.meta_description || postSummary(post, 158),
    image: [absoluteUrl(post.cover_image || SITE.ogImage)],
    datePublished: post.published_at ?? undefined,
    dateModified: post.updated_at,
    author: { '@type': 'Organization', name: author, url: absoluteUrl('/about') },
    publisher: PUBLISHER_LD,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    articleSection: post.category_name ?? undefined,
    keywords: tags.length ? tags.join(', ') : undefined,
    wordCount: stripHtml(post.content).split(' ').filter(Boolean).length,
    inLanguage: 'en',
  }

  return (
    <>
      {!live && (
        <div className="preview-banner" role="status">
          {post.status === 'draft' ? 'Draft preview' : `Scheduled for ${formatDate(post.published_at)}`} — only visible to
          signed-in admins. <Link href={`/admin/posts/${post.id}`}>Back to the editor</Link>
        </div>
      )}
      <main id="top">
        {live && <JsonLd data={articleLd} />}
        {live && <JsonLd data={breadcrumbLd(crumbs)} />}

        <section className="hero article-hero">
          <div className="wrap">
            <Breadcrumb
              items={[
                { name: 'Home', href: '/' },
                { name: 'Blog', href: '/blog' },
                ...(post.category_slug ? [{ name: post.category_name ?? '', href: `/blog/category/${post.category_slug}` }] : []),
              ]}
            />
            {post.category_name && <p className="eyebrow">{post.category_name}</p>}
            <h1>{post.title}</h1>
            {post.excerpt && <p className="lead">{post.excerpt}</p>}
            <div className="article-meta">
              <span>By <strong>{author}</strong></span>
              {post.published_at && (
                <>
                  <span className="dot" aria-hidden="true">•</span>
                  <span>Published <time dateTime={post.published_at}>{formatDate(post.published_at)}</time></span>
                </>
              )}
              {wasUpdated && (
                <>
                  <span className="dot" aria-hidden="true">•</span>
                  <span>Updated <time dateTime={post.updated_at}>{formatDate(post.updated_at)}</time></span>
                </>
              )}
              <span className="dot" aria-hidden="true">•</span>
              <span>{minutes} min read</span>
            </div>
            {post.cover_image && (
              <figure className="article-cover">
                <img src={post.cover_image} alt={post.cover_alt || post.title} fetchPriority="high" />
              </figure>
            )}
          </div>
        </section>

        <section>
          <div className="wrap article-layout">
            <article>
              {toc.length >= 3 && (
                <details className="toc toc-mobile">
                  <summary className="toc-head">On this page</summary>
                  <TocList toc={toc} />
                </details>
              )}
              <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />

              {tags.length > 0 && (
                <div className="article-tags">
                  <span className="label">Tags:</span>
                  {tags.map((t) => (
                    <Link key={t} className="chip" href={`/blog?q=${encodeURIComponent(t)}`} rel="nofollow">
                      {t}
                    </Link>
                  ))}
                </div>
              )}

              <div className="author-box">
                <LogoMark />
                <div>
                  <strong>{author}</strong>
                  <p>
                    Independent guides for creators who want to sell feet pics safely and privately.{' '}
                    <Link href="/about">About our editorial standards</Link>.
                  </p>
                </div>
              </div>

              {(older || newer) && (
                <nav className="post-nav" aria-label="More articles">
                  {older && (
                    <Link className="prev" href={`/blog/${older.slug}`} rel="prev">
                      <span>← Previous article</span>
                      <strong>{older.title}</strong>
                    </Link>
                  )}
                  {newer && (
                    <Link className="next" href={`/blog/${newer.slug}`} rel="next">
                      <span>Next article →</span>
                      <strong>{newer.title}</strong>
                    </Link>
                  )}
                </nav>
              )}
            </article>

            <aside className="article-aside">
              {toc.length >= 2 && (
                <nav className="toc" aria-label="Table of contents">
                  <p className="toc-head">On this page</p>
                  <TocList toc={toc} />
                </nav>
              )}
              <div className="side-cta">
                <h3>Start selling safely</h3>
                <p>Anonymous profile, verified buyers and payments held by the platform.</p>
                <CtaButton>Create a Free Profile</CtaButton>
              </div>
            </aside>
          </div>
        </section>

        {related.length > 0 && (
          <section className="alt">
            <div className="wrap">
              <p className="eyebrow">Keep Reading</p>
              <h2>Related Articles</h2>
              <PostGrid posts={related} />
            </div>
          </section>
        )}

        <section>
          <div className="wrap">
            <div className="cta-band">
              <p className="eyebrow">Your Next Step</p>
              <h2>Ready to Sell Your First Set?</h2>
              <p>Set up an anonymous seller profile, upload a themed set, price it properly, and let buyers who are already searching find you.</p>
              <div className="mt-22"><CtaButton>Start Selling Feet Pics Now</CtaButton></div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
