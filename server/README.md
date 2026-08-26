# Haviji Sho (هویجی شو) — Server-Side Documentation & Deployment Guide

This directory contains the PHP 8.2+ backend and Telegram Bot webhook services for FrontChapter's Haviji Sho gamification platform.

---

## Directory Structure

```
server/
├── config.php                 # Environment & database credentials
├── db.php                     # PDO connection factory
├── cors.php                   # CORS headers & preflight handler
├── schema.sql                 # Complete MySQL 8.0 schema creation script
├── .htaccess                  # Apache mod_rewrite clean URL routing
├── includes/
│   ├── TelegramApi.php        # Telegram Bot API wrapper (restrict, unlock, setChatMemberTag, send)
│   ├── Gamification.php       # Tier evaluation, coin adding & threshold upgrades
│   └── Security.php           # HMAC-SHA256 hash verification & API key validator
├── api/
│   └── v1/
│       ├── auth/
│       │   └── telegram-verify.php   # POST /api/v1/auth/telegram-verify
│       ├── onboarding/
│       │   └── complete.php          # POST /api/v1/onboarding/complete
│       ├── community/
│       │   └── members.php           # GET /api/v1/community/members
│       └── events/
│           └── sync-attendance.php   # POST /api/v1/events/sync-attendance
├── telegram-webhook.php       # Telegram Webhook dispatcher (new members & /useful)
└── README.md
```

---

## 1. Database Setup on Host (`roostkit.site`)

1. Open **cPanel -> phpMyAdmin** or MySQL CLI.
2. Create database `frontchapter_havij` (or import `server/schema.sql`):
   ```sql
   SOURCE server/schema.sql;
   ```
3. To restore previous member data from Supabase, run the generated seed script:
   ```sql
   SOURCE backups/seed_havij_database.sql;
   ```

---

## 2. Configuration (`config.php`)

Set your live bot token and DB password in `server/config.php` or as server environment variables:

```php
define('DB_HOST', '127.0.0.1');
define('DB_NAME', 'frontchapter_havij');
define('DB_USER', 'your_db_user');
define('DB_PASS', 'your_db_password');

define('TELEGRAM_BOT_TOKEN', 'YOUR_TELEGRAM_BOT_TOKEN');
define('TELEGRAM_GROUP_CHAT_ID', -1001441362277); // FrontChapter Supergroup ID
define('FRONTEND_ORIGIN', 'https://frontchapter.ir');
define('INTERNAL_API_KEY', 'your_secure_internal_sync_key');
```

---

## 3. Register Telegram Webhook

To connect your Telegram Bot to the webhook endpoint, execute:

```bash
curl -F "url=https://roostkit.site/telegram-webhook.php" \
     -F "allowed_updates=[\"message\"]" \
     https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook
```

To verify webhook status:
```bash
curl https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo
```

---

## 4. API Endpoints Reference

### `POST /api/v1/auth/telegram-verify`
- **Request Body**: Telegram Login Widget JSON payload (`id`, `first_name`, `username`, `auth_date`, `hash`).
- **Response**: `{ "success": true, "data": { "exists": true, "profile": { ... } } }`.

### `POST /api/v1/onboarding/complete`
- **Request Body**: `{ "telegramAuth": {...}, "profile": { "first_name": "...", "job_title": "..." }, "rules_accepted": true }`.
- **Action**: Unlocks chat permissions in group, assigns `🥕 هویج‌نشان` custom tag, and saves user profile.

### `GET /api/v1/community/members`
- **Query Params**: `?tier=havij_doost&q=developer&page=1&limit=50`
- **Response**: Paginated list of public members sorted by `coins_balance DESC`.

### `POST /api/v1/events/sync-attendance`
- **Header**: `X-API-KEY: your_secure_internal_sync_key`
- **Request Body**:
  ```json
  {
    "event_slug": "session-69-ai-and-future",
    "reward_coins": 2,
    "attendees": [
      { "telegram_id": 345447718, "email": "user@example.com" }
    ]
  }
  ```
