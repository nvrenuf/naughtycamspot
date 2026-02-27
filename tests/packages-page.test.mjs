import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const resolveFixturePath = (relativePath) =>
  path.join(path.dirname(fileURLToPath(import.meta.url)), '..', relativePath);

const readSource = async (relativePath) => fs.readFile(resolveFixturePath(relativePath), 'utf8');

test('Packages page lists sprint, monthly, and add-on sections from promoOffer', async () => {
  const source = await readSource('src/pages/packages.astro');
  assert.ok(source.includes('promoOffer.sprintOffers.map'), 'Packages page should render sprint offers from promoOffer');
  assert.ok(source.includes('promoOffer.monthlyTiers.map'), 'Packages page should render monthly tiers from promoOffer');
  assert.ok(source.includes('promoOffer.addOns.map'), 'Packages page should render add-ons from promoOffer');
  assert.ok(source.includes('What you provide'), 'Packages page should include model responsibilities section');
  assert.ok(source.includes('What we don'), 'Packages page should include trust/limitations section');
});

test('Packages page keeps trust policy and apply CTAs explicit', async () => {
  const source = await readSource('src/pages/packages.astro');
  assert.ok(source.includes('no passwords'), 'Packages page should state no passwords');
  assert.ok(source.includes('no exclusivity'), 'Packages page should state no exclusivity');
  assert.ok(source.includes('you own accounts and content'), 'Packages page should state ownership policy');
  assert.ok(source.includes('/apply/promo'), 'Packages page should include promo apply links');
  assert.ok(source.includes('package: packageId'), 'Packages page should build package query parameters');
});
