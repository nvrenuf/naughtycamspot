import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const resolveFixturePath = (relativePath) =>
  path.join(path.dirname(fileURLToPath(import.meta.url)), '..', relativePath);

const readSource = async (relativePath) => fs.readFile(resolveFixturePath(relativePath), 'utf8');

test('Apply page uses one-screen Fast Lane with optional details section', async () => {
  const source = await readSource('src/pages/apply.astro');
  assert.ok(source.includes('Step 1 of 4'), 'Apply page should show progress step label');
  assert.ok(source.includes('data-apply-progress'), 'Apply page should include progress container');
  assert.ok(source.includes('Fast Lane'), 'Apply page should show Fast Lane section first');
  assert.ok(source.includes('Improve my match (optional)'), 'Apply page should include optional details toggle');
  assert.ok(source.includes('name="telegram"'), 'Apply page should include Telegram field');
  assert.ok(source.includes('name="platforms_interested[]"'), 'Apply page should include platform interest checkboxes');
  assert.ok(source.includes('Submit application'), 'Apply page should include a submit button in Fast Lane');
});

test('Apply page keeps claim endpoint submission and consent requirement', async () => {
  const source = await readSource('src/pages/apply.astro');
  assert.ok(source.includes("action={formAction}"), 'Apply form should continue posting to claim endpoint');
  assert.ok(source.includes('name="consent" required'), 'Apply form should require consent checkbox');
  assert.ok(source.includes("apply.fastlane.trust"), 'Apply page should retain trust posture translation key');
});
