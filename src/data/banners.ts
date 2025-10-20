import { DISCLOSURE } from './copy';

export const BANNERS = {
  home_top_leaderboard: {
    img: '/ads/leaderboard-970x90.svg',
    alt: 'Start camming — get the free 14-day kit',
    href_pages: '/startright',
    href_prod: '/go/model-join.php?src=banner_home_top&camp=home&date=YYYYMMDD',
    size: { w: 970, h: 90 },
    note: DISCLOSURE
  },
  model_sidebar_tall: {
    img: '/ads/sky-160x600.svg',
    alt: 'Join with our links',
    href_pages: '/startright',
    href_prod: '/go/model-join.php?src=banner_model_sidebar&camp=model&date=YYYYMMDD',
    size: { w: 160, h: 600 },
    note: DISCLOSURE
  },
  model_mid_rectangle: {
    img: '/ads/model_mid_rectangle.svg',
    alt: 'Concierge-guided cam onboarding — unlock now',
    href_pages: '/startright',
    href_prod: '/go/model-join.php?src=banner_model_mid&camp=model&date=YYYYMMDD',
    size: { w: 300, h: 250 },
    note: DISCLOSURE
  },
  post_inline_rect: {
    img: '/ads/rect-300x250.svg',
    alt: 'Claim your StartRight kit',
    href_pages: '/startright',
    href_prod: '/claim/',
    size: { w: 300, h: 250 },
    note: 'Free 14-day kit after signup proof.'
  },
  post_end_strip: {
    img: '/ads/post_end_strip.svg',
    alt: 'Finish with the StartRight concierge plan',
    href_pages: '/startright',
    href_prod: '/go/model-join.php?src=banner_blog_end&camp=blog&date=YYYYMMDD',
    size: { w: 900, h: 200 },
    note: DISCLOSURE
  }
} as const;

export type BannerSlotId = keyof typeof BANNERS;

export type BannerConfig = (typeof BANNERS)[BannerSlotId];

export const getBannerSlot = (id: BannerSlotId) => BANNERS[id];
