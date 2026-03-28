import { describe, it, expect } from 'vitest';
import fs from 'node:fs';

describe('trust rules block', () => {
  it('contains all non-negotiable trust statements', () => {
    const content = fs.readFileSync('src/components/TrustRulesBlock.astro', 'utf8');
    [
      'No passwords',
      'No exclusivity',
      'Model owns accounts and content',
      'Cancel anytime',
      'No fake official partner claims',
      'No spam tactics',
      'No misleading earnings promises'
    ].forEach((rule) => {
      expect(content).toContain(rule);
    });
  });
});
