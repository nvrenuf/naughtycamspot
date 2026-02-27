import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const resolveFixturePath = (relativePath) =>
  path.join(path.dirname(fileURLToPath(import.meta.url)), '..', relativePath);

const readSource = async (relativePath) => fs.readFile(resolveFixturePath(relativePath), 'utf8');

test('/apply chooser links to promo and signup flows', async () => {
  const source = await readSource('src/pages/apply.astro');
  assert.ok(source.includes('/apply/promo'), 'Apply chooser should link to /apply/promo');
  assert.ok(source.includes('/apply/signup'), 'Apply chooser should link to /apply/signup');
});

test('/apply/promo contains form posting to claim endpoint', async () => {
  const source = await readSource('src/pages/apply/promo.astro');
  assert.ok(source.includes('method="post"'), 'Promo page should include a POST form');
  assert.ok(source.includes("action={formAction}"), 'Promo form should post to /claim/index.php via formAction');
  assert.ok(source.includes('name="source" value="apply_promo"'), 'Promo form should submit apply_promo source');
});

test('/apply/signup contains form posting to claim endpoint', async () => {
  const source = await readSource('src/pages/apply/signup.astro');
  assert.ok(source.includes('method="post"'), 'Signup page should include a POST form');
  assert.ok(source.includes("action={formAction}"), 'Signup form should post to /claim/index.php via formAction');
  assert.ok(source.includes('name="source" value="apply_signup"'), 'Signup form should submit apply_signup source');
});
