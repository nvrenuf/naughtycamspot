export type PrivatePromoLink = {
  label: string;
  url: string;
};

export type PrivatePromoModel = {
  slug: string;
  name: string;
  image: string;
  links: PrivatePromoLink[];
};

export const privateModels: PrivatePromoModel[] = [
  {
    slug: 'anna-prince',
    name: 'Anna Prince',
    image: '/images/home-hero.webp',
    links: [
      { label: 'Stripchat', url: 'https://stripchat.com/Anna_Prince' },
      { label: 'Chaturbate', url: 'https://chaturbate.com/b/anna_prince/' },
      { label: 'CamSoda', url: 'https://www.camsoda.com/annaprince' },
      { label: 'ManyVids Live', url: 'https://www.manyvids.com/live/cam/anna_prince' },
      { label: 'OnlyFans', url: 'https://onlyfans.com/sabrinagreat' },
      { label: 'Pornhub', url: 'https://pornhub.com/model/sabrina_great' }
    ]
  },
  {
    slug: 'stellapearl',
    name: 'Stella Pearl',
    image: '/images/stellapearl.png',
    links: [
      { label: 'Chaturbate', url: 'https://chaturbate.com/in/?tour=YrCr&campaign=YIOhf&track=default&room=stellapearl' }
    ]
  },
  {
    slug: 'naughtykathie',
    name: 'Naughty Kathie',
    image: '/images/naughtykathie.png',
    links: [
      { label: 'Chaturbate', url: 'https://chaturbate.com/in/?tour=YrCr&campaign=YIOhf&track=default&room=naughtykathie' }
    ]
  }
];

export default privateModels;
