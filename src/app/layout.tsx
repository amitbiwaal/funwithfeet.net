import type { Metadata, Viewport } from 'next'
import './globals.css'
import { SITE } from '@/lib/site'

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: 'Fun With Feet: Sell Feet Pics Safely & Make Money Online',
  description:
    'Learn how Fun With Feet works, how to sell feet pics online, stay private, avoid scams, set prices, and start earning from feet pictures safely.',
  applicationName: SITE.brand,
  authors: [{ name: SITE.brand }],
  verification: { google: SITE.googleVerification },
  icons: { icon: [{ url: SITE.favicon, type: 'image/png' }], apple: SITE.favicon },
  alternates: { types: { 'application/rss+xml': [{ url: '/feed.xml', title: 'FunWithFeet.net Blog' }] } },
}

export const viewport: Viewport = {
  themeColor: SITE.themeColor,
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // suppressHydrationWarning: browser extensions (ColorZilla, Grammarly, …) add
  // attributes to <html>/<body> before React loads. This only ignores those two
  // tags' own attributes — mismatches inside the page are still reported.
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
