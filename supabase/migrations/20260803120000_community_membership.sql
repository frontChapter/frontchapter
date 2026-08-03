-- FrontChapter community membership — Phase 1 schema
--
-- Auth: Telegram OIDC via Supabase custom provider (issuer https://oauth.telegram.org).
-- members.id = auth.users.id (1:1). Profile seed via handle_new_user trigger.
-- Timezone for cron / daily message cap (app logic later): Asia/Tehran.
-- Monthly Telegram custom title (set by cron later): هویج فعال ماه
-- Telegram group: @frontChapterGroup
--
-- Apply in Supabase SQL Editor, or: supabase db push
--
-- BEFORE Phase 2 login works, configure in Dashboard (not this migration):
--   Auth → Providers → Add custom OIDC provider
--     Identifier: custom:telegram
--     Issuer:     https://oauth.telegram.org
--     Client ID / Secret: from @BotFather → Bot Settings → Web Login
--       (these are NOT the Bot API token; get them from Web Login)
--     Scopes: openid profile   (omit phone — known buggy; we don't need it)
--   Auth → Settings: allow users without an email (Telegram has no email claim)
--   BotFather Web Login → Allowed URLs: https://frontchapter.ir + Supabase
--     callback (copy from provider after create)
--   Keep Telegram ID-token signing algorithm at RS256 (BotFather default).
--
-- Secrets for later phases (Edge Functions / cron) — do NOT commit:
--   TELEGRAM_BOT_TOKEN, SUPABASE service role key

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

-- Calendar "today" in Iran time (message-cap + monthly window use this later)
CREATE OR REPLACE FUNCTION public.tehran_today()
RETURNS date
LANGUAGE sql
STABLE
AS $$
  SELECT (timezone('Asia/Tehran', now()))::date;
$$;

CREATE OR REPLACE FUNCTION public.tehran_year_month(ts timestamptz DEFAULT now())
RETURNS text
LANGUAGE sql
STABLE
AS $$
  SELECT to_char(timezone('Asia/Tehran', ts), 'YYYY-MM');
$$;

-- ---------------------------------------------------------------------------
-- members  (1:1 with auth.users)
-- ---------------------------------------------------------------------------

CREATE TABLE public.members (
  id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  telegram_id bigint NOT NULL UNIQUE,
  username text,
  display_name text NOT NULL,
  photo_url text,
  expertise text,
  bio text,
  linkedin_url text,
  github_url text,
  website_url text,
  is_public boolean NOT NULL DEFAULT true,
  invited_by uuid REFERENCES public.members (id) ON DELETE SET NULL,
  telegram_joined_at timestamptz,
  profile_completed_at timestamptz,
  is_admin boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT members_no_self_invite CHECK (invited_by IS DISTINCT FROM id)
);

CREATE INDEX members_public_idx ON public.members (is_public) WHERE is_public = true;
CREATE INDEX members_invited_by_idx ON public.members (invited_by) WHERE invited_by IS NOT NULL;

CREATE TRIGGER members_set_updated_at
  BEFORE UPDATE ON public.members
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

COMMENT ON COLUMN public.members.invited_by IS
  'Reserved for future invite attribution (+20). No scoring logic in v1.';

-- ---------------------------------------------------------------------------
-- activity_log  (source of truth for points; Studio inserts for manual awards)
-- ---------------------------------------------------------------------------

CREATE TABLE public.activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid NOT NULL REFERENCES public.members (id) ON DELETE CASCADE,
  activity_type text NOT NULL,
  points integer NOT NULL CHECK (points >= 0),
  meta jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES public.members (id) ON DELETE SET NULL,
  CONSTRAINT activity_log_type_check CHECK (
    activity_type = ANY (ARRAY[
      'profile_complete',
      'quality_message',
      'invite',           -- reserved; no app logic yet
      'event_online',
      'event_inperson',
      'blog_post',
      'talk'
    ])
  )
);

-- One-time automatic award
CREATE UNIQUE INDEX activity_log_profile_complete_once
  ON public.activity_log (member_id)
  WHERE activity_type = 'profile_complete';

CREATE INDEX activity_log_member_created_idx
  ON public.activity_log (member_id, created_at DESC);

CREATE INDEX activity_log_created_idx
  ON public.activity_log (created_at DESC);

CREATE INDEX activity_log_type_created_idx
  ON public.activity_log (activity_type, created_at DESC);

COMMENT ON TABLE public.activity_log IS
  'Point events. Manual awards (events/blog/talk): insert via Supabase Studio. '
  'quality_message daily cap (5) enforced by bot Edge Function using tehran_today().';

-- ---------------------------------------------------------------------------
-- achievements  (permanent badges, once each)
-- ---------------------------------------------------------------------------

CREATE TABLE public.achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid NOT NULL REFERENCES public.members (id) ON DELETE CASCADE,
  badge text NOT NULL,
  awarded_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT achievements_badge_check CHECK (
    badge = ANY (ARRAY['speaker', 'writer'])
  ),
  CONSTRAINT achievements_member_badge_unique UNIQUE (member_id, badge)
);

