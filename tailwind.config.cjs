/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx,svelte,vue}',
    '!./src/_archive/**/*'
  ],
  theme: {
    extend: {
      colors: {
        midnight: '#07070a',
        obsidian: '#0c0b0f',
        gold: '#c6a247',
        parchment: '#e4dfd4'
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        glow: '0 24px 64px rgba(3, 3, 5, 0.65)'
      },
      backgroundImage: {
        aurora:
          'radial-gradient(circle at 18% 14%, rgba(198,162,71,0.16), transparent 50%), radial-gradient(circle at 83% 6%, rgba(198,162,71,0.08), transparent 52%), linear-gradient(180deg, rgba(7,7,10,1) 0%, rgba(10,10,14,1) 100%)'
      }
    }
  },
  plugins: []
};
