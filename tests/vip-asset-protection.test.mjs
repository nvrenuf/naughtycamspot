import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { readOutputFile, cleanupBuilds } from './utils/build.js';

const readVipUnlocked = (mode) => readOutputFile(mode, ['vip-kit-unlocked', 'index.html']);

test('VIP pages do not hard-link to /vip/*.pdf assets', async () => {
  const { html } = await readVipUnlocked('prod');

  assert.ok(!html.includes('href="/vip/first-week-plan.pdf"'), 'Should not link directly to /vip/first-week-plan.pdf');
  assert.ok(!html.includes('href="/vip/ncs-starter-checklist.pdf"'), 'Should not link directly to /vip/ncs-starter-checklist.pdf');
  assert.ok(html.includes('/vip/download.php?file='), 'Expected token download endpoint links');
});

after(cleanupBuilds);
