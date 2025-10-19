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

export const STARTRIGHT_SKIP = {
  label: 'Skip — pick my platforms',
  pagesHrefBase: '/join-models',
  tracking: {
    src: 'startright_skip',
    camp: 'startright'
  }
} as const;
