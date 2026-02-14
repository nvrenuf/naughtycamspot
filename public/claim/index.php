<?php

declare(strict_types=1);

header('X-Robots-Tag: noindex', true);

init_session();
$csrfToken = ensure_csrf_token();
$csrfError = '';

$privateDataRoot = dirname(__DIR__, 2) . '/private_data';
$leadLogDirectory = $privateDataRoot . '/logs';
$leadLogPath = $leadLogDirectory . '/leads.jsonl';
$claimsLogDirectory = $privateDataRoot . '/claims';
$claimsLogPath = $claimsLogDirectory . '/claims.log';
$uploadRoot = $privateDataRoot . '/uploads/claims';

$platformOptions = [
    'bonga' => 'Bonga',
    'camsoda' => 'CamSoda',
    'chaturbate' => 'Chaturbate',
    'other' => 'Other',
];

$maxUploadBytes = 5 * 1024 * 1024; // 5 MB
$mimeToExtension = [
    'image/png' => 'png',
    'image/jpeg' => 'jpg',
];

$values = [
    'name' => '',
    'email' => '',
    'platform' => '',
    'notes' => '',
    'src' => request_string('src'),
    'camp' => request_string('camp'),
    'date' => request_string('date'),
];
$errors = [];
$uploadMeta = null;

$leadValues = [
    'telegram' => '',
    'email' => '',
    'whatsapp' => '',
    'platforms' => [],
    'timezone' => '',
    'days' => [],
    'time_start' => '',
    'time_end' => '',
    'platforms_active' => [],
    'platforms_interested' => [],
    'style' => [],
    'hard_no' => [],
    'notes' => '',
    'asset_link' => '',
    'preferred_contact' => '',
    'consent' => false,
    'click_id' => '',
    'platform' => '',
    'source' => '',
    'page' => '',
    'src' => request_string('src'),
    'camp' => request_string('camp'),
    'date' => request_string('date'),
];

if (request_method_is('POST')) {
    $csrfError = validate_csrf_request($_POST['csrf_token'] ?? '', $_SERVER['HTTP_ORIGIN'] ?? '', $_SERVER['HTTP_REFERER'] ?? '');
}

if (request_method_is('POST') && request_string('lead_form') === '1') {
    if ($csrfError !== '') {
        http_response_code(403);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['error' => $csrfError], JSON_UNESCAPED_SLASHES);
        exit;
    }

    $kitUnlock = request_string('kit_unlock') === '1';
    $leadValues['telegram'] = sanitize_text($_POST['telegram'] ?? '', 120);
    $leadValues['email'] = sanitize_text($_POST['email'] ?? '', 200);
    $leadValues['whatsapp'] = sanitize_text($_POST['whatsapp'] ?? '', 120);
    $leadValues['platforms'] = sanitize_platform_list($_POST['platforms'] ?? []);
    $leadValues['timezone'] = sanitize_text($_POST['timezone'] ?? '', 20);
    $leadValues['days'] = sanitize_day_list($_POST['days'] ?? []);
    $leadValues['time_start'] = sanitize_time_value($_POST['time_start'] ?? '');
    $leadValues['time_end'] = sanitize_time_value($_POST['time_end'] ?? '');
    $leadValues['platforms_active'] = sanitize_platform_list($_POST['platforms_active'] ?? []);
    $leadValues['platforms_interested'] = sanitize_platform_list($_POST['platforms_interested'] ?? []);
    $leadValues['style'] = sanitize_allowed_list($_POST['style'] ?? [], allowed_style_values());
    $leadValues['hard_no'] = sanitize_allowed_list($_POST['hard_no'] ?? [], allowed_hard_no_values());
    $leadValues['notes'] = sanitize_multiline($_POST['notes'] ?? '', 2000);
    $leadValues['asset_link'] = sanitize_text($_POST['asset_link'] ?? '', 200);
    $leadValues['preferred_contact'] = sanitize_allowed_value($_POST['preferred_contact'] ?? '', allowed_contact_values());
    $leadValues['consent'] = isset($_POST['consent']) && $_POST['consent'] !== '';
    $leadValues['click_id'] = sanitize_text($_POST['click_id'] ?? '', 80);
    $leadValues['platform'] = sanitize_tracking($_POST['platform'] ?? '');
    $leadValues['source'] = sanitize_text($_POST['source'] ?? '', 40);
    $leadValues['page'] = sanitize_text($_POST['page'] ?? '', 200);
    $leadValues['src'] = sanitize_tracking($_POST['src'] ?? $leadValues['src']);
    $leadValues['camp'] = sanitize_tracking($_POST['camp'] ?? $leadValues['camp']);
    $leadValues['date'] = sanitize_tracking($_POST['date'] ?? $leadValues['date']);

    $now = new DateTimeImmutable('now', new DateTimeZone('UTC'));
    $logEntry = build_lead_log_entry($now, $leadValues);
    if (!is_dir($leadLogDirectory)) {
        @mkdir($leadLogDirectory, 0750, true);
    }

    if ($logEntry !== '' && is_dir($leadLogDirectory)) {
        @file_put_contents($leadLogPath, $logEntry . PHP_EOL, FILE_APPEND | LOCK_EX);
    }

    maybe_run_retention_maintenance($leadLogPath, $claimsLogPath, $uploadRoot);

    if ($kitUnlock && $leadValues['consent']) {
        header('Location: /vip-kit-unlocked/', true, 302);
    } else {
        header('Location: /claim/success.html', true, 302);
    }
    exit;
}

