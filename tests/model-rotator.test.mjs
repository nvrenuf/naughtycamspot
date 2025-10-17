import assert from 'node:assert/strict';
import { test } from 'node:test';

const importRotator = async () => import('../src/utils/model-rotator.js');

test('selects tier 1 program for US visitors', async () => {
  const { getModelSignupProgramByCountry } = await importRotator();
  const program = getModelSignupProgramByCountry('US');

  assert.ok(program, 'expected a program to be returned');
  assert.equal(program.id, 'bonga_tier1');
  assert.equal(program.path, '/go/model-join.php');
});

test('falls back to next active tier when preferred program is inactive', async () => {
  const { __test } = await importRotator();
  const mockPrograms = [
    { id: 'tier1', path: '/go/tier1.php', tiers: ['tier1'], active: false },
    { id: 'tier2', path: '/go/tier2.php', tiers: ['tier2'], active: true },
    { id: 'tier3', path: '/go/tier3.php', tiers: ['tier3'], active: true }
  ];

  const program = __test.findProgramForTier('tier1', mockPrograms);
  assert.ok(program, 'expected fallback program to be returned');
  assert.equal(program.id, 'tier2');
});

test('parseLocaleToCountry extracts region codes', async () => {
  const { parseLocaleToCountry } = await importRotator();
  assert.equal(parseLocaleToCountry('en-US'), 'US');
  assert.equal(parseLocaleToCountry('pt_br'), 'BR');
  assert.equal(parseLocaleToCountry('invalid'), undefined);
});
