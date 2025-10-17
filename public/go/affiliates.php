<?php

declare(strict_types=1);

const GO_SUBID_PARAM = 'subid';
const GO_MODEL_PROGRAM_CONFIG = [
    'bonga' => [
        'active' => true,
        'tiers' => ['T1', 'T2', 'T3', 'T4'],
    ],
    'camsoda' => [
        'active' => true,
        'tiers' => ['T1', 'T2', 'T3', 'T4'],
    ],
    'chaturbate' => [
        'active' => true,
        'tiers' => ['T1', 'T2', 'T3', 'T4'],
    ],
    'of_creator' => [
        'active' => true,
        'tiers' => ['T1', 'T2', 'T3', 'T4'],
    ],
    'myclub' => [
        'active' => false,
        'tiers' => ['T1', 'T2'],
    ],
    'ph_model' => [
        'active' => false,
        'tiers' => ['T3', 'T4'],
    ],
];

/**
 * Append a subid query parameter to the provided URL.
 */
function go_append_subid(string $url, string $subid): string
{
    if ($subid === '') {
        return $url;
    }

    $separator = strpos($url, '?') === false ? '?' : '&';

    return $url . $separator . GO_SUBID_PARAM . '=' . rawurlencode($subid);
}

/**
 * Normalise tracking values so they are safe to include in subids.
 */
function go_normalize_tracking_value(null|string $value, string $fallback): string
{
    $normalized = is_string($value) ? trim($value) : '';

    if ($normalized === '') {
        return $fallback;
    }

    $sanitized = preg_replace('/[^A-Za-z0-9_.-]+/', '_', $normalized);
    if (!is_string($sanitized) || $sanitized === '') {
        return $fallback;
    }

    return trim($sanitized, '_') ?: $fallback;
}

/**
 * Normalise an optional YYYYMMDD stamp.
 */
function go_normalize_tracking_date(null|string $value): string
{
    $candidate = is_string($value) ? trim($value) : '';
    if ($candidate !== '' && preg_match('/^\d{8}$/', $candidate) === 1) {
        return $candidate;
    }

    return gmdate('Ymd');
}

/**
 * Extract the base tracking payload used for all redirects.
 *
 * @return array{src: string, camp: string, date: string, subid: string}
 */
function go_extract_tracking_params(): array
{
    $src = go_normalize_tracking_value($_GET['src'] ?? null, 'direct');
    $camp = go_normalize_tracking_value($_GET['camp'] ?? null, 'default');
    $date = go_normalize_tracking_date($_GET['date'] ?? null);

    return [
        'src' => $src,
        'camp' => $camp,
        'date' => $date,
        'subid' => sprintf('%s|%s|%s', $src, $camp, $date),
    ];
}

/**
 * Send a 302 redirect with the required caching headers.
 */
function go_send_redirect(string $location): void
{
    $destination = $location !== '' ? $location : '/';

    if (!headers_sent()) {
        header('Cache-Control: no-store');
        header('Location: ' . $destination, true, 302);
    }

    exit;
}

/**
 * Toggle lookup helper that supports environment overrides.
 */
function go_model_program_is_active(string $programKey, string $tier): bool
{
    $config = GO_MODEL_PROGRAM_CONFIG[$programKey] ?? null;
    if ($config === null) {
        return false;
    }

    $envKey = 'GO_MODEL_PROGRAM_' . strtoupper($programKey) . '_ENABLED';
    $override = go_resolve_env_flag($envKey);
    $enabled = $override ?? (($config['active'] ?? false) === true);

    if (!$enabled) {
        return false;
    }

    $allowedTiers = $config['tiers'] ?? [];
    if ($allowedTiers === [] || in_array($tier, $allowedTiers, true)) {
        return true;
    }

    return false;
}

/**
 * Resolve an environment flag from supported sources.
 */
