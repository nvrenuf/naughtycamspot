export type ProgramStatus =
  | 'approved'
  | 'apply'
  | 'blocked'
  | 'low_prio'
  | 'research'
  | 'creator'
  | 'separate'
  | 'pending'
  | 'low_priority';

export type ProgramStatusMeta = {
  label: string;
  badgeClass: string;
  textClass: string;
  disclosure: string;
  joinDisabledLabel: string;
  allowsJoin: boolean;
};

const FALLBACK_LABEL = 'Pending review';

const FALLBACK_META: ProgramStatusMeta = {
  label: FALLBACK_LABEL,
  badgeClass: 'bg-amber-300/10 text-amber-200',
  textClass: 'text-amber-200',
  disclosure: 'Awaiting affiliate paperwork.',
  joinDisabledLabel: 'Join path pending',
  allowsJoin: false
};

export const PROGRAM_STATUS_META: Record<ProgramStatus, ProgramStatusMeta> = {
  approved: {
    label: 'Approved',
    badgeClass: 'bg-emerald-400/10 text-emerald-300',
    textClass: 'text-emerald-300',
    disclosure: 'Live tracking.',
    joinDisabledLabel: 'Join path ready',
    allowsJoin: true
  },
  apply: {
    label: 'Apply',
    badgeClass: 'bg-sky-400/10 text-sky-200',
    textClass: 'text-sky-200',
    disclosure: 'Apply via partner panel before we can send links.',
    joinDisabledLabel: 'Application required',
    allowsJoin: false
  },
  blocked: {
    label: 'Blocked',
    badgeClass: 'bg-rose-400/10 text-rose-200',
    textClass: 'text-rose-200',
    disclosure: 'Blocked due to compliance hold.',
    joinDisabledLabel: 'Program blocked',
    allowsJoin: false
  },
  low_prio: {
    label: 'Low priority',
    badgeClass: 'bg-sky-400/10 text-sky-200',
    textClass: 'text-sky-200',
    disclosure: 'Access reserved for established creators we already manage.',
    joinDisabledLabel: 'Low-priority access only',
    allowsJoin: false
  },
  research: {
    label: 'Research',
    badgeClass: 'bg-purple-400/10 text-purple-200',
    textClass: 'text-purple-200',
    disclosure: 'In research — no onboarding yet.',
    joinDisabledLabel: 'Research in progress',
    allowsJoin: false
  },
  creator: {
    label: 'Creator referral',
    badgeClass: 'bg-amber-300/10 text-amber-200',
    textClass: 'text-amber-200',
    disclosure: 'Use the creator’s own referral tracking.',
    joinDisabledLabel: 'Creator-managed access',
    allowsJoin: false
  },
  separate: {
    label: 'Separate track',
    badgeClass: 'bg-blue-400/10 text-blue-200',
    textClass: 'text-blue-200',
    disclosure: 'Handled via separate merch / video onboarding.',
    joinDisabledLabel: 'Separate track only',
    allowsJoin: false
  },
  pending: {
    label: 'Pending',
    badgeClass: 'bg-amber-300/10 text-amber-200',
    textClass: 'text-amber-200',
    disclosure: 'Awaiting final affiliate paperwork.',
    joinDisabledLabel: 'Join path pending',
    allowsJoin: false
  },
  low_priority: {
    label: 'Low priority',
    badgeClass: 'bg-sky-400/10 text-sky-200',
    textClass: 'text-sky-200',
    disclosure: 'Access reserved for established creators we already manage.',
    joinDisabledLabel: 'Low-priority access only',
    allowsJoin: false
  }
};

const TITLE_CASE = /(^|_)([a-z])/g;

export const resolveProgramStatusMeta = (status: string): ProgramStatusMeta => {
  if ((status as ProgramStatus) in PROGRAM_STATUS_META) {
    return PROGRAM_STATUS_META[status as ProgramStatus];
  }

  const normalizedLabel = status
    .toLowerCase()
    .replace(TITLE_CASE, (_, prefix: string, letter: string) => `${prefix === '_' ? ' ' : prefix}${letter.toUpperCase()}`)
    .trim();

  return {
    ...FALLBACK_META,
    label: normalizedLabel || FALLBACK_META.label
  };
};
