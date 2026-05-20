import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'

// On-demand revalidation — called by publish flow
export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-revalidate-secret')
  if (secret !== process.env.ADMIN_JWT_SECRET) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  revalidatePath('/', 'layout')
  return NextResponse.json({ revalidated: true, at: new Date().toISOString() })
}
