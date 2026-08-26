<?php
/**
 * REST Endpoint: POST /api/v1/onboarding/complete
 * Saves user profile, accepts rules, lifts Telegram restrictions, and applies initial carrot tag
 */

declare(strict_types=1);

require_once __DIR__ . '/../../../cors.php';
require_once __DIR__ . '/../../../db.php';
require_once __DIR__ . '/../../../includes/Security.php';
require_once __DIR__ . '/../../../includes/TelegramApi.php';
require_once __DIR__ . '/../../../includes/Gamification.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method Not Allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
if (empty($input['telegramAuth']) || empty($input['profile']) || empty($input['rules_accepted'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid onboarding payload']);
    exit;
}

$tgAuth = $input['telegramAuth'];
$profile = $input['profile'];

// Verify Telegram Hash
if (getenv('APP_ENV') === 'production' || !empty($tgAuth['hash'])) {
    if (!verifyTelegramAuth($tgAuth)) {
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'Invalid Telegram signature']);
        exit;
    }
}

$telegramId = (int)$tgAuth['id'];
$username = !empty($tgAuth['username']) ? $tgAuth['username'] : null;
$firstName = trim($profile['first_name'] ?? $tgAuth['first_name'] ?? '');
$lastName = !empty($profile['last_name']) ? trim($profile['last_name']) : (!empty($tgAuth['last_name']) ? trim($tgAuth['last_name']) : null);
$email = !empty($profile['email']) ? trim($profile['email']) : null;
$jobTitle = !empty($profile['job_title']) ? trim($profile['job_title']) : null;
$bio = !empty($profile['bio']) ? trim($profile['bio']) : null;
$avatarUrl = !empty($tgAuth['photo_url']) ? $tgAuth['photo_url'] : null;
$isPublic = isset($profile['is_public']) ? ($profile['is_public'] ? 1 : 0) : 1;

if (empty($firstName)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'error' => 'First name is required']);
    exit;
}

$db = getDb();

try {
    $sql = "INSERT INTO users (
                telegram_id, username, first_name, last_name, email, job_title, bio, avatar_url,
                coins_balance, tier_level, is_public, is_restricted, rules_accepted_at
            ) VALUES (
                :tg_id, :username, :f_name, :l_name, :email, :job_title, :bio, :avatar,
                0, 'havij_neshan', :is_public, 0, NOW()
            ) ON DUPLICATE KEY UPDATE
                username = VALUES(username),
                first_name = VALUES(first_name),
                last_name = VALUES(last_name),
                email = VALUES(email),
                job_title = VALUES(job_title),
                bio = VALUES(bio),
                avatar_url = COALESCE(VALUES(avatar_url), avatar_url),
                is_public = VALUES(is_public),
                is_restricted = 0,
                rules_accepted_at = COALESCE(rules_accepted_at, NOW())";

    $stmt = $db->prepare($sql);
    $stmt->execute([
        ':tg_id' => $telegramId,
        ':username' => $username,
        ':f_name' => $firstName,
        ':l_name' => $lastName,
        ':email' => $email,
        ':job_title' => $jobTitle,
        ':bio' => $bio,
        ':avatar' => $avatarUrl,
        ':is_public' => $isPublic,
    ]);

    // Fetch refreshed user record
    $fetchStmt = $db->prepare("SELECT * FROM users WHERE telegram_id = ? LIMIT 1");
    $fetchStmt->execute([$telegramId]);
    $user = $fetchStmt->fetch();

    // Telegram Bot API Actions: Un-restrict chat member & apply initial tag
    $tg = new TelegramApi();
    $tg->unlockMember(TELEGRAM_GROUP_CHAT_ID, $telegramId);
    $tg->setChatMemberTag(TELEGRAM_GROUP_CHAT_ID, $telegramId, '🥕 هویج‌نشان');

    echo json_encode([
        'success' => true,
        'message' => 'عضویت شما با موفقیت تایید و دسترسی‌های گروه تلگرام فعال شد.',
        'data' => [
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
    ], JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    http_response_code(500);
    error_log("Onboarding error: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'error' => 'خطایی در ثبت اطلاعات رخ داد: ' . $e->getMessage(),
    ], JSON_UNESCAPED_UNICODE);
}
