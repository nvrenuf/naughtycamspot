import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const extractLabels = (source, varName) => {
  const match = source.match(new RegExp(`const ${varName}[^=]*= \\[(.*?)\\];`, 's'));
  assert.ok(match, `expected ${varName} declaration`);
  return Array.from(match[1].matchAll(/label: '([^']+)'/g)).map((entry) => entry[1]);
};

test('primary navigation reflects signup-first routes', () => {
  const nav = readFileSync(new URL('../src/data/nav.ts', import.meta.url), 'utf8');
  assert.deepEqual(extractLabels(nav, 'NAV_PRIMARY'), ['Apply', 'Name Check', 'Launch Kit', 'Platforms', 'Trust']);
});

test('footer navigation remains hidden', () => {
  const layout = readFileSync(new URL('../src/layouts/MainLayout.astro', import.meta.url), 'utf8');
  assert.deepEqual(extractLabels(layout, 'footerLinks'), []);
});
