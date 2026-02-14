import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const resolveFixturePath = (relativePath) =>
  path.join(path.dirname(fileURLToPath(import.meta.url)), '..', relativePath);

const readNavSource = async () => fs.readFile(resolveFixturePath('src/data/nav.ts'), 'utf8');

test('Primary navigation includes Recruiting and Promotion top-level links', async () => {
  const navSource = await readNavSource();
  assert.ok(navSource.includes("label: 'Recruiting'"), 'Primary navigation should include Recruiting');
  assert.ok(navSource.includes("label: 'Promotion'"), 'Primary navigation should include Promotion');
  assert.ok(navSource.includes("href: '/recruiting/'"), 'Primary navigation should point Recruiting to /recruiting/');
  assert.ok(navSource.includes("href: '/promotion/'"), 'Primary navigation should point Promotion to /promotion/');
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
});
