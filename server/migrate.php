<?php

/**
 * Haviji Sho - Database Schema & Seed Migration Runner
 * Protected by X-API-KEY header
 */

declare(strict_types=1);

require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/includes/Security.php';

if (!verifyInternalApiKey()) {
    http_response_code(403);
    echo json_encode(['success' => false, 'error' => 'Forbidden: Invalid X-API-KEY header']);
    exit;
}

$db = getDb();

try {
    // 1. Create Users Table
    $db->exec("
        CREATE TABLE IF NOT EXISTS `users` (
          `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
          `telegram_id` BIGINT UNSIGNED UNIQUE NOT NULL,
          `username` VARCHAR(64) NULL,
          `first_name` VARCHAR(128) NOT NULL,
          `last_name` VARCHAR(128) NULL,
          `email` VARCHAR(191) NULL UNIQUE,
          `job_title` VARCHAR(128) NULL,
          `bio` TEXT NULL,
          `avatar_url` TEXT NULL,
          `coins_balance` INT UNSIGNED NOT NULL DEFAULT 0,
          `tier_level` ENUM('havij_neshan', 'havij_doost', 'havij_joo', 'havij_baz', 'havij_khah', 'havij_tala') NOT NULL DEFAULT 'havij_neshan',
          `is_public` TINYINT(1) NOT NULL DEFAULT 1,
          `is_restricted` TINYINT(1) NOT NULL DEFAULT 0,
          `rules_accepted_at` DATETIME NULL,
          `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX `idx_coins` (`coins_balance` DESC),
          INDEX `idx_tier` (`tier_level`),
          INDEX `idx_public` (`is_public`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");

    // 2. Create Activity Logs Table
    $db->exec("
        CREATE TABLE IF NOT EXISTS `activity_logs` (
          `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
          `user_id` INT UNSIGNED NOT NULL,
          `admin_telegram_id` BIGINT UNSIGNED NULL,
          `action_type` VARCHAR(64) NOT NULL,
          `coins_amount` INT NOT NULL,
          `meta_reference` VARCHAR(255) NULL,
          `description` TEXT NULL,
          `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
          INDEX `idx_user_action` (`user_id`, `action_type`),
          UNIQUE KEY `uniq_ref_action` (`action_type`, `meta_reference`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");

    // 3. Create Events Table
    $db->exec("
        CREATE TABLE IF NOT EXISTS `events` (
          `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
          `slug` VARCHAR(128) UNIQUE NOT NULL,
          `title` VARCHAR(255) NOT NULL,
          `event_type` ENUM('ONLINE_MEET', 'OFFLINE_WORKSHOP', 'ANNUAL_CONF') NOT NULL,
          `event_date` DATETIME NOT NULL,
          `reward_coins` INT UNSIGNED NOT NULL DEFAULT 2,
          `is_active` TINYINT(1) NOT NULL DEFAULT 1,
          `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");

    // 4. Create Attendances Table
    $db->exec("
        CREATE TABLE IF NOT EXISTS `attendances` (
          `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
          `event_id` INT UNSIGNED NOT NULL,
          `user_id` INT UNSIGNED NOT NULL,
          `verified_by` VARCHAR(64) NOT NULL DEFAULT 'AUTO_SCRIPT',
          `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE KEY `uniq_event_user` (`event_id`, `user_id`),
          FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE CASCADE,
          FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");

    // Check current count
    $count = (int)$db->query("SELECT COUNT(*) FROM users")->fetchColumn();

    // If empty, insert migrated members
    if ($count === 0) {
        $seedUsers = [
            [1, 345447718, 'OrdinarySaleh', 'Saleh', null, null, 'تازه‌وارد / در حال یادگیری · توسعه موبایل', 'تازه‌واردم و مشتاق آشنایی با جامعه و یادگیری از تجربه‌های دیگران.', 'https://t.me/i/userpic/320/fIgE93I6zf4Ft4t3-6yzlSM3QfTH-xCei6u8E3SOtMk.jpg', 25, 'havij_joo', 1, 0, '2026-08-05 22:21:12'],
            [2, 7003149065, 'FrontChapterSupport', 'FrontChapter', 'Support', null, 'لید / مدیر / بنیان‌گذار · مهندسی نرم‌افزار · توسعه موبایل', null, 'https://t.me/i/userpic/320/5YEmP0qJ88OcUO8h7g4FQSP6wINfmt4rcyWJY63e_Z7EYtUgCqXogfgMdwitezDI.jpg', 10, 'havij_doost', 1, 0, '2026-08-05 23:33:09'],
            [3, 712321052, 'Amirhossein_Zareian', 'Amirhossein', null, null, 'Front-end', null, 'https://t.me/i/userpic/320/cx_8PiA11Bmx0xtZc113Xdv8V6aGBe3blloT2PiMpx8.jpg', 10, 'havij_doost', 1, 0, '2026-08-03 19:57:48'],
            [4, 1136200187, 'mohammad11jj', 'M', 'J', null, null, null, null, 0, 'havij_neshan', 1, 0, null],
            [5, 8362972701, null, 'Dynamicphernia', null, null, 'Nextjs Developr', null, 'https://t.me/i/userpic/320/px4iVLgTx1H6R75ILpCI6hRCN1A1ogQaT_MpqWGYBt9AXyRF22xNlZQR88YVKYsA.jpg', 10, 'havij_doost', 1, 0, '2026-08-04 05:56:47'],
            [6, 6920692676, null, 'ESN', null, null, 'ابتدای مسیر (۰–۲ سال) · مهندسی نرم‌افزار', 'تازه‌واردم و مشتاق آشنایی با جامعه و یادگیری از تجربه‌های دیگران.', null, 10, 'havij_doost', 1, 0, '2026-08-14 17:49:49'],
            [7, 89239080, 'lokiwich', 'LokiWich', null, null, null, null, 'https://t.me/i/userpic/320/69-pyq9XF0BK3pIWIB_VnIAYnHTrnqRAXxUC6rF8BBY.jpg', 0, 'havij_neshan', 1, 0, null],
        ];

        $insStmt = $db->prepare("
            INSERT INTO users (id, telegram_id, username, first_name, last_name, email, job_title, bio, avatar_url, coins_balance, tier_level, is_public, is_restricted, rules_accepted_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");

        foreach ($seedUsers as $u) {
            $insStmt->execute($u);
        }
    }

    $finalCount = (int)$db->query("SELECT COUNT(*) FROM users")->fetchColumn();

    echo json_encode([
        'success' => true,
        'message' => 'Database tables and seed data initialized successfully!',
        'total_users' => $finalCount,
    ], JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
    ], JSON_UNESCAPED_UNICODE);
}
