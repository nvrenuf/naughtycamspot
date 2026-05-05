import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('home page reflects signup-first positioning and critical CTAs', () => {
  const home = read('src/pages/index.astro');
  assert.match(home, /Start your cam model brand <em>the right way<\/em>/);
  assert.match(home, /href=\{withBase\('\/apply\/'\)\}>Apply for Signup Guidance/);
  assert.match(home, /href=\{withBase\('\/name-check\/'\)\}>Check Your Model Name/);
  assert.match(home, /TrustRulesBlock title="Non-negotiable trust rules"/);
  assert.doesNotMatch(home, /April 2026/);
  assert.doesNotMatch(home, /growth-first-hero/);
});

test('packages page remains available while de-emphasizing as primary offer', () => {
  const page = read('src/pages/packages.astro');
  const offers = read('src/data/offers.ts');
  assert.match(page, /Selected Support/);
  assert.match(page, /OFFERS/);
  assert.match(offers, /Foundation \/ Start Right/);
  assert.match(offers, /Growth Partner/);
});

test('apply page uses signup-first fields and required consent', () => {
  const page = read('src/pages/apply.astro');
  assert.match(page, /name="preferred_model_name"/);
  assert.match(page, /name="platform_interest"/);
  assert.match(page, /name="consent_18_plus" value="yes" required/);
  assert.match(page, /name="consent_updates" value="yes"/);
  assert.match(page, /Trust stays visible before submission/);
  assert.doesNotMatch(page, /name="closest_stage"/);
});

test('name-check page loads with disclaimer and brandability checklist categories', () => {
  const page = read('src/pages/name-check.astro');
  assert.match(page, /Model-name brandability checker/);
  assert.match(page, /Cam platform handle consistency/);
  assert.match(page, /Social handle consistency/);
  assert.match(page, /Domain\/brand fit/);
  assert.match(page, /Link-in-bio fit/);
  assert.match(page, /Memorability\/readability/);
  assert.match(page, /This is a brandability pre-check, not a live availability guarantee/);
});

test('platform options are driven by shared platform config', () => {
  const apply = read('src/pages/apply.astro');
  const platformsPage = read('src/pages/platforms.astro');
  const platformData = read('src/data/platforms.ts');
  assert.match(platformData, /id: 'chaturbate'/);
  assert.match(platformData, /id: 'camsoda'/);
  assert.match(platformData, /id: 'bongacams'/);
  assert.match(platformData, /id: 'fansly'/);
  assert.match(apply, /\{PLATFORMS\.map\(\(platform\) => <option value=\{platform\.id\}>\{platform\.name\}<\/option>\)\}/);
  assert.match(platformsPage, /\{PLATFORMS\.map\(\(platform\) => \(/);
});
