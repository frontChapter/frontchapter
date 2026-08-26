<?php
/**
 * Haviji Sho - Security & Cryptographic Verifications
 */

declare(strict_types=1);

require_once __DIR__ . '/../config.php';

/**
 * Verify cryptographic hash from Telegram Login Widget
 * 
 * @param array $authData Key-value array from Telegram login widget payload
 * @param string|null $botToken Telegram bot token
 * @return bool True if signature matches and payload is within valid TTL (24h)
 */
function verifyTelegramAuth(array $authData, ?string $botToken = null): bool {
    $token = $botToken ?: TELEGRAM_BOT_TOKEN;

    if (empty($authData['hash']) || empty($authData['auth_date'])) {
        return false;
    }

    $checkHash = (string)$authData['hash'];
    $dataToCheck = $authData;
    unset($dataToCheck['hash']);

    $dataCheckArr = [];
    foreach ($dataToCheck as $key => $value) {
        if ($value !== null) {
            $dataCheckArr[] = $key . '=' . $value;
        }
    }
    sort($dataCheckArr);
    $dataCheckString = implode("\n", $dataCheckArr);

    $secretKey = hash('sha256', $token, true);
    $calculatedHash = hash_hmac('sha256', $dataCheckString, $secretKey);

    if (!hash_equals($calculatedHash, $checkHash)) {
        return false;
    }

    // Reject payload older than 24 hours (86400s)
    if ((time() - (int)$authData['auth_date']) > 86400) {
        return false;
    }

    return true;
}

/**
 * Validate internal API Key header
 */
function verifyInternalApiKey(): bool {
    $headerKey = $_SERVER['HTTP_X_API_KEY'] ?? $_SERVER['X_API_KEY'] ?? null;
    if (!$headerKey) {
        return false;
    }
    return hash_equals(INTERNAL_API_KEY, $headerKey);
}
