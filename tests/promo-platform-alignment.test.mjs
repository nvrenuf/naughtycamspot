import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const resolveFixturePath = (relativePath) =>
  path.join(path.dirname(fileURLToPath(import.meta.url)), '..', relativePath);

const readSource = async (relativePath) => fs.readFile(resolveFixturePath(relativePath), 'utf8');

test('Unified apply form keeps existing platform capture simple', async () => {
  const source = await readSource('src/pages/apply.astro');
  assert.ok(source.includes('name="platforms_active[]"'), 'Apply form should capture existing platforms');
  assert.ok(source.includes('Stripchat'), 'Apply form should include common platform options');
  assert.ok(source.includes('OnlyFans'), 'Apply form should include off-cam platform options');
});

test('Platforms page uses canonical platform data and sends waitlist platforms back to apply', async () => {
  const source = await readSource('src/pages/platforms.astro');
  assert.ok(source.includes("import { PLATFORMS } from '../data/platforms';"), 'Platforms page should use canonical platform data');
  assert.ok(source.includes("const isLiveSignup = platform.status !== 'waitlist';"), 'Platforms page should gate live signup links on canonical status');
  assert.ok(source.includes("withBase('/apply')"), 'Waitlist platforms should route back to apply');
});
