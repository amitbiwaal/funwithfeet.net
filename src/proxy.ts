import { NextResponse, type NextRequest } from 'next/server'

/**
 * Optimistic gate for the admin area: no session cookie → go to the login page.
 * The real check (session lookup in the database) happens in every admin page,
 * Server Action and API route via requireAdmin()/getCurrentUser().
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (pathname === '/admin/login' || request.cookies.has('fwf_session')) return NextResponse.next()

  const url = request.nextUrl.clone()
  url.pathname = '/admin/login'
  url.search = ''
  if (pathname !== '/admin') url.searchParams.set('next', pathname)
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
}
