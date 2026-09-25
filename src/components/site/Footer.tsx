import Link from 'next/link'
import { FOOTER_LINKS, SITE } from '@/lib/site'
import { LogoMark } from './LogoMark'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="site">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <Link className="brand-mark" href="/" aria-label="Fun With Feet home">
              <LogoMark />
              <span>Fun With Feet</span>
            </Link>
            <p className="footer-about">
              An independent guide to selling feet pics safely — privacy, pricing, scam protection and step-by-step
              setup for new creators.
            </p>
            <span className="age-badge">18+ ONLY</span>
          </div>
          <FooterCol title="Guides" links={FOOTER_LINKS.guides} />
          <FooterCol title="Company" links={FOOTER_LINKS.company} />
          <FooterCol title="Legal" links={FOOTER_LINKS.legal} />
        </div>
        <div className="footer-bottom">
          <p>{SITE.disclaimer}</p>
          <p>© {year} {SITE.brand}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({ title, links }: { title: string; links: ReadonlyArray<{ href: string; label: string }> }) {
  return (
    <nav className="footer-col" aria-label={title}>
      <h2>{title}</h2>
      <ul>
        {links.map((l) => (
          <li key={l.href}>
            {l.href.endsWith('.xml') ? <a href={l.href}>{l.label}</a> : <Link href={l.href}>{l.label}</Link>}
          </li>
        ))}
      </ul>
    </nav>
  )
}
