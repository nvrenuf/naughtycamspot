# VIP Token Management

VIP downloads are controlled by JSONL records stored at `public/logs/vip_tokens.jsonl`. Each line is one JSON object.

## Generate + Append A Token Record

Run the CLI script:

```bash
node scripts/vip-token.mjs --allow first-week-plan.pdf --allow ncs-starter-checklist.pdf --contact @telegram_handle
```

Optional expiration:

```bash
node scripts/vip-token.mjs --allow promo-caption-pack.txt --expires-in-days 14
```

Dry run (print only, do not append):

```bash
node scripts/vip-token.mjs --allow first-week-plan.pdf --dry-run
```

## Record Shape

Example line (JSONL):

```json
{
  "token_id": "tok_...",
  "token": "vip_...",
  "created_at": "2026-02-15T02:00:00.000Z",
  "expires_at": "2026-03-01T00:00:00.000Z",
  "allowed_files": ["first-week-plan.pdf"],
  "contact": "@telegram_handle"
}
```

Notes:
- `allowed_files` must be simple filenames (no slashes).
- `expires_at` is optional. When present, expired tokens are rejected by `public/vip/download.php`.
- Avoid committing customer PII in git history.

