<?php

declare(strict_types=1);

$platform = 'bonga';
$destination = 'https://example.com/bonga';

$sanitize = static function (string $value): string {
    $clean = preg_replace('/[\x00-\x1F\x7F]+/', ' ', $value);
    return trim($clean ?? '');
};

$cid = $sanitize((string) ($_GET['cid'] ?? ''));
$logEntry = [
    'timestamp' => gmdate('c'),
    'cid' => $cid,
    'platform' => $platform,
    'destination' => $destination,
    'ip' => $sanitize($_SERVER['REMOTE_ADDR'] ?? ''),
    'user_agent' => $sanitize($_SERVER['HTTP_USER_AGENT'] ?? ''),
    'referrer' => $sanitize($_SERVER['HTTP_REFERER'] ?? ''),
    'request_uri' => $sanitize($_SERVER['REQUEST_URI'] ?? ''),
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
