// ── HTML / XSS helpers ───────────────────────────────────
export function esc(s: unknown): string {
  return String(s ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]!))
}

// Convert "[bracketed]" text to <em>italic</em>
export function parseAccent(s: string): string {
  return s.replace(/\[([^\]]+)\]/g, '<em>$1</em>')
}

// Safely parse JSON without throwing
export function parseJSON<T>(json: string | null | undefined, fallback: T): T {
  if (!json) return fallback
  try { return JSON.parse(json) as T } catch { return fallback }
}

// Slugify a string to URL-safe kebab-case
export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/^-+|-+$/g, '')
}

// Format bytes to human-readable
export function formatBytes(bytes: number): string {
  if (bytes < 1024)       return `${bytes} B`
  if (bytes < 1048576)    return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1048576).toFixed(1)} MB`
}

// Clamp a number between min and max
export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n))
}

// Day-of-week index map
const DAY_MAP: Record<string, number> = {
  Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3,
  Thursday: 4, Friday: 5, Saturday: 6,
}
export function dayIndex(day: string): number {
  return DAY_MAP[day] ?? -1
}

// Image URL normalizer: handle both legacy 'assets/...' and absolute '/assets/...'
export function normalizeImageUrl(url: string | null | undefined): string {
  if (!url) return ''
  if (url.startsWith('http') || url.startsWith('/')) return url
  return `/${url}`  // prepend slash for Next.js public folder
}
