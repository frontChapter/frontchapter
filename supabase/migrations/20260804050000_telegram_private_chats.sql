-- Telegram bot: store each member's private chat_id with the bot (for DM best-effort)

CREATE TABLE public.telegram_private_chats (
  member_id uuid PRIMARY KEY REFERENCES public.members (id) ON DELETE CASCADE,
  chat_id bigint NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.telegram_private_chats ENABLE ROW LEVEL SECURITY;

-- bot uses service_role; no public policies

GRANT SELECT, INSERT, UPDATE, DELETE ON public.telegram_private_chats TO service_role;

