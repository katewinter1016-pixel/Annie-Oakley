import { NextRequest, NextResponse } from 'next/server'

// Middleware runs on every request before the page loads.
// It checks whether the visitor is logged into the admin area.
// If they're not and they try to access /admin/*, it redirects them to /admin/login.

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname

  // Let the login page and API routes through without checking
  if (pathname === '/admin/login' || pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  const token = req.cookies.get('admin_auth')?.value
  const secret = process.env.ADMIN_SECRET

  if (!token || token !== secret) {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}
