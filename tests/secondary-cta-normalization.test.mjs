import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const resolveFixturePath = (relativePath) =>
  path.join(path.dirname(fileURLToPath(import.meta.url)), '..', relativePath);

const readSource = async (relativePath) => fs.readFile(resolveFixturePath(relativePath), 'utf8');

test('Shared secondary CTA block routes back to the primary apply path', async () => {
  const source = await readSource('src/components/SecondaryPageCTA.astro');
  assert.ok(source.includes('PRIMARY_CTA'), 'Secondary CTA block should reuse the primary CTA');
  assert.ok(source.includes("pagesHref={PRIMARY_CTA.pagesHref}"), 'Secondary CTA block should route pages build to apply');
  assert.ok(source.includes("prodHref={PRIMARY_CTA.prodHref}"), 'Secondary CTA block should route prod build to apply');
});

test('Core secondary pages include the shared apply CTA block', async () => {
  const pages = [
    'src/pages/packages.astro',
    'src/pages/proof.astro',
    'src/pages/platforms.astro',
    'src/pages/promotion.astro',
    'src/pages/earnings.astro',
    'src/pages/how-it-works.astro'
  ];

  for (const page of pages) {
    const source = await readSource(page);
    assert.ok(source.includes('<SecondaryPageCTA'), `${page} should include the shared secondary CTA block`);
  }
});
