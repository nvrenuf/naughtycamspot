import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const projectRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

test('Watermarking docs exist and include required watermark string', async () => {
  const docPath = path.join(projectRoot, 'docs', 'watermarking.md');
  const contents = await fs.readFile(docPath, 'utf8');
  assert.ok(contents.includes('Licensed to [Telegram/email]'), 'Doc should include watermark prefix');
  assert.ok(contents.includes('Do not redistribute'), 'Doc should include watermark suffix');
  assert.ok(
    contents.includes('Licensed to [Telegram/email] – Do not redistribute'),
    'Doc should include the exact watermark string'
  );
});
