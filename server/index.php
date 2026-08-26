<?php

/**
 * Haviji Sho - Server Health & Entry Point
 * Host: fc.roostkit.site
 */

declare(strict_types=1);

require_once __DIR__ . '/cors.php';

echo json_encode([
    'status' => 'online',
    'service' => 'FrontChapter Haviji Sho API',
    'version' => '1.0.0',
    'timestamp' => time(),
    'endpoints' => [
        'POST /api/v1/auth/telegram-verify' => 'Verify Telegram login payload',
        'POST /api/v1/onboarding/complete' => 'Complete profile & unlock Telegram permissions',
        'GET /api/v1/community/members' => 'Leaderboard & community directory',
        'POST /api/v1/events/sync-attendance' => 'Google Meet attendance automated sync',
        'POST /webhook' => 'Telegram Bot update webhook',
    ],
], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
