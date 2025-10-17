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
- `src/pages/join-models.astro` — recruitment landing with concierge bullets, tracked CTA, FAQ placeholders, and banner slot
- `src/pages/disclosure.astro` — affiliate disclosure copy surfaced in the global footer
- `src/styles/tailwind.css` — Tailwind layers plus glassmorphism utility classes
- `images/` — shared static assets ready to surface in future sections

Legacy HTML pages, generators, and blog scaffolding have been removed. Work forward from the Astro surface for new sections and routes.

## SEO & indexing

- Production builds (`astro.config.mjs`) enable `@astrojs/sitemap` with the public `site` domain locked to `https://naughtycamspot.com`. GitHub Pages builds continue to use `astro.config.pages.mjs` and inject a `<meta name="robots" content="noindex,nofollow">` tag so previews stay out of the index.
- Robots directives live in `public/robots.prod.txt` (deploy as `robots.txt` on ViceTemple) and `public/robots.pages.txt` (copied to `robots.txt` by the Pages workflow before building). Update both files when crawl strategy changes.
- ViceTemple security headers are shipped via `public/.htaccess` — keep updates scoped there so Pages previews remain unaffected.
- Page-level titles, descriptions, OG, and canonical tags are centralized in `src/components/SEO.astro`. Pull this component into new pages and provide unique copy per surface.

## Tracked links in prod vs Pages

- Use the shared `buildTrackedLink` helper whenever a `/go/*` slug is involved (homepage hero CTA, `<BannerSlot>`, model profile buttons).
- Production builds return `/go/*` URLs with `?src=<slot>&camp=<page>&date=YYYYMMDD` appended for tracking.
- GitHub Pages builds fall back to the provided external placeholder, stripping query strings so previews stay clean and never link to `/go/*`.
- The production server now handles `/go/*` redirects and geotargeted program rotation via the PHP handlers in `public/go/`.

## Analytics & click beacons

- Set the GA4 measurement ID through the `PUBLIC_GA4_ID` environment variable (for example, add `PUBLIC_GA4_ID=G-XXXXXXX` to your ViceTemple `.env`).
- The GA snippet only renders when `import.meta.env.SITE` resolves to `https://naughtycamspot.com` **and** `IS_PAGES` is not flagged, so GitHub Pages previews never emit tracking.
- Click beacons fire for any element marked with `data-track="click"` (homepage hero CTA and all banner slots in production) and send lightweight GET requests to `/go/click.php` with the slot, campaign, and timestamp.
- ViceTemple writes those beacon hits to `logs/clicks.log` (see `public/go/click.php`). Pages builds keep the PHP handler inert because the environment never executes the file.

### Join Models CTA behaviour

- The Join Models landing (`src/pages/join-models.astro`) calls `buildTrackedLink` with `/go/model-join.php`, `src=join_models`, and `camp=landing`.
- Provide a safe public placeholder URL in the `CTA_PLACEHOLDER` constant so Pages builds output an external link that does **not** start with `/go/`.
- Production builds automatically append the `date=YYYYMMDD` stamp and keep the `/go/model-join.php` target.
- Update the FAQ copy by editing the `faqItems` array in `src/pages/join-models.astro`.

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
