import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const resolveFixturePath = (relativePath) =>
  path.join(path.dirname(fileURLToPath(import.meta.url)), '..', relativePath);

const readNavSource = async () => fs.readFile(resolveFixturePath('src/data/nav.ts'), 'utf8');

test('Primary navigation includes core funnel top-level links', async () => {
  const navSource = await readNavSource();
  assert.ok(navSource.includes("label: 'Home'"), 'Primary navigation should include Home');
  assert.ok(navSource.includes("label: 'Packages'"), 'Primary navigation should include Packages');
  assert.ok(navSource.includes("label: 'How It Works'"), 'Primary navigation should include How It Works');
  assert.ok(navSource.includes("label: 'Apply'"), 'Primary navigation should include Apply');
  assert.ok(navSource.includes("label: 'Platforms'"), 'Primary navigation should include Platforms');
  assert.ok(navSource.includes("href: '/packages/'"), 'Primary navigation should point Packages to /packages/');
  assert.ok(navSource.includes("href: '/how-it-works/'"), 'Primary navigation should point How It Works to /how-it-works/');
  assert.ok(navSource.includes("href: '/apply/'"), 'Primary navigation should point Apply to /apply/');
  assert.ok(navSource.includes("href: '/platforms/'"), 'Primary navigation should point Platforms to /platforms/');
});

test('Resource navigation excludes legal links', async () => {
  const navSource = await readNavSource();
  const navMoreSection = navSource.split('export const NAV_MORE')[1] ?? '';
  assert.ok(!navMoreSection.includes("label: 'Privacy'"), 'Resources should not include Privacy');
  assert.ok(!navMoreSection.includes("label: 'Terms'"), 'Resources should not include Terms');
  assert.ok(!navMoreSection.includes("label: 'Disclosure'"), 'Resources should not include Disclosure');
});

test('Navigation hrefs use trailing slash routing', async () => {
  const navSource = await readNavSource();
  const hrefMatches = [...navSource.matchAll(/href:\s*'([^']+)'/g)].map((match) => match[1]);
  hrefMatches.forEach((href) => {
    if (href === '/') {
      return;
    }
    assert.ok(href.endsWith('/'), `Navigation link should end with slash: ${href}`);
  });
});

test('Desktop and mobile resources triggers include ARIA controls', async () => {
  const layoutSource = await fs.readFile(resolveFixturePath('src/layouts/MainLayout.astro'), 'utf8');
  assert.ok(
    layoutSource.includes('aria-controls="desktop-resources-menu"'),
    'Desktop Resources trigger should define aria-controls'
  );
  assert.ok(
    layoutSource.includes('aria-controls="mobile-resources-menu"'),
    'Mobile Resources trigger should define aria-controls'
  );
  assert.ok(layoutSource.includes('Getting Started'), 'Resources menu should include Getting Started section');
  assert.ok(layoutSource.includes('Guides'), 'Resources menu should include Guides section');
  assert.ok(layoutSource.includes('Community'), 'Resources menu should include Community section');
  assert.ok(layoutSource.includes('Insights'), 'Resources menu should include Insights section');
});

test('Navigation links map to existing routes', async () => {
  const navSource = await readNavSource();
  const hrefMatches = [...navSource.matchAll(/href:\s*'([^']+)'/g)].map((match) => match[1]);
  const knownRouteSet = new Set([
    '/',
    '/packages/',
    '/how-it-works/',
    '/apply/',
    '/platforms/',
    '/startright/',
    '/recruiting/',
    '/promotion/',
    '/resources/platforms/',
    '/gear-kits/',
    '/community/',
    '/events/',
    '/proof/',
    '/earnings/',
    '/blog/'
  ]);

  hrefMatches.forEach((href) => {
    assert.ok(knownRouteSet.has(href), `Navigation href should point to a known route: ${href}`);
  });
});
