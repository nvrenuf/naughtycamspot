import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const resolveFixturePath = (relativePath) =>
  path.join(path.dirname(fileURLToPath(import.meta.url)), '..', relativePath);

const readSource = async (relativePath) => fs.readFile(resolveFixturePath(relativePath), 'utf8');

test('Packages page renders promoOffer sprint, monthly, and add-ons sections', async () => {
  const source = await readSource('src/pages/packages.astro');
  assert.ok(source.includes('Sprint offers'), 'Packages page should include sprint offers section');
  assert.ok(source.includes('promoOffer.sprintOffers.map'), 'Packages page should render sprint offers from promoOffer');
  assert.ok(source.includes('Monthly tiers'), 'Packages page should include monthly tiers section');
  assert.ok(source.includes('promoOffer.monthlyTiers.map'), 'Packages page should render monthly tiers from promoOffer');
  assert.ok(source.includes('Add-ons'), 'Packages page should include add-ons section');
  assert.ok(source.includes('promoOffer.addOns.map'), 'Packages page should render add-ons from promoOffer');
});

test('Packages page keeps trust policy and apply CTAs explicit', async () => {
  const source = await readSource('src/pages/packages.astro');
  assert.ok(source.includes('no passwords'), 'Packages page should state no passwords');
  assert.ok(source.includes('no exclusivity'), 'Packages page should state no exclusivity');
  assert.ok(source.includes('you own accounts and content'), 'Packages page should state ownership policy');
  assert.ok(source.includes('/apply/promo'), 'Packages page should include promo apply links');
});