if (request_method_is('POST')) {
    if ($csrfError !== '') {
        $errors['general'] = 'Security check failed. Refresh and submit the form again.';
    }

    $values['name'] = sanitize_text($_POST['name'] ?? '', 200);
    $values['email'] = sanitize_text($_POST['email'] ?? '', 200);
    $values['platform'] = sanitize_text($_POST['platform'] ?? '', 20);
    $values['notes'] = sanitize_multiline($_POST['notes'] ?? '', 4000);
    $values['src'] = sanitize_tracking($_POST['src'] ?? $values['src']);
    $values['camp'] = sanitize_tracking($_POST['camp'] ?? $values['camp']);
    $values['date'] = sanitize_tracking($_POST['date'] ?? $values['date']);

    if ($values['name'] === '') {
        $errors['name'] = 'Please enter your name so we know who submitted the claim.';
    }

    if ($values['email'] === '' || filter_var($values['email'], FILTER_VALIDATE_EMAIL) === false) {
        $errors['email'] = 'Please provide a valid email address so we can deliver the kit.';
    }

    if (!array_key_exists($values['platform'], $platformOptions)) {
        $errors['platform'] = 'Select the cam platform you just joined.';
    }

    $file = $_FILES['signup_screenshot'] ?? null;
    if (!is_array($file) || !array_key_exists('error', $file)) {
        $errors['signup_screenshot'] = 'Please upload your signup screenshot.';
    } else {
        $fileError = (int) $file['error'];
        if ($fileError === UPLOAD_ERR_NO_FILE) {
            $errors['signup_screenshot'] = 'Please upload your signup screenshot.';
        } elseif ($fileError === UPLOAD_ERR_INI_SIZE || $fileError === UPLOAD_ERR_FORM_SIZE) {
            $errors['signup_screenshot'] = 'The screenshot is larger than 5 MB. Please upload a smaller image.';
        } elseif ($fileError === UPLOAD_ERR_PARTIAL) {
            $errors['signup_screenshot'] = 'The screenshot upload did not finish. Please try again.';
        } elseif ($fileError !== UPLOAD_ERR_OK) {
            $errors['signup_screenshot'] = 'We could not process the upload. Please try again.';
        } else {
            $fileSize = isset($file['size']) ? (int) $file['size'] : 0;
            if ($fileSize <= 0) {
                $errors['signup_screenshot'] = 'We could not read the screenshot. Please try again.';
            } elseif ($fileSize > $maxUploadBytes) {
                $errors['signup_screenshot'] = 'The screenshot is larger than 5 MB. Please upload a smaller image.';
            } elseif (!isset($file['tmp_name']) || !is_uploaded_file($file['tmp_name'])) {
                $errors['signup_screenshot'] = 'We could not verify the upload. Please try again.';
            } else {
                $mimeType = detect_mime_type($file['tmp_name']);
                if ($mimeType === '' || !array_key_exists($mimeType, $mimeToExtension)) {
                    $errors['signup_screenshot'] = 'Please upload a PNG or JPG image.';
                } else {
                    $uploadMeta = [
                        'tmp_name' => $file['tmp_name'],
                        'mime' => $mimeType,
                        'extension' => $mimeToExtension[$mimeType],
                        'size' => $fileSize,
                        'original_name' => (string) ($file['name'] ?? ''),
                    ];
                }
            }
        }
    }

    if (empty($errors)) {
        $now = new DateTimeImmutable('now', new DateTimeZone('UTC'));
        $year = $now->format('Y');
        $month = $now->format('m');
        $uploadDirectory = $uploadRoot . '/' . $year . '/' . $month;

        if (!is_dir($uploadDirectory) && !mkdir($uploadDirectory, 0750, true) && !is_dir($uploadDirectory)) {
            $errors['general'] = 'We could not store your upload right now. Please try again later or email concierge@naughtycamspot.com.';
        } else {
            $randomBytes = bin2hex(random_bytes(16));
            $filename = $randomBytes . '.' . $uploadMeta['extension'];
            $destination = $uploadDirectory . '/' . $filename;

            if (!move_uploaded_file($uploadMeta['tmp_name'], $destination)) {
                $errors['general'] = 'We could not save your upload. Please try again.';
            } else {
                @chmod($destination, 0640);
                $relativePath = 'private_data/uploads/claims/' . $year . '/' . $month . '/' . $filename;

                $logEntry = build_log_entry($now, $relativePath, $values, $uploadMeta, $platformOptions);
                if (!is_dir($claimsLogDirectory)) {
                    @mkdir($claimsLogDirectory, 0750, true);
                }

                if ($logEntry === '' || file_put_contents($claimsLogPath, $logEntry . PHP_EOL, FILE_APPEND | LOCK_EX) === false) {
                    $errors['general'] = 'We saved your upload but could not log the claim. Please contact concierge@naughtycamspot.com.';
                    @unlink($destination);
                } else {
                    $platformLabel = $platformOptions[$values['platform']];
                    $subject = 'NCS Claim: ' . $platformLabel;
                    $emailBody = build_email_body($now, $relativePath, $values, $platformLabel);
                    $headers = [
                        'MIME-Version: 1.0',
                        'Content-Type: text/plain; charset=UTF-8',
                        'From: NaughtyCamSpot <no-reply@naughtycamspot.com>',
                    ];
                    if ($values['email'] !== '') {
                        $headers[] = 'Reply-To: ' . $values['email'];
                    }

                    @mail('admin@naughtycamspot.com', $subject, $emailBody, implode("\r\n", $headers));
                    maybe_run_retention_maintenance($leadLogPath, $claimsLogPath, $uploadRoot);

                    header('Location: /claim/success.html', true, 302);
                    exit;
                }
            }
        }
    }
}

