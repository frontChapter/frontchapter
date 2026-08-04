#!/usr/bin/env python3
"""Print Telegram webhook health for HavijMagic.

Usage:
  export TELEGRAM_BOT_TOKEN=...
  python3 scripts/telegram-webhook-info.py
"""

from __future__ import annotations

import json
import os
import sys
import urllib.request

TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN", "").strip()
if not TOKEN:
    print("Need TELEGRAM_BOT_TOKEN", file=sys.stderr)
    sys.exit(1)

req = urllib.request.Request(
    f"https://api.telegram.org/bot{TOKEN}/getWebhookInfo"
)
with urllib.request.urlopen(req) as res:
    info = json.loads(res.read().decode())

print(json.dumps(info, indent=2, ensure_ascii=False))

result = info.get("result") or {}
url = result.get("url") or ""
allowed = result.get("allowed_updates") or []
err = result.get("last_error_message")
pending = result.get("pending_update_count")

print("\n--- check ---", file=sys.stderr)
ok = True
if "telegram-bot" not in url:
    print("FAIL: webhook URL missing /functions/v1/telegram-bot", file=sys.stderr)
    ok = False
else:
    print(f"OK url: {url}", file=sys.stderr)

if "chat_member" not in allowed:
    # empty allowed_updates means "default" which EXCLUDES chat_member
    print(
        "FAIL: allowed_updates missing chat_member "
        f"(got {allowed or 'DEFAULT — no chat_member'}). "
        "Re-run: python3 scripts/set-telegram-webhook.py",
        file=sys.stderr,
    )
    ok = False
else:
    print(f"OK allowed_updates: {allowed}", file=sys.stderr)

if err:
    print(f"FAIL last_error_message: {err}", file=sys.stderr)
    print(f"     last_error_date: {result.get('last_error_date')}", file=sys.stderr)
    ok = False
else:
    print("OK no last_error_message", file=sys.stderr)

print(f"pending_update_count: {pending}", file=sys.stderr)
sys.exit(0 if ok else 2)
