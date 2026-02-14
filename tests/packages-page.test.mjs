import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const resolveFixturePath = (relativePath) =>
  path.join(path.dirname(fileURLToPath(import.meta.url)), '..', relativePath);

const readSource = async (relativePath) => fs.readFile(resolveFixturePath(relativePath), 'utf8');

test('Packages page lists three mobile-scannable tiers', async () => {
  const source = await readSource('src/pages/packages.astro');
  assert.ok(source.includes('Starter Pulse'), 'Packages page should include Starter tier');
  assert.ok(source.includes('Growth Engine'), 'Packages page should include Growth tier');
  assert.ok(source.includes('Concierge Scale'), 'Packages page should include Concierge tier');
  assert.ok(source.includes('Deliverables'), 'Packages page should include deliverables section');
  assert.ok(source.includes('Model provides'), 'Packages page should include model-provided section');
  assert.ok(source.includes('What we do not do'), 'Packages page should include limitations section');
});

test('Packages page keeps trust policy and apply CTAs explicit', async () => {
  const source = await readSource('src/pages/packages.astro');
  assert.ok(source.includes('no passwords'), 'Packages page should state no passwords');
  assert.ok(source.includes('no exclusivity'), 'Packages page should state no exclusivity');
  assert.ok(source.includes('you own accounts and content'), 'Packages page should state ownership policy');
  assert.ok(source.includes('/apply/'), 'Packages page should include apply links');
});
