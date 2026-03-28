import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const extractLabels = (source, varName) => {
  const match = source.match(new RegExp(`const ${varName}[^=]*= \\[(.*?)\\];`, 's'));
  assert.ok(match, `expected ${varName} declaration`);
  return Array.from(match[1].matchAll(/label: '([^']+)'/g)).map((entry) => entry[1]);
};

test('primary navigation matches growth-first structure', () => {
  const nav = readFileSync(new URL('../src/data/nav.ts', import.meta.url), 'utf8');
  assert.deepEqual(extractLabels(nav, 'NAV_PRIMARY'), ['Home', 'Growth', 'How It Works', 'Proof', 'Apply']);
});

test('footer navigation is limited to utility links', () => {
  const layout = readFileSync(new URL('../src/layouts/MainLayout.astro', import.meta.url), 'utf8');
  assert.deepEqual(extractLabels(layout, 'footerLinks'), ['Platforms', 'Privacy', 'Terms', 'Disclosure']);
});
