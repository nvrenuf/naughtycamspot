<?php
declare(strict_types=1);

header('Cache-Control: no-store');
http_response_code(204);

$sanitizeLogField = static function (string $value): string {
    // Strip control characters so attackers cannot forge log lines.
    $clean = preg_replace('/[\x00-\x1F\x7F]+/', ' ', $value);
    return trim($clean ?? '', " \t\n\r");
};

$slot = isset($_GET['src']) ? $sanitizeLogField((string) $_GET['src']) : '';
$camp = isset($_GET['camp']) ? $sanitizeLogField((string) $_GET['camp']) : '';
$timestamp = gmdate('c');
$ipAddress = $sanitizeLogField($_SERVER['REMOTE_ADDR'] ?? '');
$userAgent = $sanitizeLogField($_SERVER['HTTP_USER_AGENT'] ?? '');

$line = sprintf("%s\t%s\t%s\t%s\t%s\n", $timestamp, $ipAddress, $slot, $camp, $userAgent);

$projectRoot = dirname(__DIR__, 2);
$logDirectory = $projectRoot . '/storage/logs';
$logFile = $logDirectory . '/clicks.log';

if (!is_dir($logDirectory)) {
    @mkdir($logDirectory, 0775, true);
}

if (is_dir($logDirectory) && is_writable($logDirectory)) {
    @file_put_contents($logFile, $line, FILE_APPEND | LOCK_EX);
}
exit;
