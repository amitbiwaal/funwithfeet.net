'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, type ReactNode } from 'react'
import { logoutAction } from '@/app/admin/actions'
import { LogoMark } from '@/components/site/LogoMark'
import { cx } from '@/lib/utils'

const ICONS: Record<string, ReactNode> = {
  dashboard: (<><rect x="3" y="3" width="7" height="9" /><rect x="14" y="3" width="7" height="5" /><rect x="14" y="12" width="7" height="9" /><rect x="3" y="16" width="7" height="5" /></>),
  posts: (<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></>),
  new: (<><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></>),
  pages: (<><rect x="4" y="3" width="16" height="18" rx="1" /><line x1="8" y1="8" x2="16" y2="8" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="8" y1="16" x2="12" y2="16" /></>),
  categories: (<><path d="M20.59 13.41 13.42 20.6a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></>),
  media: (<><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></>),
  messages: (<><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></>),
  account: (<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>),
  seo: (<><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><polyline points="8 11 10.5 13.5 14 9" /></>),
}

const LINKS = [
  { href: '/admin', label: 'Dashboard', icon: 'dashboard', exact: true },
  { href: '/admin/posts', label: 'Posts', icon: 'posts', exclude: '/admin/posts/new' },
  { href: '/admin/posts/new', label: 'New Post', icon: 'new', exact: true },
  { href: '/admin/pages', label: 'Pages', icon: 'pages' },
  { href: '/admin/categories', label: 'Categories', icon: 'categories' },
  { href: '/admin/media', label: 'Media', icon: 'media' },
  { href: '/admin/seo', label: 'SEO & Links', icon: 'seo' },
  { href: '/admin/messages', label: 'Messages', icon: 'messages' },
  { href: '/admin/account', label: 'Account', icon: 'account' },
] as const

export function AdminSidebar({ email, unread }: { email: string; unread: number }) {
  const pathname = usePathname() ?? ''
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  const isActive = (l: (typeof LINKS)[number]) => {
    if ('exact' in l && l.exact) return pathname === l.href
    if ('exclude' in l && pathname === l.exclude) return false
    return pathname === l.href || pathname.startsWith(`${l.href}/`)
  }

  return (
    <aside className={cx('adm-side', open && 'is-open')}>
      <Link className="adm-brand" href="/admin" onClick={close}>
        <LogoMark />
        <span>
          Fun With Feet
          <small>CMS</small>
        </span>
      </Link>
      {/* Small screens: the links below fold behind this button. */}
      <button
        type="button"
        className="adm-burger"
        aria-label={open ? 'Close menu' : unread > 0 ? `Open menu (${unread} unread messages)` : 'Open menu'}
        aria-expanded={open}
        aria-controls="adm-menu"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="bar" />
        <span className="bar" />
        <span className="bar" />
        {unread > 0 && !open && <span className="dot" />}
      </button>
      <div className="adm-menu" id="adm-menu">
        <nav className="adm-nav" aria-label="Admin">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={isActive(l) ? 'active' : undefined}
              aria-current={isActive(l) ? 'page' : undefined}
              onClick={close}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                {ICONS[l.icon]}
              </svg>
              {l.label}
              {l.icon === 'messages' && unread > 0 && <span className="count" aria-label={`${unread} unread`}>{unread}</span>}
            </Link>
          ))}
        </nav>
        <div className="adm-side-foot">
          <span className="who" title={email}>{email}</span>
          <a href="/" target="_blank" rel="noopener">View site ↗</a>
          <form action={logoutAction}>
            <button className="adm-linkbtn" type="submit">Sign out</button>
          </form>
        </div>
      </div>
    </aside>
  )
}
