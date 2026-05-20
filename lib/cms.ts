// ============================================================
// CMS data-access layer
// All reads come from the published_value column.
// Drafts are read/written separately (admin only).
// ============================================================
import { getSupabaseServerClient } from './supabase/server'
import { getSupabaseServiceClient } from './supabase/server'
import type {
  HomePageData, HeroSettings, DoctorSettings, ContactSettings,
  BranchSettings, HourRow, PhilosophySettings, ThemeSettings,
  SeoSettings, ProcedureRow, ReviewRow,
} from './supabase/types'

// Revalidation interval for ISR (60 s keeps the site fresh without hammering DB)
export const REVALIDATE_SECONDS = 60

// ── Read helpers ──────────────────────────────────────────
async function getSetting<T>(key: string, draft = false): Promise<T | null> {
  const db = await getSupabaseServerClient()
  const col = draft ? 'draft_value' : 'published_value'
  const { data, error } = await db
    .from('site_settings')
    .select(col)
    .eq('key', key)
    .single()
  if (error || !data) return null
  return data[col] as T
}

// ── Homepage data ────────────────────────────────────────
export async function getHomePageData(draft = false): Promise<HomePageData> {
  const db = await getSupabaseServerClient()
  const col = draft ? 'draft_value' : 'published_value'

  // Parallel fetch: settings + procedures + reviews
  const [settingsRes, proceduresRes, reviewsRes] = await Promise.all([
    db.from('site_settings').select(`key, ${col}`).in('key', [
      'home.hero', 'home.doctor', 'home.contact', 'home.branches',
      'home.hours', 'home.philosophy', 'home.results', 'home.offers',
      'home.faq', 'theme', 'seo.home',
    ]),
    db.from('procedures')
      .select('*')
      .eq('visible', true)
      .order('sort_order', { ascending: true }),
    db.from('reviews')
      .select('*')
      .eq('visible', true)
      .order('sort_order', { ascending: true })
      .limit(6),
  ])

  // Convert settings array → map
  const settingsMap: Record<string, unknown> = {}
  ;(settingsRes.data ?? []).forEach((row: Record<string, unknown>) => {
    settingsMap[row.key as string] = row[col]
  })

  return {
    hero:       (settingsMap['home.hero']       as HeroSettings)       ?? {} as HeroSettings,
    doctor:     (settingsMap['home.doctor']     as DoctorSettings)     ?? {} as DoctorSettings,
    contact:    (settingsMap['home.contact']    as ContactSettings)    ?? {} as ContactSettings,
    branches:   (settingsMap['home.branches']   as BranchSettings[])   ?? [],
    hours:      (settingsMap['home.hours']      as HourRow[])          ?? [],
    philosophy: (settingsMap['home.philosophy'] as PhilosophySettings) ?? {} as PhilosophySettings,
    results:    (settingsMap['home.results']    as { items: ReturnType<typeof Array>[] }) ?? { items: [] },
    offers:     (settingsMap['home.offers']     as { items: ReturnType<typeof Array>[] }) ?? { items: [] },
    faq:        (settingsMap['home.faq']        as { items: ReturnType<typeof Array>[] }) ?? { items: [] },
    theme:      (settingsMap['theme']           as ThemeSettings)      ?? {} as ThemeSettings,
    seo:        (settingsMap['seo.home']        as SeoSettings)        ?? {} as SeoSettings,
    procedures: (proceduresRes.data ?? []) as ProcedureRow[],
    reviews:    (reviewsRes.data   ?? []) as ReviewRow[],
  }
}

// ── Procedure page ────────────────────────────────────────
export async function getProcedureBySlug(
  slug: string,
  draft = false
): Promise<ProcedureRow | null> {
  const db = await getSupabaseServerClient()

  const { data: proc, error } = await db
    .from('procedures')
    .select('*')
    .eq('slug', slug)
    .eq('visible', true)
    .single()

  if (error || !proc) return null

  const { data: sections } = await db
    .from('procedure_sections')
    .select('*')
    .eq('procedure_id', proc.id)
    .eq('visible', true)
    .order('sort_order', { ascending: true })

  return { ...proc, sections: sections ?? [] } as ProcedureRow
}

export async function getAllProcedureSlugs(): Promise<string[]> {
  const db = await getSupabaseServerClient()
  const { data } = await db.from('procedures').select('slug').eq('visible', true)
  return (data ?? []).map((r: { slug: string }) => r.slug)
}

// ── Admin (service-role) helpers ─────────────────────────
export async function getSettingDraft<T>(key: string): Promise<T | null> {
  const db = getSupabaseServiceClient()
  const { data } = await db
    .from('site_settings')
    .select('draft_value')
    .eq('key', key)
    .single()
  return data ? (data.draft_value as T) : null
}

export async function upsertSettingDraft(key: string, value: unknown) {
  const db = getSupabaseServiceClient()
  return db.from('site_settings').upsert({
    key,
    draft_value: value,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'key' })
}

export async function publishSetting(key: string) {
  const db = getSupabaseServiceClient()
  const { data } = await db
    .from('site_settings')
    .select('draft_value')
    .eq('key', key)
    .single()
  if (!data) return
  return db.from('site_settings').update({
    published_value: data.draft_value,
    published_at: new Date().toISOString(),
  }).eq('key', key)
}

export async function publishAllSettings() {
  const db = getSupabaseServiceClient()
  return db.rpc('publish_all_settings').throwOnError()
    .catch(() =>
      // Fallback if RPC not set up: update individually
      db.from('site_settings').select('key, draft_value').then(({ data }) => {
        if (!data) return
        return Promise.all(
          data.map(row =>
            db.from('site_settings').update({
              published_value: row.draft_value,
              published_at: new Date().toISOString(),
            }).eq('key', row.key)
          )
        )
      })
    )
}

// ── Revalidation ──────────────────────────────────────────
export async function revalidatePublicPages() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  try {
    await fetch(`${siteUrl}/api/revalidate`, {
      method: 'POST',
      headers: { 'x-revalidate-secret': process.env.ADMIN_JWT_SECRET ?? '' },
    })
  } catch {
    // Non-fatal — pages will revalidate on next request anyway
  }
}
