export type BannerSlotId =
  | 'home_top_leaderboard'
  | 'home_mid_rectangle'
  | 'home_footer_leaderboard'
  | 'model_sidebar_tall'
  | 'model_mid_rectangle'
  | 'post_top_strip'
  | 'post_inline_rect'
  | 'post_end_strip';

type BannerCamp = 'home' | 'models' | 'blog';

type BannerSlotConfig = {
  id: BannerSlotId;
  path: string;
  camp: BannerCamp;
  image: string;
  alt: string;
  width: number;
  height: number;
  placeholder: string;
};

const PLACEHOLDER_BASE = 'https://leads.naughtycamspot.com/sponsor';

const buildPlaceholderHref = (slot: BannerSlotId, camp: BannerCamp) =>
  `${PLACEHOLDER_BASE}?slot=${encodeURIComponent(slot)}&camp=${encodeURIComponent(camp)}`;

export const bannerSlots: Record<BannerSlotId, BannerSlotConfig> = {
  home_top_leaderboard: {
    id: 'home_top_leaderboard',
    path: '/go/home-top-leaderboard.php',
    camp: 'home',
    image: '/ads/home_top_leaderboard.svg',
    alt: 'Homepage top leaderboard banner promoting concierge services.',
    width: 1200,
    height: 250,
    placeholder: buildPlaceholderHref('home_top_leaderboard', 'home')
  },
  home_mid_rectangle: {
    id: 'home_mid_rectangle',
    path: '/go/home-mid-rectangle.php',
    camp: 'home',
    image: '/ads/home_mid_rectangle.svg',
    alt: 'Homepage mid-article rectangle banner showcasing VIP guidance.',
    width: 600,
    height: 500,
    placeholder: buildPlaceholderHref('home_mid_rectangle', 'home')
  },
  home_footer_leaderboard: {
    id: 'home_footer_leaderboard',
    path: '/go/home-footer-leaderboard.php',
    camp: 'home',
    image: '/ads/home_footer_leaderboard.svg',
    alt: 'Homepage footer leaderboard banner inviting sponsorship chats.',
    width: 1200,
    height: 250,
    placeholder: buildPlaceholderHref('home_footer_leaderboard', 'home')
  },
  model_sidebar_tall: {
    id: 'model_sidebar_tall',
    path: '/go/model-sidebar-tall.php',
    camp: 'models',
    image: '/ads/model_sidebar_tall.svg',
    alt: 'Model profile sidebar tall banner featuring concierge upgrade.',
    width: 360,
    height: 720,
    placeholder: buildPlaceholderHref('model_sidebar_tall', 'models')
  },
  model_mid_rectangle: {
    id: 'model_mid_rectangle',
    path: '/go/model-mid-rectangle.php',
    camp: 'models',
    image: '/ads/model_mid_rectangle.svg',
    alt: 'Model profile mid-article rectangle banner with runway strategy.',
    width: 600,
    height: 500,
    placeholder: buildPlaceholderHref('model_mid_rectangle', 'models')
  },
  post_top_strip: {
    id: 'post_top_strip',
    path: '/go/post-top-strip.php',
    camp: 'blog',
    image: '/ads/post_top_strip.svg',
    alt: 'Blog post top strip banner announcing concierge campaigns.',
    width: 900,
    height: 150,
    placeholder: buildPlaceholderHref('post_top_strip', 'blog')
  },
  post_inline_rect: {
    id: 'post_inline_rect',
    path: '/go/post-inline-rect.php',
    camp: 'blog',
    image: '/ads/post_inline_rect.svg',
    alt: 'Blog post inline rectangle banner highlighting sponsorship offers.',
    width: 600,
    height: 400,
    placeholder: buildPlaceholderHref('post_inline_rect', 'blog')
  },
  post_end_strip: {
    id: 'post_end_strip',
    path: '/go/post-end-strip.php',
    camp: 'blog',
    image: '/ads/post_end_strip.svg',
    alt: 'Blog post end strip banner summarizing concierge contact details.',
    width: 900,
    height: 200,
    placeholder: buildPlaceholderHref('post_end_strip', 'blog')
  }
};

export const getBannerSlot = (id: BannerSlotId) => bannerSlots[id];
