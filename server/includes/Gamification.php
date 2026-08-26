<?php
/**
 * Haviji Sho - Gamification Business Logic & Tier Evaluator
 */

declare(strict_types=1);

require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/TelegramApi.php';

class Gamification {
    public const TIERS = [
        'havij_neshan' => ['min' => 0,  'max' => 9,    'level' => 0, 'title' => 'هویج‌نشان', 'tag' => '🥕 هویج‌نشان'],
        'havij_doost'  => ['min' => 10, 'max' => 19,   'level' => 1, 'title' => 'هویج‌دوست', 'tag' => '🥕 هویج‌دوست'],
        'havij_joo'    => ['min' => 20, 'max' => 29,   'level' => 2, 'title' => 'هویج‌جو',   'tag' => '🥕 هویج‌جو'],
        'havij_baz'    => ['min' => 30, 'max' => 39,   'level' => 3, 'title' => 'هویج‌باز',   'tag' => '🥕 هویج‌باز'],
        'havij_khah'   => ['min' => 40, 'max' => 49,   'level' => 4, 'title' => 'هویج‌خواه', 'tag' => '🥕 هویج‌خواه'],
        'havij_tala'   => ['min' => 50, 'max' => 999999, 'level' => 5, 'title' => 'هویج‌طلا',  'tag' => '👑 هویج‌طلا'],
    ];

    /**
     * Compute tier level key from total coin balance
     */
    public static function getTierLevel(int $coins): string {
        if ($coins >= 50) return 'havij_tala';
        if ($coins >= 40) return 'havij_khah';
        if ($coins >= 30) return 'havij_baz';
        if ($coins >= 20) return 'havij_joo';
        if ($coins >= 10) return 'havij_doost';
        return 'havij_neshan';
    }

    /**
     * Award coins to a user, record log, and check for tier upgrade
     */
    public static function awardCoins(
        int $userId,
        int $amount,
        string $actionType,
        ?int $adminTgId = null,
        ?string $metaReference = null,
        ?string $description = null
    ): array {
        $db = getDb();
        $db->beginTransaction();

        try {
            // Check idempotency if metaReference is provided
            if ($metaReference !== null) {
                $checkStmt = $db->prepare(
                    "SELECT id FROM activity_logs WHERE action_type = ? AND meta_reference = ? LIMIT 1"
                );
                $checkStmt->execute([$actionType, $metaReference]);
                if ($checkStmt->fetch()) {
                    $db->rollBack();
                    return ['success' => false, 'duplicate' => true, 'message' => 'این فعالیت قبلاً ثبت شده است.'];
                }
            }

            // Retrieve current user
            $userStmt = $db->prepare("SELECT * FROM users WHERE id = ? FOR UPDATE");
            $userStmt->execute([$userId]);
            $user = $userStmt->fetch();

            if (!$user) {
                $db->rollBack();
                return ['success' => false, 'message' => 'کاربر یافت نشد.'];
            }

            $oldTier = $user['tier_level'];
            $newCoins = max(0, (int)$user['coins_balance'] + $amount);
            $newTier = self::getTierLevel($newCoins);

            // Update user balance & tier
            $updateStmt = $db->prepare("UPDATE users SET coins_balance = ?, tier_level = ? WHERE id = ?");
            $updateStmt->execute([$newCoins, $newTier, $userId]);

            // Insert activity log
            $logStmt = $db->prepare(
                "INSERT INTO activity_logs (user_id, admin_telegram_id, action_type, coins_amount, meta_reference, description)
                 VALUES (?, ?, ?, ?, ?, ?)"
            );
            $logStmt->execute([$userId, $adminTgId, $actionType, $amount, $metaReference, $description]);

            $db->commit();

            $isUpgraded = ($newTier !== $oldTier) && (self::TIERS[$newTier]['level'] > self::TIERS[$oldTier]['level']);

            // Update Telegram Custom Title / Tag if user upgraded or initially activated
            if ($isUpgraded && !empty($user['telegram_id'])) {
                $tg = new TelegramApi();
                $newTag = self::TIERS[$newTier]['tag'];
                $tg->setChatMemberTag(TELEGRAM_GROUP_CHAT_ID, (int)$user['telegram_id'], $newTag);
            }

            return [
                'success' => true,
                'user_id' => $userId,
                'coins_balance' => $newCoins,
                'old_tier' => $oldTier,
                'new_tier' => $newTier,
                'is_upgraded' => $isUpgraded,
            ];
        } catch (Exception $e) {
            $db->rollBack();
            error_log("Gamification awardCoins failed: " . $e->getMessage());
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
}
