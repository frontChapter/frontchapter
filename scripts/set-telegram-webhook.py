#!/usr/bin/env python3
"""Set Telegram webhook for FrontChapter group gate bot.

Usage:
  export TELEGRAM_BOT_TOKEN=...
  export TELEGRAM_WEBHOOK_SECRET=...   # random string you also set as Supabase secret
  export SUPABASE_PROJECT_REF=yuwsoyhknbjipfouemen
  python3 scripts/set-telegram-webhook.py

Optional:
  TELEGRAM_GROUP_CHAT_ID=-100…  (or let bot learn it on first join /chatid)
"""

from __future__ import annotations

import json
import os
import sys
import urllib.parse
import urllib.request

TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN", "").strip()
SECRET = os.environ.get("TELEGRAM_WEBHOOK_SECRET", "").strip()
REF = os.environ.get("SUPABASE_PROJECT_REF", "yuwsoyhknbjipfouemen").strip()

if not TOKEN or not SECRET:
    print("Need TELEGRAM_BOT_TOKEN and TELEGRAM_WEBHOOK_SECRET", file=sys.stderr)
    sys.exit(1)

url = f"https://{REF}.supabase.co/functions/v1/telegram-bot"
payload = {
    "url": url,
    "secret_token": SECRET,
    "allowed_updates": ["chat_member", "message"],
    "drop_pending_updates": True,
}

req = urllib.request.Request(
    f"https://api.telegram.org/bot{TOKEN}/setWebhook",
    data=json.dumps(payload).encode(),
    headers={"Content-Type": "application/json"},
    method="POST",
)
with urllib.request.urlopen(req) as res:
    body = json.loads(res.read().decode())
print(json.dumps(body, indent=2, ensure_ascii=False))

info_req = urllib.request.Request(
    f"https://api.telegram.org/bot{TOKEN}/getWebhookInfo"
)
with urllib.request.urlopen(info_req) as res:
    print(json.dumps(json.loads(res.read().decode()), indent=2, ensure_ascii=False))
