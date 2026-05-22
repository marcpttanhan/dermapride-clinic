import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const ADMIN_COOKIE = process.env.ADMIN_COOKIE_NAME ?? 'dp_admin_session'

// Routes that require a valid admin session
const PROTECTED_PREFIXES = ['/admin/dashboard', '/api/cms']

function isProtected(pathname: string) {
  return PROTECTED_PREFIXES.some(p => pathname.startsWith(p))
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (!isProtected(pathname)) return NextResponse.next()

  const token = req.cookies.get(ADMIN_COOKIE)?.value

  if (!token) {
    // API routes return 401; page routes redirect to login
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const loginUrl = req.nextUrl.clone()
    loginUrl.pathname = '/admin/login'
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  try {
    const secret = new TextEncoder().encode(
      process.env.ADMIN_JWT_SECRET ?? 'insecure-dev-secret-change-me-32chars+'
    )
    await jwtVerify(token, secret)
    return NextResponse.next()
  } catch {
    // Token invalid or expired
    const res = pathname.startsWith('/api/')
      ? NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      : NextResponse.redirect(new URL('/admin/login', req.url))

    res.cookies.delete(ADMIN_COOKIE)
    return res
  }
}

export const config = {
  matcher: ['/admin/dashboard/:path*', '/api/cms/:path*'],
}
