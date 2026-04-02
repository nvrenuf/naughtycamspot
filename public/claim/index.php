<?php
declare(strict_types=1);

const NCS_CLAIM_REQUIRED_FIELDS = [
    'preferred_model_name',
    'closest_stage',
    'current_stage',
    'live_status',
    'platform_interest',
    'main_problem',
    'preferred_contact_method',
    'contact',
];

const NCS_ALLOWED_PLATFORM_INTERESTS = [
    'chaturbate',
    'camsoda',
    'bongacams',
    'fansly',
];

if (strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    respondWithError(405, 'Method not allowed.');
}

$input = collectInput($_POST);
$validationErrors = validateInput($input);

if ($validationErrors !== []) {
    logNotificationEvent('validation_failed', [
        'errors' => $validationErrors,
        'preferred_model_name' => $input['preferred_model_name'] ?? '',
        'source_page' => $input['source_page'] ?? '',
    ]);
    respondWithError(422, 'Please complete the required fields and try again.');
}

$leadRecord = buildLeadRecord($input);
$storageResult = persistLead($leadRecord);

if (!$storageResult['ok']) {
    logNotificationEvent('lead_storage_failed', [
        'reason' => $storageResult['error'],
        'preferred_model_name' => $leadRecord['preferred_model_name'] ?? '',
    ]);
    respondWithError(500, 'We could not save your application right now. Please try again shortly.');
}

$notificationResult = notifyTelegram($leadRecord);
if (!$notificationResult['ok']) {
    logNotificationEvent('telegram_notify_failed', [
        'reason' => $notificationResult['error'],
        'preferred_model_name' => $leadRecord['preferred_model_name'] ?? '',
        'closest_stage' => $leadRecord['closest_stage'] ?? '',
    ]);
}

header('Cache-Control: no-store');
header('Location: /claim/success.html', true, 303);
exit;

function respondWithError(int $status, string $message): void
{
    http_response_code($status);
    header('Content-Type: text/plain; charset=utf-8');
    header('Cache-Control: no-store');
    echo $message;
    exit;
}

function collectInput(array $source): array
{
    $fields = [
        'program',
        'source_page',
        'preferred_model_name',
        'alternate_model_names',
        'closest_stage',
        'current_stage',
        'live_status',
        'platform_interest',
        'current_platforms',
        'current_handles',
        'main_problem',
        'main_problem_other',
        'preferred_contact_method',
        'contact',
        'notes',
    ];

    $result = [];
    foreach ($fields as $field) {
        $value = $source[$field] ?? '';
        $result[$field] = normalizeInputValue($value);
    }

    return $result;
}

function normalizeInputValue(mixed $value): string
{
    if (is_array($value)) {
        foreach ($value as $item) {
            if (is_string($item)) {
                $normalized = normalizeField($item);
                if ($normalized !== '') {
                    return $normalized;
                }
            }
        }

        return '';
    }

    return normalizeField(is_string($value) ? $value : '');
}

function normalizeField(string $value): string
{
    $clean = preg_replace('/[\x00-\x08\x0B-\x1F\x7F]+/', ' ', $value);
    $collapsed = preg_replace('/\s+/u', ' ', trim((string) $clean));
    return trim((string) $collapsed);
}

function validateInput(array $input): array
{
    $errors = [];

    foreach (NCS_CLAIM_REQUIRED_FIELDS as $field) {
        if (($input[$field] ?? '') === '') {
            $errors[] = $field;
        }
    }

    if (($input['preferred_model_name'] ?? '') !== '' && mb_strlen($input['preferred_model_name']) > 80) {
        $errors[] = 'preferred_model_name_length';
    }

    if (($input['contact'] ?? '') !== '' && mb_strlen($input['contact']) > 200) {
        $errors[] = 'contact_length';
    }

    if (($input['notes'] ?? '') !== '' && mb_strlen($input['notes']) > 2000) {
        $errors[] = 'notes_length';
    }

    if (($input['platform_interest'] ?? '') !== '' && !in_array($input['platform_interest'], NCS_ALLOWED_PLATFORM_INTERESTS, true)) {
        $errors[] = 'platform_interest_invalid';
    }

    return array_values(array_unique($errors));
}

function buildLeadRecord(array $input): array
{
    $timestamp = gmdate('c');

    return [
        'timestamp' => $timestamp,
        'program' => $input['program'] !== '' ? $input['program'] : 'founding-model-program',
        'source_page' => $input['source_page'] !== '' ? $input['source_page'] : '/apply/',
        'preferred_model_name' => $input['preferred_model_name'],
        'alternate_model_names' => $input['alternate_model_names'],
        'closest_stage' => $input['closest_stage'],
        'current_stage' => $input['current_stage'],
        'live_status' => $input['live_status'],
        'platform_interest' => $input['platform_interest'],
        'current_platforms' => $input['current_platforms'],
        'current_handles' => $input['current_handles'],
        'main_problem' => $input['main_problem'],
        'main_problem_other' => $input['main_problem_other'],
        'preferred_contact_method' => $input['preferred_contact_method'],
        'contact' => $input['contact'],
        'notes' => $input['notes'],
        'request_ip' => normalizeField($_SERVER['REMOTE_ADDR'] ?? ''),
        'user_agent' => normalizeField($_SERVER['HTTP_USER_AGENT'] ?? ''),
        'referer' => normalizeField($_SERVER['HTTP_REFERER'] ?? ''),
    ];
}

