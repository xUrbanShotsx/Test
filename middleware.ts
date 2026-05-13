import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_PATHS = ['/login']
const AUTH_COOKIE = 'propulse_auth'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isAuthed = request.cookies.get(AUTH_COOKIE)?.value === '1'
  const isPublic = PUBLIC_PATHS.some(p => pathname.startsWith(p))

  // Not logged in → send to /login (except public paths)
  if (!isAuthed && !isPublic) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Already logged in and hitting /login → send to dashboard
  if (isAuthed && pathname === '/login') {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  // Run on every route except Next.js internals and static assets
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
}
