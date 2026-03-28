import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('home page includes growth-first and two-path content', () => {
  const home = read('src/pages/index.astro');
  assert.match(home, /Premium Growth Business/);
  assert.match(home, /Four-pillar revenue system/);
  assert.match(home, /Already modeling\?/);
  assert.match(home, /Professional Onboarding Tools/);
});

test('how-it-works defines Start Right unlock sequence', () => {
  const page = read('src/pages/how-it-works.astro');
  assert.match(page, /Use Professional Onboarding Tools/);
  assert.match(page, /Signup through routed path/);
  assert.match(page, /Unlock Start Right after successful signup completion/);
});

test('apply page includes required launch platforms', () => {
  const page = read('src/pages/apply.astro');
  for (const platform of ['Chaturbate', 'CamSoda', 'BongaCams', 'Fansly']) {
    assert.match(page, new RegExp(platform));
  }
});
