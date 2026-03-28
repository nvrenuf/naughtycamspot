<?php

declare(strict_types=1);

require_once __DIR__ . '/affiliates.php';

$tracking = go_extract_tracking_params();
$destination = go_build_model_program_url('fansly', $tracking['subid']);

go_send_redirect(is_string($destination) ? $destination : go_model_fallback_url($tracking['subid']));
