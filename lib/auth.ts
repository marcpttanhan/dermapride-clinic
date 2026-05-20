import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { getSupabaseServiceClient } from './supabase/server'
import type { AdminUser } from './supabase/types'

const COOKIE_NAME = process.env.ADMIN_COOKIE_NAME ?? 'dp_admin_session'
const JWT_SECRET  = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET ?? 'insecure-dev-secret-change-me-32chars+'
)
const SESSION_TTL = Number(process.env.ADMIN_SESSION_TTL ?? 86400)  // 24h

export interface SessionPayload {
  sub:   string   // admin_user.id
  email: string
  role:  string
}

// ── Token helpers ─────────────────────────────────────────
export async function signToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL}s`)
    .sign(JWT_SECRET)
}

export async function verifyToken(token: string): Promise<SessionPayload> {
  const { payload } = await jwtVerify(token, JWT_SECRET)
  return payload as unknown as SessionPayload
}

// ── Cookie helpers ────────────────────────────────────────
export async function setSessionCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge:   SESSION_TTL,
    path:     '/',
  })
}

export async function clearSessionCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

export async function getSessionToken(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get(COOKIE_NAME)?.value
}

// ── Session resolver (for Server Components / API routes) ─
export async function getAdminSession(): Promise<SessionPayload | null> {
  const token = await getSessionToken()
  if (!token) return null
  try {
    return await verifyToken(token)
  } catch {
    return null
  }
}

// ── Login ──────────────────────────────────────────────────
export async function loginAdmin(
  email: string,
  password: string
): Promise<{ user: AdminUser; token: string } | { error: string }> {
  const { compare } = await import('bcryptjs')
  const db = getSupabaseServiceClient()

  const { data: user, error } = await db
    .from('admin_users')
    .select('id, email, password_hash, role, name')
    .eq('email', email.toLowerCase().trim())
    .single()

  if (error || !user) return { error: 'Invalid credentials' }

  const valid = await compare(password, user.password_hash)
  if (!valid) return { error: 'Invalid credentials' }

  // Update last_login
  await db.from('admin_users').update({ last_login: new Date().toISOString() }).eq('id', user.id)

  const payload: SessionPayload = { sub: user.id, email: user.email, role: user.role }
  const token = await signToken(payload)

  return {
    user: { id: user.id, email: user.email, role: user.role as 'admin' | 'editor', name: user.name, created_at: '', last_login: null },
    token,
  }
}

// ── Password hash helper (for seeding / user management) ─
export async function hashPassword(plain: string): Promise<string> {
  const { hash } = await import('bcryptjs')
  return hash(plain, 12)
}
