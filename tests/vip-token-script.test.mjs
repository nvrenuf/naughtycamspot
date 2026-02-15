import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { appendJsonlRecord, generateTokenRecord } from '../scripts/vip-token.mjs';

test('VIP token script generates a deterministic JSON record shape', async () => {
  const record = generateTokenRecord({
    allowedFiles: ['first-week-plan.pdf', 'promo-caption-pack.txt'],
    contact: '@example'
  });

  assert.equal(typeof record.token_id, 'string');
  assert.ok(record.token_id.startsWith('tok_'));

  assert.equal(typeof record.token, 'string');
  assert.ok(record.token.startsWith('vip_'));
  assert.ok(record.token.length > 20);

  assert.equal(typeof record.created_at, 'string');
  assert.ok(Number.isFinite(Date.parse(record.created_at)));

  assert.equal(record.expires_at, '');
  assert.deepEqual(record.allowed_files, ['first-week-plan.pdf', 'promo-caption-pack.txt']);
  assert.equal(record.contact, '@example');
});

test('VIP token script rejects unsafe allowed file names', async () => {
  assert.throws(
    () => generateTokenRecord({ allowedFiles: ['../secret.pdf'] }),
    /Invalid allowed file/i
  );
  assert.throws(
    () => generateTokenRecord({ allowedFiles: ['a/b.pdf'] }),
    /Invalid allowed file/i
  );
});

test('VIP token script appends a single JSONL line with trailing newline', async () => {
  const record = generateTokenRecord({
    allowedFiles: ['first-week-plan.pdf'],
    contact: ''
  });

  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ncs-vip-token-'));
  const targetPath = path.join(tempDir, 'vip_tokens.jsonl');

  await appendJsonlRecord(targetPath, record);
  const contents = await fs.readFile(targetPath, 'utf8');

  assert.ok(contents.endsWith('\n'), 'JSONL must end with a newline');
  assert.equal(contents, `${JSON.stringify(record)}\n`, 'JSONL line must be exactly the JSON record + newline');

  const parsed = JSON.parse(contents.trim());
  assert.equal(parsed.token, record.token);
  assert.deepEqual(parsed.allowed_files, record.allowed_files);
});

