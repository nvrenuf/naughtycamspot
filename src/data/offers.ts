export type OfferTrackId = 'launch' | 'growth';

export type Offer = {
  id: string;
  slug: string;
  displayName: string;
  stageLabel: string;
  track: OfferTrackId;
  shortDescription: string;
  forWho: string[];
  deliverables: string[];
  ncsResponsibilities: string[];
  modelResponsibilities: string[];
  successLooksLike?: string[];
  foundingModelValue?: {
    currentCost: string;
    estimatedValue: string;
    note: string;
  };
  upgradePath?: string;
  hubApproach?: {
    standard: string;
    premium: string;
  };
};

export const TRUST_RULES = [
  'No passwords',
  'No exclusivity',
  'Model owns accounts and content',
  'Cancel anytime',
  'No fake official partner claims',
  'No spam or mass unsolicited DM tactics',
  'No misleading platform language',
  'No fake proof or earnings claims',
  'No misleading earnings promises'
] as const;

export const OFFER_TRACKS: Record<
  OfferTrackId,
  {
    id: OfferTrackId;
    label: string;
    description: string;
  }
> = {
  launch: {
    id: 'launch',
    label: 'Launch Track',
    description:
      'Built for models who need a cleaner start, stronger identity, and a better front door before growth work gets deeper.'
  },
  growth: {
    id: 'growth',
    label: 'Growth Track',
    description:
      'Built for models ready to turn brand, discovery, conversion, retention, and recurring offers into a stronger operating system.'
  }
};

