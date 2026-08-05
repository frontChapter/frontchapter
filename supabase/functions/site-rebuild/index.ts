// @ts-nocheck
// Trigger GitHub Pages rebuild after public profile save (repository_dispatch).
// Deploy: supabase functions deploy site-rebuild
// Secrets: GITHUB_DISPATCH_TOKEN (repo workflow scope), optional GITHUB_REPO

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

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: cors });
  }

  const auth = req.headers.get('Authorization');
  if (!auth?.startsWith('Bearer ')) {
    return json({ error: 'unauthorized' }, 401);
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: auth } } }
  );
  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData.user) {
    return json({ error: 'unauthorized' }, 401);
  }

  const token = Deno.env.get('GITHUB_DISPATCH_TOKEN');
  const repo = Deno.env.get('GITHUB_REPO') || 'frontChapter/frontchapter';
  if (!token) {
    return json({ error: 'rebuild not configured' }, 503);
  }

  const gh = await fetch(`https://api.github.com/repos/${repo}/dispatches`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: JSON.stringify({ event_type: 'members-updated' }),
  });

  if (!gh.ok) {
    const detail = await gh.text();
    console.error('[site-rebuild] dispatch failed', gh.status, detail);
    return json({ error: 'github dispatch failed', status: gh.status }, 502);
  }

  return json({ ok: true });
});
