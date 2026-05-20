import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSupabaseServiceClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

const patchSchema = z.object({
  name:           z.string().optional(),
  name_th:        z.string().optional(),
  slug:           z.string().regex(/^[a-z0-9-]+$/).optional(),
  description:    z.string().optional(),
  image_url:      z.string().optional(),
  hero_image_url: z.string().optional(),
  cta_text:       z.string().optional(),
  kicker:         z.string().optional(),
  headline:       z.string().optional(),
  sub_text:       z.string().optional(),
  sort_order:     z.number().int().optional(),
  visible:        z.boolean().optional(),
  seo_title:      z.string().optional(),
  seo_desc:       z.string().optional(),
  seo_og_image:   z.string().optional(),
})

interface Params { params: Promise<{ id: string }> }

// GET /api/cms/procedures/[id]
export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params
  const db = getSupabaseServiceClient()
  const { data, error } = await db
    .from('procedures')
    .select('*, sections:procedure_sections(*)')
    .eq('id', id)
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json(data)
}

// PATCH /api/cms/procedures/[id]
export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params
  const body   = await req.json().catch(() => null)
  const parsed = patchSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const db = getSupabaseServiceClient()
  const { data, error } = await db
    .from('procedures')
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Invalidate the procedure page
  if (data?.slug) revalidatePath(`/procedures/${data.slug}`)
  revalidatePath('/')

  return NextResponse.json(data)
}

// DELETE /api/cms/procedures/[id]
export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params
  const db = getSupabaseServiceClient()

  // Get slug for revalidation
  const { data: proc } = await db.from('procedures').select('slug').eq('id', id).single()

  const { error } = await db.from('procedures').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  if (proc?.slug) revalidatePath(`/procedures/${proc.slug}`)
  revalidatePath('/')

  return NextResponse.json({ ok: true })
}
