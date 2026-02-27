export type PromoOfferPlan = {
  slug: string;
  name: string;
  price: string;
  deliverables: string[];
  gates: string[];
};

export type PromoOffer = {
  sprintOffers: PromoOfferPlan[];
  monthlyTiers: PromoOfferPlan[];
  addOns: string[];
  nonNegotiables: string;
  supportedPlatforms: {
    live: string[];
    comingSoon: string[];
  };
};

export const promoOffer: PromoOffer = {
  sprintOffers: [
    {
      slug: 'lite-7',
      name: '7-day Lite',
      price: '$XXX',
      deliverables: ['One platform sprint checklist', 'Daily execution notes', 'End-of-sprint recap'],
      gates: ['Model provides approved media pack', 'Model approves plan before launch']
    },
    {
      slug: 'sprint-14',
      name: '14-day Sprint',
      price: '$XXX',
      deliverables: ['Two-week promo calendar', 'Offer ladder setup', 'Twice-weekly performance review'],
      gates: ['Model provides weekly content batches', 'Model responds to approvals within 24 hours']
    }
  ],
  monthlyTiers: [
    {
      slug: 'launch-lite',
      name: 'Launch Lite',
      price: '$XXX/mo',
      deliverables: ['Single-platform monthly plan', 'Caption and CTA template pack', 'Weekly check-ins'],
      gates: ['Model provides platform links and goals', 'Model provides posting windows']
    },
    {
      slug: 'growth-engine',
      name: 'Growth Engine',
      price: '$XXX/mo',
      deliverables: ['Two-platform growth plan', 'Offer and retention testing', 'Twice-weekly optimization notes'],
      gates: ['Model provides weekly content batches', 'Model approves updates in 24 hours']
    },
    {
      slug: 'operator',
      name: 'Operator',
      price: '$XXX/mo',
      deliverables: ['Priority roadmap and experiments', 'Weekly reporting and planning call notes', 'Dedicated review support'],
      gates: ['Model confirms monthly goals and limits', 'Model confirms budget and promo constraints']
    }
  ],
  addOns: ['Profile setup polish', 'Landing page audit', 'Extra reporting pack', 'Priority weekend support window'],
  nonNegotiables:
    'No passwords or logins. No exclusivity. Model owns accounts and content. No spam DM automation. Cancel anytime. No earnings guarantees.',
  supportedPlatforms: {
    live: ['Chaturbate', 'CamSoda', 'BongaCams'],
    comingSoon: ['Stripchat']
  }
};
