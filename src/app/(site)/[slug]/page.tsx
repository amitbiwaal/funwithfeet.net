import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Breadcrumb, JsonLd } from '@/components/site/ui'
import { getCurrentUser } from '@/lib/auth'
import { renderContent } from '@/lib/content'
import { getPageBySlug, type Page } from '@/lib/pages'
import { breadcrumbLd, buildMetadata } from '@/lib/seo'
import { formatDate, stripHtml, truncate } from '@/lib/utils'

// CMS-managed pages (Privacy Policy, Terms, Disclaimer, and any page an admin creates).
export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ slug: string }> }

async function loadPage(slug: string): Promise<Page | null> {
  const page = getPageBySlug(slug)
  if (!page) return null
  if (page.status !== 'published' && !(await getCurrentUser())) return null
  return page
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const page = await loadPage(slug)
  if (!page) return { title: 'Page not found', robots: { index: false } }
  return buildMetadata({
    title: page.meta_title || `${page.title} | FunWithFeet.net`,
    description: page.meta_description || truncate(stripHtml(page.content), 158),
    path: `/${page.slug}`,
    noindex: page.status !== 'published' || page.noindex === 1,
  })
}

export default async function CmsPage({ params }: Props) {
  const { slug } = await params
  const page = await loadPage(slug)
  if (!page) notFound()
  const { html } = renderContent(page.content)

  return (
    <>
      {page.status !== 'published' && (
        <div className="preview-banner" role="status">
          Draft preview — only visible to signed-in admins. <Link href={`/admin/pages/${page.id}`}>Back to the editor</Link>
        </div>
      )}
      <main id="top">
        <JsonLd data={breadcrumbLd([{ name: 'Home', path: '/' }, { name: page.title, path: `/${page.slug}` }])} />
        <section className="hero">
          <div className="wrap">
            <Breadcrumb items={[{ name: 'Home', href: '/' }, { name: page.title }]} />
            <p className="eyebrow">FunWithFeet.net</p>
            <h1>{page.title}</h1>
            <p className="legal-updated">
              Last updated: <time dateTime={page.updated_at}>{formatDate(page.updated_at)}</time>
            </p>
          </div>
        </section>
        <section>
          <div className="wrap">
            <div className="prose legal-body" dangerouslySetInnerHTML={{ __html: html }} />
          </div>
        </section>
      </main>
    </>
  )
}
