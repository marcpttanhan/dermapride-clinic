-- ============================================================
-- DermaPride Clinics — Initial Schema
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ──────────────────────────────────────────────────────────
-- ADMIN USERS
-- ──────────────────────────────────────────────────────────
CREATE TABLE admin_users (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT        UNIQUE NOT NULL,
  password_hash TEXT        NOT NULL,
  role          TEXT        NOT NULL DEFAULT 'editor'
                            CHECK (role IN ('admin', 'editor')),
  name          TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_login    TIMESTAMPTZ
);

-- ──────────────────────────────────────────────────────────
-- ADMIN SESSIONS
-- ──────────────────────────────────────────────────────────
CREATE TABLE admin_sessions (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  token_hash TEXT        UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_sessions_token  ON admin_sessions(token_hash);
CREATE INDEX idx_sessions_expiry ON admin_sessions(expires_at);

-- ──────────────────────────────────────────────────────────
-- SITE SETTINGS (draft + published JSONB per key)
-- ──────────────────────────────────────────────────────────
CREATE TABLE site_settings (
  key             TEXT        PRIMARY KEY,
  draft_value     JSONB       NOT NULL DEFAULT 'null'::jsonb,
  published_value JSONB       NOT NULL DEFAULT 'null'::jsonb,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  published_at    TIMESTAMPTZ
);

-- ──────────────────────────────────────────────────────────
-- PROCEDURES
-- ──────────────────────────────────────────────────────────
CREATE TABLE procedures (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          TEXT        UNIQUE NOT NULL,
  name          TEXT        NOT NULL,
  name_th       TEXT,
  description   TEXT,
  image_url     TEXT,
  hero_image_url TEXT,
  cta_text      TEXT        NOT NULL DEFAULT 'ดูรายละเอียด',
  kicker        TEXT        NOT NULL DEFAULT 'Procedures',
  headline      TEXT,
  sub_text      TEXT,
  sort_order    INTEGER     NOT NULL DEFAULT 0,
  visible       BOOLEAN     NOT NULL DEFAULT true,
  seo_title     TEXT,
  seo_desc      TEXT,
  seo_og_image  TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_procedures_slug  ON procedures(slug);
CREATE INDEX idx_procedures_order ON procedures(sort_order);

-- ──────────────────────────────────────────────────────────
-- PROCEDURE SECTIONS
-- ──────────────────────────────────────────────────────────
CREATE TABLE procedure_sections (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  procedure_id UUID        NOT NULL REFERENCES procedures(id) ON DELETE CASCADE,
  type         TEXT        NOT NULL
               CHECK (type IN ('image-text','slider','before-after','pricing','reviews','cta')),
  title        TEXT,
  subtitle     TEXT,
  body         TEXT,
  price        TEXT,
  tags         TEXT,
  images       JSONB       NOT NULL DEFAULT '[]'::jsonb,
  sort_order   INTEGER     NOT NULL DEFAULT 0,
  visible      BOOLEAN     NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_proc_sections_proc ON procedure_sections(procedure_id, sort_order);

-- ──────────────────────────────────────────────────────────
-- REVIEWS
-- ──────────────────────────────────────────────────────────
CREATE TABLE reviews (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT        NOT NULL,
  age         TEXT,
  treatment   TEXT,
  body        TEXT        NOT NULL,
  stars       SMALLINT    NOT NULL DEFAULT 5 CHECK (stars BETWEEN 1 AND 5),
  image_url   TEXT,
  visible     BOOLEAN     NOT NULL DEFAULT true,
  sort_order  INTEGER     NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_reviews_order ON reviews(sort_order);

-- ──────────────────────────────────────────────────────────
-- MEDIA LIBRARY
-- ──────────────────────────────────────────────────────────
CREATE TABLE media (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  filename     TEXT        NOT NULL,
  storage_path TEXT        NOT NULL,
  public_url   TEXT        NOT NULL,
  mime_type    TEXT,
  size_bytes   INTEGER,
  width        INTEGER,
  height       INTEGER,
  alt_text     TEXT,
  uploaded_by  UUID        REFERENCES admin_users(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_media_created ON media(created_at DESC);

-- ──────────────────────────────────────────────────────────
-- CONTENT VERSIONS (rollback support)
-- ──────────────────────────────────────────────────────────
CREATE TABLE content_versions (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type  TEXT        NOT NULL,
  entity_id    TEXT        NOT NULL,
  data         JSONB       NOT NULL,
  version_label TEXT,
  created_by   UUID        REFERENCES admin_users(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_versions_entity ON content_versions(entity_type, entity_id, created_at DESC);

-- ──────────────────────────────────────────────────────────
-- BOOKINGS
-- ──────────────────────────────────────────────────────────
CREATE TABLE bookings (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT        NOT NULL,
  phone      TEXT        NOT NULL,
  branch     TEXT,
  service    TEXT,
  date       DATE,
  time_slot  TEXT,
  message    TEXT,
  status     TEXT        NOT NULL DEFAULT 'pending'
             CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_bookings_status  ON bookings(status);
CREATE INDEX idx_bookings_created ON bookings(created_at DESC);

-- ──────────────────────────────────────────────────────────
-- TRIGGERS: updated_at auto-bump
-- ──────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER trg_procedures_upd
  BEFORE UPDATE ON procedures
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_proc_sections_upd
  BEFORE UPDATE ON procedure_sections
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_reviews_upd
  BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ──────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ──────────────────────────────────────────────────────────
-- Public tables: readable by all, writable only via service role
ALTER TABLE procedures          ENABLE ROW LEVEL SECURITY;
ALTER TABLE procedure_sections  ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews             ENABLE ROW LEVEL SECURITY;
ALTER TABLE media               ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings       ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings            ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users         ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions      ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_versions    ENABLE ROW LEVEL SECURITY;

-- Public read on published data
CREATE POLICY "Public read procedures"
  ON procedures FOR SELECT USING (visible = true);

CREATE POLICY "Public read procedure_sections"
  ON procedure_sections FOR SELECT
  USING (visible = true AND EXISTS (
    SELECT 1 FROM procedures p WHERE p.id = procedure_id AND p.visible = true
  ));

CREATE POLICY "Public read reviews"
  ON reviews FOR SELECT USING (visible = true);

-- Allow anon to read the published_value of site_settings
CREATE POLICY "Public read site_settings"
  ON site_settings FOR SELECT USING (true);

-- Only service role (API server) can write
-- All INSERT/UPDATE/DELETE are done via service_role key in API routes
-- so anon and authenticated (non-service) roles cannot write.

-- ──────────────────────────────────────────────────────────
-- STORAGE BUCKET (apply in Supabase dashboard or via CLI)
-- ──────────────────────────────────────────────────────────
-- Run once after migration:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('dermapride-media', 'dermapride-media', true);
-- CREATE POLICY "Public read media" ON storage.objects FOR SELECT USING (bucket_id = 'dermapride-media');
