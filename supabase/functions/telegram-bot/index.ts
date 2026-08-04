// @ts-nocheck
// FrontChapter Telegram group gate — welcome + mute until site profile complete.
// Deploy: supabase functions deploy telegram-bot --no-verify-jwt
// Webhook: setWebhook with secret_token = TELEGRAM_WEBHOOK_SECRET
//
// Actions:
//   POST (Telegram update) + X-Telegram-Bot-Api-Secret-Token
//   POST { action: "unmute" } + Authorization: Bearer <user jwt>
//   /start welcome (private) → join-page link (bot chat consent)
//   /useful (admin reply) → +10 quality_message + thanks + profile link + tag sync

import { createClient } from 'npm:@supabase/supabase-js@2';

const JOIN_URL = 'https://frontchapter.ir/join/';
const SITE = 'https://frontchapter.ir';
// Real bot username from getMe — NOT display name "HavijMagic"
const BOT_USERNAME =
  Deno.env.get('TELEGRAM_BOT_USERNAME')?.replace(/^@/, '') ||
  'frontChapterMagicBot';
const WELCOME_START_URL = `https://t.me/${BOT_USERNAME}?start=welcome`;
const USEFUL_POINTS = 10;

/** Plain Persian Member Tags — ≤16 chars, no emoji */
const LEVEL_TAGS = {
  badge: 'هویج‌نشان',
  young: 'هویج جوان',
  whole: 'هویج تمام',
  senior: 'هویج ارشد',
  golden: 'هویج طلایی',
};

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

function isCommand(text: string, name: string) {
  const t = text.trim();
  const at = `@${BOT_USERNAME}`;
  return (
    t === `/${name}` ||
    t === `/${name}${at}` ||
    t.startsWith(`/${name} `) ||
    t.startsWith(`/${name}${at} `)
  );
}

function startPayload(text: string): string | null {
  const t = text.trim();
  const at = `@${BOT_USERNAME}`;
  const prefixes = [`/start `, `/start${at} `];
  for (const p of prefixes) {
    if (t.startsWith(p)) return t.slice(p.length).trim() || null;
  }
  if (t === '/start' || t === `/start${at}`) return null;
  return null;
}

function levelKeyFromPoints(points: number) {
  if (points >= 800) return 'golden';
  if (points >= 400) return 'senior';
  if (points >= 150) return 'whole';
  if (points >= 50) return 'young';
  return 'badge';
}

async function memberPoints(
  db: ReturnType<typeof adminDb>,
  memberId: string
): Promise<number> {
  const { data } = await db
    .from('activity_log')
    .select('points')
    .eq('member_id', memberId);
  return (data ?? []).reduce(
    (sum: number, row: { points: number }) => sum + (row.points || 0),
    0
  );
}

async function setMemberTag(chatId: number, userId: number, tag: string) {
  try {
    await tg('setChatMemberTag', {
      chat_id: chatId,
      user_id: userId,
      tag: tag.slice(0, 16),
    });
  } catch (e) {
    // expected if not in group / rights race — never block join flow
    console.error('setChatMemberTag failed', e);
  }
}

async function syncMemberTag(
  db: ReturnType<typeof adminDb>,
  chatId: number,
  memberId: string,
  telegramId: number
) {
  const points = await memberPoints(db, memberId);
  const key = levelKeyFromPoints(points);
  await setMemberTag(chatId, telegramId, LEVEL_TAGS[key]);
}

async function stampJoinDate(
  db: ReturnType<typeof adminDb>,
  telegramId: number
) {
  await db
    .from('members')
    .update({ telegram_joined_at: new Date().toISOString() })
    .eq('telegram_id', telegramId)
    .is('telegram_joined_at', null);
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
    use_independent_chat_permissions: true,
  });
}

