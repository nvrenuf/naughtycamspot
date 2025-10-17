import { describe, expect, it, vi, afterEach, beforeEach } from 'vitest';

const heroParams = {
  path: '/go/model-join.php',
  slot: 'home_hero',
  camp: 'home',
  placeholder: 'https://bongacams.com/model-signup'
};

const importLinksModule = () => import('../src/utils/links');

describe('Hero CTA routing', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
    vi.useRealTimers();
  });

  afterEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
    vi.useRealTimers();
  });

  it('emits tracked /go link for production builds', async () => {
    vi.stubEnv('BASE_URL', '/');
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-10-17T00:00:00Z'));

    const { buildTrackedLink } = await importLinksModule();
    const href = buildTrackedLink(heroParams);

    expect(href).toBe('/go/model-join.php?src=home_hero&camp=home&date=20251017');
  });

  it('emits safe external link for Pages builds', async () => {
    vi.stubEnv('BASE_URL', '/naughtycamspot/');

    const { buildTrackedLink } = await importLinksModule();
    const href = buildTrackedLink(heroParams);

    expect(href).toBe(heroParams.placeholder);
  });
});
