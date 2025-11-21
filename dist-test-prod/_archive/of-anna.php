<?php

declare(strict_types=1);

require_once __DIR__ . '/affiliates.php';

$tracking = go_extract_tracking_params();

go_send_redirect(go_build_onlyfans_anna_url($tracking['subid']));
