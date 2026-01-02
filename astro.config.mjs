import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://naughtycamspot.com',
  base: '/',
  integrations: [
    tailwind({ applyBaseStyles: false }),
    sitemap({
      serialize: (page) => {
        if (page.url === 'https://naughtycamspot.com/promo-links/' || page.url.endsWith('/promo-links/')) {
          return undefined;
        }
        return page;
      }
    })
  ],
  vite: {
    define: {
      'import.meta.env.IS_PAGES': 'false'
    }
  }
});
