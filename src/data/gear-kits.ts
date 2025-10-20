export type GearItem = {
  name: string;
  description: string;
  investment: string;
  note?: string;
  optional?: boolean;
};

export type GearKit = {
  id: string;
  name: string;
  summary: string;
  investment: string;
  idealFor: string;
  spotlight: string;
  items: GearItem[];
  conciergeNote?: string;
};

export const gearKits: GearKit[] = [
  {
    id: 'foundation',
    name: 'Foundation desk build',
    summary:
      'Lock in a warm, polished feed using compact gear that fits on any desk and sets the tone for your first StartRight streams.',
    investment: '≈ $140',
    idealFor: 'New creators launching their first paid shows and filming in tight spaces.',
    spotlight: 'USB-powered tools keep cabling simple and the look consistent for nightly shows.',
    items: [
      {
        name: 'Logitech C920s HD Pro webcam',
        description: 'True 1080p sensor with manual focus overrides for intimate framing.',
        investment: '$70',
        note: 'Pair with the included privacy shutter between sessions.'
      },
      {
        name: '12" bi-colour ring light kit',
        description: 'Adjustable warmth to hit the signature rose-gold tone in the StartRight scripts.',
        investment: '$35',
        note: 'Mount the camera inside the ring and bounce off a nearby wall to soften shadows.'
      },
      {
        name: 'Maono AU-PM461TR USB microphone',
        description: 'Clean vocal pickup that keeps concierge scripts sounding intentional.',
        investment: '$30',
        note: 'Clip it to the desk arm so breath sounds stay controlled.'
      },
      {
        name: 'Textured fabric backdrop + LED fairy lights',
        description: 'Adds depth behind you and hides small-room clutter without renovations.',
        investment: '$20',
        optional: true,
        note: 'Use warm white strands so your skin tone stays rich on camera.'
      }
    ],
    conciergeNote:
      'We calibrate this kit inside the StartRight walkthrough so you have a plug-and-play look on day one.'
  },
  {
    id: 'studio',
    name: 'Studio momentum build',
    summary:
      'Step up to mirrorless clarity, balanced lighting, and tactile controls so your concierge goals pop on screen.',
    investment: '≈ $360',
    idealFor: 'Creators booking recurring concierge shows who need cinematic focus pulls and flexible framing.',
    spotlight: 'This rig keeps the footprint small but introduces interchangeable lenses for portrait depth.',
    items: [
      {
        name: 'Sony ZV-E10 + 16-50mm kit lens',
        description: 'APS-C sensor delivers creamy background blur and fast autofocus for choreography.',
        investment: '$240 (used market average)',
        note: 'Set exposure to 1/60 shutter with ISO auto capped at 1600.'
      },
      {
        name: 'Elgato Cam Link 4K capture card',
        description: 'Feeds the mirrorless output directly into OBS without compression or dropped frames.',
        investment: '$110',
        note: 'Label the HDMI and USB-C cables so teardown is stress-free.'
      },
      {
        name: 'Pair of 24" softbox LEDs',
        description: 'Key + fill configuration wraps you in a luxe glow and keeps jewellery highlights controlled.',
        investment: '$80',
        note: 'Add the included diffusion layer for the StartRight moody look.'
      },
      {
        name: 'Loopback-enabled audio interface + lav mic',
        description: 'Upgrades vocal warmth and lets you route concierge soundscapes directly into OBS scenes.',
        investment: '$120',
        optional: true,
        note: 'Warm up the mic with a -3dB EQ dip around 3kHz to soften sibilance.'
      }
    ],
    conciergeNote:
      'During the StartRight concierge call we blueprint OBS scenes around this kit so your automation triggers stay on-brand.'
  },
  {
    id: 'luxe',
    name: 'Luxe concierge set',
    summary:
      'Full-room lighting control, redundant audio, and automation-ready tools for creators hosting white-glove experiences.',
    investment: '≈ $780',
    idealFor: 'Teams running multi-show schedules who need broadcast reliability and layered ambience.',
    spotlight: 'Redundant power and dual-camera staging keep the room live even when you pivot angles mid-show.',
    items: [
      {
        name: 'Panasonic Lumix GH5 + Sigma 16mm f/1.4',
        description: '4K60 capture with buttery low-light performance for cinematic concierge arcs.',
        investment: '$520 (body + lens)',
        note: 'Lock white balance at 4300K to match StartRight presets.'
      },
      {
        name: 'Aputure Amaran P60x three-light kit',
        description: 'Key, fill, and hair light on app-controlled scenes for instant mood changes.',
        investment: '$350',
        note: 'Save StartRight looks as presets so mods can trigger them on cue.'
      },
      {
        name: 'Rodecaster Duo + dual wireless lavs',
        description: 'Routes performer + guest channels separately with onboard compressors and safety tracks.',
        investment: '$500',
        note: 'Record a -10dB safety mix for concierge aftercare packages.'
      },
      {
        name: 'Stream Deck MK.2 automation surface',
        description: 'One-touch macros for lighting, goal reveals, and CRM follow-ups tied to StartRight flows.',
        investment: '$150',
        optional: true,
        note: 'Group macros by show arc so your concierge hits stay effortless.'
      }
    ],
    conciergeNote:
      'Our concierge engineers integrate this layout with your retention funnels and backstage dashboards.'
  }
];
