import type { NextConfig } from 'next'

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
]

const nextConfig: NextConfig = {
  // E2E runs build into their own folder so they never touch a running `next dev`.
  distDir: process.env.NEXT_DIST_DIR || '.next',
  poweredByHeader: false,
  // Native SQLite driver must stay a runtime require, never bundled.
  serverExternalPackages: ['better-sqlite3'],
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      { source: '/admin/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] },
      { source: '/api/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] },
      // Images in /public/assets never change name, so let browsers keep them for 30 days.
      { source: '/assets/:path*', headers: [{ key: 'Cache-Control', value: 'public, max-age=2592000' }] },
    ]
  },
  async redirects() {
    return [
      // Old static-site paths
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/sell-feet-pics/index.html', destination: '/sell-feet-pics', permanent: true },
      { source: '/how-to-sell-feet-pics/index.html', destination: '/how-to-sell-feet-pics', permanent: true },
      { source: '/favicon.ico', destination: '/assets/favicon.png', permanent: true },
    ]
  },
}

export default nextConfig
