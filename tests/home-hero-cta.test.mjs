import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { test } from 'node:test';

const resolveFixturePath = (relativePath) =>
  path.join(path.dirname(fileURLToPath(import.meta.url)), '..', relativePath);

const readSource = async (relativePath) => fs.readFile(resolveFixturePath(relativePath), 'utf8');

test('Primary CTA routes to Apply in all environments', async () => {
  const copySource = await readSource('src/data/copy.ts');
  assert.ok(copySource.includes("pagesHref: '/apply'"), 'Pages href should point to /apply');
  assert.ok(copySource.includes("prodHref: '/apply'"), 'Production href should point to /apply');
});

test('Hero partial renders recruiting + promotion CTAs', async () => {
  const heroSource = await readSource('src/partials/home/Hero.astro');
  assert.ok(heroSource.includes('Join as a Model'), 'Hero partial should show the recruiting CTA label');
  assert.ok(heroSource.includes('/join-models'), 'Hero partial should link to /join-models');
  assert.ok(heroSource.includes('Promote My Content'), 'Hero partial should show the promotion CTA label');
  assert.ok(heroSource.includes('/packages'), 'Hero partial should link to /packages');
});

test('Hero partial avoids tracked /go/ links', async () => {
  const heroSource = await readSource('src/partials/home/Hero.astro');
  assert.ok(!heroSource.includes('/go/'), 'Hero partial should not contain /go/ links');
});
