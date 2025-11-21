import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://naughtycamspot.com',
  base: '/',
  integrations: [tailwind({ applyBaseStyles: false }), sitemap()],
  vite: {
    define: {
      'import.meta.env.IS_PAGES': JSON.stringify(process.env.IS_PAGES === 'true')
    }
  }
});
