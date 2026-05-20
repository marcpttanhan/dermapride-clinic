import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSupabaseServiceClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

const schema = z.object({
  // Optionally publish only specific keys. Empty = publish everything.
  keys: z.array(z.string()).optional(),
})

// POST /api/cms/publish  { keys?: string[] }
export async function POST(req: NextRequest) {
  const body   = await req.json().catch(() => ({}))
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const db   = getSupabaseServiceClient()
  const keys = parsed.data.keys

  let query = db.from('site_settings').select('key, draft_value')
  if (keys?.length) query = query.in('key', keys)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Copy draft → published for each matching key + save version snapshot
  const now = new Date().toISOString()
  await Promise.all(
    (data ?? []).map(row =>
      db.from('site_settings').update({
        published_value: row.draft_value,
        published_at:    now,
      }).eq('key', row.key)
    )
  )

  // Revalidate all public routes
  revalidatePath('/', 'layout')

  return NextResponse.json({
    ok:        true,
    published: (data ?? []).map(r => r.key),
    at:        now,
  })
}

// GET /api/cms/publish — compare draft vs published
export async function GET() {
  const db = getSupabaseServiceClient()
  const { data } = await db.from('site_settings').select('key, published_at, updated_at')
  const hasDraft = (data ?? []).some(r => !r.published_at || r.updated_at > r.published_at)
  return NextResponse.json({ hasDraft, settings: data ?? [] })
}
