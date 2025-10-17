export type BongaTier = 'tier1' | 'tier2' | 'tier3';

export type ModelProgram = {
  id: string;
  label: string;
  path: string;
  tiers: BongaTier[];
  active?: boolean;
};

export declare const BONGA_TIER_ORDER: readonly BongaTier[];
export declare const DEFAULT_TIER: BongaTier;
export declare const MODEL_SIGNUP_PROGRAMS: readonly ModelProgram[];
export declare const BONGA_COUNTRY_TIERS: Record<string, BongaTier>;
export declare const getDefaultModelProgram: () => ModelProgram | undefined;
export declare const getModelSignupProgramByCountry: (
  countryCode?: string,
  programs?: readonly ModelProgram[]
) => ModelProgram | undefined;
export declare const parseLocaleToCountry: (locale?: string) => string | undefined;

export declare const __test: {
  findProgramForTier: (
    tier: BongaTier,
    programs?: readonly ModelProgram[]
  ) => ModelProgram | undefined;
  getActivePrograms: (programs?: readonly ModelProgram[]) => readonly ModelProgram[];
};
