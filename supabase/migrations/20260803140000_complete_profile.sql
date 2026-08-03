-- Phase 2: profile completion RPC + allow SECURITY DEFINER to set protected cols

-- Guard previously blocked ALL authenticated JWT updates to profile_completed_at,
-- including UPDATEs inside SECURITY DEFINER RPCs (jwt role stays authenticated).
-- Only block when the statement itself runs as role "authenticated".
CREATE OR REPLACE FUNCTION public.members_guard_column_changes()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF current_user = 'authenticated' THEN
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

CREATE OR REPLACE FUNCTION public.complete_profile(
  p_expertise text,
  p_bio text DEFAULT NULL,
  p_linkedin_url text DEFAULT NULL,
  p_github_url text DEFAULT NULL,
  p_website_url text DEFAULT NULL,
  p_is_public boolean DEFAULT true
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

  RETURN result;
END;
$$;

REVOKE ALL ON FUNCTION public.complete_profile(
  text, text, text, text, text, boolean
) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.complete_profile(
  text, text, text, text, text, boolean
) TO authenticated;

COMMENT ON FUNCTION public.complete_profile IS
  'Upsert profile fields, stamp profile_completed_at once, award +10 once.';
