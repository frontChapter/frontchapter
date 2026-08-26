<?php
/**
 * REST Endpoint: GET /api/v1/community/members
 * Returns paginated public member list & leaderboard sorted by coins_balance DESC
 */

declare(strict_types=1);

require_once __DIR__ . '/../../../cors.php';
require_once __DIR__ . '/../../../db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method Not Allowed']);
    exit;
}

$tier = $_GET['tier'] ?? null;
$search = trim($_GET['q'] ?? '');
$page = max(1, (int)($_GET['page'] ?? 1));
$limit = min(100, max(1, (int)($_GET['limit'] ?? 50)));
$offset = ($page - 1) * $limit;

$db = getDb();

$whereClauses = ['is_public = 1'];
$params = [];

if (!empty($tier) && $tier !== 'all') {
    $whereClauses[] = 'tier_level = :tier';
    $params[':tier'] = $tier;
}

if (!empty($search)) {
    $whereClauses[] = '(first_name LIKE :q OR last_name LIKE :q OR username LIKE :q OR job_title LIKE :q)';
    $params[':q'] = "%{$search}%";
}

$whereSql = implode(' AND ', $whereClauses);

// Count total
$countStmt = $db->prepare("SELECT COUNT(*) FROM users WHERE {$whereSql}");
$countStmt->execute($params);
$total = (int)$countStmt->fetchColumn();

// Fetch paginated members
$sql = "SELECT id, telegram_id, username, first_name, last_name, job_title, bio, avatar_url,
               coins_balance, tier_level, is_public, created_at
        FROM users
        WHERE {$whereSql}
        ORDER BY coins_balance DESC, id ASC
        LIMIT {$limit} OFFSET {$offset}";

$stmt = $db->prepare($sql);
$stmt->execute($params);
$rows = $stmt->fetchAll();

$members = array_map(function ($row) {
    return [
        'id' => (int)$row['id'],
        'telegram_id' => (int)$row['telegram_id'],
        'username' => $row['username'],
        'first_name' => $row['first_name'],
        'last_name' => $row['last_name'],
        'job_title' => $row['job_title'],
        'bio' => $row['bio'],
        'avatar_url' => $row['avatar_url'],
        'coins_balance' => (int)$row['coins_balance'],
        'tier_level' => $row['tier_level'],
        'is_public' => (bool)$row['is_public'],
        'created_at' => $row['created_at'],
    ];
}, $rows);

echo json_encode([
    'success' => true,
    'total' => $total,
    'page' => $page,
    'limit' => $limit,
    'data' => $members,
], JSON_UNESCAPED_UNICODE);
