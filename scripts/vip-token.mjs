import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

const DEFAULT_TOKENS_PATH = path.join('public', 'logs', 'vip_tokens.jsonl');

const usage = () => `Usage:
  node scripts/vip-token.mjs --allow <file> [--allow <file> ...] [options]

Options:
  --allow <file>           Repeatable. Allowed filename (no slashes).
  --contact <value>        Optional. Telegram or email identifier (not required).
  --expires-at <iso>       Optional. ISO-8601 timestamp (e.g. 2026-03-01T00:00:00Z).
  --expires-in-days <n>    Optional. Sets expires_at to now + n days (UTC).
  --out <path>             Optional. JSONL path to append to (default: ${DEFAULT_TOKENS_PATH}).
  --dry-run                Optional. Print JSON record only; do not append.
  -h, --help               Show help.

Examples:
  node scripts/vip-token.mjs --allow first-week-plan.pdf --allow ncs-starter-checklist.pdf --contact @myhandle
  node scripts/vip-token.mjs --allow promo-caption-pack.txt --expires-in-days 14
`;

const isSafeFilename = (value) =>
  typeof value === 'string' &&
  value.length > 0 &&
  value.length <= 200 &&
  !value.includes('/') &&
  !value.includes('\\') &&
  !value.includes('..') &&
  /^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(value);

const base64Url = (buf) =>
  buf
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');

export const generateTokenRecord = ({
  allowedFiles,
  contact = '',
  expiresAt = ''
} = {}) => {
  if (!Array.isArray(allowedFiles) || allowedFiles.length === 0) {
    throw new Error('allowedFiles is required and must be a non-empty array');
  }

  const sanitizedFiles = allowedFiles.map((file) => String(file).trim()).filter(Boolean);
  if (sanitizedFiles.length === 0) {
    throw new Error('allowedFiles must include at least one filename');
  }
  for (const file of sanitizedFiles) {
    if (!isSafeFilename(file)) {
      throw new Error(`Invalid allowed file: ${file}`);
    }
  }

  const now = new Date();
  const tokenId = `tok_${base64Url(crypto.randomBytes(9))}`;
  const token = `vip_${base64Url(crypto.randomBytes(24))}`;

  const record = {
    token_id: tokenId,
    token,
    created_at: now.toISOString(),
    expires_at: expiresAt ? String(expiresAt) : '',
    allowed_files: sanitizedFiles,
    contact: contact ? String(contact) : ''
  };

  if (record.expires_at) {
    const parsed = Date.parse(record.expires_at);
    if (Number.isNaN(parsed)) {
      throw new Error(`expiresAt must be ISO-8601 parseable: ${record.expires_at}`);
    }
  }

  return record;
};

export const appendJsonlRecord = async (filePath, record) => {
  const resolved = path.resolve(String(filePath || ''));
  if (!resolved) {
    throw new Error('filePath is required');
  }

  const dir = path.dirname(resolved);
  await fs.mkdir(dir, { recursive: true });

  const line = `${JSON.stringify(record)}\n`;
  await fs.appendFile(resolved, line, 'utf8');
  return { filePath: resolved, line };
};

const parseArgs = (argv) => {
  const args = {
    allow: [],
    contact: '',
    expiresAt: '',
    expiresInDays: '',
    out: DEFAULT_TOKENS_PATH,
    dryRun: false,
    help: false
  };

  for (let i = 0; i < argv.length; i += 1) {
    const current = argv[i];

    if (current === '-h' || current === '--help') {
      args.help = true;
      continue;
    }

    if (current === '--dry-run') {
      args.dryRun = true;
      continue;
    }

    const takeValue = () => {
      const next = argv[i + 1];
      if (!next || next.startsWith('-')) {
        throw new Error(`Missing value for ${current}`);
      }
      i += 1;
      return next;
    };

    if (current === '--allow') {
      args.allow.push(takeValue());
      continue;
    }

    if (current === '--contact') {
      args.contact = takeValue();
      continue;
    }

    if (current === '--expires-at') {
      args.expiresAt = takeValue();
      continue;
    }

    if (current === '--expires-in-days') {
      args.expiresInDays = takeValue();
      continue;
    }

    if (current === '--out') {
      args.out = takeValue();
      continue;
    }

    throw new Error(`Unknown argument: ${current}`);
  }

  return args;
};

const computeExpiresAt = ({ expiresAt, expiresInDays }) => {
  if (expiresAt && expiresInDays) {
    throw new Error('Use only one of --expires-at or --expires-in-days');
  }

  if (expiresAt) {
    return expiresAt;
  }

  if (!expiresInDays) {
    return '';
  }

  const days = Number(expiresInDays);
  if (!Number.isFinite(days) || days <= 0) {
    throw new Error('--expires-in-days must be a positive number');
  }

  const now = new Date();
  const ms = Math.round(days * 24 * 60 * 60 * 1000);
  return new Date(now.getTime() + ms).toISOString();
};

export const main = async () => {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    process.stdout.write(`${usage()}\n`);
    return;
  }

  const expiresAt = computeExpiresAt({ expiresAt: args.expiresAt, expiresInDays: args.expiresInDays });

  const record = generateTokenRecord({
    allowedFiles: args.allow,
    contact: args.contact,
    expiresAt
  });

  if (args.dryRun) {
    process.stdout.write(`${JSON.stringify(record)}\n`);
    return;
  }

  const { filePath } = await appendJsonlRecord(args.out, record);
  process.stdout.write(`Appended VIP token record to ${filePath}\n`);
  process.stdout.write(`Token: ${record.token}\n`);
  process.stdout.write(`Token ID: ${record.token_id}\n`);
};

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    process.stderr.write(`${err?.message || String(err)}\n`);
    process.exitCode = 1;
  });
}

