import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const resolveFixturePath = (relativePath) =>
  path.join(path.dirname(fileURLToPath(import.meta.url)), '..', relativePath);

const readSource = async (relativePath) => fs.readFile(resolveFixturePath(relativePath), 'utf8');

test('Packages page renders promo ladder sections from promoOffer data', async () => {
  const source = await readSource('src/pages/packages.astro');

  assert.ok(source.includes("import { promoOffer } from '../data/promoOffer';"));
  assert.ok(source.includes('Sprint offers'));
  assert.ok(source.includes('Monthly tiers'));
  assert.ok(source.includes('Add-ons menu'));
  assert.ok(source.includes('{promoOffer.whatYouProvide.title}'));
  assert.ok(source.includes('{promoOffer.nonNegotiables.title}'));
  assert.ok(source.includes('promoOffer.sprintOffers.map'));
  assert.ok(source.includes('promoOffer.monthlyTiers.map'));
  assert.ok(source.includes('promoOffer.addons.map'));
});

test('Packages page CTA links prefill apply route with stable package ids', async () => {
  const source = await readSource('src/pages/packages.astro');

  assert.ok(source.includes("withBase('/apply/promo')"));
  assert.ok(source.includes('new URLSearchParams({ package: packageId })'));
  assert.ok(source.includes('href={buildApplyHref(offer.id)}'));
  assert.ok(source.includes('href={buildApplyHref(tier.id)}'));
  assert.ok(source.includes('href={buildApplyHref(addon.id)}'));
});

test('Promo offer data includes required non-negotiables and platform scope', async () => {
  const source = await readSource('src/data/promoOffer.ts');

  assert.ok(source.includes("active: ['Chaturbate', 'CamSoda', 'BongaCams']"));
  assert.ok(source.includes("comingSoon: ['Stripchat (coming soon)']"));
  assert.ok(source.includes('No passwords or direct login handover requests.'));
  assert.ok(source.includes('No exclusivity terms or account ownership transfer.'));
  assert.ok(source.includes('No spam DM automation.'));
  assert.ok(source.includes('No earnings guarantees.'));
  assert.ok(source.includes('Cancel anytime based on your renewal cycle.'));
});
