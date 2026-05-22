import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { loginAdmin, COOKIE_NAME, SESSION_TTL } from '@/lib/auth'

const schema = z.object({
  email:    z.string().email(),
  password: z.string().min(1),
})

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  const result = await loginAdmin(parsed.data.email, parsed.data.password)
  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: 401 })
  }

  // Set cookie directly on the response — cookies() from next/headers does not
  // emit Set-Cookie headers from Route Handlers in Next.js 15 App Router.
  const response = NextResponse.json({
    user: {
      id:    result.user.id,
      email: result.user.email,
      role:  result.user.role,
      name:  result.user.name,
    },
  })

  response.cookies.set(COOKIE_NAME, result.token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge:   SESSION_TTL,
    path:     '/',
  })

  return response
}
