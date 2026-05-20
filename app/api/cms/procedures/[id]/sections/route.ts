import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSupabaseServiceClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

const createSchema = z.object({
  type:       z.enum(['image-text', 'slider', 'before-after', 'pricing', 'reviews', 'cta']),
  title:      z.string().optional(),
  subtitle:   z.string().optional(),
  body:       z.string().optional(),
  price:      z.string().optional(),
  tags:       z.string().optional(),
  images:     z.array(z.object({ src: z.string(), alt: z.string().optional() })).optional(),
  sort_order: z.number().int().optional(),
})

interface Params { params: Promise<{ id: string }> }

// GET /api/cms/procedures/[id]/sections
export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params
  const db = getSupabaseServiceClient()
  const { data, error } = await db
    .from('procedure_sections')
    .select('*')
    .eq('procedure_id', id)
    .order('sort_order', { ascending: true })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST /api/cms/procedures/[id]/sections
export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params
  const body   = await req.json().catch(() => null)
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const db = getSupabaseServiceClient()

  const { data: maxRow } = await db
    .from('procedure_sections')
    .select('sort_order')
    .eq('procedure_id', id)
    .order('sort_order', { ascending: false })
    .limit(1)
    .single()
  const nextOrder = (maxRow?.sort_order ?? -1) + 1

  const { data, error } = await db
    .from('procedure_sections')
    .insert({
      procedure_id: id,
      ...parsed.data,
      images:     parsed.data.images ?? [],
      sort_order: parsed.data.sort_order ?? nextOrder,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Get procedure slug for revalidation
  const { data: proc } = await db.from('procedures').select('slug').eq('id', id).single()
  if (proc?.slug) revalidatePath(`/procedures/${proc.slug}`)

  return NextResponse.json(data, { status: 201 })
}

// PATCH /api/cms/procedures/[id]/sections — reorder (body: [{id, sort_order}])
export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params
  const body: Array<{ id: string; sort_order: number }> = await req.json()
  const db = getSupabaseServiceClient()

  await Promise.all(
    body.map(({ id: sid, sort_order }) =>
      db.from('procedure_sections')
        .update({ sort_order, updated_at: new Date().toISOString() })
        .eq('id', sid)
        .eq('procedure_id', id)
    )
  )

  const { data: proc } = await db.from('procedures').select('slug').eq('id', id).single()
  if (proc?.slug) revalidatePath(`/procedures/${proc.slug}`)

  return NextResponse.json({ ok: true })
}
