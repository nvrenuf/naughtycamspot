type PromoPlan = {
  id: string;
  displayName: string;
  price: string;
  timeline: string;
  deliverables: string[];
  gates: string[];
};

type PromoAddOn = {
  id: string;
  name: string;
  price: string;
  description: string;
};

export type PromoPlatformScopeEntry = {
  id: string;
  name: string;
  status: 'live' | 'coming-soon';
};

export const promoOffer: {
  sprintOffers: PromoPlan[];
  monthlyTiers: PromoPlan[];
  addOns: PromoAddOn[];
  nonNegotables: string[];
  platformScope: {
    platforms: PromoPlatformScopeEntry[];
    live: string[];
    comingSoon: string[];
  };
} = {
  sprintOffers: [
    {
      id: 'lite-7',
      displayName: '7-day Lite',
      price: '$XXX',
      timeline: '7 days',
      deliverables: ['One platform sprint checklist', 'Daily execution notes', 'End-of-sprint recap'],
      gates: ['Model provides approved media pack', 'Model approves plan before launch']
    },
    {
      id: 'sprint-14',
      displayName: '14-day Sprint',
      price: '$XXX',
      timeline: '14 days',
      deliverables: ['Two-week promo calendar', 'Offer ladder setup', 'Twice-weekly performance review'],
      gates: ['Model provides weekly content batches', 'Model responds to approvals within 24 hours']
    }
  ],
  monthlyTiers: [
    {
      id: 'launch-lite',
      displayName: 'Launch Lite',
      price: '$XXX/mo',
      timeline: 'Monthly',
      deliverables: ['Single-platform monthly plan', 'Caption and CTA template pack', 'Weekly check-ins'],
      gates: ['Model provides platform links and goals', 'Model provides posting windows']
    },
    {
      id: 'growth-engine',
      displayName: 'Growth Engine',
      price: '$XXX/mo',
      timeline: 'Monthly',
      deliverables: ['Two-platform growth plan', 'Offer and retention testing', 'Twice-weekly optimization notes'],
      gates: ['Model provides weekly content batches', 'Model approves updates in 24 hours']
    },
    {
      id: 'operator',
      displayName: 'Operator',
      price: '$XXX/mo',
      timeline: 'Monthly',
      deliverables: ['Priority roadmap and experiments', 'Weekly reporting and planning call notes', 'Dedicated review support'],
      gates: ['Model confirms monthly goals and limits', 'Model confirms budget and promo constraints']
    }
  ],
  addOns: [
    {
      id: 'profile-polish',
      name: 'Profile setup polish',
      price: '$XXX',
      description: 'Profile review and setup recommendations before launch.'
    },
    {
      id: 'landing-audit',
      name: 'Landing page audit',
      price: '$XXX',
      description: 'Conversion-focused review with prioritized improvements.'
    },
    {
      id: 'reporting-pack',
      name: 'Extra reporting pack',
      price: '$XXX',
      description: 'Additional weekly performance report snapshots.'
    },
    {
      id: 'priority-weekend',
      name: 'Priority weekend support window',
      price: '$XXX',
      description: 'Priority response window for weekend campaign adjustments.'
    }
  ],
  nonNegotables: [
    'No passwords/logins',
    'No exclusivity',
    'Model owns accounts/content',
    'No spam DM automation',
    'Cancel anytime',
    'No earnings guarantees'
  ],
  platformScope: {
    platforms: [
      { id: 'chaturbate', name: 'Chaturbate', status: 'live' },
      { id: 'camsoda', name: 'CamSoda', status: 'live' },
      { id: 'bongacams', name: 'BongaCams', status: 'live' },
      { id: 'stripchat', name: 'Stripchat', status: 'coming-soon' }
    ],
    live: ['Chaturbate', 'CamSoda', 'BongaCams'],
    comingSoon: ['Stripchat']
  }
};
