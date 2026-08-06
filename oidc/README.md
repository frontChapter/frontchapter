# Telegram OIDC — filtered discovery / JWKS

**Not a leftover test.** Required workaround for Supabase Auth + Telegram OIDC.

## Problem

Telegram’s official discovery (`https://oauth.telegram.org/.well-known/openid-configuration`) points `jwks_uri` at a JWKS that includes an **ES256K / `secp256k1`** key (for TON wallet auth). Libraries used by Supabase Auth (`go-jose`) fail to parse that key and reject the **entire** JWKS — so login dies even when the `id_token` is signed with supported **RS256**.

Upstream: [supabase/auth#2534](https://github.com/supabase/auth/issues/2534) (and related PRs). Until Auth ships secp256k1 support, leave the Dashboard **Discovery URL** as:

`https://frontchapter.ir/oidc/telegram-discovery.json`

## What these files do

| File | Role |
|------|------|
| `telegram-discovery.json` | Same as Telegram’s discovery, except `jwks_uri` → our filtered JWKS |
| `telegram-jwks.json` | Telegram keys **without** the secp256k1 entry (RS256 / ES256 / EdDSA only) |

Refresh `telegram-jwks.json` if Telegram rotates keys (compare against `https://oauth.telegram.org/.well-known/jwks.json` and drop only `crv: secp256k1` / `alg: ES256K`).
