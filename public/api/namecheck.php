<?php
declare(strict_types=1);

const NAMECHECK_USER_AGENT = 'Mozilla/5.0 NaughtyCamSpotNameCheck/1.0';
const RATE_LIMIT_REQUESTS = 30;
const RATE_LIMIT_WINDOW = 3600; // 1 hour
const CACHE_TTL = 900; // 15 minutes

header('Content-Type: application/json');

function respond(int $status, array $payload): void
{
    http_response_code($status);
    echo json_encode($payload);
    exit;
}

function ensureDir(string $path): void
{
    if (!is_dir($path)) {
        mkdir($path, 0777, true);
    }
}

function httpRequest(string $url, array $options = []): array
{
    $ch = curl_init($url);

    $timeout = $options['timeout'] ?? 5;
    $headers = $options['headers'] ?? [];

    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_TIMEOUT => $timeout,
        CURLOPT_CONNECTTIMEOUT => $timeout,
        CURLOPT_USERAGENT => NAMECHECK_USER_AGENT,
        CURLOPT_HEADER => true,
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_SSL_VERIFYHOST => 2,
    ]);

    if (!empty($headers)) {
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    }

    if (isset($options['post_fields'])) {
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $options['post_fields']);
    }

    $raw = curl_exec($ch);
    $error = $raw === false ? curl_error($ch) : null;
    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
    $body = $raw !== false ? substr($raw, $headerSize) : '';
    curl_close($ch);

    return [
        'status' => (int) $status,
        'body' => $body,
        'error' => $error,
    ];
}

function rateLimit(string $ip): void
{
    $dir = sys_get_temp_dir() . '/ncs_namecheck_rate';
    ensureDir($dir);
    $file = $dir . '/' . sha1($ip ?: 'unknown');
    $now = time();
    $windowEnd = $now + RATE_LIMIT_WINDOW;
    $record = [
        'count' => 0,
        'resetAt' => $windowEnd,
    ];

    if (file_exists($file)) {
        $decoded = json_decode((string) file_get_contents($file), true);
        if (is_array($decoded) && isset($decoded['count'], $decoded['resetAt'])) {
            if ($decoded['resetAt'] > $now) {
                $record = $decoded;
            }
        }
    }

    if ($record['resetAt'] <= $now) {
        $record = [
            'count' => 0,
            'resetAt' => $now + RATE_LIMIT_WINDOW,
        ];
    }

    if ($record['count'] >= RATE_LIMIT_REQUESTS) {
        respond(429, [
            'error' => 'rate_limited',
            'resetAt' => gmdate('c', (int) $record['resetAt']),
        ]);
    }

    $record['count']++;
    file_put_contents($file, json_encode($record));
}

function readCache(string $canonical): ?array
{
    $dir = sys_get_temp_dir() . '/ncs_namecheck_cache';
    ensureDir($dir);
    $file = $dir . '/' . sha1($canonical) . '.json';
    if (!file_exists($file)) {
        return null;
    }
    $payload = json_decode((string) file_get_contents($file), true);
    if (!is_array($payload) || !isset($payload['cachedAt'])) {
        return null;
    }
    if ((time() - (int) $payload['cachedAt']) > CACHE_TTL) {
        return null;
    }
    return $payload;
}

function writeCache(string $canonical, array $results): void
{
    $dir = sys_get_temp_dir() . '/ncs_namecheck_cache';
    ensureDir($dir);
    $file = $dir . '/' . sha1($canonical) . '.json';
    $payload = [
        'canonical' => $canonical,
        'results' => $results,
        'cachedAt' => time(),
    ];
    file_put_contents($file, json_encode($payload));
}

function isoNow(): string
{
    return gmdate('c');
}

function checkChaturbate(string $canonical): array
{
    $response = httpRequest('https://chaturbate.com/get_edge_hls_url_ajax/', [
        'post_fields' => http_build_query(['room_slug' => $canonical]),
    ]);

    $status = 'UNKNOWN';
    if (!$response['error']) {
        $decoded = json_decode($response['body'], true);
        if (is_array($decoded) && array_key_exists('success', $decoded)) {
            if ($decoded['success'] === true) {
                $status = 'TAKEN';
            } elseif ($decoded['success'] === false) {
                $status = 'AVAILABLE';
            }
        }
    }

    return [
        'status' => $status,
        'checkedAt' => isoNow(),
    ];
}

function checkCamsoda(string $canonical): array
{
    $response = httpRequest("https://www.camsoda.com/api/v1/user/{$canonical}");

    $status = 'UNKNOWN';
    if (!$response['error']) {
        if ($response['status'] === 404) {
            $status = 'AVAILABLE';
        } elseif ($response['status'] === 200) {
            $decoded = json_decode($response['body'], true);
            if (is_array($decoded)) {
                $status = 'TAKEN';
            }
        }
    }

    return [
        'status' => $status,
        'checkedAt' => isoNow(),
    ];
}

function checkBongaCams(string $canonical): array
{
    $response = httpRequest('https://bongacams.com/tools/amf.php', [
        'post_fields' => http_build_query([
            'method' => 'getRoomData',
            'args[]' => $canonical,
            'args[]' => '',
            'args[]' => '',
        ]),
    ]);

    $status = 'UNKNOWN';

    if (!$response['error']) {
        $body = $response['body'];
        $decoded = json_decode($body, true);

        if (is_array($decoded)) {
            $encoded = json_encode($decoded);
            $lowerEncoded = is_string($encoded) ? strtolower($encoded) : '';

            if (
                isset($decoded['error']) ||
                (isset($decoded['status']) && in_array($decoded['status'], ['error', 'notfound', 'not_found'], true))
            ) {
                $status = 'AVAILABLE';
            } elseif (
                isset($decoded['performer']) ||
                isset($decoded['room']) ||
                isset($decoded['username']) ||
                ($lowerEncoded && strpos($lowerEncoded, 'performer') !== false)
            ) {
                $status = 'TAKEN';
            }
        }

        if ($status === 'UNKNOWN') {
            $normalizedBody = strtolower($body);
            if (
                strpos($normalizedBody, 'no such room') !== false ||
                strpos($normalizedBody, 'not found') !== false ||
                strpos($normalizedBody, 'unknown room') !== false
            ) {
                $status = 'AVAILABLE';
            } elseif (
                strpos($normalizedBody, 'performer') !== false ||
                strpos($normalizedBody, 'room_data') !== false ||
                strpos($normalizedBody, 'username') !== false
            ) {
                $status = 'TAKEN';
            }
        }
    }

    return [
        'status' => $status,
        'checkedAt' => isoNow(),
    ];
}

$rawInput = isset($_GET['name']) ? (string) $_GET['name'] : '';
$canonical = strtolower(trim($rawInput));

if ($canonical === '' || !preg_match('/^[a-z0-9_]{3,30}$/', $canonical)) {
    respond(400, ['error' => 'invalid_name']);
}

$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
rateLimit($ip);

$cached = readCache($canonical);
if ($cached !== null) {
    respond(200, [
        'input' => $rawInput,
        'canonical' => $cached['canonical'],
        'results' => $cached['results'],
        'cached' => true,
    ]);
}

$chaturbate = checkChaturbate($canonical);
$camsoda = checkCamsoda($canonical);
$bongacams = checkBongaCams($canonical);

$results = [
    'chaturbate' => $chaturbate,
    'camsoda' => $camsoda,
    'bongacams' => $bongacams,
];

writeCache($canonical, $results);

respond(200, [
    'input' => $rawInput,
    'canonical' => $canonical,
    'results' => $results,
    'cached' => false,
]);
