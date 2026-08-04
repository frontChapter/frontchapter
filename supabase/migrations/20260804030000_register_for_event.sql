-- Phase 5a: register_for_event + confirm_event_attendance

CREATE OR REPLACE FUNCTION public.register_for_event(
  p_post_slug text,
  p_email text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  slug text := trim(COALESCE(p_post_slug, ''));
  ev public.events;
  normalized text := lower(trim(COALESCE(p_email, '')));
  existing_email text;
  already boolean := false;
  points_awarded int := 0;
  inserted int := 0;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;

  IF slug = '' THEN
    RAISE EXCEPTION 'post_slug required';
  END IF;

  SELECT email INTO existing_email
    FROM public.member_emails
   WHERE member_id = uid;

  IF existing_email IS NULL THEN
    IF normalized = '' OR position('@' IN normalized) = 0 THEN
      RAISE EXCEPTION 'email required for event registration';
    END IF;
    INSERT INTO public.member_emails (member_id, email)
    VALUES (uid, normalized)
    ON CONFLICT (member_id) DO UPDATE
      SET email = EXCLUDED.email, updated_at = now();
  ELSIF normalized <> '' AND position('@' IN normalized) > 0 THEN
    UPDATE public.member_emails
       SET email = normalized, updated_at = now()
     WHERE member_id = uid;
  END IF;

  SELECT * INTO ev FROM public.events WHERE post_slug = slug;
  IF ev.id IS NULL THEN
    INSERT INTO public.events (post_slug)
    VALUES (slug)
    RETURNING * INTO ev;
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.event_registrations
     WHERE member_id = uid AND event_id = ev.id
  ) THEN
    already := true;
  ELSE
    INSERT INTO public.event_registrations (member_id, event_id)
    VALUES (uid, ev.id);

    INSERT INTO public.activity_log (
      member_id, activity_type, points, meta, created_by
    )
    SELECT uid, 'event_register', ev.registration_points,
           jsonb_build_object('event_id', ev.id::text, 'post_slug', slug),
           uid
     WHERE NOT EXISTS (
       SELECT 1 FROM public.activity_log
        WHERE member_id = uid
          AND activity_type = 'event_register'
          AND meta->>'event_id' = ev.id::text
     );
    GET DIAGNOSTICS inserted = ROW_COUNT;
    IF inserted > 0 THEN
      points_awarded := ev.registration_points;
    END IF;
  END IF;

  RETURN jsonb_build_object(
    'ok', true,
    'already', already,
    'event_id', ev.id,
    'post_slug', slug,
    'points_awarded', points_awarded
  );
END;
$$;

REVOKE ALL ON FUNCTION public.register_for_event(text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.register_for_event(text, text) TO authenticated;

COMMENT ON FUNCTION public.register_for_event IS
  'Register caller for session post_slug; create events row if needed; award points once; require email.';

-- Idempotent +15 attendance. Edge CSV import uses service_role (auth.uid null).
-- Authenticated callers must be members.is_admin.
CREATE OR REPLACE FUNCTION public.confirm_event_attendance(
  p_event_id uuid,
  p_member_id uuid,
  p_matched_email text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  caller uuid := auth.uid();
  is_adm boolean := false;
  points_awarded int := 0;
  inserted int := 0;
  email_norm text := lower(trim(COALESCE(p_matched_email, '')));
BEGIN
  IF caller IS NOT NULL THEN
    SELECT m.is_admin INTO is_adm FROM public.members m WHERE m.id = caller;
    IF NOT COALESCE(is_adm, false) THEN
      RAISE EXCEPTION 'admin only';
    END IF;
  END IF;

  IF email_norm = '' THEN
    RAISE EXCEPTION 'matched_email required';
  END IF;

  INSERT INTO public.event_attendance (member_id, event_id, matched_email)
  VALUES (p_member_id, p_event_id, email_norm)
  ON CONFLICT (member_id, event_id) DO NOTHING;

  INSERT INTO public.activity_log (
    member_id, activity_type, points, meta, created_by
  )
  SELECT p_member_id, 'event_online', 15,
         jsonb_build_object(
           'event_id', p_event_id::text,
           'matched_email', email_norm
         ),
         caller
   WHERE NOT EXISTS (
     SELECT 1 FROM public.activity_log
      WHERE member_id = p_member_id
        AND activity_type = 'event_online'
        AND meta->>'event_id' = p_event_id::text
   );
  GET DIAGNOSTICS inserted = ROW_COUNT;
  IF inserted > 0 THEN
    points_awarded := 15;
  END IF;

  RETURN jsonb_build_object('ok', true, 'points_awarded', points_awarded);
END;
$$;

REVOKE ALL ON FUNCTION public.confirm_event_attendance(uuid, uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.confirm_event_attendance(uuid, uuid, text)
  TO authenticated, service_role;

COMMENT ON FUNCTION public.confirm_event_attendance IS
  'CSV/attendance import: +15 once per member×event. Admin JWT or service_role.';
