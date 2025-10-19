export const DISCLOSURE = "Contains affiliate links. Not an agency. No earnings guarantee.";

export const HERO = {
  title: 'StartRight for models',
  sub: 'Skip the guesswork. Pick the right platforms and get a tailored launch kit — free.'
} as const;

export const PRIMARY_CTA = {
  label: 'Get my plan',
  pagesHref: '/startright',
  prodHref: '/startright'
} as const;

export const KIT = {
  h1: 'StartRight Kit: your platform-matched launch plan',
  sub: 'Choose where you were accepted. We assemble only what you need.',
  claimCTA: {
    label: 'Claim StartRight Kit',
    pagesHref: '/claim',
    prodHref: '/claim/'
  } as const,
  joinCTA: {
    label: 'Join with our links',
    pagesHref: '/startright',
    prodHref: '/startright'
  } as const
} as const;

export type KitCopy = typeof KIT;
