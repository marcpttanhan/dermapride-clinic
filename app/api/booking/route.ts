import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSupabaseServiceClient } from '@/lib/supabase/server'

const schema = z.object({
  name:      z.string().min(1).max(200),
  phone:     z.string().min(6).max(30),
  branch:    z.string().optional(),
  service:   z.string().optional(),
  date:      z.string().optional(),
  time_slot: z.string().optional(),
  message:   z.string().max(2000).optional(),
})

export async function POST(req: NextRequest) {
  const body   = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const db = getSupabaseServiceClient()
  const { data, error } = await db
    .from('bookings')
    .insert(parsed.data)
    .select('id')
    .single()

  if (error) {
    console.error('[booking]', error.message)
    return NextResponse.json({ error: 'Could not save booking' }, { status: 500 })
  }

  // Optional: send webhook notification
  const webhookUrl = process.env.BOOKING_WEBHOOK_URL
  if (webhookUrl) {
    fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...parsed.data, booking_id: data.id }),
    }).catch(() => {})
  }

  return NextResponse.json({ ok: true, booking_id: data.id })
}

// GET /api/booking  — admin: list bookings
export async function GET(req: NextRequest) {
  const db     = getSupabaseServiceClient()
  const status = req.nextUrl.searchParams.get('status')

  let query = db.from('bookings').select('*').order('created_at', { ascending: false })
  if (status) query = query.eq('status', status)

  const { data, error } = await query.limit(100)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
