// @ts-nocheck
import { createClient } from 'npm:@supabase/supabase-js@2';
import { SignJWT, importPKCS8 } from 'npm:jose@5';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-event-ops-secret',
};

const SITE_URL = Deno.env.get('PUBLIC_SITE_URL') || 'https://frontchapter.ir';
const TELEGRAM_CHANNEL = Deno.env.get('TELEGRAM_CHANNEL_USERNAME') || '@mytestchannel10002';
const BUFFER_TOKEN = Deno.env.get('BUFFER_ACCESS_TOKEN') || '';
const CALENDAR_ID = Deno.env.get('GOOGLE_CALENDAR_ID') || 'frontchapter.ir@gmail.com';
/**
 * Only set with Google Workspace Domain-Wide Delegation.
 * Personal Gmail + impersonation → token error "Client is unauthorized…".
 */
const CALENDAR_IMPERSONATE =
  Deno.env.get('GOOGLE_CALENDAR_USE_DWD') === '1'
    ? Deno.env.get('GOOGLE_CALENDAR_IMPERSONATE') || ''
    : '';
const EVENT_OPS_SECRET = Deno.env.get('EVENT_OPS_SECRET') || '';
/** Stable host for Buffer/Telegram media fetch (ngrok interstitial hangs bots). */
const MEDIA_ORIGIN = 'https://frontchapter.ir';

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  });
}

/** Rewrite ngrok/local image URLs to production so Telegram/Buffer can fetch them. */
function publicMediaUrl(imageUrl: string): string {
  const raw = imageUrl.trim();
  if (!raw) return raw;
  try {
    const u = new URL(raw);
    const local =
      u.hostname.includes('ngrok') ||
      u.hostname === 'localhost' ||
      u.hostname === '127.0.0.1' ||
      u.hostname.endsWith('.local');
    if (local) return `${MEDIA_ORIGIN}${u.pathname}${u.search}`;
    return raw;
  } catch {
    if (raw.startsWith('/')) return `${MEDIA_ORIGIN}${raw}`;
    return raw;
  }
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit = {},
  ms = 25000
) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, { ...init, signal: ctrl.signal });
  } finally {
    clearTimeout(t);
  }
}

