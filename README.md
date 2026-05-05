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
- `public/claim/index.php` handles Founding Model Program form submissions, stores lead records durably, redirects to `public/claim/success.html`, and optionally sends a Telegram notification.

## Founding Model Program intake

Environment variables for Telegram notification:

- `NCS_TELEGRAM_BOT_TOKEN`
- `NCS_TELEGRAM_CHAT_ID`

Optional environment variable for lead storage location:

- `NCS_LEAD_LOG_DIR`

Behavior:

- lead storage is the primary requirement
- if Telegram env vars are missing, the lead is still stored and the success redirect still happens
- if Telegram send fails, the lead is still stored, the success redirect still happens, and the failure is logged safely

How to test locally:

1. Run a local PHP server from the repo root:
   `php -S 127.0.0.1:8080 -t public`
2. Submit a `POST` to `/claim/index.php` or wire the Astro form to that handler in a built deployment.
3. Verify:
   - a new line is appended to the lead log file
   - the browser receives a `303` redirect to `/claim/success.html`
   - Telegram notification arrives if `NCS_TELEGRAM_BOT_TOKEN` and `NCS_TELEGRAM_CHAT_ID` are set
