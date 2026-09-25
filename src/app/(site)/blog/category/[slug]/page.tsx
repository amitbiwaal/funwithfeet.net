import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BlogSidebar, CategoryChips, Pager, parsePage } from '@/components/blog/BlogNav'
import { PostList } from '@/components/blog/PostCard'
import { Breadcrumb, JsonLd } from '@/components/site/ui'
import { getCategoryBySlug } from '@/lib/categories'
import { listLivePosts } from '@/lib/posts'
import { breadcrumbLd, buildMetadata } from '@/lib/seo'
import { absoluteUrl } from '@/lib/site'

export const dynamic = 'force-dynamic'

const PER_PAGE = 9

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params
  const page = parsePage((await searchParams).page)
  const category = getCategoryBySlug(slug)
  if (!category) return { title: 'Category not found', robots: { index: false } }
  const path = `/blog/category/${category.slug}${page > 1 ? `?page=${page}` : ''}`
  return buildMetadata({
    title: `${category.name}${page > 1 ? ` — Page ${page}` : ''} | Fun With Feet Blog`,
    description: category.description || `Articles about ${category.name.toLowerCase()} for feet pic sellers.`,
    path,
  })
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params
  const page = parsePage((await searchParams).page)
  const category = getCategoryBySlug(slug)
  if (!category) notFound()

  const { posts, total } = listLivePosts({ categoryId: category.id, limit: PER_PAGE, offset: (page - 1) * PER_PAGE })
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE))

  const collectionLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${category.name} — Fun With Feet Blog`,
    url: absoluteUrl(`/blog/category/${category.slug}`),
    description: category.description || undefined,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: posts.map((p, i) => ({
        '@type': 'ListItem',
        position: (page - 1) * PER_PAGE + i + 1,
        url: absoluteUrl(`/blog/${p.slug}`),
        name: p.title,
      })),
    },
  }

  return (
    <main id="top">
      <JsonLd data={collectionLd} />
      <JsonLd
        data={breadcrumbLd([
          { name: 'Home', path: '/' },
          { name: 'Blog', path: '/blog' },
          { name: category.name, path: `/blog/category/${category.slug}` },
        ])}
      />
      <section className="hero">
        <div className="wrap">
          <Breadcrumb items={[{ name: 'Home', href: '/' }, { name: 'Blog', href: '/blog' }, { name: category.name }]} />
          <p className="eyebrow">Category</p>
          <h1>{category.name}</h1>
          {category.description && <p className="lead">{category.description}</p>}
        </div>
      </section>
      <section className="blog-body">
        <div className="wrap">
          <div className="blog-chips-mobile">
            <CategoryChips active={category.slug} />
          </div>
          <div className="blog-layout">
            <div className="blog-main">
              {posts.length > 0 ? (
                <>
                  <div className="blog-list-head">
                    <h2>
                      {total} article{total === 1 ? '' : 's'} in {category.name}
                    </h2>
                  </div>
                  <PostList posts={posts} />
                </>
              ) : (
                <div className="empty-state">
                  <h2>No articles in this category yet</h2>
                  <p>Browse the rest of the blog in the meantime.</p>
                  <Link className="btn btn-ghost" href="/blog">All articles</Link>
                </div>
              )}
              <Pager page={page} totalPages={totalPages} basePath={`/blog/category/${category.slug}`} />
            </div>
            <BlogSidebar active={category.slug} />
          </div>
        </div>
      </section>
    </main>
  )
}
