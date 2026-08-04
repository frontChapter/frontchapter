// @ts-nocheck
// Admin CSV attendance import for online sessions.
// Deploy: supabase functions deploy event-attendance --no-verify-jwt
// POST { post_slug, csv } + Authorization: Bearer <admin user jwt>

import { createClient } from 'npm:@supabase/supabase-js@2';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  });
}

function adminDb() {
  const url = Deno.env.get('SUPABASE_URL');
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !key) throw new Error('supabase env missing');
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

/** Pull emails from AttendKit-style CSV (header row with Email / email / E-mail). */
function emailsFromCsv(csv: string): string[] {
  const lines = csv
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length < 2) return [];

  const split = (line: string) => {
    // ponytail: naive CSV — enough for Meet export; quoted commas rare in emails
    const cells: string[] = [];
    let cur = '';
    let q = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') {
        q = !q;
        continue;
      }
      if (c === ',' && !q) {
        cells.push(cur.trim());
        cur = '';
        continue;
      }
      cur += c;
    }
    cells.push(cur.trim());
    return cells;
  };

  const headers = split(lines[0]).map((h) => h.toLowerCase());
  let emailIdx = headers.findIndex(
    (h) => h === 'email' || h === 'e-mail' || h.includes('email')
  );
  if (emailIdx < 0) {
    // no header match — treat first column that looks like email in row 2
    const sample = split(lines[1]);
    emailIdx = sample.findIndex((c) => c.includes('@'));
  }
  if (emailIdx < 0) return [];

  const out: string[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cells = split(lines[i]);
    const raw = (cells[emailIdx] || '').trim().toLowerCase();
    if (raw.includes('@')) out.push(raw);
  }
  return [...new Set(out)];
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: cors });
  }
  if (req.method !== 'POST') return json({ error: 'POST only' }, 405);

  try {
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
    const { data: member } = await db
      .from('members')
      .select('is_admin')
      .eq('id', userData.user.id)
      .maybeSingle();
    if (!member?.is_admin) return json({ error: 'admin only' }, 403);

    const body = await req.json();
    const postSlug = String(body?.post_slug || '').trim();
    const csv = String(body?.csv || '');
    if (!postSlug || !csv) {
      return json({ error: 'post_slug and csv required' }, 400);
    }

    let { data: ev } = await db
      .from('events')
      .select('id')
      .eq('post_slug', postSlug)
      .maybeSingle();
    if (!ev) {
      const { data: created, error: cErr } = await db
        .from('events')
        .insert({ post_slug: postSlug })
        .select('id')
        .single();
      if (cErr || !created) {
        return json({ error: cErr?.message || 'event create failed' }, 500);
      }
      ev = created;
    }

    const emails = emailsFromCsv(csv);
    let matched = 0;
    let awarded = 0;
    const unmatched: string[] = [];

    for (const email of emails) {
      const { data: row } = await db
        .from('member_emails')
        .select('member_id')
        .eq('email', email)
        .maybeSingle();
      if (!row?.member_id) {
        unmatched.push(email);
        continue;
      }
      matched++;
      const { data: res, error: confErr } = await db.rpc(
        'confirm_event_attendance',
        {
          p_event_id: ev.id,
          p_member_id: row.member_id,
          p_matched_email: email,
        }
      );
      if (confErr) {
        console.error('confirm', email, confErr);
        continue;
      }
      awarded += Number(res?.points_awarded || 0) > 0 ? 1 : 0;
    }

    return json({
      ok: true,
      event_id: ev.id,
      csv_emails: emails.length,
      matched,
      newly_awarded: awarded,
      unmatched_count: unmatched.length,
      // ponytail: cap list so response stays small
      unmatched: unmatched.slice(0, 50),
    });
  } catch (e) {
    console.error(e);
    return json(
      { error: e instanceof Error ? e.message : 'failed' },
      500
    );
  }
});
