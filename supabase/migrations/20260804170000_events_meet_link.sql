-- Store Meet link created via Google Calendar API (or from frontmatter).

ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS meet_link text;

COMMENT ON COLUMN public.events.meet_link IS
  'Google Meet URL for the session; set on admin publish or from post frontmatter.';
