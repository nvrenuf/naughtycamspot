import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { cleanupBuilds, readOutputFile } from './utils/build.js';

const readTrustSafety = (mode) => readOutputFile(mode, ['trust-safety', 'index.html']);
const readHome = (mode) => readOutputFile(mode, ['index.html']);

test('Trust & Safety page builds in production and includes required trust bullets', async () => {
  const { html } = await readTrustSafety('prod');

  assert.ok(html.includes('Trust &amp; Safety') || html.includes('Trust & Safety'), 'Trust & Safety page should render heading');
  ['No Passwords', 'No Exclusivity', 'Model Owns Accounts', 'Cancel Anytime', 'Not An Agency', 'No Earnings Guarantee', 'Affiliate Disclosure'].forEach(
    (needle) => assert.ok(html.includes(needle), `Trust & Safety page should include: ${needle}`)
  );
});

test('Footer links include /trust-safety/', async () => {
  const { html } = await readHome('prod');
  assert.ok(html.includes('href="/trust-safety/"'), 'Footer should link to /trust-safety/');
});

after(cleanupBuilds);

