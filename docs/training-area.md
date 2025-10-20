# Training area access design (#45)

## Overview
We need a concierge-only training hub that lives on the public site but stays hidden behind an access gate. The hub should hold VIP briefs, launch runbooks, and other sensitive playbooks without exposing them to casual visitors. The feature ships in two layers: a design note that captures the structure and guardrails, and a front-end implementation that obeys those rules.

## Goals
- Provide a dedicated `/training` destination that matches the site aesthetic and highlights what VIP members receive.
- Require a concierge-provided access code before revealing the library or any VIP posts.
- Keep VIP posts out of the blog index while giving them their own hero, categories, and related article browsing once unlocked.
- Avoid shipping real secrets in the static HTML and make it easy to rotate access codes without a redeploy.

## Access control
- The gate expects an environment variable called `PUBLIC_TRAINING_ACCESS_HASH` that stores the lowercase hex digest of the allowed access code hashed with SHA-256.
- Visitors type their code into the gate. The client hashes the submitted value with `crypto.subtle.digest('SHA-256', ...)` and compares it to the stored hash.
- When a match occurs, the digest is cached in `localStorage` under the key `ncs.training.access` so the visitor can browse freely until they clear storage.
- If the environment variable is empty, the interface shows a concierge contact prompt instead of a broken form.
- Hash verification happens entirely in the browser; the clear-text code never appears in the built output.

## Content architecture
- Introduce a new `training` content collection under `src/content/training` with metadata that mirrors the blog (title, excerpt, category, publish date, author, imagery).
- VIP posts live in Markdown files. Astro renders the Markdown once the gate unlocks; until then the post body stays hidden.
- Training posts receive dedicated routes at `/training/<slug>` and never mingle with `/blog` routes or components.
- Hero art and excerpts use the same aesthetic as the main blog to keep design cohesion while making the training area feel intentional.

## Page layout
### `/training`
- Hero banner summarising the concierge vault and telling visitors what unlocks provide.
- Gate card with an inline form, error state, and success confirmation.
- Once authenticated, a grid of VIP-only posts appears with metadata and deep links to individual posts.

### `/training/<slug>`
- Individual hero with category, author, and publish date.
- Body copy rendered inside the gate once the access code is confirmed.
- Related posts rail so VIPs can jump to other briefs without returning to the index.

## Implementation checklist
1. Add the `training` collection schema in `src/content/config.ts` and seed it with at least two Markdown posts.
2. Create a reusable gate component that renders the form, stores the hash in `localStorage`, and toggles protected slots once the hash matches.
3. Build `src/pages/training/index.astro` to pull the new collection, wrap the grid in the gate component, and surface a concierge contact CTA when the hash is missing.
4. Build `src/pages/training/[slug].astro` to render individual posts inside the same gate component and show related VIP content below the fold.
5. Add the Training link to the more-menu navigation set so concierge partners can find it once authorised.
6. Document the environment variable in this design note and reuse the script across index and detail views to keep behaviour consistent.

## Future enhancements
- Replace the static access code with a real membership service (Supabase Auth, Clerk, or a concierge portal) once infrastructure exists.
- Encrypt the Markdown payload in the build step so even view-source cannot read the VIP content without the key.
- Track unlock events in analytics to measure VIP engagement and rotate codes automatically when membership changes.
