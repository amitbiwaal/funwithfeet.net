'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { NAV_LINKS, SITE } from '@/lib/site'
import { cx } from '@/lib/utils'
import { LogoMark } from './LogoMark'

function isCurrent(pathname: string, href: string) {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function Header() {
  const pathname = usePathname() ?? '/'
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <header className="site">
      <div className={cx('nav', open && 'is-open')}>
        <Link className="brand-mark" href="/" aria-label="Fun With Feet home" onClick={close}>
          <LogoMark />
          <span>Fun With Feet</span>
        </Link>

        <button
          type="button"
          className="nav-burger"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="primary-nav"
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className="nav-menu" id="primary-nav" aria-label="Primary">
          {NAV_LINKS.map((l) => {
            const current = isCurrent(pathname, l.href)
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cx(current && 'current')}
                aria-current={current ? 'page' : undefined}
                onClick={close}
              >
                {l.label}
              </Link>
            )
          })}
          <a className="btn btn-sm" href={SITE.affiliateUrl} target="_blank" rel="noopener sponsored">
            Sell Feet Pics
          </a>
        </nav>
      </div>
    </header>
  )
}
