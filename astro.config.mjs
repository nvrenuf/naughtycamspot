import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import fs from 'node:fs/promises';

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
    }),
    {
      name: 'robots-writer',
      hooks: {
        'astro:build:done': async ({ dir }) => {
          try {
            const dest = new URL('robots.txt', dir);
            await fs.copyFile(new URL('./public/robots.prod.txt', import.meta.url), dest);
          } catch (error) {
            console.warn('[robots-writer] Failed to write robots.txt', error);
          }
        }
      }
    }
  ],
  vite: {
    define: {
      'import.meta.env.IS_PAGES': 'false'
    }
  }
});