function adminDb() {
  const url = Deno.env.get('SUPABASE_URL');
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !key) throw new Error('supabase env missing');
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function anonDb(authHeader: string) {
  const url = Deno.env.get('SUPABASE_URL');
  const anon = Deno.env.get('SUPABASE_ANON_KEY');
  if (!url || !anon) throw new Error('supabase anon env missing');
  return createClient(url, anon, {
    global: { headers: { Authorization: authHeader } },
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function tgToken() {
  const t = Deno.env.get('TELEGRAM_BOT_TOKEN');
  if (!t) throw new Error('TELEGRAM_BOT_TOKEN missing');
  return t;
}

async function tg(method: string, body: Record<string, unknown>) {
  const res = await fetchWithTimeout(
    `https://api.telegram.org/bot${tgToken()}/${method}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    },
    25000
  );
  const data = await res.json();
  if (!data.ok) {
    throw new Error(data.description || `${method} failed`);
  }
  return data.result;
}

/** Upload photo bytes — avoids Telegram fetching flaky ngrok URLs. */
async function tgSendPhotoFile(
  chatId: string,
  imageUrl: string,
  caption: string
) {
  const imgRes = await fetchWithTimeout(imageUrl, {}, 15000);
  if (!imgRes.ok) {
    throw new Error(`image fetch ${imgRes.status}: ${imageUrl}`);
  }
  const bytes = new Uint8Array(await imgRes.arrayBuffer());
  const form = new FormData();
  form.set('chat_id', chatId);
  form.set('caption', caption);
  form.set('parse_mode', 'HTML');
  form.set(
    'photo',
    new Blob([bytes], { type: 'image/jpeg' }),
    'poster.jpg'
  );
  const res = await fetchWithTimeout(
    `https://api.telegram.org/bot${tgToken()}/sendPhoto`,
    { method: 'POST', body: form },
    30000
  );
  const data = await res.json();
  if (!data.ok) {
    throw new Error(data.description || 'sendPhoto failed');
  }
  return data.result;
}

/** Buffer GraphQL Public API (legacy REST tokens are rejected). */
async function bufferGql(query: string, variables?: Record<string, unknown>) {
  if (!BUFFER_TOKEN) {
    throw new Error(
      'BUFFER_ACCESS_TOKEN missing — create GraphQL API key at Buffer → Settings → API'
    );
  }
  const res = await fetchWithTimeout(
    'https://api.buffer.com',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${BUFFER_TOKEN}`,
      },
      body: JSON.stringify({ query, variables }),
    },
    25000
  );
  const raw = await res.text();
  let payload: {
    data?: Record<string, unknown>;
    errors?: Array<{ message?: string }>;
  } = {};
  try {
    payload = raw ? JSON.parse(raw) : {};
  } catch {
    throw new Error(`buffer non-json ${res.status}: ${raw.slice(0, 300)}`);
  }
  if (!res.ok) {
    const msg =
      payload.errors?.map((e) => e.message).filter(Boolean).join('; ') ||
      raw.slice(0, 300);
    if (res.status === 401) {
      throw new Error(
        `buffer 401: ${msg}. Need GraphQL API key from Buffer → Settings → API (not legacy Public API token)`
      );
    }
    throw new Error(`buffer http ${res.status}: ${msg}`);
  }
  if (payload.errors?.length) {
    throw new Error(
      payload.errors.map((e) => e.message || 'unknown').join('; ')
    );
  }
  return payload.data || {};
}

type BufferChannel = { id: string; name?: string; service?: string };

async function bufferChannels(): Promise<BufferChannel[]> {
  const accountData = await bufferGql(`
    query {
      account {
        organizations { id name }
      }
    }
  `);
  const orgs =
    (
      accountData.account as {
        organizations?: Array<{ id: string; name?: string }>;
      }
    )?.organizations || [];
  if (!orgs.length) {
    throw new Error('no buffer organizations for this API key');
  }
  const channels: BufferChannel[] = [];
  for (const org of orgs) {
    const data = await bufferGql(
      `query($organizationId: OrganizationId!) {
        channels(input: { organizationId: $organizationId }) {
          id
          name
          service
        }
      }`,
      { organizationId: org.id }
    );
    const list = (data.channels as BufferChannel[]) || [];
    channels.push(...list);
  }
  return channels;
}

async function bufferSchedulePost(opts: {
  channelId: string;
  text: string;
  dueAtIso: string;
  service?: string;
  imageUrl?: string;
  imageAlt?: string;
  instagramHandle?: string;
  instagramTagX?: number;
  instagramTagY?: number;
}) {
  const service = (opts.service || '').toLowerCase();
  const input: Record<string, unknown> = {
    text: opts.text,
    channelId: opts.channelId,
    schedulingType: 'automatic',
    mode: 'customScheduled',
    dueAt: opts.dueAtIso,
  };

  if (opts.imageUrl) {
    const image: Record<string, unknown> = { url: opts.imageUrl };
    const needsMeta =
      Boolean(opts.imageAlt) ||
      service === 'instagram' ||
      Boolean(opts.instagramHandle);
    if (needsMeta) {
      const meta: Record<string, unknown> = {
        altText: opts.imageAlt || 'FrontChapter event poster',
      };
      if (service === 'instagram' && opts.instagramHandle) {
        meta.userTags = [
          {
            handle: opts.instagramHandle.replace(/^@/, ''),
            x: opts.instagramTagX ?? 0.7,
            y: opts.instagramTagY ?? 0.35,
          },
        ];
      }
      image.metadata = meta;
    }
    input.assets = [{ image }];
  }

  // Buffer free: no firstComment (LinkedIn/Instagram paid feature)
  if (service === 'instagram') {
    if (!opts.imageUrl) throw new Error('instagram needs image');
    input.metadata = {
      instagram: { type: 'post', shouldShareToFeed: true },
    };
  }

  const data = await bufferGql(
    `mutation($input: CreatePostInput!) {
      createPost(input: $input) {
        ... on PostActionSuccess {
          post { id status }
        }
        ... on MutationError {
          message
        }
      }
    }`,
    { input }
  );
  const result = data.createPost as
    | { post?: { id: string; status?: string }; message?: string }
    | undefined;
  if (result?.message && !result?.post) {
    throw new Error(result.message);
  }
  if (!result?.post?.id) {
    throw new Error(`createPost unexpected: ${JSON.stringify(result)}`);
  }
  return result.post;
}

function googleServiceAccount() {
  const raw = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_JSON') || '';
  if (!raw) throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON missing');
  return JSON.parse(raw);
}

async function googleAccessToken(): Promise<string> {
  const sa = googleServiceAccount();
  const now = Math.floor(Date.now() / 1000);
  const scope = 'https://www.googleapis.com/auth/calendar';
  const aud = sa.token_uri || 'https://oauth2.googleapis.com/token';
  const key = await importPKCS8(sa.private_key, 'RS256');
  // Without Domain-Wide Delegation + subject, SA cannot email invites.
  const subject = CALENDAR_IMPERSONATE || sa.client_email;
  const assertion = await new SignJWT({ scope })
    .setProtectedHeader({ alg: 'RS256', typ: 'JWT' })
    .setIssuer(sa.client_email)
    .setSubject(subject)
    .setAudience(aud)
    .setIssuedAt(now)
    .setExpirationTime(now + 3600)
    .sign(key);

  const body = new URLSearchParams();
  body.set('grant_type', 'urn:ietf:params:oauth:grant-type:jwt-bearer');
  body.set('assertion', assertion);
  const res = await fetch(aud, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });
  const data = await res.json();
  if (!res.ok || !data.access_token) {
    throw new Error(
      data.error_description ||
        data.error ||
        'google token failed' +
          (CALENDAR_IMPERSONATE
            ? ` (impersonating ${CALENDAR_IMPERSONATE})`
            : ' (set GOOGLE_CALENDAR_IMPERSONATE + Workspace DWD for invites)')
    );
  }
  return data.access_token as string;
}

function calBase() {
  return `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
    CALENDAR_ID
  )}`;
}

/** One-click “Add to Google Calendar” (works without SA invite permission). */
function calendarTemplateUrl(
  title: string,
  sessionDatetime: string,
  details: string,
  location?: string
) {
  const start = new Date(sessionDatetime);
  if (!Number.isFinite(start.getTime())) return '';
  const end = new Date(start.getTime() + 90 * 60 * 1000);
  const fmt = (d: Date) =>
    d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${fmt(start)}/${fmt(end)}`,
    details,
    location: location || '',
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/** Prefer production post URL in calendar/emails (avoid ngrok). */
function publicPostUrl(postSlug: string, maybeUrl?: string) {
  const u = (maybeUrl || '').trim();
  if (
    u &&
    !u.includes('ngrok') &&
    !u.includes('localhost') &&
    !u.includes('127.0.0.1')
  ) {
    return u.endsWith('/') ? u : `${u}/`;
  }
  return `https://frontchapter.ir/posts/${postSlug}/`;
}

function isPlaceholderMeet(url: string) {
  const u = url.trim().toLowerCase();
  if (!u) return true;
  return (
    u.includes('test-session') ||
    u.includes('xxx-xxxx') ||
    u.includes('example.com') ||
    u === 'https://meet.google.com/' ||
    u === 'http://meet.google.com/'
  );
}

function extractMeetFromGoogleEvent(data: Record<string, unknown>): string | null {
  const hangout = data.hangoutLink;
  if (typeof hangout === 'string' && hangout) return hangout;
  const conf = data.conferenceData as
    | { entryPoints?: Array<{ entryPointType?: string; uri?: string }> }
    | undefined;
  const video = conf?.entryPoints?.find(
    (e) => e.entryPointType === 'video' && e.uri
  );
  return video?.uri || null;
}

type CalendarEnsureResult = {
  googleEventId: string;
  meetLink: string | null;
};

async function ensureCalendarWithMeet(
  db: ReturnType<typeof adminDb>,
  eventId: string,
  postSlug: string,
  eventTitle: string,
  eventUrl: string,
  sessionDatetime: string,
  preferredMeet?: string
): Promise<CalendarEnsureResult> {
  const stableUrl = publicPostUrl(postSlug, eventUrl);
  const preferred =
    preferredMeet && !isPlaceholderMeet(preferredMeet)
      ? preferredMeet.trim()
      : '';

  const { data: ev } = await db
    .from('events')
    .select('google_calendar_event_id, meet_link')
    .eq('id', eventId)
    .single();

  if (ev?.google_calendar_event_id) {
    let meet =
      (ev.meet_link as string | null) ||
      preferred ||
      null;
    const token = await googleAccessToken();
    const getRes = await fetch(
      `${calBase()}/events/${encodeURIComponent(ev.google_calendar_event_id)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const cur = await getRes.json();
    if (getRes.ok) {
      meet =
        extractMeetFromGoogleEvent(cur) ||
        (meet && !isPlaceholderMeet(meet) ? meet : null) ||
        preferred ||
        null;
    }

    if (!meet) {
      // Attach Meet to existing calendar event
      const patchRes = await fetch(
        `${calBase()}/events/${encodeURIComponent(
          ev.google_calendar_event_id
        )}?conferenceDataVersion=1&sendUpdates=none`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            conferenceData: {
              createRequest: {
                requestId: `m${eventId.replace(/-/g, '').slice(0, 18)}${Date.now()}`,
                conferenceSolutionKey: { type: 'hangoutsMeet' },
              },
            },
          }),
        }
      );
      const patched = await patchRes.json();
      if (patchRes.ok) {
        meet = extractMeetFromGoogleEvent(patched);
      }
    }

    if (meet && meet !== ev.meet_link) {
      await db.from('events').update({ meet_link: meet }).eq('id', eventId);
    } else if (preferred && preferred !== ev.meet_link) {
      await db
        .from('events')
        .update({ meet_link: preferred })
        .eq('id', eventId);
      meet = preferred;
    }
    return {
      googleEventId: ev.google_calendar_event_id as string,
      meetLink: meet,
    };
  }

  const token = await googleAccessToken();
  const start = new Date(sessionDatetime);
  if (!Number.isFinite(start.getTime())) {
    throw new Error('session_datetime invalid');
  }
  const end = new Date(start.getTime() + 90 * 60 * 1000);
  const createMeet = !preferred;
  const payload: Record<string, unknown> = {
    summary: eventTitle,
    description: `${eventTitle}\n${stableUrl}`,
    start: { dateTime: start.toISOString(), timeZone: 'Asia/Tehran' },
    end: { dateTime: end.toISOString(), timeZone: 'Asia/Tehran' },
  };
  if (preferred) {
    payload.location = preferred;
    payload.description = `${payload.description}\n\nMeet: ${preferred}`;
  }
  if (createMeet) {
    payload.conferenceData = {
      createRequest: {
        requestId: `${eventId.replace(/-/g, '').slice(0, 20)}${Date.now()}`,
        conferenceSolutionKey: { type: 'hangoutsMeet' },
      },
    };
  }

  const qs = createMeet
    ? 'conferenceDataVersion=1&sendUpdates=none'
    : 'sendUpdates=none';
  const res = await fetch(`${calBase()}/events?${qs}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok || !data.id) {
    throw new Error(data?.error?.message || 'calendar event create failed');
  }

  const meetLink =
    extractMeetFromGoogleEvent(data) || preferred || null;

  await db
    .from('events')
    .update({
      google_calendar_event_id: data.id,
      meet_link: meetLink,
    })
    .eq('id', eventId);

  return { googleEventId: data.id as string, meetLink };
}

/** @deprecated use ensureCalendarWithMeet */
async function createCalendarEventIfMissing(
  db: ReturnType<typeof adminDb>,
  eventId: string,
  postSlug: string,
  eventTitle: string,
  eventUrl: string,
  sessionDatetime: string,
  meetLink?: string
) {
  const r = await ensureCalendarWithMeet(
    db,
    eventId,
    postSlug,
    eventTitle,
    eventUrl,
    sessionDatetime,
    meetLink
  );
  return r.googleEventId;
}

async function addCalendarAttendee(
  googleEventId: string,
  attendeeEmail: string
) {
  const token = await googleAccessToken();
  const getRes = await fetch(`${calBase()}/events/${encodeURIComponent(googleEventId)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const cur = await getRes.json();
  if (!getRes.ok) throw new Error(cur?.error?.message || 'calendar get failed');

  const attendees = Array.isArray(cur.attendees) ? cur.attendees : [];
  if (!attendees.some((a: { email?: string }) => a.email === attendeeEmail)) {
    attendees.push({ email: attendeeEmail });
  }

  const patchRes = await fetch(
    `${calBase()}/events/${encodeURIComponent(googleEventId)}?sendUpdates=all`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ attendees }),
    }
  );
  const patched = await patchRes.json();
  if (!patchRes.ok) {
    throw new Error(patched?.error?.message || 'calendar attendee patch failed');
  }
}

async function mustUser(req: Request) {
  const auth = req.headers.get('Authorization');
  if (!auth?.startsWith('Bearer ')) throw new Error('unauthorized');
  const client = anonDb(auth);
  const { data, error } = await client.auth.getUser();
  if (error || !data.user) throw new Error('unauthorized');
  return data.user;
}

async function ensureAdmin(db: ReturnType<typeof adminDb>, userId: string) {
  const { data } = await db
    .from('members')
    .select('is_admin')
    .eq('id', userId)
    .maybeSingle();
  if (!data?.is_admin) throw new Error('admin only');
}

function plusHoursIso(hours: number) {
  return new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
}

function fillEventUrl(template: string, eventUrl: string) {
  if (template.includes('__EVENT_URL__')) {
    return template.split('__EVENT_URL__').join(eventUrl);
  }
  return template.includes(eventUrl)
    ? template
    : `${template.trim()}\n${eventUrl}`;
}

function telegramCaptionFromSocial(
  socialTelegram: string,
  eventTitle: string,
  eventUrl: string,
  sessionDatetime: string
) {
  if (socialTelegram) return fillEventUrl(socialTelegram, eventUrl);

  let when = '';
  if (sessionDatetime) {
    const t = Date.parse(sessionDatetime);
    if (Number.isFinite(t)) {
      when = new Date(t).toLocaleString('fa-IR', {
        dateStyle: 'full',
        timeStyle: 'short',
        timeZone: 'Asia/Tehran',
      });
    }
  }
  return (
    `🚀 <b>${eventTitle}</b>\n\n` +
    (when ? `🗓 ${when}\n💻 آنلاین و رایگان\n\n` : '') +
    `📋 ثبت‌نام:\n${eventUrl}\n\n` +
    `🥕 @FrontChapter`
  );
}

async function actionPublishEventTest(req: Request, body: Record<string, unknown>) {
  const user = await mustUser(req);
  const db = adminDb();
  await ensureAdmin(db, user.id);

  if (!BUFFER_TOKEN) throw new Error('BUFFER_ACCESS_TOKEN missing');

  const postSlug = String(body.post_slug || '').trim();
  const eventTitle = String(body.event_title || postSlug).trim();
  const eventUrl = String(body.event_url || `${SITE_URL}/posts/${postSlug}/`).trim();
  const sessionDatetime = String(body.session_datetime || '').trim();
  const meetLink = String(body.meet_link || '').trim();
  const scheduledFor = String(body.scheduled_for || plusHoursIso(3));
  const imageUrlRaw = String(body.image_url || '').trim();
  const imageUrl = publicMediaUrl(imageUrlRaw);
  const imageAlt = String(body.image_alt || eventTitle).trim();
  const socialIn =
    body.social && typeof body.social === 'object'
      ? (body.social as Record<string, unknown>)
      : {};
  const social = {
    telegram: String(socialIn.telegram || '').trim(),
    linkedin: String(socialIn.linkedin || '').trim(),
    linkedin_first_comment: String(
      socialIn.linkedin_first_comment || ''
    ).trim(),
    twitter: String(socialIn.twitter || '').trim(),
    instagram: String(socialIn.instagram || '').trim(),
    instagram_first_comment: String(
      socialIn.instagram_first_comment || ''
    ).trim(),
  };
  const speakerIn =
    body.speaker && typeof body.speaker === 'object'
      ? (body.speaker as Record<string, unknown>)
      : {};
  const speakerLinkedin = String(speakerIn.linkedin || '').trim();
  const speakerIg = String(speakerIn.instagram || '')
    .trim()
    .replace(/^@/, '');
  const speakerTagX = Number(speakerIn.instagram_tag_x);
  const speakerTagY = Number(speakerIn.instagram_tag_y);

  if (!postSlug) throw new Error('post_slug required');
  if (!sessionDatetime) throw new Error('session_datetime required for publish');

  let { data: ev } = await db
    .from('events')
    .select('id, meet_link, google_calendar_event_id')
    .eq('post_slug', postSlug)
    .maybeSingle();
  if (!ev?.id) {
    const { data: created, error } = await db
      .from('events')
      .insert({ post_slug: postSlug })
      .select('id, meet_link, google_calendar_event_id')
      .single();
    if (error || !created) throw new Error(error?.message || 'event create failed');
    ev = created;
  }

  const stableEventUrl = publicPostUrl(postSlug, eventUrl);
  let calendarError = '';
  let meetResolved =
    meetLink && !isPlaceholderMeet(meetLink) ? meetLink : '';
  let googleEventId: string | null =
    (ev.google_calendar_event_id as string | null) || null;
  try {
    const cal = await ensureCalendarWithMeet(
      db,
      ev.id,
      postSlug,
      eventTitle,
      stableEventUrl,
      sessionDatetime,
      meetResolved || undefined
    );
    googleEventId = cal.googleEventId;
    if (cal.meetLink && !isPlaceholderMeet(cal.meetLink)) {
      meetResolved = cal.meetLink;
    }
  } catch (e) {
    calendarError = e instanceof Error ? e.message : String(e);
  }

  const fallbackText =
    telegramCaptionFromSocial('', eventTitle, eventUrl, sessionDatetime)
      .replace(/<\/?b>/g, '');

  const telegramCaption = telegramCaptionFromSocial(
    social.telegram,
    eventTitle,
    eventUrl,
    sessionDatetime
  );

  if (!imageUrl) {
    throw new Error(
      'image_url required for FrontChapter-style Telegram post (photo + caption)'
    );
  }

  const caption =
    telegramCaption.length > 1024
      ? `${telegramCaption.slice(0, 1000)}…`
      : telegramCaption;

  try {
    await tgSendPhotoFile(TELEGRAM_CHANNEL, imageUrl, caption);
  } catch {
    await tg('sendPhoto', {
      chat_id: TELEGRAM_CHANNEL,
      photo: imageUrl,
      caption,
      parse_mode: 'HTML',
    });
  }
  await db.from('event_social_schedules').insert({
    event_id: ev.id,
    platform: 'telegram',
    channel_id: TELEGRAM_CHANNEL,
    status: 'sent',
    payload: {
      message: telegramCaption,
      image_url: imageUrl,
      image_url_raw: imageUrlRaw || null,
    },
  });

  const scheduled: Array<{
    profile_id: string;
    update_id?: string;
    service?: string;
  }> = [];
  const bufferNotes: string[] = [];

  const copyFor = (service: string): { text: string } => {
    const withRegLink = (body: string) => {
      const t = body.trim();
      if (t.includes(eventUrl)) return t;
      return `${t}\n\n📋 ثبت‌نام:\n${eventUrl}`;
    };
    const withSpeakerLinkedin = (body: string) => {
      if (!speakerLinkedin) return body;
      if (body.includes(speakerLinkedin)) return body;
      return `${body.trim()}\n\n🔗 پروفایل سخنران:\n${speakerLinkedin}`;
    };
    const withSpeakerIg = (body: string) => {
      if (!speakerIg) return body;
      const mention = `@${speakerIg}`;
      if (body.includes(mention) || body.includes(speakerIg)) return body;
      return `${mention}\n\n${body.trim()}`;
    };
    if (service === 'linkedin') {
      return {
        text: withRegLink(
          withSpeakerLinkedin(social.linkedin || fallbackText)
        ),
      };
    }
    if (service === 'twitter' || service === 'x') {
      const base = social.twitter || `${eventTitle}\n${eventUrl}`;
      const withUrl = base.includes(eventUrl) ? base : `${base}\n${eventUrl}`;
      return { text: withUrl.slice(0, 280) };
    }
    if (service === 'instagram') {
      return {
        text: withRegLink(
          withSpeakerIg(social.instagram || `${eventTitle}\n\n${eventUrl}`)
        ),
      };
    }
    return { text: withRegLink(social.linkedin || fallbackText) };
  };

  try {
    const channels = await bufferChannels();
    if (!channels.length) {
      throw new Error('no buffer channels for this API key');
    }
    const needsMedia = new Set(['instagram', 'tiktok', 'pinterest', 'youtube']);
    for (const ch of channels) {
      const service = (ch.service || '').toLowerCase();
      if (needsMedia.has(service) && !imageUrl) {
        bufferNotes.push(`${service}: skipped (needs image/video)`);
        continue;
      }
      const { text } = copyFor(service);
      try {
        const post = await bufferSchedulePost({
          channelId: ch.id,
          text,
          dueAtIso: scheduledFor,
          service,
          imageUrl: imageUrl || undefined,
          imageAlt,
          instagramHandle: speakerIg || undefined,
          instagramTagX: Number.isFinite(speakerTagX) ? speakerTagX : 0.7,
          instagramTagY: Number.isFinite(speakerTagY) ? speakerTagY : 0.35,
        });
        scheduled.push({
          profile_id: ch.id,
          update_id: post.id,
          service: ch.service,
        });
        await db.from('event_social_schedules').insert({
          event_id: ev.id,
          platform: 'buffer',
          channel_id: ch.id,
          buffer_update_id: post.id,
          scheduled_for: scheduledFor,
          status: 'scheduled',
          payload: { channel: ch, post, image_url: imageUrl || null },
        });
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        bufferNotes.push(`${service || ch.id}: ${msg}`);
        await db.from('event_social_schedules').insert({
          event_id: ev.id,
          platform: 'buffer',
          channel_id: ch.id,
          scheduled_for: scheduledFor,
          status: 'failed',
          payload: { channel: ch, error: msg },
        });
      }
    }
    if (!scheduled.length && !bufferNotes.length) {
      throw new Error('no buffer posts scheduled');
    }
  } catch (e) {
    bufferNotes.push(e instanceof Error ? e.message : String(e));
    await db.from('event_social_schedules').insert({
      event_id: ev.id,
      platform: 'buffer',
      status: 'failed',
      scheduled_for: scheduledFor,
      payload: { error: bufferNotes.join(' | '), eventTitle, eventUrl },
    });
  }

  return json({
    ok: true,
    telegram_sent: true,
    buffer_scheduled: scheduled,
    buffer_error: bufferNotes.length ? bufferNotes.join(' | ') : null,
    image_url: imageUrl || null,
    meet_link: meetResolved || null,
    google_event_id: googleEventId,
    calendar_error: calendarError || null,
    event_url: stableEventUrl,
  });
}

async function actionRegisterEventFollowups(req: Request, body: Record<string, unknown>) {
  const user = await mustUser(req);
  const db = adminDb();
  const memberId = user.id;

  const postSlug = String(body.post_slug || '').trim();
  const eventTitle = String(body.event_title || postSlug).trim();
  const eventUrlRaw = String(body.event_url || '').trim();
  const eventUrl = publicPostUrl(postSlug, eventUrlRaw);
  const sessionDatetime = String(body.session_datetime || '').trim();
  let meetLink = String(body.meet_link || '').trim();
  if (!postSlug || !sessionDatetime) {
    throw new Error('post_slug and session_datetime required');
  }

  const { data: ev } = await db
    .from('events')
    .select('id, meet_link')
    .eq('post_slug', postSlug)
    .maybeSingle();
  if (!ev?.id) throw new Error('event not found — register_for_event first');

  if ((!meetLink || isPlaceholderMeet(meetLink)) && ev.meet_link) {
    meetLink = String(ev.meet_link);
  }

  const addUrl = calendarTemplateUrl(
    eventTitle,
    sessionDatetime,
    `${eventTitle}\n${eventUrl}`,
    meetLink && !isPlaceholderMeet(meetLink) ? meetLink : undefined
  );

  const { data: emailRow } = await db
    .from('member_emails')
    .select('email')
    .eq('member_id', memberId)
    .maybeSingle();
  const email = emailRow?.email;
  if (!email) {
    return json({
      ok: false,
      error: 'member email missing',
      calendar_add_url: addUrl || null,
      meet_link: meetLink || null,
      invite_sent: false,
    });
  }

  let googleEventId: string | null = null;
  let inviteSent = false;
  let inviteError: string | null = null;
  let resolvedMeet: string | null = meetLink || null;

  try {
    const cal = await ensureCalendarWithMeet(
      db,
      ev.id,
      postSlug,
      eventTitle,
      eventUrl,
      sessionDatetime,
      meetLink || undefined
    );
    googleEventId = cal.googleEventId;
    resolvedMeet = cal.meetLink || meetLink || null;
    try {
      await addCalendarAttendee(googleEventId, email);
      inviteSent = true;
    } catch (e) {
      // Expected on personal Gmail without Workspace DWD
      inviteError = e instanceof Error ? e.message : String(e);
    }
  } catch (e) {
    inviteError = e instanceof Error ? e.message : String(e);
  }

  const meetForReminders =
    resolvedMeet && !isPlaceholderMeet(resolvedMeet) ? resolvedMeet : null;

  // Queue reminders (1 day + 3 hours) even if invite email failed
  const sessionAt = new Date(sessionDatetime);
  const dayBefore = new Date(sessionAt.getTime() - 24 * 60 * 60 * 1000).toISOString();
  const hoursBefore = new Date(sessionAt.getTime() - 3 * 60 * 60 * 1000).toISOString();
  await db.from('event_reminders').upsert(
    [
      {
        event_id: ev.id,
        member_id: memberId,
        reminder_kind: 'day_before',
        remind_at: dayBefore,
        event_title: eventTitle,
        event_url: eventUrl,
        session_datetime: sessionDatetime,
        meet_link: meetForReminders,
      },
      {
        event_id: ev.id,
        member_id: memberId,
        reminder_kind: 'hours_before',
        remind_at: hoursBefore,
        event_title: eventTitle,
        event_url: eventUrl,
        session_datetime: sessionDatetime,
        meet_link: meetForReminders,
      },
    ],
    { onConflict: 'event_id,member_id,reminder_kind' }
  );

  return json({
    ok: true,
    google_event_id: googleEventId,
    invite_sent: inviteSent,
    invite_error: inviteError,
    calendar_add_url: calendarTemplateUrl(
      eventTitle,
      sessionDatetime,
      `${eventTitle}\n${eventUrl}`,
      meetForReminders || undefined
    ) || addUrl || null,
    meet_link: meetForReminders,
    email,
  });
}

async function actionRunDueReminders(req: Request) {
  if (!EVENT_OPS_SECRET) throw new Error('EVENT_OPS_SECRET missing');
  const h = req.headers.get('x-event-ops-secret');
  if (h !== EVENT_OPS_SECRET) return json({ error: 'forbidden' }, 403);

  const db = adminDb();
  const now = new Date().toISOString();
  const { data: due } = await db
    .from('event_reminders')
    .select('id,member_id,reminder_kind,event_title,event_url,session_datetime,meet_link')
    .is('sent_at', null)
    .lte('remind_at', now)
    .limit(200);

  let sent = 0;
  for (const r of due ?? []) {
    try {
      const { data: pc } = await db
        .from('telegram_private_chats')
        .select('chat_id')
        .eq('member_id', r.member_id)
        .maybeSingle();
      if (!pc?.chat_id) continue;
      const msg =
        (r.reminder_kind === 'day_before'
          ? `⏰ یادآوری: فردا ایونت «${r.event_title}» داریم.\n`
          : `⏰ چند ساعت دیگه ایونت «${r.event_title}» شروع می‌شه.\n`) +
        `مشتاق دیدارت هستیم 🥕\n` +
        `${r.event_url}` +
        (r.meet_link ? `\n\nلینک جلسه: ${r.meet_link}` : '');
      await tg('sendMessage', {
        chat_id: pc.chat_id,
        text: msg,
        disable_web_page_preview: false,
      });
      await db
        .from('event_reminders')
        .update({ sent_at: new Date().toISOString(), send_error: null })
        .eq('id', r.id);
      sent++;
    } catch (e) {
      await db
        .from('event_reminders')
        .update({ send_error: String(e) })
        .eq('id', r.id);
    }
  }
  return json({ ok: true, sent });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ error: 'POST only' }, 405);
  try {
    const body = (await req.json()) as Record<string, unknown>;
    const action = String(body.action || '');
    if (action === 'publish_event_test') return await actionPublishEventTest(req, body);
    if (action === 'register_event_followups')
      return await actionRegisterEventFollowups(req, body);
    if (action === 'run_due_reminders') return await actionRunDueReminders(req);
    return json({ error: 'unknown action' }, 400);
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : 'failed' }, 500);
  }
});

