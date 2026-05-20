# DermaPride Clinics — Production CMS

A production-ready Next.js 15 clinic CMS with Supabase backend, preserving the full premium editorial design of the original prototype.

---

## Architecture

```
app/                    Next.js 15 App Router
├── page.tsx            Homepage (ISR, 60s revalidation)
├── procedures/[slug]/  Dynamic procedure pages
├── admin/              Protected admin area
│   ├── login/          JWT-based auth login
│   └── dashboard/      Full CMS dashboard
└── api/
    ├── auth/           login · logout
    ├── cms/            settings · procedures · reviews · media · publish
    ├── booking/        appointment form submissions
    └── revalidate/     on-demand ISR revalidation

components/
├── site/               All public-facing sections (server + client components)
└── admin/              Admin shell + login form

lib/
├── supabase/           Browser + server clients + TypeScript types
├── auth.ts             JWT session (jose + bcryptjs, httpOnly cookies)
├── cms.ts              Data access layer (ISR-aware)
└── utils.ts            Shared helpers

styles/
├── globals.css         Entry point (imports brand + editorial)
├── brand.css           Original styles.css (font path updated for /public)
├── editorial.css       Original editorial.css (unchanged)
├── admin.css           Original admin panel styles
└── procedure.css       Procedure page styles

supabase/
├── migrations/001_initial.sql    Full schema + RLS
└── seed.sql                      Default data + admin user
```

---

## Quick Start

### 1. Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com) project
- (Optional) [Supabase CLI](https://supabase.com/docs/guides/cli) for migrations

### 2. Clone & install

```bash
git clone <repo>
cd dermapride-clinics
npm install
```

### 3. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in all values (see `.env.example` for docs).

Critical:
- `NEXT_PUBLIC_SUPABASE_URL` — from Supabase → Project Settings → API
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — from the same page
- `SUPABASE_SERVICE_ROLE_KEY` — secret key, never expose to browser
- `ADMIN_JWT_SECRET` — random 64-char string: `openssl rand -hex 32`

### 4. Run database migrations

**Option A — Supabase CLI (recommended)**
```bash
supabase login
supabase link --project-ref <your-project-ref>
supabase db push
supabase db reset --linked   # runs migrations + seed
```

**Option B — Supabase Dashboard SQL Editor**
1. Copy `supabase/migrations/001_initial.sql` → run in SQL editor
2. Copy `supabase/seed.sql` → run in SQL editor

### 5. Create Supabase Storage bucket

In the Supabase dashboard → Storage → New bucket:
- Name: `dermapride-media`
- Public: ✓

Or run in SQL editor:
```sql
INSERT INTO storage.buckets (id, name, public) VALUES ('dermapride-media', 'dermapride-media', true);
CREATE POLICY "Public read media" ON storage.objects FOR SELECT USING (bucket_id = 'dermapride-media');
```

### 6. Start development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

Admin panel: [http://localhost:3000/admin](http://localhost:3000/admin)
- Default email: `admin@dermapride.com`
- Default password: `admin123` ← **change this in production!**

---

## Changing the admin password

In Supabase SQL editor:

```sql
-- Replace with your real bcrypt hash (cost 12)
-- Generate: node -e "const b=require('bcryptjs'); b.hash('yourpassword',12).then(console.log)"
UPDATE admin_users
SET password_hash = '$2a$12$<your-hash-here>'
WHERE email = 'admin@dermapride.com';
```

---

## Deployment (Vercel — recommended)

1. Push code to GitHub
2. Import repository in [vercel.com](https://vercel.com)
3. Add all environment variables from `.env.example`
4. Deploy

Vercel automatically detects Next.js, handles ISR, and supports Edge Functions for the middleware.

### Environment variables for Vercel

| Variable | Where to find |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API |
| `ADMIN_JWT_SECRET` | `openssl rand -hex 32` |
| `SUPABASE_STORAGE_BUCKET` | `dermapride-media` |
| `NEXT_PUBLIC_SITE_URL` | `https://your-domain.com` |

---

## CMS Workflow

1. **Edit** — make changes in Admin Dashboard → saved to `draft_value`
2. **Preview** — changes are live on the page immediately (admin sees draft; public sees published)
3. **Publish** — click "Publish Changes" → copies draft → published, triggers ISR revalidation
4. **Rollback** — content versions are saved in `content_versions` table

---

## URL structure

| Route | Description |
|---|---|
| `/` | Homepage (all CMS-driven sections) |
| `/procedures/botox` | Dynamic procedure page |
| `/procedures/filler` | Dynamic procedure page |
| `/procedures/[slug]` | Any slug from the `procedures` table |
| `/admin` | Redirects to `/admin/dashboard` |
| `/admin/login` | Login page |
| `/admin/dashboard` | Protected CMS dashboard |
| `/api/cms/*` | Protected CMS API (auth required) |
| `/api/booking` | Public booking form endpoint |
| `/sitemap.xml` | Auto-generated sitemap |
| `/robots.txt` | Auto-generated robots file |

Backward-compatible redirect: `/procedure.html?cat=botox` → `/procedures/botox`

---

## Performance

- **ISR** — homepage and procedure pages revalidate every 60 seconds
- **Fonts** — Fraunces + JetBrains Mono loaded via `next/font` (no layout shift)
- **Anuphan** — served from `/public/assets/fonts/` as a variable font
- **Images** — `next/image` ready; Supabase Storage URLs are whitelisted in `next.config.ts`
- **CSS** — existing premium CSS is preserved verbatim, imported at build time

---

## Admin credentials (seed)

| Field | Value |
|---|---|
| Email | `admin@dermapride.com` |
| Password | `admin123` |
| Role | `admin` |

**Change the password immediately after first login.**
