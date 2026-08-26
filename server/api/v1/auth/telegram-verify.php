<?php
/**
 * REST Endpoint: POST /api/v1/auth/telegram-verify
 * Validates Telegram Login Widget payload and checks if profile exists
 */

declare(strict_types=1);

require_once __DIR__ . '/../../../cors.php';
require_once __DIR__ . '/../../../db.php';
require_once __DIR__ . '/../../../includes/Security.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method Not Allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
if (!$input || empty($input['id'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid JSON payload']);
    exit;
}

// In production, verify HMAC hash
if (getenv('APP_ENV') === 'production' || !empty($input['hash'])) {
    if (!verifyTelegramAuth($input)) {
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'Invalid or expired Telegram signature']);
        exit;
    }
}

$telegramId = (int)$input['id'];
$db = getDb();

$stmt = $db->prepare("SELECT * FROM users WHERE telegram_id = ? LIMIT 1");
$stmt->execute([$telegramId]);
$user = $stmt->fetch();

if ($user) {
    echo json_encode([
        'success' => true,
        'data' => [
            'exists' => true,
            'profile' => [
                'id' => (int)$user['id'],
                'telegram_id' => (int)$user['telegram_id'],
                'username' => $user['username'],
                'first_name' => $user['first_name'],
                'last_name' => $user['last_name'],
                'email' => $user['email'],
                'job_title' => $user['job_title'],
                'bio' => $user['bio'],
                'avatar_url' => $user['avatar_url'],
                'coins_balance' => (int)$user['coins_balance'],
                'tier_level' => $user['tier_level'],
                'is_public' => (bool)$user['is_public'],
                'rules_accepted_at' => $user['rules_accepted_at'],
            ],
        ],
    ], JSON_UNESCAPED_UNICODE);
} else {
    echo json_encode([
        'success' => true,
        'data' => [
            'exists' => false,
        ],
    ], JSON_UNESCAPED_UNICODE);
}
