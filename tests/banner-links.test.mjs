import { test } from 'node:test';
import assert from 'node:assert/strict';

const loadLinksModule = async (env = {}) => {
  const keys = Object.keys(env);
  const previous = {};

  for (const key of keys) {
    previous[key] = process.env[key];
    process.env[key] = env[key];
  }

  const mod = await import(`../src/utils/links.js?seed=${Math.random()}`);

  for (const key of keys) {
    if (typeof previous[key] === 'undefined') {
      delete process.env[key];
    } else {
      process.env[key] = previous[key];
    }
  }

  return mod;
};

const sample = {
  path: '/go/sample-offer.php',
  slot: 'home_top_leaderboard',
  camp: 'home',
  placeholder:
    'https://leads.naughtycamspot.com/sponsor/home/home_top_leaderboard?slot=home_top_leaderboard&camp=home'
};

test('Pages builds route banners to StartRight', async () => {
  const { buildTrackedLink } = await loadLinksModule({ ASTRO_BASE_URL: '/naughtycamspot/' });
  const href = buildTrackedLink(sample);
  assert.ok(!href.startsWith('/go/'), 'Pages href must not point to /go/');
  assert.equal(href, '/naughtycamspot/startright', 'Pages href should point to StartRight');
  assert.ok(!href.includes('?'), 'Pages href should not contain query params');
});

test('Production builds generate tracked /go/ links', async () => {
  const { buildTrackedLink } = await loadLinksModule({});
  const href = buildTrackedLink(sample);
  assert.ok(href.startsWith('/go/'), 'Production href should use /go/ path');
  assert.ok(href.includes('src=home_top_leaderboard'), 'href must include src param');
  assert.ok(href.includes('camp=home'), 'href must include camp param');
});
