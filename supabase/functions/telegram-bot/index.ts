// @ts-nocheck
// FrontChapter Telegram group gate — welcome + mute until site profile complete.
// Deploy: supabase functions deploy telegram-bot --no-verify-jwt
// Webhook: setWebhook with secret_token = TELEGRAM_WEBHOOK_SECRET
//
// Actions:
//   POST (Telegram update) + X-Telegram-Bot-Api-Secret-Token
//   POST { action: "unmute" } + Authorization: Bearer <user jwt>

import { createClient } from 'npm:@supabase/supabase-js@2';

const JOIN_URL = 'https://frontchapter.ir/join/';

const MUTED = {
  can_send_messages: false,
  can_send_audios: false,
  can_send_documents: false,
  can_send_photos: false,
  can_send_videos: false,
  can_send_video_notes: false,
  can_send_voice_notes: false,
  can_send_polls: false,
  can_send_other_messages: false,
  can_add_web_page_previews: false,
  can_change_info: false,
  can_invite_users: false,
  can_pin_messages: false,
  can_manage_topics: false,
};

const OPEN = {
  can_send_messages: true,
  can_send_audios: true,
  can_send_documents: true,
  can_send_photos: true,
  can_send_videos: true,
  can_send_video_notes: true,
  can_send_voice_notes: true,
  can_send_polls: true,
  can_send_other_messages: true,
  can_add_web_page_previews: true,
  can_change_info: false,
  can_invite_users: true,
  can_pin_messages: false,
  can_manage_topics: false,
};

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-telegram-bot-api-secret-token',
};

function adminDb() {
  const url = Deno.env.get('SUPABASE_URL');
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !key) throw new Error('supabase env missing');
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function botToken() {
  const t = Deno.env.get('TELEGRAM_BOT_TOKEN');
  if (!t) throw new Error('TELEGRAM_BOT_TOKEN missing');
  return t;
}

