import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const projectRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const readSource = async (relativePath) => fs.readFile(path.join(projectRoot, relativePath), 'utf8');

test('VIP download endpoint exists and includes basic traversal/token guards', async () => {
  const source = await readSource('public/vip/download.php');

  assert.ok(source.includes("vip_tokens.jsonl"), "Expected download endpoint to validate against vip_tokens.jsonl");
  assert.ok(source.includes("vip_downloads.jsonl"), "Expected download endpoint to log to vip_downloads.jsonl");
  assert.ok(source.includes('allowed_files'), 'Expected download endpoint to validate requested file against allowed_files');

  // Traversal hardening signals.
  assert.ok(source.includes('realpath('), 'Expected realpath usage for path normalization');
  assert.ok(source.includes('strpos($resolvedPath, $prefix) !== 0'), 'Expected realpath prefix guard');
  assert.ok(source.includes('..'), 'Expected dot-dot guard to be present');
});
