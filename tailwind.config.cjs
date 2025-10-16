/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx,svelte,vue}'],
  theme: {
    extend: {
      colors: {
        midnight: '#050608',
        "rose-gold": '#b76e79',
        "rose-petal": '#f4d4d7'
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        glow: '0 0 45px rgba(183, 110, 121, 0.35)'
      },
      backgroundImage: {
        aurora: 'radial-gradient(circle at 20% 20%, rgba(183, 110, 121, 0.45), transparent 55%), radial-gradient(circle at 80% 0%, rgba(183, 110, 121, 0.25), transparent 50%)'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' }
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 40px rgba(183, 110, 121, 0.15)' },
          '50%': { boxShadow: '0 0 55px rgba(183, 110, 121, 0.45)' }
        },
        fadeSlide: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        float: 'float 9s ease-in-out infinite',
        glow: 'glow 7s ease-in-out infinite',
        'fade-slide': 'fadeSlide 0.8s ease-out forwards'
      }
    }
  },
  plugins: []
};
