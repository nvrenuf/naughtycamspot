import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('home page includes April 2026 launch positioning and two-path content', () => {
  const home = read('src/pages/index.astro');
  assert.match(home, /Live April 2026/);
  assert.match(home, /id="growth-first-hero"/);
  assert.match(home, /The next promotional and growth line clearly goes live in April 2026/);
  assert.match(home, /What April unlocks/);
  assert.match(home, /Already modeling\?/);
  assert.match(home, /Launching fresh\?/);
  assert.match(home, /id="final-cta"/);
  assert.doesNotMatch(home, /Get set up/);
  assert.doesNotMatch(home, /Apply once and start earning faster/);
});

test('packages page consumes the canonical offer ladder', () => {
  const page = read('src/pages/packages.astro');
  const offers = read('src/data/offers.ts');
  assert.match(page, /OFFERS/);
  assert.match(page, /Offer Ladder/);
  assert.match(offers, /Foundation \/ Start Right/);
  assert.match(offers, /Growth Partner/);
});

test('apply page consumes the canonical offer ladder', () => {
  const page = read('src/pages/apply.astro');
  assert.match(page, /OFFERS/);
  assert.match(page, /Which stage sounds closest\?/);
  assert.match(page, /Trust stays visible before submission/);
});
