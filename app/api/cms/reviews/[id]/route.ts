import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSupabaseServiceClient } from '@/lib/supabase/server'

const patchSchema = z.object({
  name:       z.string().optional(),
  age:        z.string().optional(),
  treatment:  z.string().optional(),
  body:       z.string().optional(),
  stars:      z.number().int().min(1).max(5).optional(),
  image_url:  z.string().optional(),
  visible:    z.boolean().optional(),
  sort_order: z.number().int().optional(),
})

interface Params { params: Promise<{ id: string }> }

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params
  const body   = await req.json().catch(() => null)
  const parsed = patchSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const db = getSupabaseServiceClient()
  const { data, error } = await db
    .from('reviews')
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params
  const db = getSupabaseServiceClient()
  const { error } = await db.from('reviews').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
