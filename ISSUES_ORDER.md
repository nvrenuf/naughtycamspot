# Issue Implementation Order

This file is the prioritized execution queue for the **Promo-ready launch plan**.

## Promo-ready launch sequence
1. **#119 Promo offering single source of truth (promoOffer)**  
   Canonical promo data for sprint offers, monthly tiers, add-ons, non-negotiables, and platform scope (Chaturbate/CamSoda/Bonga live; Stripchat coming soon).
2. **#120 Rebuild `/packages` for live-cam promo ladder (Sprint + Monthly + Add-ons)**  
   Render offers from promoOffer; CTAs route to `/apply/promo` with package preselected.
3. **#121 Split apply flow: `/apply` chooser + `/apply/promo` + `/apply/signup`**  
   Separate promo intake from signup help; POST to `public/claim/index.php`; require consent; log source/package/platform.
4. **#122 Homepage CTA + nav tighten for promo launch**  
   Make promo primary path; keep signup help secondary; ensure nav points to Packages/Apply/Proof.
5. **#123 Build `/proof` page for promo conversion (templates/examples)**  
   Add scannable placeholders (promo packet/report/tip menu/mod script) + no-guarantee language.
6. **#124 Platform alignment for promo scope (CB/CamSoda/Bonga; Stripchat coming soon)**  
   Single source of truth for promo platform scope; Stripchat “coming soon” with CTA to `/apply/promo`.

   ## Phase 2 (positioning / pricing)
7. **#138 AI-Fulfilled Model Growth Ops positioning pass (copy-only)**  
   Copy/layout-only pass on index/packages/proof to justify higher pricing; no routing or data model changes.

## Model Signup Help (Free) sequence
1. **#TBD Signup: Create canonical “Signup Help (Free)” landing page**  
   Create one canonical funnel entry point with clear step-by-step signup flow and proof guidance. Reuse canonical platform data and keep contacts limited to Telegram + Email.
2. **#TBD Signup: Proof submission instructions (make “send proof” unambiguous)**  
   Standardize a single reusable proof-copy block and apply it consistently on signup pages.
3. **#TBD Signup: Platforms page becomes signup-first and consistent**  
   Align `/platforms` CTAs and status messaging with signup-first flow and canonical platform metadata.
4. **#TBD Signup: StartRight page restructure for signup conversion**  
   Reframe `/startright` around post-proof value, checklist, and strong signup funnel CTAs.
5. **#TBD Signup: Earnings page supports signup decision (not a dead end)**  
   Add clear top/bottom signup CTAs while preserving no-guarantee posture.
6. **#TBD Signup: Audit and align /go endpoints for signup flow**  
   Ensure live platform IDs and `/go/<id>` redirects are aligned and used as the only outbound path.

## Backlog
- **#TBD Signup+Promo: Add more contact options beyond Telegram + Email**  
  Add WhatsApp and at least one additional contact channel to promo and signup intake (separate from this execution queue).

## Notes
- One issue per PR. Run `npm test` and `npm run build` and fix failures before moving to the next issue.
- No refactors outside issue scope (no type renames across the repo, no “cleanup”).
- Promo trust posture everywhere: no passwords/logins, no exclusivity, model owns accounts/content, no spam DM automation, cancel anytime, no earnings guarantees.
