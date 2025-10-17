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

## How to add a model page

1. Create a dedicated page in `src/pages/models/` named after the slug (for example, `anna-prince.astro`). Import `MainLayout`, `BannerSlot`, and the shared `buildTrackedLink` helper so link behaviour matches other surfaces.
2. Wire up both `model_sidebar_tall` and `model_mid_rectangle` banner slots with their identifying HTML comments so ad ops can trace placements quickly.
3. Surface JSON-LD `Person` metadata with the model name, canonical URL, and `sameAs` profiles. Use the production URL structure (e.g. `https://naughtycamspot.com/models/<slug>/`).
4. Use `buildTrackedLink` for every active affiliate button so Pages previews fall back to safe externals while production builds point to `/go/*` slugs.
5. Include at least one concierge-flavoured call-to-action (email capture stub, booking prompt, etc.) to keep the page aligned with the luxury concierge brand tone.

### Model button order

When listing platform buttons on model pages, use the following canonical order so returning visitors immediately recognise the lineup:

1. ManyVids (primary treatment)
2. Beacons – All links
3. Stripchat
4. Chaturbate
5. CamSoda
6. Pornhub
7. OnlyFans
8. My.club (render as inactive when not yet live)
