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

test('how-it-works defines Start Right unlock sequence', () => {
  const page = read('src/pages/how-it-works.astro');
  assert.match(page, /Use Professional Onboarding Tools/);
  assert.match(page, /Signup through routed path/);
  assert.match(page, /Unlock Start Right/);
});

test('apply page includes required launch platforms', () => {
  const page = read('src/pages/apply.astro');
  assert.match(page, /The bigger line goes live in April 2026/);
  assert.match(page, /founding model consideration/i);
  for (const platform of ['Chaturbate', 'CamSoda', 'BongaCams', 'Fansly']) {
    assert.match(page, new RegExp(platform));
  }
});
