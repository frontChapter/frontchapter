<?php

/**
 * Haviji Sho - CORS Handler
 * Handles cross-origin requests from frontchapter.ir and localhost during development
 */

declare(strict_types=1);

require_once __DIR__ . '/config.php';

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOrigins = [
    'https://frontchapter.ir',
    'https://www.frontchapter.ir',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
];

if (in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: {$origin}");
} else {
    header("Access-Control-Allow-Origin: " . FRONTEND_ORIGIN);
}

header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-API-KEY");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Max-Age: 86400");
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}
