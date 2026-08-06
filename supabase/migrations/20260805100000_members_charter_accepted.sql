-- Community charter acceptance before profile completion (onboarding audit trail)

ALTER TABLE public.members
  ADD COLUMN IF NOT EXISTS charter_accepted_at timestamptz;

COMMENT ON COLUMN public.members.charter_accepted_at IS
  'When member accepted community charter (/terms-policy) during onboarding.';

-- Backfill existing completed profiles
UPDATE public.members
   SET charter_accepted_at = profile_completed_at
 WHERE profile_completed_at IS NOT NULL
   AND charter_accepted_at IS NULL;

CREATE OR REPLACE FUNCTION public.accept_community_charter()
RETURNS public.members
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  result public.members;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;

  UPDATE public.members
     SET charter_accepted_at = COALESCE(charter_accepted_at, now()),
         updated_at = now()
   WHERE id = uid
   RETURNING * INTO result;

  IF result.id IS NULL THEN
    RAISE EXCEPTION 'member row missing — OIDC trigger may have failed';
  END IF;

  RETURN result;
END;
$$;

REVOKE ALL ON FUNCTION public.accept_community_charter() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.accept_community_charter() TO authenticated;

COMMENT ON FUNCTION public.accept_community_charter IS
  'Record charter acceptance during /join onboarding (idempotent).';

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

  SELECT * INTO result FROM public.members WHERE id = uid;
  IF result.id IS NULL THEN
    RAISE EXCEPTION 'member row missing — OIDC trigger may have failed';
  END IF;

  IF result.charter_accepted_at IS NULL THEN
    RAISE EXCEPTION 'community charter must be accepted first';
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
