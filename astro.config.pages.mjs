import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://leecuevasowner.github.io/naughtycamspot',
  base: '/naughtycamspot/',
  integrations: [tailwind({ applyBaseStyles: false })],
  vite: {
    define: {
      'import.meta.env.IS_PAGES': 'true'
    }
  }
});
