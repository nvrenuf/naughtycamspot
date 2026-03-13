import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const resolveFixturePath = (relativePath) =>
  path.join(path.dirname(fileURLToPath(import.meta.url)), '..', relativePath);

const readSource = async (relativePath) => fs.readFile(resolveFixturePath(relativePath), 'utf8');

test('Header navigation uses only Apply, Models, and Resources', async () => {
  const navSource = await readSource('src/data/nav.ts');
  const layoutSource = await readSource('src/layouts/MainLayout.astro');

  assert.ok(navSource.includes("label: 'Apply'"), 'Header nav should include Apply');
  assert.ok(navSource.includes("label: 'Models'"), 'Header nav should include Models');
  assert.ok(navSource.includes("label: 'Resources'"), 'Header nav should include Resources');
  assert.ok(!layoutSource.includes('<LinkCTA'), 'Header should not include a separate CTA button');
});

test('Footer keeps displaced secondary links reachable', async () => {
  const layoutSource = await readSource('src/layouts/MainLayout.astro');

  ["'/packages/'", "'/platforms/'", "'/proof/'", "'/how-it-works/'", "'/trust-safety/'"].forEach((href) => {
    assert.ok(layoutSource.includes(`href: ${href}`), `Footer should keep secondary route reachable: ${href}`);
  });
});
