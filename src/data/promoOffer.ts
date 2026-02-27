export type PromoPackage = {
  id: string;
  name: string;
  timeline: string;
  price: string;
  summary: string;
  idealFor: string;
export type PromoOfferPlan = {
  slug: string;
  name: string;
  price: string;
  deliverables: string[];
  gates: string[];
};

export type PromoAddon = {
  id: string;
  name: string;
  price: string;
  summary: string;
  deliverables: string[];
  gates: string[];
};

export const promoOffer = {
  hero: {
    eyebrow: 'Live-Cam Promo Ladder',
    title: 'Pick your sprint, then scale into monthly operations.',
    intro:
      'Built for live-cam creators who want traffic flow plus stronger show structure. Start with a sprint, keep momentum with a monthly tier, then bolt on add-ons when needed.'
  },
  platformScope: {
    title: 'Promo platform scope v1',
    active: ['Chaturbate', 'CamSoda', 'BongaCams'],
    comingSoon: ['Stripchat (coming soon)']
  },
  sprintOffers: [
    {
      id: 'sprint_7_lite',
      name: '7-Day Lite Sprint',
      timeline: '7 days',
      price: '$149',
      summary: 'Fast reset for traffic basics and show-flow cleanup.',
      idealFor: 'Models who want a short, low-friction starter push.',
      deliverables: [
        'Traffic source check and one-page action map',
        'Show structure tune-up: opener, mid-show hooks, close CTA',
        'Daily promo checklist with posting windows',
        'End-of-sprint scorecard + next-step plan'
      ],
      gates: ['One active cam profile in v1 scope', 'Daily check-ins within 24 hours']
    },
    {
      id: 'sprint_14',
      name: '14-Day Sprint',
      timeline: '14 days',
      price: '$299',
      summary: 'Two-week push to stabilize traffic and repeatable show routines.',
      idealFor: 'Models ready for tighter execution and more consistent sessions.',
      deliverables: [
        'Everything in 7-Day Lite plus deeper audience pattern review',
        'Two-week promo calendar mapped to show slots',
        'Offer ladder and room CTA sequence for each show block',
        'Twice-weekly optimization notes and final sprint debrief'
      ],
      gates: ['Minimum four live sessions per week', 'Provide prior 14-day activity data or screenshots']
    }
  ] satisfies PromoPackage[],
  monthlyTiers: [
    {
      id: 'monthly_launch_lite',
      name: 'Launch Lite',
      timeline: 'Monthly',
      price: '$399/mo',
      summary: 'Baseline monthly operating system for steady growth.',
      idealFor: 'Creators moving from occasional to structured weekly output.',
      deliverables: [
        'Weekly promo + show plan',
        'Weekly scorecard with traffic and conversion checkpoints',
        'Message and CTA refinements for repeat viewers'
      ],
      gates: ['One strategy review call per month', 'Content and performance feedback turned around within 48 hours']
    },
    {
      id: 'monthly_growth_engine',
      name: 'Growth Engine',
      timeline: 'Monthly',
      price: '$749/mo',
      summary: 'Hands-on monthly optimization across promo and show rhythm.',
      idealFor: 'Models targeting stronger traffic consistency and higher room conversion.',
      deliverables: [
        'Everything in Launch Lite',
        'Two platform-specific promo experiments each month',
        'Twice-weekly optimization support and adjustment notes',
        'Monthly ladder refresh (hooks, offers, sequencing)'
      ],
      gates: ['Minimum 16 live sessions monthly', 'Approve tests before launch']
    },
    {
      id: 'monthly_operator',
      name: 'Operator',
      timeline: 'Monthly',
      price: '$1,190/mo',
      summary: 'High-touch operations layer for advanced models and teams.',
      idealFor: 'Models ready for dense schedules, tracking discipline, and scale decisions.',
      deliverables: [
        'Everything in Growth Engine',
        'Weekly planning call and KPI review',
        'Cross-platform pacing strategy for high-volume weeks',
        'Advanced show-structure iteration with retention checkpoints'
      ],
      gates: ['Priority response during business hours', 'Share weekly performance snapshots before review call']
    }
  ] satisfies PromoPackage[],
  addons: [
    {
      id: 'addon_show_structure_audit',
      name: 'Show Structure Audit',
      price: '$129',
      summary: 'Deep review of your live session flow with direct fixes.',
      deliverables: [
        'Session flow audit and timestamped feedback',
        'New opener + hook + close outline'
      ],
      gates: ['One recent session recording or notes required']
    },
    {
      id: 'addon_traffic_asset_pack',
      name: 'Traffic Asset Pack',
      price: '$179',
      summary: 'Plug-and-play promo copy and asset prompts for cam traffic.',
      deliverables: ['Caption bank for campaign days', 'Promo angle matrix for show themes'],
      gates: ['One brand voice sample required']
    },
    {
      id: 'addon_monthly_report',
      name: 'Monthly Performance Breakdown',
      price: '$99',
      summary: 'Operator-style report without full operator subscription.',
      deliverables: ['KPI summary and trend notes', 'Next-month priorities and risk flags'],
      gates: ['Raw stats export or screenshots required']
    }
  ] satisfies PromoAddon[],
  whatYouProvide: {
    title: 'What you provide',
    items: [
      'You keep and control all platform accounts and content.',
      'You provide approved clips, screenshots, offers, and schedule inputs on time.',
      'You approve strategy updates and campaign tests before they run.',
      'You stay active in your show schedule so promo efforts can compound.'
    ]
  },
  nonNegotiables: {
    title: 'What we don’t do',
    items: [
      'No passwords or direct login handover requests.',
      'No exclusivity terms or account ownership transfer.',
      'No spam DM automation.',
      'No earnings guarantees.',
      'Cancel anytime based on your renewal cycle.'
    ]
  }
} as const;
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
