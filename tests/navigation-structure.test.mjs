import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('primary navigation matches growth-first structure', () => {
  const nav = readFileSync(new URL('../src/data/nav.ts', import.meta.url), 'utf8');
  assert.match(nav, /\{ href: '\/', label: 'Home' \}/);
  assert.match(nav, /\{ href: '\/growth\/', label: 'Growth' \}/);
  assert.match(nav, /\{ href: '\/how-it-works\/', label: 'How It Works' \}/);
  assert.match(nav, /\{ href: '\/proof\/', label: 'Proof' \}/);
  assert.match(nav, /\{ href: '\/apply\/', label: 'Apply' \}/);
});
