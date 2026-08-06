-- member_stats: LATERAL aggregates so WHERE m.id / is_public can push down.
-- Old form always GROUP BY'd entire activity_log + achievements before join;
-- under security_invoker + RLS that held connections and starved Auth/REST.

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
    WHEN COALESCE(s.points_total, 0) >= 800 THEN 'golden'
    WHEN COALESCE(s.points_total, 0) >= 400 THEN 'senior'
    WHEN COALESCE(s.points_total, 0) >= 150 THEN 'whole'
    WHEN COALESCE(s.points_total, 0) >= 50  THEN 'young'
    ELSE 'badge'
  END AS level_key,
  COALESCE(ab.badges, ARRAY[]::text[]) AS badges
FROM public.members m
LEFT JOIN LATERAL (
  SELECT SUM(a.points)::integer AS points_total
    FROM public.activity_log a
   WHERE a.member_id = m.id
) s ON true
LEFT JOIN LATERAL (
  SELECT array_agg(ah.badge ORDER BY ah.awarded_at) AS badges
    FROM public.achievements ah
   WHERE ah.member_id = m.id
) ab ON true;

COMMENT ON VIEW public.member_stats IS
  'Directory/profile read model: points, level_key, badges. LATERAL aggregates for filter push-down. RLS via members.';

CREATE INDEX IF NOT EXISTS activity_log_member_points_idx
  ON public.activity_log (member_id)
  INCLUDE (points);

NOTIFY pgrst, 'reload schema';
