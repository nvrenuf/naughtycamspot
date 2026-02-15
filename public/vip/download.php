<?php

declare(strict_types=1);

header('X-Robots-Tag: noindex', true);
header('Cache-Control: no-store');

$sanitize = static function (string $value): string {
    $clean = preg_replace('/[\x00-\x1F\x7F]+/', ' ', $value);
    return trim($clean ?? '');
};

$token = $sanitize((string) ($_GET['token'] ?? ''));
$requestedFile = $sanitize((string) ($_GET['file'] ?? ''));

$logDirectory = dirname(__DIR__) . '/logs';
$tokensPath = $logDirectory . '/vip_tokens.jsonl';
$downloadsPath = $logDirectory . '/vip_downloads.jsonl';

$allowed = false;
$status = 'forbidden';

$tokenRecord = null;
if ($token !== '' && $requestedFile !== '') {
    $tokenRecord = find_token_record($tokensPath, $token);
    if (is_array($tokenRecord)) {
        $allowedFiles = $tokenRecord['allowed_files'] ?? null;
        if (is_array($allowedFiles) && in_array($requestedFile, $allowedFiles, true)) {
            $allowed = true;
        }
    }
}

if (!$allowed) {
    write_download_log($downloadsPath, build_download_log_entry($sanitize, $requestedFile, $token, $status));
    http_response_code(403);
    header('Content-Type: text/plain; charset=utf-8');
    echo "Forbidden\n";
    exit;
}

// Additional guard: only allow simple filenames, no slashes or dot-dot.
if (!is_safe_filename($requestedFile)) {
    $status = 'forbidden';
    write_download_log($downloadsPath, build_download_log_entry($sanitize, $requestedFile, $token, $status));
    http_response_code(403);
    header('Content-Type: text/plain; charset=utf-8');
    echo "Forbidden\n";
    exit;
}

$assetRoot = __DIR__;
$resolvedRoot = realpath($assetRoot);
$resolvedPath = realpath($assetRoot . '/' . $requestedFile);

if (!is_string($resolvedRoot) || $resolvedRoot === '' || !is_string($resolvedPath) || $resolvedPath === '') {
    $status = 'not_found';
    write_download_log($downloadsPath, build_download_log_entry($sanitize, $requestedFile, $token, $status));
    http_response_code(404);
    header('Content-Type: text/plain; charset=utf-8');
    echo "Not found\n";
    exit;
}

$prefix = $resolvedRoot . DIRECTORY_SEPARATOR;
if (strpos($resolvedPath, $prefix) !== 0 || !is_file($resolvedPath) || !is_readable($resolvedPath)) {
    $status = 'not_found';
    write_download_log($downloadsPath, build_download_log_entry($sanitize, $requestedFile, $token, $status));
    http_response_code(404);
    header('Content-Type: text/plain; charset=utf-8');
    echo "Not found\n";
    exit;
}

$status = 'ok';
write_download_log($downloadsPath, build_download_log_entry($sanitize, $requestedFile, $token, $status));

$mimeType = resolve_mime_type($resolvedPath);
$downloadName = basename($requestedFile);

header('Content-Type: ' . $mimeType);
header('Content-Disposition: attachment; filename="' . rawurlencode($downloadName) . '"');
header('X-Content-Type-Options: nosniff');

@readfile($resolvedPath);
exit;

function is_safe_filename(string $filename): bool
{
    if ($filename === '' || strlen($filename) > 200) {
        return false;
    }

    if (strpos($filename, '/') !== false || strpos($filename, '\\') !== false) {
        return false;
    }

    if (strpos($filename, '..') !== false) {
        return false;
    }

    return (bool) preg_match('/\A[a-zA-Z0-9][a-zA-Z0-9._-]*\z/', $filename);
}

function find_token_record(string $path, string $token): ?array
{
    if (!is_file($path) || !is_readable($path)) {
        return null;
    }

    $lines = @file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if (!is_array($lines)) {
        return null;
    }

    foreach ($lines as $line) {
        $decoded = json_decode($line, true);
        if (!is_array($decoded)) {
            continue;
        }

        $candidate = (string) ($decoded['token'] ?? '');
        if ($candidate !== '' && hash_equals($candidate, $token)) {
            $expiresAt = (string) ($decoded['expires_at'] ?? '');
            if ($expiresAt !== '') {
                $expiresTimestamp = strtotime($expiresAt);
                if ($expiresTimestamp !== false && $expiresTimestamp < time()) {
                    return null;
                }
            }

            return $decoded;
        }
    }

    return null;
}

function build_download_log_entry(callable $sanitize, string $requestedFile, string $token, string $status): array
{
    $tokenHash = $token === '' ? '' : hash('sha256', $token);

    return [
        'timestamp' => gmdate('c'),
        'status' => $sanitize($status),
        'file' => $sanitize($requestedFile),
        'token_sha256' => $sanitize($tokenHash),
        'token_prefix' => $sanitize($token === '' ? '' : substr($token, 0, 8)),
        'ip' => $sanitize($_SERVER['REMOTE_ADDR'] ?? ''),
        'user_agent' => $sanitize($_SERVER['HTTP_USER_AGENT'] ?? ''),
        'referrer' => $sanitize($_SERVER['HTTP_REFERER'] ?? ''),
        'request_uri' => $sanitize($_SERVER['REQUEST_URI'] ?? ''),
    ];
}

function write_download_log(string $path, array $entry): void
{
    $dir = dirname($path);
    if (!is_dir($dir)) {
        @mkdir($dir, 0755, true);
    }

    $json = json_encode($entry, JSON_UNESCAPED_SLASHES);
    if (is_string($json) && is_dir($dir)) {
        @file_put_contents($path, $json . PHP_EOL, FILE_APPEND | LOCK_EX);
    }
}

function resolve_mime_type(string $path): string
{
    $extension = strtolower(pathinfo($path, PATHINFO_EXTENSION));
    if ($extension === 'pdf') {
        return 'application/pdf';
    }

    if ($extension === 'txt') {
        return 'text/plain; charset=utf-8';
    }

    return 'application/octet-stream';
}
