# naughtycamspot
Luxury gallery frontend for Naughty Cam Spot, built with Astro and Tailwind CSS.

## Commands

- Install dependencies: `npm install`
- Start local dev server: `npm run dev`
- Create a production build: `npm run build`
- Build for GitHub Pages: `npm run build:pages`

## Project structure

- `src/layouts/MainLayout.astro` — shared chrome, fonts, and ambient gradients
- `src/pages/index.astro` — luxury gallery homepage experience
- `src/styles/tailwind.css` — Tailwind layers plus glassmorphism utility classes
- `images/` — shared static assets ready to surface in future sections

Legacy HTML pages, generators, and blog scaffolding have been removed. Work forward from the Astro surface for new sections and routes.
