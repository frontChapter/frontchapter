<?php
/**
 * REST Endpoint: POST /api/v1/events/sync-attendance
 * Ingests attendance records from Google Meet Apps Script or admin dashboard
 * Protected by X-API-KEY header
 */

declare(strict_types=1);

require_once __DIR__ . '/../../../cors.php';
require_once __DIR__ . '/../../../db.php';
require_once __DIR__ . '/../../../includes/Security.php';
require_once __DIR__ . '/../../../includes/Gamification.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method Not Allowed']);
    exit;
}

if (!verifyInternalApiKey()) {
    http_response_code(403);
    echo json_encode(['success' => false, 'error' => 'Forbidden: Invalid X-API-KEY']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
if (empty($input['event_slug']) || empty($input['attendees']) || !is_array($input['attendees'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid event attendance payload']);
    exit;
}

$eventSlug = trim($input['event_slug']);
$attendees = $input['attendees'];
$rewardCoins = isset($input['reward_coins']) ? max(1, (int)$input['reward_coins']) : 2;

$db = getDb();

// Find or create event
$eventStmt = $db->prepare("SELECT * FROM events WHERE slug = ? LIMIT 1");
$eventStmt->execute([$eventSlug]);
$event = $eventStmt->fetch();

if (!$event) {
    $createEventStmt = $db->prepare(
        "INSERT INTO events (slug, title, event_type, event_date, reward_coins)
         VALUES (?, ?, 'ONLINE_MEET', NOW(), ?)"
    );
    $createEventStmt->execute([$eventSlug, "رویداد {$eventSlug}", $rewardCoins]);
    $eventId = (int)$db->lastInsertId();
} else {
    $eventId = (int)$event['id'];
    $rewardCoins = (int)$event['reward_coins'];
}

$syncedCount = 0;
$skippedCount = 0;
$results = [];

foreach ($attendees as $att) {
    $tgId = !empty($att['telegram_id']) ? (int)$att['telegram_id'] : null;
    $email = !empty($att['email']) ? trim($att['email']) : null;

    if (!$tgId && !$email) {
        continue;
    }

    // Locate user by telegram_id or email
    $findUserStmt = $db->prepare("SELECT id, telegram_id, first_name FROM users WHERE (telegram_id = ? AND ? IS NOT NULL) OR (email = ? AND ? IS NOT NULL) LIMIT 1");
    $findUserStmt->execute([$tgId, $tgId, $email, $email]);
    $user = $findUserStmt->fetch();

    if (!$user) {
        $skippedCount++;
        continue;
    }

    $userId = (int)$user['id'];

    // Check attendance duplicate
    try {
        $attStmt = $db->prepare("INSERT INTO attendances (event_id, user_id, verified_by) VALUES (?, ?, 'GOOGLE_APPS_SCRIPT')");
        $attStmt->execute([$eventId, $userId]);
    } catch (PDOException $e) {
        // Duplicate attendance for this event
        $skippedCount++;
        continue;
    }

    // Award reward coins
    $metaRef = "event_{$eventId}_user_{$userId}";
    $res = Gamification::awardCoins(
        $userId,
        $rewardCoins,
        'MEET_ATTENDANCE',
        null,
        $metaRef,
        "شرکت در رویداد {$eventSlug}"
    );

    if ($res['success']) {
        $syncedCount++;
        $results[] = [
            'user_id' => $userId,
            'first_name' => $user['first_name'],
            'coins_awarded' => $rewardCoins,
            'is_upgraded' => $res['is_upgraded'] ?? false,
        ];
    }
}

echo json_encode([
    'success' => true,
    'event_slug' => $eventSlug,
    'synced_attendees' => $syncedCount,
    'skipped_attendees' => $skippedCount,
    'details' => $results,
], JSON_UNESCAPED_UNICODE);
