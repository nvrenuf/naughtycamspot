import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const resolveFixturePath = (relativePath) =>
  path.join(path.dirname(fileURLToPath(import.meta.url)), '..', relativePath);

const readSource = async (relativePath) => fs.readFile(resolveFixturePath(relativePath), 'utf8');

test('Unified apply form keeps existing platform capture simple', async () => {
  const source = await readSource('src/pages/apply.astro');
  assert.ok(source.includes('name="platforms_active[]"'), 'Apply form should capture existing platforms');
  assert.ok(source.includes('Stripchat'), 'Apply form should include common platform options');
  assert.ok(source.includes('OnlyFans'), 'Apply form should include off-cam platform options');
});

test('Platforms page renders promo scope from promoOffer with coming soon routing to promo apply', async () => {
  const source = await readSource('src/pages/platforms.astro');
  assert.ok(source.includes('promoOffer.platformScope.platforms'), 'Platforms page should use promoOffer canonical platform scope');
  assert.ok(source.includes("platform.status === 'coming-soon' ? withBase('/apply/promo')"), 'Coming soon platforms should route to promo apply CTA');
});