function request_method_is(string $method): bool
{
    return isset($_SERVER['REQUEST_METHOD']) && strtoupper((string) $_SERVER['REQUEST_METHOD']) === $method;
}

function request_string(string $key): string
{
    if (!isset($_REQUEST[$key])) {
        return '';
    }

    $value = $_REQUEST[$key];
    if (is_array($value)) {
        return '';
    }

    return trim((string) $value);
}

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

function validate_csrf_request(mixed $tokenValue, string $originHeader, string $refererHeader): string
{
    $sessionToken = ensure_csrf_token();
    if (!is_string($tokenValue) || !hash_equals($sessionToken, trim($tokenValue))) {
        return 'Invalid security token.';
    }

    if (!validate_same_origin($originHeader, $refererHeader)) {
        return 'Invalid request origin.';
    }

    return '';
}

function validate_same_origin(string $originHeader, string $refererHeader): bool
{
    $expectedHost = strtolower((string) ($_SERVER['HTTP_HOST'] ?? ''));
    if ($expectedHost === '') {
        return true;
    }

    $candidate = trim($originHeader);
    if ($candidate === '') {
        $candidate = trim($refererHeader);
    }

    if ($candidate === '') {
        return false;
    }

    $host = parse_url($candidate, PHP_URL_HOST);
    if (!is_string($host) || $host === '') {
        return false;
    }

    return strtolower($host) === $expectedHost;
}

