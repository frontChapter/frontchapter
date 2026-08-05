#!/usr/bin/env bash
# Public HTTPS URL for local dev (Telegram Login rejects localhost).
# Prereq: ngrok account + authtoken (https://dashboard.ngrok.com/get-started/your-authtoken)
#
# Terminal 1: pnpm run dev:http
# Terminal 2: ./scripts/tunnel-ngrok.sh
#
# Then add in BotFather → Web Login:
#   Trusted Origin: https://YOUR-NGROK-URL
#   Redirect URI:   https://YOUR-NGROK-URL/join/

set -euo pipefail

if ! command -v ngrok >/dev/null 2>&1; then
  echo "Install ngrok first: brew install ngrok/ngrok/ngrok" >&2
  exit 1
fi

echo "Tunneling http://localhost:3000 — copy the https://….ngrok-free.app URL"
exec ngrok http 3000
