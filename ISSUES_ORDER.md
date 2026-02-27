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
1. **#144 Signup: Create canonical “Signup Help (Free)” landing page**
2. **#145 Signup: Proof submission instructions (make “send proof” unambiguous)**
3. **#146 Signup: Platforms page becomes signup-first and consistent**
4. **#147 Signup: StartRight page restructure for signup conversion**
5. **#148 Signup: Earnings page supports signup decision (not a dead end)**
6. **#149 Signup: Audit and align /go endpoints for signup flow**

## Backlog
- **#150 Backlog: Signup+Promo: Add more contact options beyond Telegram + Email**



## Notes
- One issue per PR. Run `npm test` and `npm run build` and fix failures before moving to the next issue.
- No refactors outside issue scope (no type renames across the repo, no “cleanup”).
- Promo trust posture everywhere: no passwords/logins, no exclusivity, model owns accounts/content, no spam DM automation, cancel anytime, no earnings guarantees.