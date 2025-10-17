<?php
declare(strict_types=1);

header('Cache-Control: no-store');
http_response_code(204);

$slot = isset($_GET['src']) ? (string) $_GET['src'] : '';
$camp = isset($_GET['camp']) ? (string) $_GET['camp'] : '';
$timestamp = gmdate('c');
$ipAddress = $_SERVER['REMOTE_ADDR'] ?? '';
$userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';

$line = sprintf("%s\t%s\t%s\t%s\t%s\n", $timestamp, $ipAddress, $slot, $camp, $userAgent);

$logDirectory = dirname(__DIR__) . '/logs';
$logFile = $logDirectory . '/clicks.log';

if (!is_dir($logDirectory)) {
    @mkdir($logDirectory, 0775, true);
}

if (is_dir($logDirectory) && is_writable($logDirectory)) {
    @file_put_contents($logFile, $line, FILE_APPEND | LOCK_EX);
}
exit;
