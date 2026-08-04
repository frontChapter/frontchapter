-- Phase 1b: member_emails + thin events + registration/attendance
--
-- Email lives off members so public RLS on members cannot leak it.
-- Events content stays in /posts/ markdown; this table is the DB registry only.

-- ---------------------------------------------------------------------------
-- member_emails  (private; self + service_role)
-- ---------------------------------------------------------------------------

CREATE TABLE public.member_emails (
  member_id uuid PRIMARY KEY REFERENCES public.members (id) ON DELETE CASCADE,
  email text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT member_emails_email_nonempty CHECK (length(trim(email)) > 0)
);

CREATE UNIQUE INDEX member_emails_email_lower_uidx
  ON public.member_emails (lower(trim(email)));

CREATE TRIGGER member_emails_set_updated_at
  BEFORE UPDATE ON public.member_emails
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

COMMENT ON TABLE public.member_emails IS
  'Private contact email. RLS: owner only. CSV attendance match uses service_role.';

ALTER TABLE public.member_emails ENABLE ROW LEVEL SECURITY;

CREATE POLICY member_emails_select_own
  ON public.member_emails
  FOR SELECT
  TO authenticated
  USING (auth.uid() = member_id);

CREATE POLICY member_emails_insert_own
  ON public.member_emails
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = member_id);

CREATE POLICY member_emails_update_own
  ON public.member_emails
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = member_id)
  WITH CHECK (auth.uid() = member_id);

CREATE POLICY member_emails_delete_own
  ON public.member_emails
  FOR DELETE
  TO authenticated
  USING (auth.uid() = member_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.member_emails TO authenticated;

-- Upsert own email (normalizes trim + lower for storage consistency on unique index)
CREATE OR REPLACE FUNCTION public.set_member_email(p_email text)
RETURNS public.member_emails
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  normalized text := lower(trim(COALESCE(p_email, '')));
  result public.member_emails;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;

  IF normalized = '' OR position('@' IN normalized) = 0 THEN
    RAISE EXCEPTION 'valid email required';
  END IF;

  INSERT INTO public.member_emails (member_id, email)
  VALUES (uid, normalized)
  ON CONFLICT (member_id) DO UPDATE
    SET email = EXCLUDED.email,
        updated_at = now()
  RETURNING * INTO result;

  RETURN result;
END;
$$;

REVOKE ALL ON FUNCTION public.set_member_email(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.set_member_email(text) TO authenticated;

COMMENT ON FUNCTION public.set_member_email IS
  'Upsert caller email into member_emails (private).';

-- Replace 6-arg complete_profile with 7-arg (p_email DEFAULT NULL — old callers OK)
DROP FUNCTION IF EXISTS public.complete_profile(text, text, text, text, text, boolean);

CREATE OR REPLACE FUNCTION public.complete_profile(
  p_expertise text,
  p_bio text DEFAULT NULL,
  p_linkedin_url text DEFAULT NULL,
  p_github_url text DEFAULT NULL,
  p_website_url text DEFAULT NULL,
  p_is_public boolean DEFAULT true,
  p_email text DEFAULT NULL
)
RETURNS public.members
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  result public.members;
  exp text := trim(COALESCE(p_expertise, ''));
  normalized text;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;

  IF exp = '' THEN
    RAISE EXCEPTION 'expertise required';
  END IF;

  UPDATE public.members
     SET expertise = exp,
         bio = NULLIF(trim(COALESCE(p_bio, '')), ''),
         linkedin_url = NULLIF(trim(COALESCE(p_linkedin_url, '')), ''),
         github_url = NULLIF(trim(COALESCE(p_github_url, '')), ''),
         website_url = NULLIF(trim(COALESCE(p_website_url, '')), ''),
         is_public = COALESCE(p_is_public, true),
         profile_completed_at = COALESCE(profile_completed_at, now()),
         updated_at = now()
   WHERE id = uid
   RETURNING * INTO result;

  IF result.id IS NULL THEN
    RAISE EXCEPTION 'member row missing — OIDC trigger may have failed';
  END IF;

  INSERT INTO public.activity_log (member_id, activity_type, points, created_by)
  SELECT uid, 'profile_complete', 10, uid
   WHERE NOT EXISTS (
     SELECT 1
       FROM public.activity_log
      WHERE member_id = uid
        AND activity_type = 'profile_complete'
   );

  normalized := lower(trim(COALESCE(p_email, '')));
  IF normalized <> '' THEN
    IF position('@' IN normalized) = 0 THEN
      RAISE EXCEPTION 'valid email required';
    END IF;
    INSERT INTO public.member_emails (member_id, email)
    VALUES (uid, normalized)
    ON CONFLICT (member_id) DO UPDATE
      SET email = EXCLUDED.email,
          updated_at = now();
  END IF;

  RETURN result;
END;
$$;

REVOKE ALL ON FUNCTION public.complete_profile(
  text, text, text, text, text, boolean, text
) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.complete_profile(
  text, text, text, text, text, boolean, text
) TO authenticated;

-- ---------------------------------------------------------------------------
-- events  (thin registry; content = /posts/{post_slug})
-- ---------------------------------------------------------------------------

CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_slug text NOT NULL,
  google_calendar_event_id text,
  registration_points integer NOT NULL DEFAULT 5
    CHECK (registration_points >= 3 AND registration_points <= 5),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT events_post_slug_nonempty CHECK (length(trim(post_slug)) > 0)
);

CREATE UNIQUE INDEX events_post_slug_uidx ON public.events (post_slug);

COMMENT ON TABLE public.events IS
  'DB handle for a session post. Frontmatter on /posts/{post_slug} is source of title/time/meet.';

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Public read of registry (slug + points); calendar id is not a secret
CREATE POLICY events_select_all
  ON public.events
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Writes: Studio / service_role only (no anon/authenticated INSERT policies)

GRANT SELECT ON public.events TO anon, authenticated;

-- ---------------------------------------------------------------------------
-- event_registrations
-- ---------------------------------------------------------------------------

CREATE TABLE public.event_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid NOT NULL REFERENCES public.members (id) ON DELETE CASCADE,
  event_id uuid NOT NULL REFERENCES public.events (id) ON DELETE CASCADE,
  registered_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT event_registrations_member_event_unique UNIQUE (member_id, event_id)
);

