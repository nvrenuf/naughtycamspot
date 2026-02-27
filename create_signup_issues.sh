#!/usr/bin/env bash
set -euo pipefail

REPO="nvrenuf/naughtycamspot"

need() { command -v "$1" >/dev/null 2>&1 || { echo "Missing dependency: $1"; exit 1; }; }
need gh

gh auth status >/dev/null
gh repo view "$REPO" >/dev/null

TMPDIR="$(mktemp -d)"
trap 'rm -rf "$TMPDIR"' EXIT

mkbody () {
  local path="$1"
  shift
  cat > "$path" <<'MD'
MD
}

cat > "$TMPDIR/A_signup_help.md" <<'MD'
## Summary
Create a single canonical landing page for the free **Model Signup Help** funnel (not promo). This should be the one place new models start.

## Requirements
- Create `/signup-help` (new page) that explains the steps:
  1) Choose platform
  2) Sign up using `/go/<platform>`
  3) Send proof
  4) Receive StartRight kit + next steps
- Must include “what proof looks like” (clear bullet examples) and where to send it:
  - Telegram + Email only for this batch.
- Must include a platform chooser rendered from the canonical platform data source (no hardcoded list).

## Acceptance criteria
- `/signup-help` exists and returns 200.
- Contains platform chooser from canonical platform data.
- Contains proof instructions (what counts + where to send).
- Contains CTA(s) that lead to `/platforms` or directly to `/go/<id>`.

## Likely files
- `src/pages/signup-help.astro` (new)
- `src/data/platforms.ts` (reuse)
- `src/data/nav.ts` (if linking)

## Notes
- Do not add WhatsApp or other contact channels in this issue.
MD

cat > "$TMPDIR/B_proof_instructions.md" <<'MD'
## Summary
Make “send proof” unambiguous and consistent across the signup track.

## Requirements
- Create a reusable proof instructions block (shared data or component) describing:
  - What counts as proof (examples)
  - Where to send it (Telegram + Email)
  - Expected response window (use conservative wording you can honor)
- Use it in `/signup-help` and `/startright`.

## Acceptance criteria
- Proof block appears consistently on `/signup-help` and `/startright`.
- Wording is concise and unambiguous.

## Likely files
- `src/pages/signup-help.astro`
- `src/pages/startright.astro`
- Optional: `src/data/signupProof.ts` (or a small component under `src/components/`)

## Notes
- Keep it lightweight; don’t introduce a new design system.
MD

cat > "$TMPDIR/C_platforms_signup_first.md" <<'MD'
## Summary
Make `/platforms` “signup-first” and consistent with the free signup help flow.

## Requirements
- Live platforms: primary CTA “Start signup” → `/go/<id>`
- Coming soon platforms: CTA “Notify me” → `/signup-help` (or the canonical signup-help entry point)
- Platform list + status must come from the canonical platform data source (no hardcoded duplication).
- Stripchat must remain coming soon until accepted.

## Acceptance criteria
- `/platforms` shows correct statuses and CTAs.
- Live → `/go/<id>` works.
- Coming soon → `/signup-help`.

## Likely files
- `src/pages/platforms.astro`
- `src/data/platforms.ts`
MD

cat > "$TMPDIR/D_startright_restructure.md" <<'MD'
## Summary
Restructure `/startright` to support signup conversion (what you get after proof + next steps).

## Requirements
- Make `/startright` clearly answer:
  - What you get (kit preview)
  - What to do next (platform selection + signup)
  - How to send proof (reuse proof block from Issue B)
- Add strong CTA: “Pick a platform and start signup” → `/platforms` or `/signup-help`.

## Acceptance criteria
- `/startright` includes kit preview + checklist + next steps.
- Proof instructions block is present and consistent.
- CTA routes correctly.

## Likely files
- `src/pages/startright.astro`
- (reuse) proof block from Issue B
MD

cat > "$TMPDIR/E_earnings_cta.md" <<'MD'
## Summary
Make `/earnings` support decision-making and drive into signup (not a dead end).

## Requirements
- Add clear CTA near top and bottom:
  - “Start signup” → `/platforms` or `/signup-help`
- Keep “no guarantees” language; avoid misleading earnings claims.

## Acceptance criteria
- `/earnings` has at least two strong CTAs into signup.
- No-guarantee language remains.
- Page remains readable and scannable.

## Likely files
- `src/pages/earnings.astro`
MD

cat > "$TMPDIR/F_go_endpoints_audit.md" <<'MD'
## Summary
Audit and align `/go` endpoints for the signup flow.

## Requirements
- Ensure `/go/chaturbate`, `/go/camsoda`, `/go/bongacams` exist and match platform IDs used in `src/data/platforms.ts`.
- Pages must link to `/go/<id>` (no hardcoded outbound URLs in Astro pages).
- Stripchat remains coming soon; if `/go/stripchat` exists, it should not be presented as live until accepted.

## Acceptance criteria
- All live platforms listed on `/platforms` have working `/go/<id>` redirects.
- Platform IDs are consistent between `/platforms` and `/go` endpoints.

## Likely files
- `public/go/*.php`
- `src/data/platforms.ts`
- `src/pages/platforms.astro` (link usage)
MD

cat > "$TMPDIR/G_backlog_contacts.md" <<'MD'
## Summary
Backlog: Expand contact options beyond Telegram + Email for both promo and signup intake (e.g., WhatsApp and at least one additional option).

## Acceptance criteria
- Optional contact fields added to relevant forms.
- Values logged to `public/logs/leads.jsonl`.
- Display/copy updated consistently where “send proof/contact us” appears.

## Notes
- Not part of the primary execution queue; schedule after signup funnel is stable.
MD

echo "Creating Signup issues in $REPO ..."

A_URL=$(gh issue create -R "$REPO" -t "Signup: Create canonical “Signup Help (Free)” landing page" -F "$TMPDIR/A_signup_help.md")
B_URL=$(gh issue create -R "$REPO" -t "Signup: Proof submission instructions (make “send proof” unambiguous)" -F "$TMPDIR/B_proof_instructions.md")
C_URL=$(gh issue create -R "$REPO" -t "Signup: Platforms page becomes signup-first and consistent" -F "$TMPDIR/C_platforms_signup_first.md")
D_URL=$(gh issue create -R "$REPO" -t "Signup: StartRight page restructure for signup conversion" -F "$TMPDIR/D_startright_restructure.md")
E_URL=$(gh issue create -R "$REPO" -t "Signup: Earnings page supports signup decision (not a dead end)" -F "$TMPDIR/E_earnings_cta.md")
F_URL=$(gh issue create -R "$REPO" -t "Signup: Audit and align /go endpoints for signup flow" -F "$TMPDIR/F_go_endpoints_audit.md")
G_URL=$(gh issue create -R "$REPO" -t "Backlog: Signup+Promo: Add more contact options beyond Telegram + Email" -F "$TMPDIR/G_backlog_contacts.md")

echo ""
echo "Created:"
echo "A) $A_URL"
echo "B) $B_URL"
echo "C) $C_URL"
echo "D) $D_URL"
echo "E) $E_URL"
echo "F) $F_URL"
echo "G) $G_URL"