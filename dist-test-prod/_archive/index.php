<?php

declare(strict_types=1);

header('X-Robots-Tag: noindex', true);

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

if (request_method_is('POST')) {
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
        $uploadDirectory = __DIR__ . '/uploads/' . $year . '/' . $month;

        if (!is_dir($uploadDirectory) && !mkdir($uploadDirectory, 0755, true) && !is_dir($uploadDirectory)) {
            $errors['general'] = 'We could not store your upload right now. Please try again later or email concierge@naughtycamspot.com.';
        } else {
            $randomBytes = bin2hex(random_bytes(16));
            $filename = $randomBytes . '.' . $uploadMeta['extension'];
            $destination = $uploadDirectory . '/' . $filename;

            if (!move_uploaded_file($uploadMeta['tmp_name'], $destination)) {
                $errors['general'] = 'We could not save your upload. Please try again.';
            } else {
                @chmod($destination, 0644);
                $relativePath = 'uploads/' . $year . '/' . $month . '/' . $filename;

                $logEntry = build_log_entry($now, $relativePath, $values, $uploadMeta, $platformOptions);
                $logPath = __DIR__ . '/claims.log';
                if ($logEntry === '' || file_put_contents($logPath, $logEntry . PHP_EOL, FILE_APPEND | LOCK_EX) === false) {
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