function sanitize_text(mixed $value, int $maxLength): string
{
    if (!is_scalar($value)) {
        return '';
    }

    $string = trim((string) $value);
    if ($string === '') {
        return '';
    }

    if (function_exists('mb_substr')) {
        $string = mb_substr($string, 0, $maxLength);
    } else {
        $string = substr($string, 0, $maxLength);
    }

    return $string;
}

function sanitize_multiline(mixed $value, int $maxLength): string
{
    $text = sanitize_text($value, $maxLength);
    if ($text === '') {
        return '';
    }

    return str_replace(["\r\n", "\r"], "\n", $text);
}

function sanitize_tracking(mixed $value): string
{
    $text = sanitize_text($value, 64);
    if ($text === '') {
        return '';
    }

    return (string) preg_replace('/[^a-zA-Z0-9_\-]/', '', $text);
}

function sanitize_platform_list(mixed $value): array
{
    if (!is_array($value)) {
        return [];
    }

    $items = [];
    foreach ($value as $entry) {
        $slug = sanitize_tracking($entry);
        if ($slug !== '') {
            $items[] = $slug;
        }
    }

    return array_values(array_unique($items));
}

function sanitize_day_list(mixed $value): array
{
    return sanitize_allowed_list($value, ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
}

function sanitize_time_value(mixed $value): string
{
    if (!is_scalar($value)) {
        return '';
    }
    $candidate = trim((string) $value);
    if ($candidate === '') {
        return '';
    }
    if (preg_match('/^\d{2}:\d{2}$/', $candidate) !== 1) {
        return '';
    }
    return $candidate;
}

function allowed_style_values(): array
{
    return ['gfe', 'tease', 'domme', 'roleplay', 'couples', 'fetish', 'gnd', 'other'];
}

function allowed_hard_no_values(): array
{
    return ['meetups', 'face', 'public', 'custom', 'off_platform', 'extreme', 'explicit', 'dom'];
}

function allowed_contact_values(): array
{
    return ['telegram', 'email', 'whatsapp'];
}

function sanitize_allowed_value(mixed $value, array $allowed): string
{
    if (!is_scalar($value)) {
        return '';
    }
    $candidate = trim((string) $value);
    if ($candidate === '') {
        return '';
    }
    return in_array($candidate, $allowed, true) ? $candidate : '';
}

function sanitize_allowed_list(mixed $value, array $allowed): array
{
    if (!is_array($value)) {
        return [];
    }
    $items = [];
    foreach ($value as $entry) {
        if (!is_scalar($entry)) {
            continue;
        }
        $candidate = trim((string) $entry);
        if ($candidate !== '' && in_array($candidate, $allowed, true)) {
            $items[] = $candidate;
        }
    }
    return array_values(array_unique($items));
}

function detect_mime_type(string $path): string
{
    if (!is_file($path)) {
        return '';
    }

    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    if ($finfo === false) {
        return '';
    }

    $mime = finfo_file($finfo, $path);
    finfo_close($finfo);

    if (!is_string($mime)) {
        return '';
    }

    return $mime;
}

function build_lead_log_entry(DateTimeImmutable $timestamp, array $values): string
{
    $log = [
        'timestamp' => $timestamp->format(DateTimeInterface::ATOM),
        'telegram' => normalize_log_value($values['telegram'] ?? ''),
        'email' => normalize_log_value($values['email'] ?? ''),
        'whatsapp' => normalize_log_value($values['whatsapp'] ?? ''),
        'platforms' => array_values($values['platforms'] ?? []),
        'timezone' => normalize_log_value($values['timezone'] ?? ''),
        'days' => array_values($values['days'] ?? []),
        'time_start' => normalize_log_value($values['time_start'] ?? ''),
        'time_end' => normalize_log_value($values['time_end'] ?? ''),
        'platforms_active' => array_values($values['platforms_active'] ?? []),
        'platforms_interested' => array_values($values['platforms_interested'] ?? []),
        'style' => array_values($values['style'] ?? []),
        'hard_no' => array_values($values['hard_no'] ?? []),
        'notes' => normalize_log_value($values['notes'] ?? ''),
        'asset_link' => normalize_log_value($values['asset_link'] ?? ''),
        'preferred_contact' => normalize_log_value($values['preferred_contact'] ?? ''),
        'consent' => (bool) ($values['consent'] ?? false),
        'click_id' => normalize_log_value($values['click_id'] ?? ''),
        'platform' => normalize_log_value($values['platform'] ?? ''),
        'source' => normalize_log_value($values['source'] ?? ''),
        'page' => normalize_log_value($values['page'] ?? ''),
        'src' => normalize_log_value($values['src'] ?? ''),
        'camp' => normalize_log_value($values['camp'] ?? ''),
        'date' => normalize_log_value($values['date'] ?? ''),
        'ip' => normalize_log_value($_SERVER['REMOTE_ADDR'] ?? ''),
        'user_agent' => normalize_log_value($_SERVER['HTTP_USER_AGENT'] ?? ''),
    ];

    $json = json_encode($log, JSON_UNESCAPED_SLASHES);
    if (!is_string($json)) {
        return '';
    }

    return $json;
}

function build_log_entry(DateTimeImmutable $timestamp, string $relativePath, array $values, array $uploadMeta, array $platformOptions): string
{
    $log = [
        'timestamp' => $timestamp->format(DateTimeInterface::ATOM),
        'name' => normalize_log_value($values['name'] ?? ''),
        'email' => normalize_log_value($values['email'] ?? ''),
        'platform' => $platformOptions[$values['platform']] ?? $values['platform'],
        'src' => normalize_log_value($values['src'] ?? ''),
        'camp' => normalize_log_value($values['camp'] ?? ''),
        'date' => normalize_log_value($values['date'] ?? ''),
        'notes' => normalize_log_value($values['notes'] ?? ''),
        'upload' => $relativePath,
        'original_name' => normalize_log_value($uploadMeta['original_name'] ?? ''),
        'size' => $uploadMeta['size'] ?? 0,
    ];

    $json = json_encode($log, JSON_UNESCAPED_SLASHES);
    if (!is_string($json)) {
        return '';
    }

    return $json;
}

function build_email_body(DateTimeImmutable $timestamp, string $relativePath, array $values, string $platformLabel): string
{
    $lines = [
        'New StartRight kit claim received on ' . $timestamp->format('Y-m-d H:i:s T') . '.',
        '',
        'Name: ' . $values['name'],
        'Email: ' . $values['email'],
        'Platform: ' . $platformLabel,
        'Tracking src: ' . ($values['src'] ?: '(not provided)'),
        'Tracking camp: ' . ($values['camp'] ?: '(not provided)'),
        'Tracking date: ' . ($values['date'] ?: '(not provided)'),
        'Upload path: ' . $relativePath,
    ];

    if ($values['notes'] !== '') {
        $lines[] = '';
        $lines[] = 'Notes:';
        $lines[] = $values['notes'];
    }

    return implode("\n", $lines) . "\n";
}

function maybe_run_retention_maintenance(string $leadLogPath, string $claimsLogPath, string $uploadRoot): void
{
    if (random_int(1, 25) !== 1) {
        return;
    }

    $now = new DateTimeImmutable('now', new DateTimeZone('UTC'));
    $leadCutoff = $now->sub(new DateInterval('P90D'))->getTimestamp();
    $claimCutoff = $now->sub(new DateInterval('P180D'))->getTimestamp();

    prune_jsonl_file($leadLogPath, $leadCutoff);
    prune_jsonl_file($claimsLogPath, $claimCutoff);
    prune_upload_tree($uploadRoot, $claimCutoff);
}

function prune_jsonl_file(string $path, int $cutoffTimestamp): void
{
    if (!is_file($path) || !is_readable($path)) {
        return;
    }

    $lines = @file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if (!is_array($lines)) {
        return;
    }

    $kept = [];
    foreach ($lines as $line) {
        $decoded = json_decode($line, true);
        if (!is_array($decoded)) {
            continue;
        }
        $timestamp = strtotime((string) ($decoded['timestamp'] ?? ''));
        if ($timestamp === false || $timestamp >= $cutoffTimestamp) {
            $kept[] = $line;
        }
    }

    $payload = $kept === [] ? '' : implode(PHP_EOL, $kept) . PHP_EOL;
    @file_put_contents($path, $payload, LOCK_EX);
}

function prune_upload_tree(string $root, int $cutoffTimestamp): void
{
    if (!is_dir($root)) {
        return;
    }

    $iterator = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($root, FilesystemIterator::SKIP_DOTS),
        RecursiveIteratorIterator::CHILD_FIRST
    );

    foreach ($iterator as $item) {
        $path = $item->getPathname();
        if ($item->isFile() && $item->getMTime() < $cutoffTimestamp) {
            @unlink($path);
        } elseif ($item->isDir()) {
            @rmdir($path);
        }
    }
}