async function tg(method: string, body: Record<string, unknown>) {
  const res = await fetch(
    `https://api.telegram.org/bot${botToken()}/${method}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
  );
  const data = await res.json();
  if (!data.ok) {
    console.error('tg', method, data);
    throw new Error(data.description || `${method} failed`);
  }
  return data.result;
}

async function rememberChatId(db: ReturnType<typeof adminDb>, chatId: number) {
  await db.from('telegram_bot_config').upsert({
    id: 1,
    group_chat_id: chatId,
    updated_at: new Date().toISOString(),
  });
}

async function getChatId(
  db: ReturnType<typeof adminDb>
): Promise<number | null> {
  const envId = Deno.env.get('TELEGRAM_GROUP_CHAT_ID');
  if (envId && /^-?\d+$/.test(envId)) return Number(envId);
  const { data } = await db
    .from('telegram_bot_config')
    .select('group_chat_id')
    .eq('id', 1)
    .maybeSingle();
  return data?.group_chat_id ?? null;
}

function displayName(user: {
  first_name?: string;
  last_name?: string;
  username?: string;
}) {
  const full = [user.first_name, user.last_name]
    .filter(Boolean)
    .join(' ')
    .trim();
  return full || user.username || 'هویجی';
}

function welcomeText(name: string) {
  return (
    `درود ${name} 🥕\n` +
    `به گروه فرانت‌چپتر خیلی خوش‌اومدی!\n` +
    `فقط یه قدم مونده تا عضو رسمی خانواده هویجی ما بشی،\n` +
    `روی دکمه زیر کلیک کن و توی چند ثانیه ثبت نام رو تموم کن.`
  );
}

async function muteUser(chatId: number, userId: number) {
  await tg('restrictChatMember', {
    chat_id: chatId,
    user_id: userId,
    permissions: MUTED,
  });
}

async function unmuteUser(chatId: number, userId: number) {
  await tg('restrictChatMember', {
    chat_id: chatId,
    user_id: userId,
    permissions: OPEN,
  });
}

async function isProfileComplete(
  db: ReturnType<typeof adminDb>,
  telegramId: number
): Promise<boolean> {
  const { data } = await db
    .from('members')
    .select('profile_completed_at')
    .eq('telegram_id', telegramId)
    .maybeSingle();
  return Boolean(data?.profile_completed_at);
}

async function gateNewMember(
  db: ReturnType<typeof adminDb>,
  chatId: number,
  user: {
    id: number;
    is_bot?: boolean;
    first_name?: string;
    last_name?: string;
    username?: string;
  }
) {
  if (!user?.id || user.is_bot) return;
  await rememberChatId(db, chatId);

  const name = displayName(user);
  const done = await isProfileComplete(db, user.id);

  if (done) {
    await unmuteUser(chatId, user.id);
    await tg('sendMessage', {
      chat_id: chatId,
      text:
        `درود ${name} 🥕 برگشتی! پروفایلت کامله — چت برات آزاده.\n` +
        `اگه هنوز ندیدی: frontchapter.ir/members/`,
      disable_web_page_preview: true,
    });
    return;
  }

  await muteUser(chatId, user.id);
  await tg('sendMessage', {
    chat_id: chatId,
    text: welcomeText(name),
    disable_web_page_preview: true,
    reply_markup: {
      inline_keyboard: [[{ text: 'میخوام هویج نشان باشم 🥕', url: JOIN_URL }]],
    },
  });
}

/** chat_member: left/kicked → member|restricted (first enter only) */
function memberJoinedFromChatMember(update: Record<string, unknown>) {
  const cm = update.chat_member as
    | {
        chat?: { id?: number; type?: string };
        old_chat_member?: { status?: string };
        new_chat_member?: {
          status?: string;
          user?: {
            id: number;
            is_bot?: boolean;
            first_name?: string;
            last_name?: string;
            username?: string;
          };
        };
      }
    | undefined;
  if (!cm?.chat?.id || !cm.new_chat_member?.user) return null;
  if (cm.chat.type !== 'group' && cm.chat.type !== 'supergroup') return null;

  const old = cm.old_chat_member?.status ?? 'left';
  const neu = cm.new_chat_member.status;
  const entered =
    ['left', 'kicked'].includes(old) &&
    (neu === 'member' || neu === 'restricted');
  if (!entered) return null;

  return { chatId: cm.chat.id, user: cm.new_chat_member.user };
}

function membersFromServiceMessage(update: Record<string, unknown>) {
  const msg = update.message as
    | {
        chat?: { id?: number; type?: string };
        new_chat_members?: Array<{
          id: number;
          is_bot?: boolean;
          first_name?: string;
          last_name?: string;
          username?: string;
        }>;
        text?: string;
        from?: { id: number };
      }
    | undefined;
  if (!msg?.chat?.id) return null;
  if (msg.chat.type !== 'group' && msg.chat.type !== 'supergroup') return null;
  return msg;
}

async function handleUnmute(req: Request) {
  const auth = req.headers.get('Authorization');
  if (!auth?.startsWith('Bearer ')) {
    return json({ error: 'unauthorized' }, 401);
  }

  const url = Deno.env.get('SUPABASE_URL');
  const anon = Deno.env.get('SUPABASE_ANON_KEY');
  if (!url || !anon) return json({ error: 'server misconfigured' }, 500);

  const userClient = createClient(url, anon, {
    global: { headers: { Authorization: auth } },
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data: userData, error: userErr } = await userClient.auth.getUser();
  if (userErr || !userData.user) return json({ error: 'unauthorized' }, 401);

  const db = adminDb();
  const { data: member, error: mErr } = await db
    .from('members')
    .select('telegram_id, profile_completed_at')
    .eq('id', userData.user.id)
    .maybeSingle();

  if (mErr || !member) return json({ error: 'member not found' }, 404);
  if (!member.profile_completed_at) {
    return json({ error: 'profile incomplete' }, 403);
  }

  const chatId = await getChatId(db);
  if (!chatId) {
    // ponytail: no group event yet — join gate never stored chat_id
    return json({ ok: true, unmuted: false, reason: 'no_chat_id' });
  }

  try {
    await unmuteUser(chatId, Number(member.telegram_id));
  } catch (e) {
    const message = e instanceof Error ? e.message : 'unmute failed';
    // user may not be in group yet — not fatal for site join
    return json({ ok: true, unmuted: false, reason: message });
  }

  return json({ ok: true, unmuted: true });
}

async function handleWebhook(update: Record<string, unknown>) {
  const db = adminDb();

  const joined = memberJoinedFromChatMember(update);
  if (joined) {
    await gateNewMember(db, joined.chatId, joined.user);
    return;
  }

  const msg = membersFromServiceMessage(update);
  if (msg) {
    await rememberChatId(db, msg.chat!.id!);

    // Join gating is via chat_member only (avoids double welcome).
    // admin helper: /chatid
    const text = (msg.text || '').trim();
    if (text === '/chatid' || text.startsWith('/chatid@')) {
      await tg('sendMessage', {
        chat_id: msg.chat!.id!,
        text: `chat_id: \`${msg.chat!.id}\``,
        parse_mode: 'Markdown',
      });
    }
  }
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: cors });
  }

  if (req.method !== 'POST') {
    return json({ error: 'POST only' }, 405);
  }

  try {
    const secret = Deno.env.get('TELEGRAM_WEBHOOK_SECRET');
    const headerSecret = req.headers.get('X-Telegram-Bot-Api-Secret-Token');
    const body = await req.json();

    // Site unmute (user JWT) — body.action === 'unmute'
    if (body?.action === 'unmute') {
      return await handleUnmute(req);
    }

    // Telegram webhook
    if (secret && headerSecret !== secret) {
      return json({ error: 'forbidden' }, 403);
    }

    await handleWebhook(body as Record<string, unknown>);
    return json({ ok: true });
  } catch (e) {
    console.error(e);
    // Always 200 to Telegram so it does not retry forever on our bugs
    if (req.headers.get('X-Telegram-Bot-Api-Secret-Token')) {
      return json({ ok: false });
    }
    const message = e instanceof Error ? e.message : 'failed';
    return json({ error: message }, 500);
  }
});
