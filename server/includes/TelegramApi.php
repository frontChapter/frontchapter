<?php
/**
 * Haviji Sho - Telegram Bot API Client Wrapper
 */

declare(strict_types=1);

require_once __DIR__ . '/../config.php';

class TelegramApi {
    private string $botToken;
    private string $baseUrl;

    public function __construct(?string $botToken = null) {
        $this->botToken = $botToken ?: TELEGRAM_BOT_TOKEN;
        $this->baseUrl = "https://api.telegram.org/bot{$this->botToken}";
    }

    /**
     * Send HTTP POST request to Telegram Bot API
     */
    private function request(string $method, array $params = []): array {
        $url = "{$this->baseUrl}/{$method}";

        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => $url,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode($params),
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
            CURLOPT_TIMEOUT => 10,
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);

        if ($error) {
            error_log("TelegramApi Error ({$method}): {$error}");
            return ['ok' => false, 'error' => $error];
        }

        $decoded = json_decode((string)$response, true);
        if (!$decoded || empty($decoded['ok'])) {
            error_log("TelegramApi API Failed ({$method}, HTTP {$httpCode}): " . ($response ?: 'Empty response'));
        }

        return $decoded ?: ['ok' => false, 'http_code' => $httpCode];
    }

    /**
     * Send message to a chat/user
     */
    public function sendMessage(int|string $chatId, string $text, array $extra = []): array {
        $params = array_merge([
            'chat_id' => $chatId,
            'text' => $text,
            'parse_mode' => 'HTML',
        ], $extra);

        return $this->request('sendMessage', $params);
    }

    /**
     * Restrict or un-restrict member permissions in a group chat
     */
    public function restrictChatMember(int|string $chatId, int $userId, array $permissions, int $untilDate = 0): array {
        return $this->request('restrictChatMember', [
            'chat_id' => $chatId,
            'user_id' => $userId,
            'permissions' => $permissions,
            'until_date' => $untilDate,
        ]);
    }

    /**
     * Unlock standard member permissions for verified users
     */
    public function unlockMember(int|string $chatId, int $userId): array {
        $permissions = [
            'can_send_messages' => true,
            'can_send_audios' => true,
            'can_send_documents' => true,
            'can_send_photos' => true,
            'can_send_videos' => true,
            'can_send_video_notes' => true,
            'can_send_voice_notes' => true,
            'can_send_polls' => true,
            'can_send_other_messages' => true,
            'can_add_web_page_previews' => true,
            'can_change_info' => false,
            'can_invite_users' => true,
            'can_pin_messages' => false,
        ];

        return $this->restrictChatMember($chatId, $userId, $permissions);
    }

    /**
     * Restrict member from sending messages (used when new user joins)
     */
    public function muteMember(int|string $chatId, int $userId): array {
        $permissions = [
            'can_send_messages' => false,
            'can_send_audios' => false,
            'can_send_documents' => false,
            'can_send_photos' => false,
            'can_send_videos' => false,
            'can_send_video_notes' => false,
            'can_send_voice_notes' => false,
            'can_send_polls' => false,
            'can_send_other_messages' => false,
            'can_add_web_page_previews' => false,
        ];

        return $this->restrictChatMember($chatId, $userId, $permissions);
    }

    /**
     * Set custom administrator title / tag (setChatMemberTag / setChatAdministratorCustomTitle)
     * In Telegram Supergroups, custom title is set via setChatAdministratorCustomTitle.
     */
    public function setChatMemberTag(int|string $chatId, int $userId, string $customTitle): array {
        // Truncate custom title to max 16 chars as enforced by Telegram Bot API
        $tag = mb_substr($customTitle, 0, 16, 'UTF-8');

        // First attempt setting custom title
        $result = $this->request('setChatAdministratorCustomTitle', [
            'chat_id' => $chatId,
            'user_id' => $userId,
            'custom_title' => $tag,
        ]);

        return $result;
    }

    /**
     * Get chat member status
     */
    public function getChatMember(int|string $chatId, int $userId): array {
        return $this->request('getChatMember', [
            'chat_id' => $chatId,
            'user_id' => $userId,
        ]);
    }

    /**
     * Check if user is administrator or creator
     */
    public function isChatAdmin(int|string $chatId, int $userId): bool {
        $res = $this->getChatMember($chatId, $userId);
        if (!empty($res['ok']) && !empty($res['result']['status'])) {
            $status = $res['result']['status'];
            return in_array($status, ['creator', 'administrator'], true);
        }
        return false;
    }
}