async function unmuteUser(chatId: number, userId: number) {
  await tg('restrictChatMember', {
    chat_id: chatId,
    user_id: userId,
    permissions: OPEN,
    use_independent_chat_permissions: true,
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

function botUserId(): number {
  // token = "<bot_id>:<secret>"
  return Number(botToken().split(':')[0]);
}

type GateReason = 'join' | 'nudge';

/** Avoid spamming welcome on repeated restricted→restricted updates */
const nudgeCooldownMs = 24 * 60 * 60 * 1000;
const lastNudgeAt = new Map<number, number>();

function allowNudge(userId: number): boolean {
  const last = lastNudgeAt.get(userId) ?? 0;
  if (Date.now() - last < nudgeCooldownMs) {
    console.log('nudge cooldown', userId);
    return false;
  }
  lastNudgeAt.set(userId, Date.now());
  return true;
}

function welcomeIncompleteMarkup() {
  return {
    inline_keyboard: [
      [{ text: 'میخوام هویج نشان بشم!', url: WELCOME_START_URL }],
    ],
  };
}

async function sendIncompleteWelcome(chatId: number, name: string) {
  await tg('sendMessage', {
    chat_id: chatId,
    text: welcomeText(name),
    disable_web_page_preview: true,
    reply_markup: welcomeIncompleteMarkup(),
  });
}

async function sendCompleteWelcome(chatId: number, name: string) {
  await tg('sendMessage', {
    chat_id: chatId,
    text:
      `درود ${name} 🥕 خوش اومدی!\n` +
      `پروفایلت کامله — چت و بقیه‌ی دسترسی‌ها برات آزاده.\n` +
      `فهرست اعضا: frontchapter.ir/members/\n` +
      `برای دیدن سطح و امتیازت هر وقت خواستی، /profile رو بزن.`,
    disable_web_page_preview: true,
  });
}

/**
 * Admin preview — exact same copy/button as real join paths.
 * /gate_test          → incomplete CTA (no mute; safe to test on yourself)
 * /gate_test complete → complete-profile welcome (no mute spam either)
 */
async function handleGateTest(
  db: ReturnType<typeof adminDb>,
  msg: GroupMessage
) {
  const chatId = msg.chat!.id!;
  const from = msg.from;
  if (!from?.id) return;

  if (!(await isGroupAdmin(chatId, from.id))) {
    await tg('sendMessage', {
      chat_id: chatId,
      reply_to_message_id: msg.message_id,
      text: 'فقط ادمین می‌تونه /gate_test بزنه.',
    });
    return;
  }

  const text = (msg.text || '').trim().toLowerCase();
  const wantComplete =
    text.includes('complete') || text.includes('done') || text.includes('کامل');
  const name = displayName(from);

  try {
    if (wantComplete) {
      await sendCompleteWelcome(chatId, name);
    } else {
      // Exact new-member incomplete message — ignore your real profile_completed_at
      await sendIncompleteWelcome(chatId, name);
    }
  } catch (e) {
    console.error('gate_test send failed', e);
    await tg('sendMessage', {
      chat_id: chatId,
      reply_to_message_id: msg.message_id,
      text: `gate_test failed: ${e instanceof Error ? e.message : e}`,
    });
  }
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
  },
  reason: GateReason = 'join'
) {
  if (!user?.id || user.is_bot) return;
  if (reason === 'nudge' && !allowNudge(user.id)) return;
  await rememberChatId(db, chatId);
  await stampJoinDate(db, user.id);

  const name = displayName(user);
  const done = await isProfileComplete(db, user.id);

  // Profile complete: always open chat, never mute, no signup CTA
  if (done) {
    try {
      await unmuteUser(chatId, user.id);
    } catch (e) {
      console.error('unmute failed', e);
    }
    const { data: m } = await db
      .from('members')
      .select('id')
      .eq('telegram_id', user.id)
      .maybeSingle();
    if (m?.id) await syncMemberTag(db, chatId, m.id, user.id);

    try {
      await sendCompleteWelcome(chatId, name);
    } catch (e) {
      console.error('welcome (complete) send failed', e);
    }
    return;
  }

  // Incomplete: welcome + deep-link button
  try {
    await sendIncompleteWelcome(chatId, name);
  } catch (e) {
    console.error('welcome send failed', e);
  }

  // Mute only on fresh join. Nudge = already restricted — mute again loops chat_member.
  if (reason === 'join') {
    try {
      await muteUser(chatId, user.id);
    } catch (e) {
      console.error('mute failed', e);
    }
  }
}

/**
 * join: left/kicked → in-group
 * nudge: already muted (restricted→restricted) — legacy members who never got CTA
 * Skip updates caused by this bot (mute/unmute) to avoid loops.
 */
function memberJoinedFromChatMember(update: Record<string, unknown>): {
  chatId: number;
  user: TgUser;
  reason: GateReason;
} | null {
  const cm = update.chat_member as
    | {
        from?: { id?: number; is_bot?: boolean };
        chat?: { id?: number; type?: string };
        old_chat_member?: { status?: string };
        new_chat_member?: {
          status?: string;
          user?: TgUser;
        };
      }
    | undefined;
  if (!cm?.chat?.id || !cm.new_chat_member?.user) return null;
  if (cm.chat.type !== 'group' && cm.chat.type !== 'supergroup') return null;

  // Our own restrict/unrestrict must not re-trigger gate
  if (cm.from?.id && cm.from.id === botUserId()) {
    console.log('chat_member skip (bot actor)', {
      user: cm.new_chat_member.user.id,
    });
    return null;
  }

  const old = cm.old_chat_member?.status ?? 'left';
  const neu = cm.new_chat_member.status;
  const wasOut = ['left', 'kicked'].includes(old);
  const isIn =
    neu === 'member' || neu === 'restricted' || neu === 'administrator';
  const stuckRestricted = old === 'restricted' && neu === 'restricted';

  if (wasOut && isIn) {
    return {
      chatId: cm.chat.id,
      user: cm.new_chat_member.user,
      reason: 'join',
    };
  }

  if (stuckRestricted) {
    return {
      chatId: cm.chat.id,
      user: cm.new_chat_member.user,
      reason: 'nudge',
    };
  }

  console.log('chat_member skip', {
    old,
    neu,
    user: cm.new_chat_member.user.id,
  });
  return null;
}

type TgUser = {
  id: number;
  is_bot?: boolean;
  first_name?: string;
  last_name?: string;
  username?: string;
};

type GroupMessage = {
  message_id?: number;
  chat?: { id?: number; type?: string };
  new_chat_members?: TgUser[];
  text?: string;
  from?: TgUser;
  reply_to_message?: {
    message_id?: number;
    from?: TgUser;
    text?: string;
  };
};

function membersFromServiceMessage(update: Record<string, unknown>) {
  const msg = update.message as GroupMessage | undefined;
  if (!msg?.chat?.id) return null;
  if (msg.chat.type !== 'group' && msg.chat.type !== 'supergroup') return null;
  return msg;
}

function urlButton(text: string, url: string) {
  return { inline_keyboard: [[{ text, url }]] };
}

function profileSlug(m: { username: string | null; telegram_id: number }) {
  const u = m.username?.trim().toLowerCase();
  if (u) return u;
  return `tg-${m.telegram_id}`;
}

async function isGroupAdmin(chatId: number, userId: number) {
  const m = await tg('getChatMember', { chat_id: chatId, user_id: userId });
  return m.status === 'creator' || m.status === 'administrator';
}

async function handleUseful(db: ReturnType<typeof adminDb>, msg: GroupMessage) {
  const chatId = msg.chat!.id!;
  const admin = msg.from;
  const target = msg.reply_to_message?.from;
  const targetMsgId = msg.reply_to_message?.message_id;

  if (!admin?.id) return;

  if (!msg.reply_to_message || !target?.id || !targetMsgId) {
    await tg('sendMessage', {
      chat_id: chatId,
      reply_to_message_id: msg.message_id,
      text: 'روی پیام مفید ریپلای کن، بعد /useful بزن.',
    });
    return;
  }

  if (!(await isGroupAdmin(chatId, admin.id))) return;

  if (target.is_bot) {
    await tg('sendMessage', {
      chat_id: chatId,
      reply_to_message_id: msg.message_id,
      text: 'به ربات امتیاز نمی‌دیم 🥕',
    });
    return;
  }

  const { data: member } = await db
    .from('members')
    .select('id, username, telegram_id, display_name, profile_completed_at')
    .eq('telegram_id', target.id)
    .maybeSingle();

  if (!member) {
    await tg('sendMessage', {
      chat_id: chatId,
      reply_to_message_id: msg.message_id,
      text: 'این کاربر هنوز عضو فرانت‌چپتر نیست.\nاول ثبت‌نام کنه، بعد امتیاز می‌دیم 🥕',
      disable_web_page_preview: true,
      reply_markup: urlButton('ثبت‌نام در فرانت‌چپتر', WELCOME_START_URL),
    });
    return;
  }

  // already awarded for this telegram message?
  const { data: existing } = await db
    .from('activity_log')
    .select('id')
    .eq('member_id', member.id)
    .eq('activity_type', 'quality_message')
    .contains('meta', { telegram_message_id: targetMsgId, chat_id: chatId })
    .maybeSingle();

  if (existing) {
    await tg('sendMessage', {
      chat_id: chatId,
      reply_to_message_id: msg.message_id,
      text: 'این پیام قبلاً امتیاز گرفته.',
    });
    return;
  }

  const { data: adminMember } = await db
    .from('members')
    .select('id')
    .eq('telegram_id', admin.id)
    .maybeSingle();

  const { error: insErr } = await db.from('activity_log').insert({
    member_id: member.id,
    activity_type: 'quality_message',
    points: USEFUL_POINTS,
    created_by: adminMember?.id ?? null,
    meta: {
      source: 'telegram_/useful',
      chat_id: chatId,
      telegram_message_id: targetMsgId,
      awarded_by_telegram_id: admin.id,
    },
  });

  if (insErr) {
    console.error('useful insert', insErr);
    await tg('sendMessage', {
      chat_id: chatId,
      reply_to_message_id: msg.message_id,
      text: 'ثبت امتیاز نشد — دوباره تلاش کن.',
    });
    return;
  }

  const name = member.display_name || displayName(target);
  const url = `${SITE}/members/?m=${encodeURIComponent(profileSlug(member))}`;

  if (member.profile_completed_at) {
    await syncMemberTag(db, chatId, member.id, Number(member.telegram_id));
  }

  if (!member.profile_completed_at) {
    await tg('sendMessage', {
      chat_id: chatId,
      reply_to_message_id: targetMsgId,
      text:
        `مرسی ${name} 🥕\n` +
        `پیامت خیلی مفید بود — ${USEFUL_POINTS} امتیاز گرفتی!\n` +
        `فقط پروفایلت هنوز کامل نیست؛ زود تکمیلش کن تا امتیازت هدر نره.`,
      disable_web_page_preview: true,
      reply_markup: urlButton('تکمیل پروفایل', WELCOME_START_URL),
    });
    return;
  }

  await tg('sendMessage', {
    chat_id: chatId,
    reply_to_message_id: targetMsgId,
    text:
      `مرسی ${name} 🥕\n` +
      `پیامت خیلی مفید بود!\n` +
      `${USEFUL_POINTS} امتیاز گرفتی.`,
    disable_web_page_preview: true,
    reply_markup: urlButton('مشاهده پروفایل', url),
  });
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
    .select('id, telegram_id, profile_completed_at')
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

  await syncMemberTag(db, chatId, member.id, Number(member.telegram_id));

  return json({ ok: true, unmuted: true });
}

async function handlePrivateStart(msg: {
  chat?: { id?: number; type?: string };
  text?: string;
  from?: TgUser;
}) {
  if (msg.chat?.type !== 'private' || !msg.chat.id) return false;
  const text = (msg.text || '').trim();
  if (!text.startsWith('/start')) return false;

  const payload = startPayload(text);
  const name = msg.from ? displayName(msg.from) : 'هویجی';

  const capabilities =
    `از این‌جا به بعد می‌تونم:\n` +
    `🥕 عضویتت رو ثبت کنم و سطح هویجیت رو نگه دارم\n` +
    `📈 امتیاز فعالیتت رو حساب کنم\n` +
    `📅 قبل از جلسات آنلاین یادآوری بفرستم\n\n`;

  await tg('sendMessage', {
    chat_id: msg.chat.id,
    text:
      payload === 'welcome'
        ? `درود ${name} 🥕\n` +
          `خوش اومدی به فرانت‌چپتر!\n\n` +
          capabilities +
          `فقط یه قدم مونده — روی دکمه بزن و عضویتت رو تموم کن:`
        : `سلام! من هویج‌مجیک‌ام 🥕\n` +
          `ربات رسمی جامعه‌ی فرانت‌چپترم.\n\n` +
          capabilities +
          `برای عضویت، روی دکمه بزن:`,
    disable_web_page_preview: true,
    reply_markup: urlButton('تکمیل عضویت در سایت', JOIN_URL),
  });
  return true;
}

async function handleWebhook(update: Record<string, unknown>) {
  const db = adminDb();
  const keys = Object.keys(update).filter((k) => k !== 'update_id');
  console.log('update', update.update_id, keys);

  // Log raw join-ish payloads for Dashboard debugging
  if (update.chat_member) {
    const cm = update.chat_member as {
      old_chat_member?: { status?: string };
      new_chat_member?: { status?: string; user?: { id?: number } };
    };
    console.log('chat_member raw', {
      old: cm.old_chat_member?.status,
      neu: cm.new_chat_member?.status,
      user: cm.new_chat_member?.user?.id,
      from: (update.chat_member as { from?: { id?: number } })?.from?.id,
    });
  }

  const joined = memberJoinedFromChatMember(update);
  if (joined) {
    console.log('gate via chat_member', joined.user.id, joined.reason);
    await gateNewMember(db, joined.chatId, joined.user, joined.reason);
    return;
  }

  // Private /start (bot chat consent for later DMs)
  const anyMsg = update.message as
    | {
        chat?: { id?: number; type?: string };
        text?: string;
        from?: TgUser;
        message_id?: number;
        new_chat_members?: TgUser[];
      }
    | undefined;
  if (anyMsg && (await handlePrivateStart(anyMsg))) return;

  const msg = membersFromServiceMessage(update);
  if (msg) {
    await rememberChatId(db, msg.chat!.id!);

    if (msg.new_chat_members?.length) {
      for (const u of msg.new_chat_members) {
        console.log('gate via new_chat_members', u.id);
        await gateNewMember(db, msg.chat!.id!, u);
      }
      return;
    }

    const text = (msg.text || '').trim();

    // admin: reply to a message with /useful → +10 + thanks + profile link
    if (isCommand(text, 'useful')) {
      await handleUseful(db, msg);
      return;
    }

    // admin helper: /chatid
    if (isCommand(text, 'chatid')) {
      await tg('sendMessage', {
        chat_id: msg.chat!.id!,
        text: `chat_id: \`${msg.chat!.id}\``,
        parse_mode: 'Markdown',
      });
      return;
    }

    // admin: preview exact welcome copy (incomplete by default)
    if (isCommand(text, 'gate_test') && msg.from?.id) {
      await handleGateTest(db, msg);
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