CREATE INDEX achievements_member_idx ON public.achievements (member_id);

COMMENT ON COLUMN public.achievements.badge IS
  'speaker = Havij-e Sokhanran (first talk); writer = Havij-e Ghalam-be-Dast (first article). '
  'Insert alongside talk / blog_post activity_log rows in Studio.';

-- ---------------------------------------------------------------------------
-- monthly_active_titles  (top 40 Telegram custom-title holders)
-- ---------------------------------------------------------------------------

CREATE TABLE public.monthly_active_titles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  year_month text NOT NULL,
  member_id uuid NOT NULL REFERENCES public.members (id) ON DELETE CASCADE,
  rank integer NOT NULL CHECK (rank >= 1 AND rank <= 40),
  score integer NOT NULL CHECK (score >= 0),
  telegram_promoted boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT monthly_active_titles_ym_member UNIQUE (year_month, member_id),
  CONSTRAINT monthly_active_titles_ym_rank UNIQUE (year_month, rank),
  CONSTRAINT monthly_active_titles_ym_format CHECK (year_month ~ '^\d{4}-\d{2}$')
);

CREATE INDEX monthly_active_titles_ym_idx
  ON public.monthly_active_titles (year_month);

COMMENT ON TABLE public.monthly_active_titles IS
  'Cron (1st of month, Asia/Tehran): top 40 by activity in prior window; '
  'promote + setChatAdministratorCustomTitle = هویج فعال ماه';

-- ---------------------------------------------------------------------------
-- Seed member row on Telegram OIDC signup
-- ---------------------------------------------------------------------------
-- Supabase maps OIDC claims into raw_user_meta_data / auth.identities.identity_data.
-- Telegram profile scope: id, name, preferred_username, picture
-- (sub ≠ Telegram numeric id — always prefer claim "id" for bot matching.)

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  meta jsonb := COALESCE(NEW.raw_user_meta_data, '{}'::jsonb);
  ident jsonb;
  tg_id bigint;
  uname text;
  dname text;
  photo text;
BEGIN
  SELECT i.identity_data
    INTO ident
    FROM auth.identities i
   WHERE i.user_id = NEW.id
   ORDER BY i.created_at DESC NULLS LAST
   LIMIT 1;

  ident := COALESCE(ident, '{}'::jsonb);

  tg_id := COALESCE(
    NULLIF(meta->>'id', '')::bigint,
    NULLIF(ident->>'id', '')::bigint
  );

  IF tg_id IS NULL THEN
    RAISE EXCEPTION 'handle_new_user: missing Telegram id claim for user %', NEW.id
      USING HINT = 'Ensure OIDC scopes include profile and claim "id" reaches user metadata.';
  END IF;

  uname := NULLIF(COALESCE(meta->>'preferred_username', ident->>'preferred_username'), '');
  dname := COALESCE(
    NULLIF(COALESCE(meta->>'name', ident->>'name'), ''),
    uname,
    'Member'
  );
  photo := NULLIF(COALESCE(meta->>'picture', ident->>'picture'), '');

  INSERT INTO public.members (id, telegram_id, username, display_name, photo_url)
  VALUES (NEW.id, tg_id, uname, dname, photo)
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Keep telegram profile fields fresh on re-login (metadata update)
CREATE OR REPLACE FUNCTION public.handle_user_metadata_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  meta jsonb := COALESCE(NEW.raw_user_meta_data, '{}'::jsonb);
BEGIN
  IF NEW.raw_user_meta_data IS DISTINCT FROM OLD.raw_user_meta_data THEN
    UPDATE public.members
       SET username = COALESCE(NULLIF(meta->>'preferred_username', ''), username),
           display_name = COALESCE(NULLIF(meta->>'name', ''), display_name),
           photo_url = COALESCE(NULLIF(meta->>'picture', ''), photo_url),
           updated_at = now()
     WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE OF raw_user_meta_data ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_user_metadata_update();

-- ---------------------------------------------------------------------------
-- Views (security_invoker → underlying RLS applies)
-- ---------------------------------------------------------------------------

