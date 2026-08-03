// @ts-nocheck
// Telegram Login (new OIDC JS) → Supabase session
// Verifies id_token with filtered JWKS (drops secp256k1 — breaks jose/go-jose).

import { createClient } from 'npm:@supabase/supabase-js@2';
import * as jose from 'npm:jose@5';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

// Hosted copy without ES256K/secp256k1 — see public/oidc/
const JWKS_URL = 'https://frontchapter.ir/oidc/telegram-jwks.json';
const ISSUER = 'https://oauth.telegram.org';

type IdTokenBody = { id_token: string };

type Profile = {
  telegramId: string;
  displayName: string;
  username: string | null;
  photoUrl: string | null;
};

async function profileFromIdToken(
  idToken: string,
  clientId: string
): Promise<Profile> {
  const JWKS = jose.createRemoteJWKSet(new URL(JWKS_URL));
  const { payload } = await jose.jwtVerify(idToken, JWKS, {
    issuer: ISSUER,
    audience: clientId,
  });

  const telegramId = String(payload.id ?? '');
  if (!telegramId) throw new Error('id_token missing id claim');

  const displayName =
    (typeof payload.name === 'string' && payload.name.trim()) ||
    (typeof payload.preferred_username === 'string' &&
      payload.preferred_username) ||
    'Member';

  return {
    telegramId,
    displayName,
    username:
      typeof payload.preferred_username === 'string'
        ? payload.preferred_username
        : null,
    photoUrl: typeof payload.picture === 'string' ? payload.picture : null,
  };
}

async function mintSession(
  admin: ReturnType<typeof createClient>,
  profile: Profile
) {
  const email = `tg_${profile.telegramId}@users.telegram.local`;
  const meta = {
    id: Number(profile.telegramId),
    name: profile.displayName,
    preferred_username: profile.username,
    picture: profile.photoUrl,
    provider: 'telegram_login',
  };

  const { data: created, error: createErr } = await admin.auth.admin.createUser({
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

  const { data: link, error: sessionErr } = await admin.auth.admin.generateLink({
    type: 'magiclink',
    email,
  });
  if (sessionErr) throw sessionErr;

  const hashed = link.properties.hashed_token;
  if (!hashed) throw new Error('no hashed_token from generateLink');

  return { token_hash: hashed, user_id: userId ?? link.user.id };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: cors });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const clientId =
      Deno.env.get('TELEGRAM_CLIENT_ID') || '8954964070';
    if (!supabaseUrl || !serviceKey) {
      return new Response(JSON.stringify({ error: 'server misconfigured' }), {
        status: 500,
        headers: { ...cors, 'Content-Type': 'application/json' },
      });
    }

    const body = (await req.json()) as IdTokenBody;
    if (!body?.id_token || typeof body.id_token !== 'string') {
      return new Response(JSON.stringify({ error: 'id_token required' }), {
        status: 400,
        headers: { ...cors, 'Content-Type': 'application/json' },
      });
    }

    const profile = await profileFromIdToken(body.id_token, clientId);
    const admin = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const session = await mintSession(admin, profile);

    return new Response(JSON.stringify(session), {
      headers: { ...cors, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'login failed';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...cors, 'Content-Type': 'application/json' },
    });
  }
});
