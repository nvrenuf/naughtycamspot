import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const resolveFixturePath = (relativePath) =>
  path.join(path.dirname(fileURLToPath(import.meta.url)), '..', relativePath);

const readSource = async (relativePath) => fs.readFile(resolveFixturePath(relativePath), 'utf8');

test('Claim handler validates CSRF and stores uploads outside web root', async () => {
  const source = await readSource('public/claim/index.php');
  assert.ok(source.includes('validate_csrf_request'), 'Expected CSRF validation in claim handler');
  assert.ok(source.includes("dirname(__DIR__, 2) . '/private_data'"), 'Expected private data root outside web public directory');
  assert.ok(source.includes('maybe_run_retention_maintenance'), 'Expected retention routine hook');
});

test('Astro lead forms include CSRF token fields', async () => {
  const applySource = await readSource('src/pages/apply.astro');
  const preclickSource = await readSource('src/components/PreClickCapture.astro');
  assert.ok(applySource.includes('name="csrf_token"'), 'Apply form should include CSRF token field');
  assert.ok(preclickSource.includes('name="csrf_token"'), 'Preclick form should include CSRF token field');
  assert.ok(preclickSource.includes('/api/csrf.php'), 'Preclick should fetch CSRF token endpoint');
});

test('Security policy pages mention retention and private storage safeguards', async () => {
  const privacySource = await readSource('src/pages/privacy.astro');
  const termsSource = await readSource('src/pages/terms.astro');
  assert.ok(privacySource.includes('90 days'), 'Privacy page should mention lead retention');
  assert.ok(privacySource.includes('180 days'), 'Privacy page should mention claim retention');
  assert.ok(termsSource.includes('Data Handling'), 'Terms should include data handling section');
});
