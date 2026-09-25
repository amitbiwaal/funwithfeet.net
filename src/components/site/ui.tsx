import Link from 'next/link'
import type { ReactNode } from 'react'
import { SITE } from '@/lib/site'
import { cx, jsonLdString } from '@/lib/utils'

/** Affiliate call-to-action. Always opens in a new tab and is marked sponsored. */
export function CtaButton({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <a className={cx('btn', className)} href={SITE.affiliateUrl} target="_blank" rel="noopener sponsored">
      {children}
    </a>
  )
}

export function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(data) }} />
}

export function Breadcrumb({ items }: { items: Array<{ name: string; href?: string }> }) {
  return (
    <nav className="crumb" aria-label="Breadcrumb">
      {items.map((it, i) => (
        <span key={i}>
          {i > 0 && <span className="sep">/</span>}
          {it.href ? <Link href={it.href}>{it.name}</Link> : <span aria-current="page">{it.name}</span>}
        </span>
      ))}
    </nav>
  )
}

export type FaqItem = { q: string; a: string }

export function faqLd(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
}

export function FaqList({ items, openFirst = false }: { items: FaqItem[]; openFirst?: boolean }) {
  return (
    <div className="faq-list mt-26">
      {items.map((f, i) => (
        <details className="faq" key={f.q} open={openFirst && i === 0}>
          <summary>{f.q}</summary>
          <p>{f.a}</p>
        </details>
      ))}
    </div>
  )
}

export function CheckList({ items, variant = 'checks', className }: { items: ReactNode[]; variant?: 'checks' | 'crosses'; className?: string }) {
  return (
    <ul className={cx(variant, className)}>
      {items.map((it, i) => (
        <li key={i}>{it}</li>
      ))}
    </ul>
  )
}