CREATE INDEX event_registrations_event_idx
  ON public.event_registrations (event_id);

CREATE INDEX event_registrations_member_idx
  ON public.event_registrations (member_id);

ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY event_registrations_select_own
  ON public.event_registrations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = member_id);

-- Inserts go through register_for_event RPC (Phase 5); no direct client INSERT yet

GRANT SELECT ON public.event_registrations TO authenticated;

-- ---------------------------------------------------------------------------
-- event_attendance  (CSV import → service_role)
-- ---------------------------------------------------------------------------

CREATE TABLE public.event_attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid NOT NULL REFERENCES public.members (id) ON DELETE CASCADE,
  event_id uuid NOT NULL REFERENCES public.events (id) ON DELETE CASCADE,
  matched_email text NOT NULL,
  confirmed_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT event_attendance_member_event_unique UNIQUE (member_id, event_id)
);

CREATE INDEX event_attendance_event_idx ON public.event_attendance (event_id);
CREATE INDEX event_attendance_email_lower_idx
  ON public.event_attendance (lower(matched_email));

ALTER TABLE public.event_attendance ENABLE ROW LEVEL SECURITY;

CREATE POLICY event_attendance_select_own
  ON public.event_attendance
  FOR SELECT
  TO authenticated
  USING (auth.uid() = member_id);

GRANT SELECT ON public.event_attendance TO authenticated;

-- ---------------------------------------------------------------------------
-- activity_log: add event_register + once-per-event uniques
-- ---------------------------------------------------------------------------

ALTER TABLE public.activity_log
  DROP CONSTRAINT activity_log_type_check;

ALTER TABLE public.activity_log
  ADD CONSTRAINT activity_log_type_check CHECK (
    activity_type = ANY (ARRAY[
      'profile_complete',
      'quality_message',
      'invite',
      'event_register',
      'event_online',
      'event_inperson',
      'blog_post',
      'talk'
    ])
  );

-- meta must carry event_id (uuid text) for these types
CREATE UNIQUE INDEX activity_log_event_register_once
  ON public.activity_log (member_id, (meta->>'event_id'))
  WHERE activity_type = 'event_register';

CREATE UNIQUE INDEX activity_log_event_online_once
  ON public.activity_log (member_id, (meta->>'event_id'))
  WHERE activity_type = 'event_online';

COMMENT ON TABLE public.activity_log IS
  'Point events. Manual awards (events/blog/talk): insert via Supabase Studio. '
  'quality_message daily cap (5) enforced by bot Edge Function using tehran_today(). '
  'event_register / event_online: once per member×event via meta.event_id.';

-- Studio cheatsheet:
-- profile_complete  10
-- quality_message    1   (bot; max 5 / tehran_today)
-- invite            20
-- event_register     3–5 (per events.registration_points; default 5)
-- event_online      15   (CSV attendance)
-- event_inperson    30
-- blog_post         80   + achievements.badge = writer
-- talk             100   + achievements.badge = speaker
