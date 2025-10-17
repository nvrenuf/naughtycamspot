import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://naughtycamspot.com',
  base: '/',
  integrations: [tailwind({ applyBaseStyles: false })],
});
