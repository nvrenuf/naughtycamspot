<?php

declare(strict_types=1);

require_once __DIR__ . '/affiliates.php';

$tracking = go_extract_tracking_params();

// Stripchat is not live in the public signup path yet.
go_send_redirect(go_model_fallback_url($tracking['subid']));