CREATE OR REPLACE VIEW public.member_stats
WITH (security_invoker = true)
AS
SELECT
  m.id,
  m.telegram_id,
  m.username,
  m.display_name,
  m.photo_url,
  m.expertise,
  m.bio,
  m.linkedin_url,
  m.github_url,
  m.website_url,
  m.is_public,
  m.telegram_joined_at,
  m.profile_completed_at,
  m.created_at,
  COALESCE(s.points_total, 0)::integer AS points_total,
  CASE
    WHEN COALESCE(s.points_total, 0) >= 800 THEN 'golden'   -- Havij-e Talaei
    WHEN COALESCE(s.points_total, 0) >= 400 THEN 'senior'   -- Havij-e Arshad
    WHEN COALESCE(s.points_total, 0) >= 150 THEN 'whole'    -- Havij-e Tamam
    WHEN COALESCE(s.points_total, 0) >= 50  THEN 'young'    -- Havij-e Javan
    ELSE 'badge'                                           -- Havij-Neshan
  END AS level_key,
  COALESCE(ab.badges, ARRAY[]::text[]) AS badges
FROM public.members m
LEFT JOIN (
  SELECT member_id, SUM(points)::integer AS points_total
  FROM public.activity_log
  GROUP BY member_id
) s ON s.member_id = m.id
LEFT JOIN (
  SELECT member_id, array_agg(badge ORDER BY awarded_at) AS badges
  FROM public.achievements
  GROUP BY member_id
) ab ON ab.member_id = m.id;

COMMENT ON VIEW public.member_stats IS
  'Directory/profile read model: points, level_key, badges. RLS via members.';

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monthly_active_titles ENABLE ROW LEVEL SECURITY;

-- members
CREATE POLICY members_select_public_or_self
  ON public.members
  FOR SELECT
  TO anon, authenticated
  USING (is_public = true OR auth.uid() = id);

CREATE POLICY members_update_own_profile
  ON public.members
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Block clients from raising privileges / forging telegram identity.
-- service_role bypasses RLS; this trigger still runs — skip non-authenticated roles.
CREATE OR REPLACE FUNCTION public.members_guard_column_changes()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF COALESCE(auth.jwt() ->> 'role', '') = 'authenticated' THEN
    IF NEW.id IS DISTINCT FROM OLD.id
       OR NEW.telegram_id IS DISTINCT FROM OLD.telegram_id
       OR NEW.is_admin IS DISTINCT FROM OLD.is_admin
       OR NEW.invited_by IS DISTINCT FROM OLD.invited_by
       OR NEW.telegram_joined_at IS DISTINCT FROM OLD.telegram_joined_at
       OR NEW.profile_completed_at IS DISTINCT FROM OLD.profile_completed_at
       OR NEW.created_at IS DISTINCT FROM OLD.created_at THEN
      RAISE EXCEPTION 'members: cannot change protected columns';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER members_guard_protected_columns
  BEFORE UPDATE ON public.members
  FOR EACH ROW
  EXECUTE FUNCTION public.members_guard_column_changes();

-- No INSERT/DELETE for anon/authenticated on members (trigger + service role only)

-- activity_log: readable for public members' history + own; writes = Studio/service role
CREATE POLICY activity_log_select_visible
  ON public.activity_log
  FOR SELECT
  TO anon, authenticated
  USING (
    member_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.members m
      WHERE m.id = activity_log.member_id AND m.is_public = true
    )
  );

-- achievements
CREATE POLICY achievements_select_visible
  ON public.achievements
  FOR SELECT
  TO anon, authenticated
  USING (
    member_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.members m
      WHERE m.id = achievements.member_id AND m.is_public = true
    )
  );

-- monthly titles: public read (announcement archive)
CREATE POLICY monthly_titles_select_all
  ON public.monthly_active_titles
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Grants: views + tables for API roles
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.members, public.activity_log, public.achievements, public.monthly_active_titles TO anon, authenticated;
GRANT UPDATE ON public.members TO authenticated;
GRANT SELECT ON public.member_stats TO anon, authenticated;

-- ---------------------------------------------------------------------------
-- Suggested Studio manual-award cheatsheet (points)
-- ---------------------------------------------------------------------------
-- profile_complete  10   (prefer app trigger later; unique index enforces once)
-- quality_message    1   (bot only; max 5 / tehran_today)
-- invite            20   (reserved)
-- event_online      15
-- event_inperson    30
-- blog_post         80   + achievements.badge = writer (first time)
-- talk             100   + achievements.badge = speaker (first time)