function persistLead(array $record): array
{
    $logDir = resolveLogDirectory();
    if ($logDir === '') {
        return ['ok' => false, 'error' => 'no_writable_log_directory'];
    }

    $file = $logDir . '/founding-model-applications.jsonl';
    $line = json_encode($record, JSON_UNESCAPED_SLASHES);

    if (!is_string($line)) {
        return ['ok' => false, 'error' => 'json_encode_failed'];
    }

    $bytes = @file_put_contents($file, $line . PHP_EOL, FILE_APPEND | LOCK_EX);
    if ($bytes === false) {
        return ['ok' => false, 'error' => 'file_append_failed'];
    }

    return ['ok' => true, 'path' => $file];
}

function resolveLogDirectory(): string
{
    $explicit = normalizeField(envValue('NCS_LEAD_LOG_DIR'));
    $candidates = [];
    if ($explicit !== '') {
        $candidates[] = $explicit;
    }

    $webRoot = dirname(__DIR__);
    $parentRoot = dirname($webRoot);

    $candidates[] = $parentRoot . '/storage/logs';
    $candidates[] = $webRoot . '/storage/logs';
    $candidates[] = $webRoot . '/logs';

    foreach ($candidates as $candidate) {
        if (ensureWritableDir($candidate)) {
            protectLogDirectory($candidate, $webRoot);
            return $candidate;
        }
    }

    return '';
}

function ensureWritableDir(string $path): bool
{
    if ($path === '') {
        return false;
    }

    if (!is_dir($path) && !@mkdir($path, 0775, true) && !is_dir($path)) {
        return false;
    }

    return is_dir($path) && is_writable($path);
}

function protectLogDirectory(string $path, string $webRoot): void
{
    $normalizedPath = rtrim(str_replace('\\', '/', $path), '/');
    $normalizedRoot = rtrim(str_replace('\\', '/', $webRoot), '/');

    if (strpos($normalizedPath, $normalizedRoot) !== 0) {
      return;
    }

    $htaccess = $path . '/.htaccess';
    if (!file_exists($htaccess)) {
        @file_put_contents($htaccess, "Require all denied\n");
    }
}

function notifyTelegram(array $record): array
{
    $botToken = normalizeField(envValue('NCS_TELEGRAM_BOT_TOKEN'));
    $chatId = normalizeField(envValue('NCS_TELEGRAM_CHAT_ID'));

    if ($botToken === '' || $chatId === '') {
        return ['ok' => false, 'error' => 'telegram_env_missing'];
    }

    $message = buildTelegramMessage($record);
    $payload = http_build_query([
        'chat_id' => $chatId,
        'text' => $message,
        'disable_web_page_preview' => 'true',
    ]);

    $endpoint = sprintf('https://api.telegram.org/bot%s/sendMessage', rawurlencode($botToken));
    $ch = curl_init($endpoint);
    if ($ch === false) {
        return ['ok' => false, 'error' => 'curl_init_failed'];
    }

    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $payload,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 8,
        CURLOPT_CONNECTTIMEOUT => 5,
        CURLOPT_HTTPHEADER => ['Content-Type: application/x-www-form-urlencoded'],
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_SSL_VERIFYHOST => 2,
    ]);

    $response = curl_exec($ch);
    $curlError = $response === false ? curl_error($ch) : '';
    $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($response === false) {
        return ['ok' => false, 'error' => 'telegram_curl_error:' . normalizeField($curlError)];
    }

    if ($status < 200 || $status >= 300) {
        return ['ok' => false, 'error' => 'telegram_http_' . $status];
    }

    return ['ok' => true];
}

function buildTelegramMessage(array $record): string
{
    $lines = [
        'New Founding Model Program application',
        'Time: ' . ($record['timestamp'] ?? ''),
        'Model: ' . ($record['preferred_model_name'] ?? ''),
        'Contact: ' . ($record['preferred_contact_method'] ?? '') . ' - ' . ($record['contact'] ?? ''),
        'Closest stage: ' . ($record['closest_stage'] ?? ''),
        'Live status: ' . ($record['live_status'] ?? ''),
        'Current platforms: ' . (($record['current_platforms'] ?? '') !== '' ? $record['current_platforms'] : ($record['platform_interest'] ?? '')),
        'Main problem: ' . ($record['main_problem'] ?? ''),
    ];

    if (($record['main_problem_other'] ?? '') !== '') {
        $lines[] = 'Problem detail: ' . $record['main_problem_other'];
    }

    return implode("\n", array_map('normalizeField', $lines));
}

function logNotificationEvent(string $event, array $context): void
{
    $logDir = resolveLogDirectory();
    if ($logDir === '') {
        return;
    }

    $entry = [
        'timestamp' => gmdate('c'),
        'event' => $event,
        'context' => $context,
    ];

    $line = json_encode($entry, JSON_UNESCAPED_SLASHES);
    if (!is_string($line)) {
        return;
    }

    @file_put_contents($logDir . '/founding-model-program-events.jsonl', $line . PHP_EOL, FILE_APPEND | LOCK_EX);
}

function envValue(string $key): string
{
    $value = getenv($key);
    if (is_string($value) && $value !== '') {
        return $value;
    }

    if (isset($_ENV[$key]) && is_string($_ENV[$key]) && $_ENV[$key] !== '') {
        return $_ENV[$key];
    }

    if (isset($_SERVER[$key]) && is_string($_SERVER[$key]) && $_SERVER[$key] !== '') {
        return $_SERVER[$key];
    }

    return '';
}
