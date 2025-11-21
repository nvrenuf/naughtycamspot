import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { readFile } from 'node:fs/promises';
import { buildPagesJoinHref, allowsPagesJoin } from '../src/utils/programs.js';

const programs = JSON.parse(
  await readFile(new URL('../src/data/programs.json', import.meta.url), 'utf8')
);

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
    'compare_bonga|compare|20250114',
    'should encode src, camp, and date into s1 parameter using pipes'
  );
});

test('Pages join builder respects env overrides', () => {
  const program = programs.find((entry) => entry.key === 'camsoda');
  assert.ok(program, 'expected camsoda program entry');

  const previousJoin = process.env.NCS_CAMSODA_JOIN_BASE;
  const previousSubids = process.env.NCS_CAMSODA_SUBIDS;

  process.env.NCS_CAMSODA_JOIN_BASE = 'https://override.test/join';
  process.env.NCS_CAMSODA_SUBIDS = 'sid_override,ignored';

  try {
    const href = buildPagesJoinHref(program, {
      slot: 'override_slot',
      src: 'override_slot',
      camp: 'phase1',
      date: '20250115'
    });

    const url = new URL(href);
    assert.equal(url.origin + url.pathname, 'https://override.test/join');
    assert.equal(
      url.searchParams.get('sid_override'),
      'override_slot|phase1|20250115',
      'should use env-subid param with pipe-delimited tracking'
    );
  } finally {
    if (typeof previousJoin === 'string') {
      process.env.NCS_CAMSODA_JOIN_BASE = previousJoin;
    } else {
      delete process.env.NCS_CAMSODA_JOIN_BASE;
    }
    if (typeof previousSubids === 'string') {
      process.env.NCS_CAMSODA_SUBIDS = previousSubids;
    } else {
      delete process.env.NCS_CAMSODA_SUBIDS;
    }
  }
});

test('Pages join builder never emits /go/ links', () => {
  const program = programs.find((entry) => entry.key === 'chaturbate');
  assert.ok(program, 'expected chaturbate program entry');

  const previousJoin = process.env.NCS_CHATURBATE_JOIN_BASE;
  process.env.NCS_CHATURBATE_JOIN_BASE = 'https://naughty.example/go/model';

  try {
    const href = buildPagesJoinHref(program, {
      slot: 'compare_chaturbate',
      src: 'compare_chaturbate',
      camp: 'compare',
      date: '20250115'
    });

    assert.equal(href, '', 'should block /go/ paths on Pages');
    assert.equal(
      allowsPagesJoin(program),
      false,
      'allowsPagesJoin should also block /go/ paths on Pages'
    );
  } finally {
    if (typeof previousJoin === 'string') {
      process.env.NCS_CHATURBATE_JOIN_BASE = previousJoin;
    } else {
      delete process.env.NCS_CHATURBATE_JOIN_BASE;
    }
  }
});
