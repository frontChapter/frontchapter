#!/usr/bin/env python3
"""Refresh filtered Telegram JWKS (drops secp256k1 — breaks Supabase Auth go-jose).

Run: python3 scripts/refresh-telegram-oidc.py
Then deploy. Point Supabase custom:telegram Discovery URL at:
  https://frontchapter.ir/oidc/telegram-discovery.json
Issuer stays: https://oauth.telegram.org
"""
from __future__ import annotations

import gzip
import json
import ssl
from pathlib import Path
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1] / "public" / "oidc"
OUT_DISC = ROOT / "telegram-discovery.json"
OUT_JWKS = ROOT / "telegram-jwks.json"
SITE_JWKS = "https://frontchapter.ir/oidc/telegram-jwks.json"


def get(url: str) -> dict:
    req = Request(url, headers={"Accept": "application/json", "Accept-Encoding": "gzip"})
    with urlopen(req, context=ssl.create_default_context(), timeout=30) as r:
        data = r.read()
        if r.headers.get("Content-Encoding") == "gzip" or data[:2] == b"\x1f\x8b":
            data = gzip.decompress(data)
        return json.loads(data.decode("utf-8"))


def main() -> None:
    disc = get("https://oauth.telegram.org/.well-known/openid-configuration")
    jwks = get("https://oauth.telegram.org/.well-known/jwks.json")
    filtered = {
        "keys": [
            k
            for k in jwks["keys"]
            if k.get("crv") != "secp256k1" and k.get("alg") != "ES256K"
        ]
    }
    disc = dict(disc)
    disc["jwks_uri"] = SITE_JWKS
    disc["id_token_signing_alg_values_supported"] = [
        a
        for a in disc.get("id_token_signing_alg_values_supported", [])
        if a != "ES256K"
    ]
    ROOT.mkdir(parents=True, exist_ok=True)
    OUT_DISC.write_text(json.dumps(disc, indent=2) + "\n")
    OUT_JWKS.write_text(json.dumps(filtered, indent=2) + "\n")
    print("kept", [k.get("kid") for k in filtered["keys"]])
    print("wrote", OUT_DISC, OUT_JWKS)


if __name__ == "__main__":
    main()
