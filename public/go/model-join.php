<?php

declare(strict_types=1);

require_once __DIR__ . '/affiliates.php';

const GO_GEO_TIER_MAP = [
    'T1' => ['US', 'CA', 'GB', 'IE', 'AU', 'NZ'],
    'T2' => ['AT', 'BE', 'CH', 'CZ', 'DE', 'DK', 'ES', 'FI', 'FR', 'IT', 'LU', 'NL', 'NO', 'PT', 'SE'],
    'T3' => [
        'AR', 'BG', 'BR', 'CL', 'CO', 'CR', 'DO', 'EC', 'GT', 'HN', 'MX', 'NI', 'PA', 'PE', 'PR', 'PY', 'SV', 'UY', 'VE', 'BO',
        'PH', 'TH', 'MY', 'ID', 'VN', 'IN', 'TR', 'HR', 'RS', 'EE', 'LV', 'LT', 'ZA', 'HK', 'IL', 'JP', 'KR'
    ],
];

const GO_MODEL_PROGRAM_ORDER = ['bonga', 'camsoda', 'chaturbate', 'of_creator', 'myclub', 'ph_model'];

$tracking = go_extract_tracking_params();
$country = resolve_country_code();
$tier = resolve_geo_tier($country);

foreach (GO_MODEL_PROGRAM_ORDER as $programKey) {
    if (!go_model_program_is_active($programKey, $tier)) {
        continue;
    }

    $url = go_build_model_program_url($programKey, $tracking['subid'], [
        'country' => $country,
        'tier' => $tier,
    ]);

    if (is_string($url) && $url !== '') {
        go_send_redirect($url);
    }
}

go_send_redirect(go_model_fallback_url($tracking['subid']));

function resolve_country_code(): string
{
    $override = normalize_country_code($_GET['cc'] ?? null);
    if ($override !== '') {
        return $override;
    }

    $candidates = [
        $_SERVER['HTTP_CF_IPCOUNTRY'] ?? null,
        $_SERVER['HTTP_X_COUNTRY_CODE'] ?? null,
        $_SERVER['HTTP_X_GEOIP_COUNTRY'] ?? null,
        $_SERVER['GEOIP_COUNTRY_CODE'] ?? null,
        $_SERVER['HTTP_X_APPENGINE_COUNTRY'] ?? null,
    ];

    foreach ($candidates as $candidate) {
        $normalized = normalize_country_code($candidate);
        if ($normalized !== '') {
            return $normalized;
        }
    }

    return 'XX';
}

function normalize_country_code(mixed $value): string
{
    if (!is_string($value)) {
        return '';
    }

    $trimmed = strtoupper(trim($value));
    if ($trimmed === '' || $trimmed === 'XX') {
        return '';
    }

    if (preg_match('/^[A-Z]{2}$/', $trimmed) !== 1) {
        return '';
    }

    return $trimmed;
}

function resolve_geo_tier(string $countryCode): string
{
    foreach (GO_GEO_TIER_MAP as $tier => $countries) {
        if (in_array($countryCode, $countries, true)) {
            return $tier;
        }
    }

    return 'T4';
}
