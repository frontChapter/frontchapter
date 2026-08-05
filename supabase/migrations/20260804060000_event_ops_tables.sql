-- Event ops: social publish tracking + reminder queue

CREATE TABLE public.event_social_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events (id) ON DELETE CASCADE,
  platform text NOT NULL CHECK (platform IN ('telegram', 'buffer')),
  channel_id text,
  buffer_update_id text,
  scheduled_for timestamptz,
  status text NOT NULL DEFAULT 'scheduled',
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX event_social_schedules_event_idx
  ON public.event_social_schedules (event_id);

CREATE TABLE public.event_reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events (id) ON DELETE CASCADE,
  member_id uuid NOT NULL REFERENCES public.members (id) ON DELETE CASCADE,
  reminder_kind text NOT NULL CHECK (reminder_kind IN ('day_before', 'hours_before')),
  remind_at timestamptz NOT NULL,
  event_title text NOT NULL,
  event_url text NOT NULL,
  session_datetime timestamptz NOT NULL,
  meet_link text,
  sent_at timestamptz,
  send_error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT event_reminders_member_event_kind_unique
    UNIQUE (event_id, member_id, reminder_kind)
);

CREATE INDEX event_reminders_due_idx
  ON public.event_reminders (remind_at)
  WHERE sent_at IS NULL;

ALTER TABLE public.event_social_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_reminders ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE
  ON public.event_social_schedules, public.event_reminders
  TO service_role;

