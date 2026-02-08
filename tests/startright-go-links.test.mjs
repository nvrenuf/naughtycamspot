import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { test } from 'node:test';

const resolveFixturePath = (relativePath) =>
  path.join(path.dirname(fileURLToPath(import.meta.url)), '..', relativePath);

const readSource = async (relativePath) => fs.readFile(resolveFixturePath(relativePath), 'utf8');

test('StartRight and earnings retain /go/ routes for production joins', async () => {
  const startrightSource = await readSource('src/pages/startright.astro');
  ['/go/bonga', '/go/camsoda', '/go/chaturbate'].forEach((href) => {
    assert.ok(startrightSource.includes(href), `Expected StartRight to include ${href}`);
  });

  const earningsSource = await readSource('src/pages/earnings.astro');
  assert.ok(earningsSource.includes('/go/model-join.php'), 'Expected earnings to include /go/model-join.php');
});

test('Platforms data retains /go/ paths for production', async () => {
  const platformsSource = await readSource('src/data/platforms.ts');
  ['/go/stripchat', '/go/chaturbate', '/go/camsoda', '/go/bonga'].forEach((href) => {
    assert.ok(platformsSource.includes(href), `Expected platforms data to include ${href}`);
  });
});
