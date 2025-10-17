type BannerSlotKey =
  | 'home_top_leaderboard'
  | 'home_mid_rectangle'
  | 'home_footer_leaderboard'
  | 'model_sidebar_tall'
  | 'model_mid_rectangle'
  | 'post_top_strip'
  | 'post_inline_rect'
  | 'post_end_strip';

type BannerConfig = {
  id: BannerSlotKey;
  path: string;
  camp: string;
  image: string;
  alt: string;
  placeholder: string;
};

const sharedPlaceholder = 'https://bongacams.com/landing/bcmlp/models';

export const bannerSlots: Record<BannerSlotKey, BannerConfig> = {
  home_top_leaderboard: {
    id: 'home_top_leaderboard',
    path: '/go/home-top-leaderboard.php',
    camp: 'home',
    image: 'https://placehold.co/1200x250/111827/FFE4E1?text=Home+Top+Leaderboard',
    alt: 'Home top leaderboard takeover',
    placeholder: sharedPlaceholder
  },
  home_mid_rectangle: {
    id: 'home_mid_rectangle',
    path: '/go/home-mid-rectangle.php',
    camp: 'home',
    image: 'https://placehold.co/600x500/111827/FFE4E1?text=Home+Mid+Rectangle',
    alt: 'Home mid rectangle spotlight',
    placeholder: sharedPlaceholder
  },
  home_footer_leaderboard: {
    id: 'home_footer_leaderboard',
    path: '/go/home-footer-leaderboard.php',
    camp: 'home',
    image: 'https://placehold.co/1200x250/111827/FFE4E1?text=Home+Footer+Leaderboard',
    alt: 'Home footer leaderboard placement',
    placeholder: sharedPlaceholder
  },
  model_sidebar_tall: {
    id: 'model_sidebar_tall',
    path: '/go/model-sidebar-tall.php',
    camp: 'models',
    image: 'https://placehold.co/360x720/111827/FFE4E1?text=Model+Sidebar+Tall',
    alt: 'Model sidebar tall banner',
    placeholder: sharedPlaceholder
  },
  model_mid_rectangle: {
    id: 'model_mid_rectangle',
    path: '/go/model-mid-rectangle.php',
    camp: 'models',
    image: 'https://placehold.co/600x500/111827/FFE4E1?text=Model+Mid+Rectangle',
    alt: 'Model mid rectangle banner',
    placeholder: sharedPlaceholder
  },
  post_top_strip: {
    id: 'post_top_strip',
    path: '/go/post-top-strip.php',
    camp: 'blog',
    image: 'https://placehold.co/900x150/111827/FFE4E1?text=Post+Top+Strip',
    alt: 'Blog post top strip banner',
    placeholder: sharedPlaceholder
  },
  post_inline_rect: {
    id: 'post_inline_rect',
    path: '/go/post-inline-rect.php',
    camp: 'blog',
    image: 'https://placehold.co/600x400/111827/FFE4E1?text=Post+Inline+Rect',
    alt: 'Blog post inline rectangle',
    placeholder: sharedPlaceholder
  },
  post_end_strip: {
    id: 'post_end_strip',
    path: '/go/post-end-strip.php',
    camp: 'blog',
    image: 'https://placehold.co/900x200/111827/FFE4E1?text=Post+End+Strip',
    alt: 'Blog post end strip banner',
    placeholder: sharedPlaceholder
  }
};
