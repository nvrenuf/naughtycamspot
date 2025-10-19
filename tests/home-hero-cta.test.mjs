import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { test } from 'node:test';

const resolveFixturePath = (relativePath) =>
  path.join(path.dirname(fileURLToPath(import.meta.url)), '..', relativePath);

const readSource = async (relativePath) => fs.readFile(resolveFixturePath(relativePath), 'utf8');

test('Primary CTA routes to StartRight in all environments', async () => {
  const copySource = await readSource('src/data/copy.ts');
  assert.ok(copySource.includes("pagesHref: '/startright'"), 'Pages href should point to /startright');
  assert.ok(copySource.includes("prodHref: '/startright'"), 'Production href should point to /startright');
});

test('Hero partial wires secondary CTA to Join Models', async () => {
  const heroSource = await readSource('src/partials/home/Hero.astro');
  assert.ok(heroSource.includes("'/join-models'"), 'Hero partial should link to /join-models');
});

test('Hero partial avoids tracked /go/ links', async () => {
  const heroSource = await readSource('src/partials/home/Hero.astro');
  assert.ok(!heroSource.includes('/go/'), 'Hero partial should not contain /go/ links');
});
