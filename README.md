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

## Banner slots

Banner placement is configured in `src/data/banners.ts`. Each slot defines its `/go/*` path for production, a Pages-safe placeholder link, SVG creative, explicit dimensions, and descriptive alt text.

Current slots:

- `home_top_leaderboard`
- `home_mid_rectangle`
- `home_footer_leaderboard`
- `model_sidebar_tall`
- `model_mid_rectangle`
- `post_top_strip`
- `post_inline_rect`
- `post_end_strip`

SVG placeholders for every slot live in `public/ads/`. Update these assets if creative direction changes, but avoid embedding third-party ad scripts.

### Adding a new slot

1. Define the slot in `src/data/banners.ts` with a unique `id`, production `/go/*` path, Pages placeholder URL, camp grouping, image path, dimensions, and alt text.
2. Drop a matching SVG into `public/ads/` so Pages previews have local creative.
3. Render the slot with `<BannerSlot id="slot_id" />` in the page or layout where it should appear, adding a `<!-- SLOT: slot_id -->` comment for quick scanning.

### Link behaviour

- **Pages builds (`astro.config.pages.mjs`)** use the placeholder URLs from the data file. These must be safe external links and must not start with `/go/` so GitHub Pages previews work.
- **Production builds** use the `/go/*` slugs and automatically append `?src=<slot>&camp=<page>&date=YYYYMMDD` tracking parameters via the shared `buildTrackedLink` helper.
