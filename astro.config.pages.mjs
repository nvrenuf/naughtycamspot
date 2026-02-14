import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import fs from 'node:fs/promises';

export default defineConfig({
  site: 'https://leecuevasowner.github.io/naughtycamspot',
  base: '/naughtycamspot/',
  integrations: [
    tailwind({ applyBaseStyles: false }),
    {
      name: 'robots-writer',
      hooks: {
        'astro:build:done': async ({ dir }) => {
          try {
            const dest = new URL('robots.txt', dir);
            await fs.copyFile(new URL('./public/robots.pages.txt', import.meta.url), dest);
          } catch (error) {
            console.warn('[robots-writer] Failed to write robots.txt', error);
          }
        }
      }
    }
  ],
  vite: {
    define: {
      'import.meta.env.IS_PAGES': 'true'
    }
  }
});
