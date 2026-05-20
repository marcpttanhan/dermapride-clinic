import { NextResponse } from 'next/server'
import { getSupabaseServiceClient } from '@/lib/supabase/server'

// GET /api/cms/media — list all media items
export async function GET() {
  const db = getSupabaseServiceClient()
  const { data, error } = await db
    .from('media')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