export const OFFERS: Offer[] = [
  {
    id: 'foundation-start-right',
    slug: 'foundation-start-right',
    displayName: 'Foundation / Start Right',
    stageLabel: 'Stage 1',
    track: 'launch',
    shortDescription:
      'The base layer for stopping early self-sabotage: weak naming, no structure, no clear front door, and bad starting decisions that make later growth harder.',
    forWho: [
      'Models who are new, relaunching, or already feel messy before they have real momentum',
      'Models with weak naming, scattered positioning, no clear starting structure, or no obvious first destination for new fans'
    ],
    deliverables: [
      'Model-name, positioning, and starting-structure review',
      'Beginner-mistake audit covering brand, routing, platform fit, and first-offer logic',
      'A concrete first-pass plan for public rails, front door, and what should exist before real promotion starts',
      'Clear operating boundaries around ownership, trust, and account control'
    ],
    ncsResponsibilities: [
      'Review the model’s current setup and identify the mistakes most likely to slow down launch',
      'Translate vague intent into a usable starting structure',
      'Define what needs to exist before launch traffic is worth sending anywhere'
    ],
    modelResponsibilities: [
      'Provide honest information about current stage, goals, boundaries, and existing accounts',
      'Make concrete decisions on name, positioning, and setup priorities instead of staying vague',
      'Keep ownership of all accounts, content, and logins'
    ],
    successLooksLike: [
      'A cleaner identity with fewer obvious beginner mistakes',
      'A clear idea of where new fans should go first',
      'A launch base that does not need to be rebuilt immediately'
    ],
    foundingModelValue: {
      currentCost: '$0 for founding models',
      estimatedValue: '$500-$2,000+ estimated value',
      note: 'Value anchor only. This is not final public pricing.'
    },
    upgradePath: 'Moves into Launch when the model has a usable base and is ready to turn setup into a real front-door flow.'
  },
  {
    id: 'launch',
    slug: 'launch',
    displayName: 'Launch',
    stageLabel: 'Stage 2',
    track: 'launch',
    shortDescription:
      'The front-door stage: when someone finds the model, they should land in the right place, see the right signals, and know how to enter her world.',
    forWho: [
      'Models starting fresh or relaunching with enough clarity to build the first real destination',
      'Models whose current links, profiles, or surfaces do not create a clean handoff from public discovery into the model world'
    ],
    deliverables: [
      'Initial managed hub or front-door build',
      'Clear routing logic for what new fans see first and where they should go next',
      'Launch-facing event, schedule, or entry-point structure',
      'A cleaner handoff from X, Instagram, TikTok, Telegram, and similar rails into the destination that matters'
    ],
    ncsResponsibilities: [
      'Build the first usable front door and define its CTA order',
      'Shape the initial discovery-to-destination flow so public rails do not send traffic into confusion',
      'Set the launch structure that makes the model easier to enter and easier to remember'
    ],
    modelResponsibilities: [
      'Provide assets, preferences, and current public surfaces that need to connect into the front door',
      'Keep public profiles aligned with the launch structure instead of sending mixed signals',
      'Own the accounts and content being connected to the destination'
    ],
    successLooksLike: [
      'A front door that feels intentional instead of improvised',
      'New fans can tell where to start and what matters now',
      'Public discovery no longer dies in a loose pile of links'
    ],
    foundingModelValue: {
      currentCost: '$0 for founding models',
      estimatedValue: '$750-$2,500+ estimated value',
      note: 'Value anchor only. This is not final public pricing.'
    },
    hubApproach: {
      standard: 'NCS-hosted managed hub inside the NaughtyCamSpot system.',
      premium: 'Model-owned custom domain with NCS-managed hub while service is active.'
    },
    upgradePath: 'Moves into Brand Builder when the front door works and the next problem is memorability, distinction, and stronger discovery pull.'
  },
  {
    id: 'brand-builder',
    slug: 'brand-builder',
    displayName: 'Brand Builder',
    stageLabel: 'Stage 3',
    track: 'growth',
    shortDescription:
      'The stage where the model stops looking generic: stronger identity, recurring event structure, better memory cues, and a discovery system people can actually remember.',
    forWho: [
      'Models who are active but still blend into the feed like everyone else',
      'Models who need stronger consistency across public rails, front door, recurring events, and paid layers'
    ],
    deliverables: [
      'Sharper persona, positioning, and language that separates the model from generic creator noise',
      'Discovery architecture built around identity, recurring named events, and trust-transfer opportunities',
      'Stronger event concepts, memory structure, and repeatable audience cues',
      'A more premium front door and offer path, including stronger premium-domain logic when justified'
    ],
    ncsResponsibilities: [
      'Pressure-test the brand until it feels distinct, not interchangeable',
      'Shape the recurring event and discovery architecture that gives public rails something stronger to carry',
      'Tighten the relationship between brand signals, front door, and paid layers'
    ],
    modelResponsibilities: [
      'Commit to a clearer identity instead of hiding inside generic posting habits',
      'Maintain consistency across content, event language, and public surfaces',
      'Use the stronger brand structure in practice instead of drifting back to random posting'
    ],
    successLooksLike: [
      'The model feels easier to remember and easier to describe',
      'Recurring events create anticipation instead of one-off noise',
      'Discovery starts to carry identity, not just reach'
    ],
    hubApproach: {
      standard: 'Managed NCS-hosted hub can still work when the operating priority is speed and control.',
      premium: 'Custom-domain hub is the stronger standalone option when long-term creator brand matters.'
    },
    upgradePath: 'Moves into Growth Partner when the brand is strong enough to support repeat-spend systems, retention work, and deeper revenue architecture.'
  },
  {
    id: 'growth-partner',
    slug: 'growth-partner',
    displayName: 'Growth Partner',
    stageLabel: 'Stage 4',
    track: 'growth',
    shortDescription:
      'The repeat-earning stage: a stronger business built around conversion, repeat spend, recurring events, VIP retention, premium offers, and passive layers instead of random traffic spikes.',
    forWho: [
      'Active models ready for ongoing structure, review, and operational follow-through',
      'Models who want less dependence on random traffic and more stability around repeat fans and recurring revenue behavior'
    ],
    deliverables: [
      'Conversion and room-flow work tied to what happens after a fan first arrives',
      'VIP retention structure, recurring-event planning, and stronger repeat-spend logic',
      'Premium-offer and passive-layer planning that extends the business beyond the live room',
      'Ongoing review, testing priorities, and operational next steps across the system'
    ],
    ncsResponsibilities: [
      'Identify the highest-leverage changes across discovery, conversion, retention, and offers',
      'Keep the model business organized around repeat earning rather than one-off traffic bursts',
      'Run ongoing review and system-level prioritization instead of defaulting to more posting'
    ],
    modelResponsibilities: [
      'Stay operationally engaged and execute agreed changes',
      'Maintain clear boundaries, brand consistency, and full ownership of accounts and content',
      'Treat the work like business infrastructure, not a one-off promo purchase'
    ],
    successLooksLike: [
      'More repeat fans and less dependence on random traffic',
      'Recurring events and offers create predictable reasons to come back',
      'The business behaves more like a system and less like a nightly reset'
    ],
    hubApproach: {
      standard: 'NCS can manage the standard hosted hub when speed and system control matter most.',
      premium: 'Model-owned custom domain remains the premium path when standalone brand ownership is the priority.'
    },
    upgradePath:
      'Long term, this stage informs the internal operator workflows that may later support agencies, studios, promoters, and growth operators.'
  }
] as const;

export const OFFERS_BY_SLUG = Object.fromEntries(OFFERS.map((offer) => [offer.slug, offer])) as Record<string, Offer>;