function go_resolve_env_flag(string $key): ?bool
{
    $sources = [$_ENV, $_SERVER];

    foreach ($sources as $source) {
        if (!isset($source[$key])) {
            continue;
        }

        $value = strtolower((string) $source[$key]);
        if (in_array($value, ['1', 'true', 'on', 'yes'], true)) {
            return true;
        }

        if (in_array($value, ['0', 'false', 'off', 'no'], true)) {
            return false;
        }
    }

    return null;
}

/**
 * Dispatch to the correct model program builder.
 */
function go_build_model_program_url(string $programKey, string $subid, array $context = []): ?string
{
    return match ($programKey) {
        'bonga' => go_build_bonga_model_signup($subid, $context),
        'camsoda' => go_build_camsoda_model_signup($subid),
        'chaturbate' => go_build_chaturbate_model_signup($subid),
        'of_creator' => go_build_onlyfans_creator_signup($subid),
        'myclub' => go_build_myclub_model_signup($subid),
        'ph_model' => go_build_pornhub_model_signup($subid),
        default => null,
    };
}

/**
 * Default fallback when no affiliate program is active.
 */
function go_model_fallback_url(string $subid): string
{
    return go_append_subid('/join-models/', $subid);
}

/**
 * BongaCash model signup targets segmented by tier.
 * These will need to be replaced with live tracking links once issued.
 */
function go_build_bonga_model_signup(string $subid, array $context = []): string
{
    $tier = strtoupper($context['tier'] ?? 'T4');
    $targets = [
        'T1' => 'https://track.naughtycamspot.com/bonga/models/tier1',
        'T2' => 'https://track.naughtycamspot.com/bonga/models/tier2',
        'T3' => 'https://track.naughtycamspot.com/bonga/models/tier3',
        'T4' => 'https://track.naughtycamspot.com/bonga/models/global',
    ];

    $base = $targets[$tier] ?? $targets['T4'];

    return go_append_subid($base, $subid);
}

function go_build_camsoda_model_signup(string $subid): string
{
    $base = 'https://track.naughtycamspot.com/camsoda/models';

    return go_append_subid($base, $subid);
}

function go_build_chaturbate_model_signup(string $subid): string
{
    $base = 'https://track.naughtycamspot.com/chaturbate/models';

    return go_append_subid($base, $subid);
}

function go_build_onlyfans_creator_signup(string $subid): string
{
    $base = 'https://track.naughtycamspot.com/onlyfans/creators';

    return go_append_subid($base, $subid);
}

function go_build_myclub_model_signup(string $subid): string
{
    $base = 'https://track.naughtycamspot.com/myclub/models';

    return go_append_subid($base, $subid);
}

function go_build_pornhub_model_signup(string $subid): string
{
    $base = 'https://track.naughtycamspot.com/pornhub/models';

    return go_append_subid($base, $subid);
}

function go_build_mv_anna_url(string $subid): string
{
    return go_append_subid('https://www.manyvids.com/live/cam/anna_prince', $subid);
}

function go_build_beacons_anna_url(string $subid): string
{
    return go_append_subid('https://beacons.ai/annaprince', $subid);
}

function go_build_stripchat_anna_url(string $subid): string
{
    return go_append_subid('https://stripchat.com/Anna_Prince', $subid);
}

function go_build_chaturbate_anna_url(string $subid): string
{
    return go_append_subid('https://chaturbate.com/b/anna_prince/', $subid);
}

function go_build_camsoda_anna_url(string $subid): string
{
    return go_append_subid('https://www.camsoda.com/annaprince', $subid);
}

function go_build_pornhub_anna_url(string $subid): string
{
    return go_append_subid('https://pornhub.com/model/sabrina_great', $subid);
}

function go_build_onlyfans_anna_url(string $subid): string
{
    return go_append_subid('https://onlyfans.com/sabrinagreat', $subid);
}

function go_build_myclub_anna_url(string $subid): string
{
    return go_append_subid('https://my.club/Anna_Prince', $subid);
}
