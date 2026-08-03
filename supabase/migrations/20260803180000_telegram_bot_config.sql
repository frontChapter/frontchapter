-- Phase 4a: bot stores group chat_id (no manual lookup needed)

CREATE TABLE public.telegram_bot_config (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  group_chat_id bigint NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.telegram_bot_config IS
  'Singleton. group_chat_id upserted by telegram-bot Edge Function on group events.';

ALTER TABLE public.telegram_bot_config ENABLE ROW LEVEL SECURITY;
-- no policies for anon/authenticated — service_role only

GRANT SELECT, INSERT, UPDATE ON public.telegram_bot_config TO service_role;
