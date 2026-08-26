<?php

/**
 * Haviji Sho (هویجی شو) - Server Configuration
 * Target host: fc.roostkit.site
 */

declare(strict_types=1);

// Database Configuration
define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_PORT', (int)(getenv('DB_PORT') ?: 3306));
define('DB_NAME', getenv('DB_NAME') ?: 'roostkit_frontchapter');
define('DB_USER', getenv('DB_USER') ?: 'roostkit_frontchapter');
define('DB_PASS', getenv('DB_PASS') ?: 'U8mjfZyL-Rq3_q^l');

// Telegram Bot Configuration
define('TELEGRAM_BOT_TOKEN', getenv('TELEGRAM_BOT_TOKEN') ?: '8954964070:AAFZm05A830HvYAzSIexRoGVRFlZQEQDpwk');
define('TELEGRAM_GROUP_CHAT_ID', (int)(getenv('TELEGRAM_GROUP_CHAT_ID') ?: -1001441362277));
define('TELEGRAM_BOT_USERNAME', getenv('TELEGRAM_BOT_USERNAME') ?: 'frontChapterMagicBot');

// FrontChapter Frontend Base URL
define('FRONTEND_ORIGIN', getenv('FRONTEND_ORIGIN') ?: 'https://frontchapter.ir');

// Internal API Security Key for automated syncs (Google Meet Apps Script)
define('INTERNAL_API_KEY', getenv('INTERNAL_API_KEY') ?: 'secret_havij_sync_key_change_me');

// Error reporting settings
if (getenv('APP_ENV') === 'production') {
    ini_set('display_errors', '0');
    error_reporting(0);
} else {
    ini_set('display_errors', '1');
    error_reporting(E_ALL);
}
