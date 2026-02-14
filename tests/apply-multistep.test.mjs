import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const resolveFixturePath = (relativePath) =>
  path.join(path.dirname(fileURLToPath(import.meta.url)), '..', relativePath);

const readSource = async (relativePath) => fs.readFile(resolveFixturePath(relativePath), 'utf8');

test('Apply page uses multi-step form with progress controls', async () => {
  const source = await readSource('src/pages/apply.astro');
  assert.ok(source.includes('data-multistep-form'), 'Apply page should include multi-step form marker');
  assert.ok(source.includes('data-form-step'), 'Apply page should include step containers');
  assert.ok(source.includes('data-step-progress-bar'), 'Apply page should include progress bar marker');
  assert.ok(source.includes('data-step-next'), 'Apply page should include next-step control');
  assert.ok(source.includes('data-step-prev'), 'Apply page should include previous-step control');
});

test('Apply page keeps claim endpoint submission and consent requirement', async () => {
  const source = await readSource('src/pages/apply.astro');
  assert.ok(source.includes("action={formAction}"), 'Apply form should continue posting to claim endpoint');
  assert.ok(source.includes('name="consent" required'), 'Apply form should require consent checkbox');
  assert.ok(source.includes('No passwords. No exclusivity. You keep your accounts.'), 'Apply page should retain trust posture copy');
});
