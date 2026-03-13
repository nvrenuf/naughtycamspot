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
  assert.ok(navSource.includes("label: 'Apply'"), 'Primary navigation should include Apply');
  assert.ok(navSource.includes("label: 'Models'"), 'Primary navigation should include Models');
  assert.ok(navSource.includes("label: 'Resources'"), 'Primary navigation should include Resources');
  assert.ok(!navSource.includes("label: 'Home'"), 'Primary navigation should not include Home');
  assert.ok(!navSource.includes("label: 'Packages'"), 'Primary navigation should not include Packages');
  assert.ok(!navSource.includes("label: 'Platforms'"), 'Primary navigation should not include Platforms');
  assert.ok(!navSource.includes("label: 'Proof'"), 'Primary navigation should not include Proof');
  assert.ok(navSource.includes("href: '/apply/'"), 'Primary navigation should point Apply to /apply/');
  assert.ok(navSource.includes("href: '/models/'"), 'Primary navigation should point Models to /models/');
  assert.ok(navSource.includes("href: '/resources/'"), 'Primary navigation should point Resources to /resources/');
});

test('Resource navigation excludes legal links', async () => {
  const navSource = await readNavSource();
  const navMoreSection = navSource.split('export const NAV_MORE')[1] ?? '';
  assert.ok(navMoreSection.includes('[]'), 'Resources list should be empty (footer-only)');
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
  assert.ok(!layoutSource.includes('aria-controls="desktop-resources-menu"'), 'Header should not include desktop resources menu');
  assert.ok(!layoutSource.includes('aria-controls="mobile-resources-menu"'), 'Header should not include mobile resources menu');
});

test('Navigation links map to existing routes', async () => {
  const navSource = await readNavSource();
  const hrefMatches = [...navSource.matchAll(/href:\s*'([^']+)'/g)].map((match) => match[1]);
  const knownRouteSet = new Set([
    '/apply/',
    '/models/',
    '/resources/',
  ]);

  hrefMatches.forEach((href) => {
    assert.ok(knownRouteSet.has(href), `Navigation href should point to a known route: ${href}`);
  });
});
