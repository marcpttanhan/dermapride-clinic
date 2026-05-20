import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSupabaseServiceClient } from '@/lib/supabase/server'

const schema = z.object({
  name:       z.string().min(1),
  age:        z.string().optional(),
  treatment:  z.string().optional(),
  body:       z.string().min(1),
  stars:      z.number().int().min(1).max(5).default(5),
  image_url:  z.string().optional(),
  sort_order: z.number().int().optional(),
})

export async function GET() {
  const db = getSupabaseServiceClient()
  const { data, error } = await db
    .from('reviews')
    .select('*')
    .order('sort_order', { ascending: true })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const body   = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const db = getSupabaseServiceClient()
  const { data: maxRow } = await db
    .from('reviews')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)
    .single()

  const { data, error } = await db
    .from('reviews')
    .insert({ ...parsed.data, sort_order: parsed.data.sort_order ?? (maxRow?.sort_order ?? -1) + 1 })
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