function normalize_log_value(string $value): string
{
    $normalized = (string) preg_replace('/[\r\n\t]+/', ' ', $value);
    if ($normalized === '') {
        return '';
    }

    return trim($normalized);
}

function esc(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function field_error(array $errors, string $key): string
{
    return $errors[$key] ?? '';
}

?>
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Claim StartRight Kit | NaughtyCamSpot</title>
    <meta name="description" content="Upload proof of your signup so the NaughtyCamSpot concierge can release the StartRight kit." />
    <style>
      :root {
        color-scheme: dark;
        --bg: #05060a;
        --card: rgba(255, 255, 255, 0.06);
        --card-border: rgba(255, 255, 255, 0.12);
        --accent: #f8c0c8;
        --text: rgba(255, 255, 255, 0.9);
        --muted: rgba(255, 255, 255, 0.65);
        --error: #ff7b7b;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        min-height: 100vh;
        font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        background: radial-gradient(circle at top left, rgba(248, 192, 200, 0.2), transparent 55%),
          radial-gradient(circle at top right, rgba(248, 192, 200, 0.15), transparent 50%),
          var(--bg);
        color: var(--text);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 40px 16px;
      }

      main {
        width: 100%;
        max-width: 720px;
        background: var(--card);
        border: 1px solid var(--card-border);
        border-radius: 28px;
        padding: 32px;
        backdrop-filter: blur(16px);
        box-shadow: 0 30px 60px rgba(0, 0, 0, 0.35);
      }

      h1 {
        font-family: 'Playfair Display', 'Times New Roman', serif;
        font-size: 2.25rem;
        margin: 0 0 8px;
      }

      p {
        margin: 0 0 16px;
        color: var(--muted);
        line-height: 1.6;
      }

      .field {
        margin-bottom: 18px;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      label {
        font-size: 0.75rem;
        letter-spacing: 0.24em;
        text-transform: uppercase;
        color: rgba(255, 255, 255, 0.7);
      }

      input[type="text"],
      input[type="email"],
      select,
      textarea {
        width: 100%;
        border-radius: 16px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        background: rgba(5, 6, 10, 0.6);
        color: var(--text);
        padding: 12px 16px;
        font-size: 0.95rem;
        transition: border-color 0.2s ease, background 0.2s ease;
      }

      input[type="text"]:focus,
      input[type="email"]:focus,
      select:focus,
      textarea:focus,
      input[type="file"]:focus {
        outline: none;
        border-color: rgba(248, 192, 200, 0.6);
        background: rgba(5, 6, 10, 0.75);
      }

      input[type="file"] {
        color: var(--muted);
      }

      textarea {
        min-height: 120px;
        resize: vertical;
      }

      button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 14px 32px;
        border-radius: 999px;
        border: 1px solid rgba(248, 192, 200, 0.6);
        background: var(--accent);
        color: #1a1b1f;
        text-transform: uppercase;
        letter-spacing: 0.28em;
        font-weight: 600;
        font-size: 0.75rem;
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }

      button:hover {
        transform: translateY(-2px);
        box-shadow: 0 20px 40px rgba(248, 192, 200, 0.2);
      }

      .helper {
        font-size: 0.75rem;
        color: rgba(255, 255, 255, 0.55);
        letter-spacing: 0.04em;
      }

      .error {
        color: var(--error);
        font-size: 0.8rem;
        letter-spacing: 0.02em;
      }

      .error-summary {
        border-radius: 18px;
        border: 1px solid rgba(255, 123, 123, 0.35);
        background: rgba(255, 123, 123, 0.08);
        padding: 16px 18px;
        margin-bottom: 24px;
        color: var(--error);
        font-size: 0.9rem;
        line-height: 1.5;
      }

      .steps {
        margin: 32px 0;
        display: grid;
        gap: 18px;
      }

      .steps span {
        display: block;
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.3em;
        color: rgba(248, 192, 200, 0.7);
        margin-bottom: 6px;
      }

      @media (min-width: 640px) {
        .steps {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
      }
    </style>
  </head>
  <body>
    <main>
      <h1>Claim your StartRight kit</h1>
      <p>
        Submit proof of your signup so the NaughtyCamSpot concierge can release the 14-day StartRight kit. We verify every claim by
        hand. Weekday responses usually land within 24 hours.
      </p>

      <div class="steps">
        <div>
          <span>Step 1</span>
          <p class="helper">Complete the partner signup using our tracked link.</p>
        </div>
        <div>
          <span>Step 2</span>
          <p class="helper">Grab a screenshot of your approval email or dashboard with your username visible.</p>
        </div>
        <div>
          <span>Step 3</span>
          <p class="helper">Upload the screenshot and add any context below so we can match the referral.</p>
        </div>
      </div>

      <?php if (!empty($errors['general'])): ?>
        <div class="error-summary"><?php echo esc($errors['general']); ?></div>
      <?php endif; ?>

      <form method="post" enctype="multipart/form-data" novalidate>
        <input type="hidden" name="csrf_token" value="<?php echo esc($csrfToken); ?>" />
        <input type="hidden" name="src" value="<?php echo esc($values['src']); ?>" />
        <input type="hidden" name="camp" value="<?php echo esc($values['camp']); ?>" />
        <input type="hidden" name="date" value="<?php echo esc($values['date']); ?>" />
        <input type="hidden" name="MAX_FILE_SIZE" value="<?php echo (string) $maxUploadBytes; ?>" />

        <div class="field">
          <label for="claim-name">Name</label>
          <input type="text" id="claim-name" name="name" required value="<?php echo esc($values['name']); ?>" autocomplete="name" />
          <?php if ($message = field_error($errors, 'name')): ?>
            <span class="error"><?php echo esc($message); ?></span>
          <?php endif; ?>
        </div>

        <div class="field">
          <label for="claim-email">Email</label>
          <input type="email" id="claim-email" name="email" required value="<?php echo esc($values['email']); ?>" autocomplete="email" />
          <?php if ($message = field_error($errors, 'email')): ?>
            <span class="error"><?php echo esc($message); ?></span>
          <?php endif; ?>
        </div>

        <div class="field">
          <label for="claim-platform">Platform</label>
          <select id="claim-platform" name="platform" required>
            <option value="" disabled <?php echo $values['platform'] === '' ? 'selected' : ''; ?>>Select a platform</option>
            <?php foreach ($platformOptions as $optionValue => $label): ?>
              <option value="<?php echo esc($optionValue); ?>" <?php echo $values['platform'] === $optionValue ? 'selected' : ''; ?>><?php echo esc($label); ?></option>
            <?php endforeach; ?>
          </select>
          <?php if ($message = field_error($errors, 'platform')): ?>
            <span class="error"><?php echo esc($message); ?></span>
          <?php endif; ?>
        </div>

        <div class="field">
          <label for="claim-screenshot">Signup screenshot (PNG or JPG, max 5&nbsp;MB)</label>
          <input type="file" id="claim-screenshot" name="signup_screenshot" accept="image/png,image/jpeg" required />
          <span class="helper">Include your username or referral ID in the screenshot so we can confirm the match.</span>
          <?php if ($message = field_error($errors, 'signup_screenshot')): ?>
            <span class="error"><?php echo esc($message); ?></span>
          <?php endif; ?>
        </div>

        <div class="field">
          <label for="claim-notes">Notes (optional)</label>
          <textarea id="claim-notes" name="notes" placeholder="Share anything we should know about your signup timing or referral credit."><?php echo esc($values['notes']); ?></textarea>
          <?php if ($message = field_error($errors, 'notes')): ?>
            <span class="error"><?php echo esc($message); ?></span>
          <?php endif; ?>
        </div>

        <button type="submit">Submit claim</button>
      </form>

      <p class="helper" style="margin-top: 28px;">
        After approval you&apos;ll receive an email with the full kit plus a direct link to the
        <a href="/starter-kit" style="color: var(--accent);">StartRight kit overview</a> for quick reference.
      </p>
    </main>
  </body>
</html>
