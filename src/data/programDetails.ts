export type ProgramDetail = {
  name: string;
  payout?: string;
  kyc?: string;
  traffic?: string;
  geo?: string;
  best_for?: string[];
};

export type ResolvedProgramDetail = {
  name: string;
  payout: string;
  kyc: string;
  traffic: string;
  geo: string;
  best_for: string[];
};

const withDefaults = (detail: ProgramDetail | undefined, key: string): ResolvedProgramDetail => {
  const base = detail ?? { name: key };
  return {
    name: base.name ?? key,
    payout: base.payout ?? 'TBD',
    kyc: base.kyc ?? 'TBD',
    traffic: base.traffic ?? 'TBD',
    geo: base.geo ?? 'TBD',
    best_for: Array.isArray(base.best_for) ? base.best_for : []
  };
};

export const PROGRAM_DETAILS: Record<string, ProgramDetail> = {
  camsoda: {
    name: 'CamSoda',
    payout: 'weekly',
    kyc: 'low friction',
    traffic: 'good in NA',
    geo: 'T1 US-heavy',
    best_for: ['fast start', 'simple setup']
  },
  chaturbate: {
    name: 'Chaturbate',
    payout: 'weekly',
    kyc: 'medium',
    traffic: 'very high',
    geo: 'global',
    best_for: ['largest audience', 'broad categories']
  },
  bonga: {
    name: 'BongaCams',
    payout: 'weekly',
    kyc: 'medium',
    traffic: 'high EU/EE',
    geo: 'T1–T4 bounty tiers',
    best_for: ['GEO-tuned payouts', 'regional promos']
  },
  jasmin: {
    name: 'LiveJasmin',
    payout: 'twice monthly',
    kyc: 'strict',
    traffic: 'high EU premium',
    geo: 'EU focus, limited US',
    best_for: ['studio-managed creators', 'premium cam niches']
  },
  stripchat: {
    name: 'Stripchat',
    payout: 'weekly',
    kyc: 'medium',
    traffic: 'global live traffic',
    geo: 'Global with strong EU/LatAm',
    best_for: ['interactive cam formats', 'token whales']
  },
  myclub: {
    name: 'My.Club',
    payout: 'monthly',
    kyc: 'medium',
    traffic: 'boutique fanbase',
    geo: 'T1 studio referrals',
    best_for: ['high-touch fan clubs', 'established creators']
  },
  pornhub: {
    name: 'Pornhub',
    payout: 'monthly',
    kyc: 'strict',
    traffic: 'massive global',
    geo: 'Global, content-tiered',
    best_for: ['multi-platform expansion', 'studio catalog monetization']
  },
  onlyfans: {
    name: 'OnlyFans',
    payout: 'creator-managed',
    kyc: 'platform standard',
    traffic: 'creator-driven',
    geo: 'Global per fanbase',
    best_for: ['direct creator referral', 'fan monetization']
  },
  manyvids: {
    name: 'ManyVids',
    payout: 'biweekly',
    kyc: 'standard',
    traffic: 'clip marketplace',
    geo: 'Global marketplace',
    best_for: ['video sales', 'merch funnels']
  }
};

export const resolveProgramDetail = (key: string): ResolvedProgramDetail => withDefaults(PROGRAM_DETAILS[key], key);
