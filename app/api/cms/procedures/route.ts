import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSupabaseServiceClient } from '@/lib/supabase/server'

const createSchema = z.object({
  name:     z.string().min(1),
  name_th:  z.string().optional(),
  slug:     z.string().min(1).regex(/^[a-z0-9-]+$/),
})

// GET /api/cms/procedures  — all procedures (admin, includes hidden)
export async function GET() {
  const db = getSupabaseServiceClient()
  const { data, error } = await db
    .from('procedures')
    .select('*')
    .order('sort_order', { ascending: true })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST /api/cms/procedures  — create new procedure
export async function POST(req: NextRequest) {
  const body   = await req.json().catch(() => null)
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const db = getSupabaseServiceClient()

  // Check slug uniqueness
  const { data: existing } = await db
    .from('procedures')
    .select('id')
    .eq('slug', parsed.data.slug)
    .single()
  if (existing) {
    return NextResponse.json({ error: 'Slug already exists' }, { status: 409 })
  }

  // Get max sort_order
  const { data: maxRow } = await db
    .from('procedures')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)
    .single()
  const nextOrder = (maxRow?.sort_order ?? 0) + 1

  const { data, error } = await db
    .from('procedures')
    .insert({
      ...parsed.data,
      cta_text:   'ดูรายละเอียด',
      kicker:     'Procedures',
      sort_order: nextOrder,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
