<?php

declare(strict_types=1);

if (!isset($_SERVER['REQUEST_METHOD']) || strtoupper((string) $_SERVER['REQUEST_METHOD']) !== 'GET') {
    http_response_code(405);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['error' => 'Method not allowed.'], JSON_UNESCAPED_SLASHES);
    exit;
}

init_session();
$token = ensure_csrf_token();

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');

echo json_encode([
    'token' => $token,
], JSON_UNESCAPED_SLASHES);

function init_session(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }

    $secure = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off';
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'secure' => $secure,
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
    session_start();
}

function ensure_csrf_token(): string
{
    $token = $_SESSION['csrf_token'] ?? '';
    if (is_string($token) && preg_match('/^[a-f0-9]{64}$/', $token) === 1) {
        return $token;
    }

    $token = bin2hex(random_bytes(32));
    $_SESSION['csrf_token'] = $token;
    return $token;
}
