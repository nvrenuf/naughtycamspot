<?php

declare(strict_types=1);

$platform = 'chaturbate';
$destination = 'https://example.com/chaturbate';

$sanitize = static function (string $value): string {
    $clean = preg_replace('/[\x00-\x1F\x7F]+/', ' ', $value);
    return trim($clean ?? '');
};

$logEntry = [
    'timestamp' => gmdate('c'),
    'platform' => $platform,
    'destination' => $destination,
    'ip' => $sanitize($_SERVER['REMOTE_ADDR'] ?? ''),
    'user_agent' => $sanitize($_SERVER['HTTP_USER_AGENT'] ?? ''),
    'referrer' => $sanitize($_SERVER['HTTP_REFERER'] ?? ''),
];

$logDirectory = dirname(__DIR__) . '/logs';
$logPath = $logDirectory . '/outbound.jsonl';

if (!is_dir($logDirectory)) {
    @mkdir($logDirectory, 0755, true);
}

$json = json_encode($logEntry, JSON_UNESCAPED_SLASHES);
if (is_string($json) && is_dir($logDirectory)) {
    @file_put_contents($logPath, $json . PHP_EOL, FILE_APPEND | LOCK_EX);
}

header('Cache-Control: no-store');
header('Location: ' . $destination, true, 302);
exit;

