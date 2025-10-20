import { strict as assert } from 'node:assert';
import programs from '../src/data/programs.json';
import { buildPagesJoinHref } from '../src/utils/programs';

test('Bonga Pages join retains affiliate query parameters', () => {
  const program = programs.find((entry) => entry.key === 'bonga');
  assert.ok(program, 'expected bonga program entry');

  const href = buildPagesJoinHref(program, {
    slot: 'compare_bonga',
    src: 'compare_bonga',
    camp: 'compare',
    date: '20250114'
  });

  assert.ok(href.startsWith('https://bongacash.com/model-ref'), 'expected Bonga join URL');

  const url = new URL(href);
  assert.equal(url.searchParams.get('c'), '828873', 'should preserve original campaign id');
  assert.equal(
    url.searchParams.get('s1'),
    'compare_bonga-compare-20250114',
    'should encode src, camp, and date into s1 parameter'
  );
});
