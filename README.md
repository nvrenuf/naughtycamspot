# NaughtyCamSpot

Growth-first public site for NaughtyCamSpot, built with Astro and Tailwind CSS.

## Public architecture

Main public pages:

- `/`
- `/growth`
- `/how-it-works`
- `/apply`
- `/platforms`
- `/proof`

Utility pages:

- `/privacy`
- `/terms`
- `/disclosure`

Affiliate routing exists only for the launch lane through the `/go/*.php` endpoints surfaced on the platforms page.

## Commands

- Install dependencies: `npm install`
- Start local dev server: `npm run dev`
- Run tests: `npm test`
- Create a production build: `npm run build`
- Build for GitHub Pages: `npm run build:pages`
- Pages safety scan: `npm run test:pages-safety`

## Notes

- `src/components/TrustRulesBlock.astro` contains the non-negotiable trust language used across the public site.
- `public/api/namecheck.php` supports the model-name scanner mentioned on the apply page.
- `public/go/*.php` contains the launch-lane affiliate redirects used by the platforms page.
