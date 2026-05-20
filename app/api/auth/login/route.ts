import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { loginAdmin, setSessionCookie } from '@/lib/auth'

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
    // Constant-time response to prevent timing attacks
    return NextResponse.json({ error: result.error }, { status: 401 })
  }

  await setSessionCookie(result.token)

  return NextResponse.json({
    user: {
      id:    result.user.id,
      email: result.user.email,
      role:  result.user.role,
      name:  result.user.name,
    },
  })
}
