const BONGA_TIER_ORDER = ['tier1', 'tier2', 'tier3'];
const DEFAULT_TIER = 'tier3';

const MODEL_SIGNUP_PROGRAMS = [
  {
    id: 'bonga_tier1',
    label: 'BongaCams • Tier 1',
    path: '/go/model-join.php',
    tiers: ['tier1'],
    active: true
  },
  {
    id: 'bonga_tier2',
    label: 'BongaCams • Tier 2',
    path: '/go/model-join-tier2.php',
    tiers: ['tier2'],
    active: true
  },
  {
    id: 'bonga_tier3',
    label: 'BongaCams • Global',
    path: '/go/model-join-tier3.php',
    tiers: ['tier3'],
    active: true
  }
];

const BONGA_COUNTRY_TIERS = {
  US: 'tier1',
  CA: 'tier1',
  GB: 'tier1',
  DE: 'tier1',
  FR: 'tier1',
  IT: 'tier1',
  ES: 'tier1',
  AU: 'tier1',
  NZ: 'tier1',
  NL: 'tier1',
  SE: 'tier1',
  NO: 'tier1',
  DK: 'tier1',
  FI: 'tier1',
  IE: 'tier1',
  BE: 'tier1',
  AT: 'tier1',
  CH: 'tier1',
  JP: 'tier1',
  SG: 'tier1',
  KR: 'tier1',
  AE: 'tier1',
  KW: 'tier1',
  SA: 'tier1',
  QA: 'tier1',
  BH: 'tier1',
  OM: 'tier1',
  BR: 'tier2',
  MX: 'tier2',
  AR: 'tier2',
  CL: 'tier2',
  CO: 'tier2',
  PE: 'tier2',
  UY: 'tier2',
  PY: 'tier2',
  BO: 'tier2',
  CR: 'tier2',
  PA: 'tier2',
  GT: 'tier2',
  HN: 'tier2',
  NI: 'tier2',
  SV: 'tier2',
  DO: 'tier2',
  PR: 'tier2',
  VE: 'tier2',
  EC: 'tier2',
  PH: 'tier2',
  TH: 'tier2',
  MY: 'tier2',
  ID: 'tier2',
  VN: 'tier2',
  IN: 'tier2',
  PL: 'tier2',
  CZ: 'tier2',
  HU: 'tier2',
  SK: 'tier2',
  SI: 'tier2',
  RO: 'tier2',
  BG: 'tier2',
  HR: 'tier2',
  RS: 'tier2',
  GR: 'tier2',
  TR: 'tier2'
};

const getActivePrograms = (programs = MODEL_SIGNUP_PROGRAMS) =>
  programs.filter((program) => program.active !== false);

const findProgramForTier = (tier, programs = MODEL_SIGNUP_PROGRAMS) => {
  const activePrograms = getActivePrograms(programs);
  if (activePrograms.length === 0) {
    return undefined;
  }

  const startIndex = Math.max(BONGA_TIER_ORDER.indexOf(tier), 0);
  for (let index = startIndex; index < BONGA_TIER_ORDER.length; index += 1) {
    const currentTier = BONGA_TIER_ORDER[index];
    const match = activePrograms.find((program) =>
      Array.isArray(program.tiers) && program.tiers.includes(currentTier)
    );

    if (match) {
      return match;
    }
  }

  return activePrograms[0];
};

const getModelSignupProgramByCountry = (countryCode, programs = MODEL_SIGNUP_PROGRAMS) => {
  const normalizedCountry = countryCode ? countryCode.toUpperCase() : undefined;
  const tier = normalizedCountry ? BONGA_COUNTRY_TIERS[normalizedCountry] ?? DEFAULT_TIER : DEFAULT_TIER;
  return findProgramForTier(tier, programs);
};

const getDefaultModelProgram = () => findProgramForTier(DEFAULT_TIER);

const parseLocaleToCountry = (locale) => {
  if (!locale || typeof locale !== 'string') {
    return undefined;
  }

  const matcher = locale.toUpperCase().match(/[-_]([A-Z]{2})$/);
  return matcher ? matcher[1] : undefined;
};

export {
  BONGA_COUNTRY_TIERS,
  BONGA_TIER_ORDER,
  DEFAULT_TIER,
  MODEL_SIGNUP_PROGRAMS,
  getDefaultModelProgram,
  getModelSignupProgramByCountry,
  parseLocaleToCountry
};

export const __test = {
  findProgramForTier,
  getActivePrograms
};
