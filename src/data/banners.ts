export interface Banner {
  id: string;
  width: number;
  height: number;
  img: string;
  alt: string;
  href: string; // will point to internal `/go/*` slugs later
}

export const banners: Banner[] = [
  {
    id: 'placeholder-wide',
    width: 728,
    height: 90,
    img: '/placeholders/banner-728x90.svg',
    alt: 'Ad banner',
    href: '/join-models'
  },
  {
    id: 'placeholder-rect',
    width: 300,
    height: 250,
    img: '/placeholders/banner-300x250.svg',
    alt: 'Ad banner',
    href: '/join-models'
  }
];
