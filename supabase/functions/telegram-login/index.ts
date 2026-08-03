// Telegram Login Widget → Supabase session
// Bypasses broken Telegram OIDC on Supabase Cloud (auth#2534).

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.111.0';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

type TgPayload = {
  id: number | string;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number | string;
  hash: string;
};

async function sha256(data: Uint8Array): Promise<ArrayBuffer> {
  return crypto.subtle.digest('SHA-256', data);
}

async function hmacHex(key: ArrayBuffer, message: string): Promise<string> {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign(
    'HMAC',
    cryptoKey,
    new TextEncoder().encode(message)
  );
  return [...new Uint8Array(sig)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

async function verifyTelegram(payload: TgPayload, botToken: string) {
  const { hash, ...rest } = payload;
  if (!hash) return false;

  const checkString = Object.keys(rest)
    .filter((k) => {
      const v = rest[k as keyof typeof rest];
      return v !== undefined && v !== null && v !== '';
    })
    .sort()
    .map((k) => `${k}=${rest[k as keyof typeof rest]}`)
    .join('\n');

  const secret = await sha256(new TextEncoder().encode(botToken));
  const computed = await hmacHex(secret, checkString);
  if (!timingSafeEqual(computed, String(hash))) return false;

  const authDate = Number(payload.auth_date);
  if (!Number.isFinite(authDate)) return false;
  if (Math.abs(Date.now() / 1000 - authDate) > 86400) return false;
  return true;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: cors });
  }

  try {
    const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!botToken || !supabaseUrl || !serviceKey) {
      return new Response(JSON.stringify({ error: 'server misconfigured' }), {
        status: 500,
        headers: { ...cors, 'Content-Type': 'application/json' },
      });
    }

    const body = (await req.json()) as TgPayload;
    if (!(await verifyTelegram(body, botToken))) {
      return new Response(JSON.stringify({ error: 'invalid telegram auth' }), {
        status: 401,
        headers: { ...cors, 'Content-Type': 'application/json' },
      });
    }

    const telegramId = String(body.id);
    const email = `tg_${telegramId}@users.telegram.local`;
    const displayName =
      [body.first_name, body.last_name].filter(Boolean).join(' ').trim() ||
      body.username ||
      'Member';

    const meta = {
      id: Number(telegramId),
      name: displayName,
      preferred_username: body.username ?? null,
      picture: body.photo_url ?? null,
      provider: 'telegram_widget',
    };

    const admin = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: created, error: createErr } =
      await admin.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: meta,
      });

    if (createErr && !/already|registered|exists/i.test(createErr.message)) {
      throw createErr;
    }

    let userId = created?.user?.id;
    if (!userId) {
      const { data: existingLink, error: findErr } =
        await admin.auth.admin.generateLink({ type: 'magiclink', email });
      if (findErr) throw findErr;
      userId = existingLink.user.id;
      await admin.auth.admin.updateUserById(userId, { user_metadata: meta });
    }

    const { data: link, error: sessionErr } =
      await admin.auth.admin.generateLink({ type: 'magiclink', email });
    if (sessionErr) throw sessionErr;

    const hashed = link.properties.hashed_token;
    if (!hashed) throw new Error('no hashed_token from generateLink');

    return new Response(
      JSON.stringify({
        token_hash: hashed,
        user_id: userId ?? link.user.id,
      }),
      { headers: { ...cors, 'Content-Type': 'application/json' } }
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : 'login failed';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...cors, 'Content-Type': 'application/json' },
    });
  }
});
