# TECH-ARCHITECTURE.md
# Haviji Sho (هویجی شو) — Technical Architecture & Database Contracts

## 1. System Topology
- **Frontend**: Next.js (SSG / Static Export) on GitHub Pages (`frontchapter.ir`).
- **Backend**: PHP 8.2+ with PDO / MySQL on host (`roostkit.site`).
- **Telegram Bot**: Official Telegram Bot API Webhook handling updates.

---

## 2. MySQL Database Schema

```sql
CREATE DATABASE IF NOT EXISTS `frontchapter_havij` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `frontchapter_havij`;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `events` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `slug` VARCHAR(128) UNIQUE NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `event_type` ENUM('ONLINE_MEET', 'OFFLINE_WORKSHOP', 'ANNUAL_CONF') NOT NULL,
  `event_date` DATETIME NOT NULL,
  `reward_coins` INT UNSIGNED NOT NULL DEFAULT 2,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `attendances` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `event_id` INT UNSIGNED NOT NULL,
  `user_id` INT UNSIGNED NOT NULL,
  `verified_by` VARCHAR(64) NOT NULL DEFAULT 'AUTO_SCRIPT',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uniq_event_user` (`event_id`, `user_id`),
  FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

## 3. REST API Contracts (PHP Backend)

Base URL: `https://roostkit.site/api/v1`

### `POST /auth/telegram-verify`
- Validates hash from widget and checks if user profile already exists.

### `POST /onboarding/complete`
- Saves user profile, accepts rules, un-restricts user on Telegram, sets initial tag.

### `GET /community/members`
- Returns paginated list of public members sorted by `coins_balance` descending.

### `POST /events/sync-attendance`
- Internal endpoint protected with `X-API-KEY` for automated Google Apps Script ingestion.