import { buildTrackedLink } from '../utils/links';

export interface Banner {
  id: string;
  width: number;
  height: number;
  img: string;
  alt: string;
  href: string;
}

type BannerDefinition = Omit<Banner, 'href'> & {
  path: string;
  slot: string;
  camp: string;
  placeholder?: string;
};

const definitions: BannerDefinition[] = [
  {
    id: 'home_top_leaderboard',
    width: 728,
    height: 90,
    img: '/placeholders/banner-728x90.svg',
    alt: 'Route your signup through StartRight concierge',
    path: '/go/model-join.php',
    slot: 'home_top_leaderboard',
    camp: 'home',
    placeholder: '/startright'
  },
  {
    id: 'compare_top_leaderboard',
    width: 728,
    height: 90,
    img: '/placeholders/banner-728x90.svg',
    alt: 'Guarded onboarding links for compare readers',
    path: '/go/model-join.php',
    slot: 'compare_top_leaderboard',
    camp: 'compare',
    placeholder: '/startright'
  },
  {
    id: 'blog_inline_rect',
    width: 300,
    height: 250,
    img: '/placeholders/banner-300x250.svg',
    alt: 'Unlock the StartRight concierge kit',
    path: '/go/model-join.php',
    slot: 'blog_inline_rect',
    camp: 'blog',
    placeholder: '/startright'
  }
];

export const banners: Banner[] = definitions.map(({ path, slot, camp, placeholder, ...rest }) => ({
  ...rest,
  href: buildTrackedLink({
    path,
    slot,
    camp,
    placeholder: placeholder ?? '/startright'
  })
}));
