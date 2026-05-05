import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('home page reflects signup-first offer and launch-kit positioning', () => {
  const home = read('src/pages/index.astro');
  assert.match(home, /Sign up through NCS and get the <em>Model Launch Kit free<\/em>/);
  assert.match(home, /Apply \/ Start Signup/);
  assert.match(home, /Check Your Model Name/);
  assert.match(home, /\$200 USD standalone/);
  assert.match(home, /The model name branding app stays public and free/);
  assert.match(home, /TrustRulesBlock title="Trust rules stay public from the first click"/);
  assert.doesNotMatch(home, /growth-system/i);
  assert.doesNotMatch(home, /offer ladder/i);
});

test('launch-kit page exists with free-with-signup and paid standalone framing', () => {
  const page = read('src/pages/launch-kit.astro');
  assert.match(page, /Model Launch Kit/);
  assert.match(page, /free when you sign up through NCS/i);
  assert.match(page, /\$200 USD/);
  assert.match(page, /Platform selection guidance/);
  assert.match(page, /Beginner mistake avoidance/);
  assert.match(page, /No guaranteed earnings/i);
});

test('packages page is reframed around the launch kit rather than growth-first public offers', () => {
  const page = read('src/pages/packages.astro');
  assert.match(page, /The public offer is the <em>Model Launch Kit<\/em>/);
  assert.match(page, /\$200 USD standalone/);
  assert.match(page, /Broader support is not the main public offer/);
  assert.doesNotMatch(page, /Growth Partner/);
  assert.doesNotMatch(page, /Brand Builder/);
});

test('apply page uses signup-first language and required consent', () => {
  const page = read('src/pages/apply.astro');
  assert.match(page, /Models who sign up through NCS get the Model Launch Kit free/);
  assert.match(page, /same\s+kit is also available separately for \$200 USD/i);
  assert.match(page, /name="preferred_model_name"/);
  assert.match(page, /name="platform_interest"/);
  assert.match(page, /name="consent_18_plus" value="yes" required/);
  assert.match(page, /name="consent_updates" value="yes"/);
  assert.match(page, /Trust stays visible before submission/);
  assert.doesNotMatch(page, /Growth Partner/);
  assert.doesNotMatch(page, /Brand Builder/);
});

test('name-check page remains public and points into the signup-first funnel', () => {
  const page = read('src/pages/name-check.astro');
  assert.match(page, /Free public tool/);
  assert.match(page, /Apply \/ Start Signup/);
  assert.match(page, /View Model Launch Kit/);
  assert.match(page, /not a live availability guarantee/);
});

test('platform page uses signup-oriented CTAs and free-with-signup copy', () => {
  const page = read('src/pages/platforms.astro');
  assert.match(page, /If you sign up through NCS, you can receive the Model Launch Kit free/);
  assert.match(page, /Start Signup/);
  assert.doesNotMatch(page, /placeholder/i);
});

test('trust posture remains visible on public pages', () => {
  const trust = read('src/pages/how-it-works.astro');
  assert.match(trust, /Public trust rules/);
  assert.match(trust, /does not promise guaranteed earnings/i);
  assert.match(trust, /TrustRulesBlock title="Public trust rules"/);
});
