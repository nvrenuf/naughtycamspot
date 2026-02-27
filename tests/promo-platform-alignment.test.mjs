import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const resolveFixturePath = (relativePath) =>
  path.join(path.dirname(fileURLToPath(import.meta.url)), '..', relativePath);

const readSource = async (relativePath) => fs.readFile(resolveFixturePath(relativePath), 'utf8');

test('Apply promo platform checkboxes render from promoOffer and keep coming soon disabled', async () => {
  const source = await readSource('src/pages/apply/promo.astro');
  assert.ok(source.includes('promoOffer.platformScope.platforms'), 'Apply promo page should use promoOffer canonical platform scope');
  assert.ok(source.includes('name="platform_interest[]"'), 'Apply promo page should keep platform_interest[] fields');
  assert.ok(source.includes('disabled={platform.status !== \'live\'}'), 'Only live promo platforms should be selectable');
  assert.ok(source.includes("(coming soon)"), 'Coming soon promo platform should be visibly labeled');
});

test('Platforms page renders promo scope from promoOffer with coming soon routing to promo apply', async () => {
  const source = await readSource('src/pages/platforms.astro');
  assert.ok(source.includes('promoOffer.platformScope.platforms'), 'Platforms page should use promoOffer canonical platform scope');
  assert.ok(source.includes("platform.status === 'coming-soon' ? withBase('/apply/promo')"), 'Coming soon platforms should route to promo apply CTA');
});
