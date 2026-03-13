import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const resolveFixturePath = (relativePath) =>
  path.join(path.dirname(fileURLToPath(import.meta.url)), '..', relativePath);

const readSource = async (relativePath) => fs.readFile(resolveFixturePath(relativePath), 'utf8');

test('/apply renders one unified guided form', async () => {
  const source = await readSource('src/pages/apply.astro');
  assert.ok(source.includes('name="source" value="apply_unified"'), 'Apply form should submit unified apply source');
  assert.ok(source.includes('1. Basics'), 'Apply form should show guided step one');
  assert.ok(source.includes('2. Goal'), 'Apply form should show guided step two');
  assert.ok(source.includes('3. Existing platforms'), 'Apply form should show guided step three');
  assert.ok(source.includes('4. Best contact'), 'Apply form should show guided step four');
  assert.ok(source.includes('5. Consent'), 'Apply form should show guided step five');
  assert.ok(source.includes('name="contact_value"'), 'Apply form should use one contact detail field');
});

test('/apply contains form posting to claim endpoint', async () => {
  const source = await readSource('src/pages/apply.astro');
  assert.ok(source.includes('method="post"'), 'Apply page should include a POST form');
  assert.ok(source.includes("action={formAction}"), 'Apply form should post to /claim/index.php via formAction');
  assert.ok(source.includes('name="csrf_token"'), 'Apply form should include a CSRF token field');
});

test('legacy apply routes redirect to the unified form', async () => {
  const promoSource = await readSource('src/pages/apply/promo.astro');
  const signupSource = await readSource('src/pages/apply/signup.astro');
  assert.ok(promoSource.includes('url=${destination}'), 'Promo apply route should redirect to unified apply');
  assert.ok(signupSource.includes('url=${destination}'), 'Signup apply route should redirect to unified apply');
  assert.ok(promoSource.includes("withBase('/apply')"), 'Promo apply route should point at /apply');
  assert.ok(signupSource.includes("withBase('/apply')"), 'Signup apply route should point at /apply');
});
