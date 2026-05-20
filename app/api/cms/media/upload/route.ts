import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServiceClient } from '@/lib/supabase/server'
import { getAdminSession } from '@/lib/auth'

const BUCKET      = process.env.SUPABASE_STORAGE_BUCKET ?? 'dermapride-media'
const MAX_BYTES   = Number(process.env.MAX_UPLOAD_SIZE ?? 20 * 1024 * 1024)
const ALLOWED     = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif', 'video/mp4', 'video/webm'])

export async function POST(req: NextRequest) {
  // Auth check (also enforced by middleware, but double-check here)
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const form = await req.formData().catch(() => null)
  if (!form) return NextResponse.json({ error: 'No form data' }, { status: 400 })

  const file = form.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: `File too large (max ${MAX_BYTES / 1048576} MB)` }, { status: 413 })
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json({ error: `File type not allowed: ${file.type}` }, { status: 415 })
  }

  const ext      = file.name.split('.').pop() ?? 'bin'
  const ts       = Date.now()
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const path     = `uploads/${ts}-${safeName}`

  const db       = getSupabaseServiceClient()
  const bytes    = await file.arrayBuffer()

  const { data: uploadData, error: uploadError } = await db.storage
    .from(BUCKET)
    .upload(path, bytes, { contentType: file.type, upsert: false })

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  const { data: urlData } = db.storage.from(BUCKET).getPublicUrl(uploadData.path)
  const publicUrl = urlData.publicUrl

  // Save to media library
  const { data: mediaRow, error: dbError } = await db
    .from('media')
    .insert({
      filename:     file.name,
      storage_path: uploadData.path,
      public_url:   publicUrl,
      mime_type:    file.type,
      size_bytes:   file.size,
      uploaded_by:  session.sub,
    })
    .select()
    .single()

  if (dbError) {
    console.error('[media upload] DB insert error:', dbError.message)
  }

  return NextResponse.json({
    id:  mediaRow?.id ?? null,
    url: publicUrl,
    filename: file.name,
    mime_type: file.type,
    size_bytes: file.size,
  })
}
