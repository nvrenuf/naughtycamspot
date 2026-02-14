import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const resolveFixturePath = (relativePath) =>
  path.join(path.dirname(fileURLToPath(import.meta.url)), '..', relativePath);

const readSource = async (relativePath) => fs.readFile(resolveFixturePath(relativePath), 'utf8');

test('Homepage lead magnet includes an opt-in lead capture form', async () => {
  const source = await readSource('src/partials/home/LeadMagnet.astro');
  assert.ok(source.includes('data-lead-capture'), 'Lead magnet should render a lead capture form');
  assert.ok(source.includes('name="lead_form" value="1"'), 'Lead capture should post as lead_form=1');
  assert.ok(source.includes('name="consent" required'), 'Lead capture should require consent opt-in');
});

test('Claim success page guides next action and avoids dead links', async () => {
  const source = await readSource('public/claim/success.html');
  assert.ok(source.includes('noindex,nofollow'), 'Success page should be noindex');
  assert.ok(source.includes('/apply/?success=1'), 'Success page should link back to Apply');
  assert.ok(source.includes('/packages/'), 'Success page should link to Packages');
  assert.ok(source.includes('/platforms/'), 'Success page should link to Platforms');
  assert.ok(source.includes('/startright/'), 'Success page should link to StartRight');
  assert.ok(!source.includes('/starter-kit'), 'Success page should not reference missing /starter-kit path');
});

