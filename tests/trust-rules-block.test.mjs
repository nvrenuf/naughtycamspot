import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const resolveFixturePath = (relativePath) =>
  path.join(path.dirname(fileURLToPath(import.meta.url)), '..', relativePath);

const readSource = async (relativePath) => fs.readFile(resolveFixturePath(relativePath), 'utf8');

test('TrustRulesBlock includes the hard non-negotiables copy', async () => {
  const source = await readSource('src/components/TrustRulesBlock.astro');
  assert.ok(source.includes('No passwords. Ever.'), 'Trust block should state no passwords ever');
  assert.ok(source.includes('No fake ID. No underage. No exceptions.'), 'Trust block should state fake ID and age rules');
  assert.ok(source.includes('We only help with legitimate setup and promotion.'), 'Trust block should state legitimate help only');
  assert.ok(source.includes('If a platform bans for fraud, we cannot reverse it.'), 'Trust block should state fraud bans cannot be reversed');
  assert.ok(source.includes('You keep your accounts, content, payouts, and private info.'), 'Trust block should state ownership and privacy plainly');
});

test('Top-funnel pages include the shared trust rules block', async () => {
  const homeSource = await readSource('src/pages/index.astro');
  const applySource = await readSource('src/pages/apply.astro');
  const packagesSource = await readSource('src/pages/packages.astro');
  const howItWorksSource = await readSource('src/pages/how-it-works.astro');

  assert.ok(homeSource.includes("import TrustRulesBlock"), 'Homepage should import the trust rules block');
  assert.ok(homeSource.includes('<TrustRulesBlock'), 'Homepage should render the trust rules block');
  assert.ok(applySource.includes('<TrustRulesBlock'), 'Apply page should render the trust rules block');
  assert.ok(packagesSource.includes('<TrustRulesBlock'), 'Packages page should render the trust rules block');
  assert.ok(howItWorksSource.includes('<TrustRulesBlock'), 'How it works page should render the trust rules block');
});
