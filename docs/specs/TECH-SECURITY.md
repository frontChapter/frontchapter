# TECH-SECURITY.md
# Haviji Sho (هویجی شو) — Security, CORS & Verification

## 1. Cryptographic Telegram Hash Verification (PHP)
Every authentication payload from Telegram Login Widget must be verified using HMAC-SHA256:

```php
<?php
function verifyTelegramAuth(array $authData, string $botToken): bool {
    if (!isset($authData['hash']) || !isset($authData['auth_date'])) {
        return false;
    }
    
    $checkHash = $authData['hash'];
    unset($authData['hash']);
    
    $dataCheckArr = [];
    foreach ($authData as $key => $value) {
        $dataCheckArr[] = $key . '=' . $value;
    }
    sort($dataCheckArr);
    $dataCheckString = implode("
", $dataCheckArr);
    
    $secretKey = hash('sha256', $botToken, true);
    $hash = hash_hmac('sha256', $dataCheckString, $secretKey);
    
    if (!hash_equals($hash, $checkHash)) {
        return false;
    }
    
    // Check if auth is older than 24 hours
    if ((time() - (int)$authData['auth_date']) > 86400) {
        return false;
    }
    
    return true;
}
```

---

## 2. CORS Handling for Static Next.js Frontend
Because the frontend is hosted on `frontchapter.ir` and backend on `roostkit.site`:

```php
<?php
// cors.php - include at the top of every PHP API endpoint
header("Access-Control-Allow-Origin: https://frontchapter.ir");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-API-KEY");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}
```

---

## 3. Bot Command Rate Limiting & Admin Guard
- Webhook must verify that any user issuing `/useful` belongs to an authorized admin list or has Telegram admin permissions (`getChatMember.status in ['creator', 'administrator']`).
- Reject actions where target user is the admin themselves (prevent self-awarding).