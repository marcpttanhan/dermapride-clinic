// ============================================================
// Shared TypeScript types for the DermaPride CMS
// ============================================================

// ── Settings domain types ────────────────────────────────
export interface HeroSettings {
  kicker: string
  l1: string
  l2: string
  l3: string
  side: string
  ctaPrimary: string
  ctaPrimaryHref: string
  ctaSecondary: string
  ctaSecondaryHref: string
  backgroundImage: string
  backgroundVideo?: string
}

export interface DoctorSettings {
  role: string
  name: string
  nameTh: string
  license: string
  quote: string
  bio: string
  image: string
  specialization: string
  certifications: string
  experience: string
  verificationUrl: string
}

export interface ContactSettings {
  phone: string
  facebook: string
  line?: string
  instagram?: string
  tiktok?: string
}

export interface BranchSettings {
  name: string
  address: string
  license: string
  phone: string
  image1: string
  image2: string
  image3: string
  mapUrl: string
  mapEmbed: string
  extra1Label?: string
  extra1Value?: string
  extra2Label?: string
  extra2Value?: string
}

export interface HourRow {
  day: string
  th: string
  open: string
  close: string
  closed: boolean
}

export interface PhilosophyItem {
  id: string
  title: string
  titleTh: string
  body: string
  visible: boolean
}

export interface PhilosophySettings {
  kicker: string
  title: string
  sub: string
  items: PhilosophyItem[]
}

export interface ResultItem {
  id: string
  image: string
  title: string
  summary: string
  treatment: string
  amount: string
  resultTime: string
  visible: boolean
}

export interface OfferItem {
  id: string
  image: string
  title: string       // supports [Em] bracket syntax
  sub: string
  tag: string
  price: string
  was: string
  ctaHref: string
  visible: boolean
}

export interface FaqItem {
  id: string
  q: string
  a: string
  visible: boolean
}

export interface ThemeSettings {
  primary: string
  secondary: string
  ink: string
  paper: string
  radiusScale: number
  fontScale: number
}

export interface SeoSettings {
  title: string
  description: string
  ogImage: string
}

// ── Database row types ────────────────────────────────────
export interface ProcedureRow {
  id: string
  slug: string
  name: string
  name_th: string | null
  description: string | null
  image_url: string | null
  hero_image_url: string | null
  cta_text: string
  kicker: string
  headline: string | null
  sub_text: string | null
  sort_order: number
  visible: boolean
  seo_title: string | null
  seo_desc: string | null
  seo_og_image: string | null
  created_at: string
  updated_at: string
  // joined
  sections?: ProcedureSectionRow[]
}

export interface ProcedureSectionRow {
  id: string
  procedure_id: string
  type: 'image-text' | 'slider' | 'before-after' | 'pricing' | 'reviews' | 'cta'
  title: string | null
  subtitle: string | null
  body: string | null
  price: string | null
  tags: string | null
  images: Array<{ src: string; alt?: string }>
  sort_order: number
  visible: boolean
  created_at: string
  updated_at: string
}

export interface ReviewRow {
  id: string
  name: string
  age: string | null
  treatment: string | null
  body: string
  stars: number
  image_url: string | null
  visible: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface MediaRow {
  id: string
  filename: string
  storage_path: string
  public_url: string
  mime_type: string | null
  size_bytes: number | null
  width: number | null
  height: number | null
  alt_text: string | null
  uploaded_by: string | null
  created_at: string
}

export interface AdminUser {
  id: string
  email: string
  role: 'admin' | 'editor'
  name: string | null
  created_at: string
  last_login: string | null
}

export interface BookingRow {
  id: string
  name: string
  phone: string
  branch: string | null
  service: string | null
  date: string | null
  time_slot: string | null
  message: string | null
  status: 'pending' | 'confirmed' | 'cancelled'
  created_at: string
}

// ── Homepage aggregated data ──────────────────────────────
export interface HomePageData {
  hero: HeroSettings
  doctor: DoctorSettings
  contact: ContactSettings
  branches: BranchSettings[]
  hours: HourRow[]
  philosophy: PhilosophySettings
  results: { items: ResultItem[] }
  offers: { items: OfferItem[] }
  faq: { items: FaqItem[] }
  theme: ThemeSettings
  seo: SeoSettings
  procedures: ProcedureRow[]
  reviews: ReviewRow[]
}
