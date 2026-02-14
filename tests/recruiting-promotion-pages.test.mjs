import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const resolveFixturePath = (relativePath) =>
  path.join(path.dirname(fileURLToPath(import.meta.url)), '..', relativePath);

const readSource = async (relativePath) => fs.readFile(resolveFixturePath(relativePath), 'utf8');

test('Recruiting page includes tracked affiliate link builder and cross-link to promotion', async () => {
  const recruitingSource = await readSource('src/pages/recruiting.astro');
  assert.ok(recruitingSource.includes('buildTrackedLink'), 'Recruiting page should use buildTrackedLink');
  assert.ok(recruitingSource.includes("camp: 'recruiting'"), 'Recruiting links should include recruiting campaign');
  assert.ok(recruitingSource.includes("slot: `recruiting_${platform.slug}`"), 'Recruiting links should include slot tracking');
  assert.ok(recruitingSource.includes("/promotion/"), 'Recruiting page should cross-link to promotion');
});

test('Promotion page includes pricing, package forms, and cross-link to recruiting', async () => {
  const promotionSource = await readSource('src/pages/promotion.astro');
  assert.ok(promotionSource.includes('Starter Pulse'), 'Promotion page should include starter package');
  assert.ok(promotionSource.includes('Growth Engine'), 'Promotion page should include growth package');
  assert.ok(promotionSource.includes('Concierge Scale'), 'Promotion page should include concierge package');
  assert.ok(promotionSource.includes('<form method="get" action={withBase(\'/apply/\')}'), 'Promotion page should include signup forms');
  assert.ok(promotionSource.includes("/recruiting/"), 'Promotion page should cross-link to recruiting');
});
