import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { cleanupBuilds, readOutputFile } from './utils/build.js';

const readPromoDrops = (mode) => readOutputFile(mode, ['promo-drops', 'index.html']);

test('Promo Drops page builds in production and includes required sections + CTA', async () => {
  const { html } = await readPromoDrops('prod');

  assert.ok(html.includes('Promo Drops'), 'Promo Drops page should render headline copy');
  assert.ok(html.includes('Weekly Drops'), 'Promo Drops page should explain Weekly Drops');
  assert.ok(html.includes('Telegram Delivery'), 'Promo Drops page should mention Telegram delivery');
  assert.ok(html.includes('Optional X Posting Packs'), 'Promo Drops page should mention optional X posting packs');
  assert.ok(html.includes('What You Provide'), 'Promo Drops page should list what the client provides');
  assert.ok(html.includes('Apply'), 'Promo Drops page should include an Apply CTA');
  assert.ok(html.includes('Buy Package'), 'Promo Drops page should include a Buy Package CTA');
});

after(cleanupBuilds);

