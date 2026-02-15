import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const resolveFixturePath = (relativePath) =>
  path.join(path.dirname(fileURLToPath(import.meta.url)), '..', relativePath);

const readSource = async (relativePath) => fs.readFile(resolveFixturePath(relativePath), 'utf8');

test('Resources, community, and events pages are present', async () => {
  const resources = await readSource('src/pages/resources/platforms.astro');
  const community = await readSource('src/pages/community.astro');
  const events = await readSource('src/pages/events.astro');
  assert.ok(resources.includes('OnlyFans'), 'Resources page should include OnlyFans guide');
  assert.ok(resources.includes('ManyVids'), 'Resources page should include ManyVids guide');
  assert.ok(community.includes('discord.gg'), 'Community page should include Discord invite');
  assert.ok(events.includes('Upcoming events'), 'Events page should include event listing');
});

test('Navigation exposes guides, community, and events links', async () => {
  const layoutSource = await readSource('src/layouts/MainLayout.astro');
  assert.ok(layoutSource.includes("href: '/resources/platforms/'"), 'Footer should include platform resources');
  assert.ok(layoutSource.includes("href: '/community/'"), 'Footer should include community');
  assert.ok(layoutSource.includes("href: '/events/'"), 'Footer should include events');
});

test('Educational content includes pricing/retention and cross-promotion posts', async () => {
  const pricing = await readSource('src/content/blog/pricing-retention-social-media-sprint.md');
  const crossPromo = await readSource('src/content/blog/cross-promotion-systems-for-creators.md');
  assert.ok(pricing.includes('Educational video outline'), 'Pricing post should include video module guidance');
  assert.ok(crossPromo.includes('Cross-promotion formats'), 'Cross-promotion post should include tactical framework');
});
