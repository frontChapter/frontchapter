<?php
/**
 * Haviji Sho - Telegram Bot Webhook Dispatcher
 * Handles new_chat_members gatekeeping & /useful / +هویج community recognition
 */

declare(strict_types=1);

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/includes/TelegramApi.php';
require_once __DIR__ . '/includes/Gamification.php';

// Acknowledge Telegram Webhook immediately
http_response_code(200);
header('Content-Type: application/json');

$rawInput = file_get_contents('php://input');
if (empty($rawInput)) {
    echo json_encode(['ok' => true]);
    exit;
}

$update = json_decode($rawInput, true);
if (!$update) {
    echo json_encode(['ok' => true]);
    exit;
}

$tg = new TelegramApi();
$db = getDb();

// 1. Handle New Chat Members (Gatekeeper Flow)
if (!empty($update['message']['new_chat_members'])) {
    $message = $update['message'];
    $chatId = $message['chat']['id'];

    foreach ($message['new_chat_members'] as $newMember) {
        $memberId = (int)$newMember['id'];
        $isBot = !empty($newMember['is_bot']);
        if ($isBot) {
            continue;
        }

        $memberName = trim($newMember['first_name'] . ' ' . ($newMember['last_name'] ?? ''));

        // Check if user is already verified and has accepted rules in DB
        $stmt = $db->prepare("SELECT * FROM users WHERE telegram_id = ? AND rules_accepted_at IS NOT NULL LIMIT 1");
        $stmt->execute([$memberId]);
        $existing = $stmt->fetch();

        if ($existing) {
            // Already verified member: unlock permissions & apply current tag
            $tg->unlockMember($chatId, $memberId);
            $tierTag = Gamification::TIERS[$existing['tier_level']]['tag'] ?? '🥕 هویج‌نشان';
            $tg->setChatMemberTag($chatId, $memberId, $tierTag);

            $tg->sendMessage($chatId, "سلام {$memberName} عزیز! خوش آمدی دوباره به فرانت‌چپتر 🥕\nنشان شما: <b>{$tierTag}</b>");
        } else {
            // New unverified user: restrict chat permissions until onboarded
            $tg->muteMember($chatId, $memberId);

            $joinUrl = FRONTEND_ORIGIN . "/join?tg_id={$memberId}&chat_id={$chatId}";
            $welcomeText = "سلام <b>{$memberName}</b> عزیز! 👋\nبه جمع توسعه‌دهندگان <b>فرانت‌چپتر</b> خوش آمدید.\n\nبرای شروع گفتگو، لطفا مرام‌نامه جامعه را تایید کنید و نشان هویجی خود را دریافت نمایید 🥕";

            $inlineKeyboard = [
                'inline_keyboard' => [
                    [
                        [
                            'text' => '🥕 برای تایید عضویت و هویجی شدن کلیک کنید',
                            'url' => $joinUrl,
                        ],
                    ],
                ],
            ];

            $tg->sendMessage($chatId, $welcomeText, [
                'reply_markup' => json_encode($inlineKeyboard),
            ]);
        }
    }

    echo json_encode(['ok' => true]);
    exit;
}

// 2. Handle /useful or +هویج Recognition (Admin Reward Flow)
if (!empty($update['message']['text']) && !empty($update['message']['reply_to_message'])) {
    $message = $update['message'];
    $text = trim($message['text']);
    $chatId = $message['chat']['id'];
    $adminSender = $message['from'];
    $adminId = (int)$adminSender['id'];

    // Check trigger command
    $isUsefulCommand = ($text === '/useful' || $text === '+هویج' || mb_strpos($text, '/useful@') === 0 || $text === 'هویج+');

    if ($isUsefulCommand) {
        $replyTo = $message['reply_to_message'];
        $targetUser = $replyTo['from'] ?? null;
        $targetMsgId = (int)$replyTo['message_id'];

        if (!$targetUser || !empty($targetUser['is_bot'])) {
            $tg->sendMessage($chatId, '❌ امکان اهدای هویج به ربات‌ها وجود ندارد.');
            echo json_encode(['ok' => true]);
            exit;
        }

        $targetTgId = (int)$targetUser['id'];

        // Guard: Prevent self-rewarding
        if ($adminId === $targetTgId) {
            $tg->sendMessage($chatId, '😄 شما نمی‌توانید به پیام خودتان هویج اهدا کنید!');
            echo json_encode(['ok' => true]);
            exit;
        }

        // Guard: Check if sender is admin in this chat
        if (!$tg->isChatAdmin($chatId, $adminId)) {
            $tg->sendMessage($chatId, '⚠️ تنها ادمین‌های جامعه می‌توانند با کامند /useful یا +هویج امتیاز اهدا کنند.');
            echo json_encode(['ok' => true]);
            exit;
        }

        // Retrieve or auto-create target user in database
        $userStmt = $db->prepare("SELECT * FROM users WHERE telegram_id = ? LIMIT 1");
        $userStmt->execute([$targetTgId]);
        $userRecord = $userStmt->fetch();

        if (!$userRecord) {
            // Auto-create basic user record
            $createStmt = $db->prepare(
                "INSERT INTO users (telegram_id, username, first_name, last_name, coins_balance, tier_level, is_public)
                 VALUES (?, ?, ?, ?, 0, 'havij_neshan', 1)"
            );
            $createStmt->execute([
                $targetTgId,
                $targetUser['username'] ?? null,
                $targetUser['first_name'] ?? 'User',
                $targetUser['last_name'] ?? null,
            ]);
            $userId = (int)$db->lastInsertId();
            $targetDisplayName = $targetUser['first_name'];
        } else {
            $userId = (int)$userRecord['id'];
            $targetDisplayName = $userRecord['first_name'];
        }

        // Award +1 coin with message idempotency
        $metaReference = "tg_msg_{$chatId}_{$targetMsgId}";
        $result = Gamification::awardCoins(
            $userId,
            1,
            'USEFUL_REPLY',
            $adminId,
            $metaReference,
            "پاسخ یا بحث مفید در گروه (Message #{$targetMsgId})"
        );

        if (empty($result['success'])) {
            if (!empty($result['duplicate'])) {
                $tg->sendMessage($chatId, 'ℹ️ برای این پیام قبلاً هویج ثبت شده است.', [
                    'reply_to_message_id' => $message['message_id'],
                ]);
            }
            echo json_encode(['ok' => true]);
            exit;
        }

        $newBalance = $result['coins_balance'];
        $newTierKey = $result['new_tier'];
        $tierConfig = Gamification::TIERS[$newTierKey];

        $replyText = "🥕 <b>+۱ هویج</b> توسط ادمین به <b>{$targetDisplayName}</b> اهدا شد!\n"
                   . "📊 موجودی کل: <b>{$newBalance} هویج</b>\n"
                   . "سطح فعلی: <b>{$tierConfig['tag']}</b>";

        if (!empty($result['is_upgraded'])) {
            $replyText .= "\n\n🎉 <b>تبریک!</b> سطح شما ارتقا یافت به: <b>{$tierConfig['tag']}</b> 👑\nتگ شما در گروه به‌روزرسانی شد!";
        }

        $tg->sendMessage($chatId, $replyText, [
            'reply_to_message_id' => $targetMsgId,
        ]);
    }
}

echo json_encode(['ok' => true]);
