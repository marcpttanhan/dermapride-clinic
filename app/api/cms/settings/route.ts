import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSupabaseServiceClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

const upsertSchema = z.object({
  key:   z.string().min(1),
  value: z.unknown(),
})

// GET /api/cms/settings?key=home.hero&draft=1
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const key   = searchParams.get('key')
  const draft = searchParams.get('draft') === '1'
  const col   = draft ? 'draft_value' : 'published_value'

  const db = getSupabaseServiceClient()

  if (key) {
    const { data, error } = await db
      .from('site_settings')
      .select(col)
      .eq('key', key)
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 404 })
    return NextResponse.json({ key, value: data[col] })
  }

  // Return all settings
  const { data, error } = await db.from('site_settings').select(`key, ${col}`)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const map: Record<string, unknown> = {}
  ;(data ?? []).forEach(row => { map[row.key] = row[col] })
  return NextResponse.json(map)
}

// PUT /api/cms/settings  { key, value }  — saves to draft
export async function PUT(req: NextRequest) {
  const body   = await req.json().catch(() => null)
  const parsed = upsertSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  const db = getSupabaseServiceClient()
  const { error } = await db.from('site_settings').upsert({
    key:         parsed.data.key,
    draft_value: parsed.data.value,
    updated_at:  new Date().toISOString(),
  }, { onConflict: 'key' })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
