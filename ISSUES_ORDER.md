# Issue Implementation Order

This file is the prioritized execution queue for the **Promo-ready launch plan**.

## Promo-ready launch sequence
1. **Define promo offering single source of truth**  
   Create canonical promo data (`promoOffer`) for sprint offers, monthly tiers, add-ons, non-negotiables, and supported platforms (CB, CamSoda, Bonga; Stripchat coming soon).
2. **Rebuild `/packages` into promo sales page (Sprint + Monthly + Add-ons)**  
   Redesign `/packages` to render Sprint + Monthly ladders, add-ons, explicit non-negotiables, and CTA routing to `/apply/promo` with preselected package.
3. **Split apply flow: `/apply` chooser + `/apply/promo` + `/apply/signup`**  
   Keep `/apply` as a chooser, add promo/signup routes, route form posts to `public/claim/index.php`, and enforce required consent + source/package/platform capture.
4. **Tighten homepage primary CTA for promo sprint + simplify nav for promo launch**  
   Shift homepage CTA emphasis to promo packages/apply, keep signup-help secondary path visible, and prioritize Packages / Apply / Proof in nav.
5. **Build `/proof` page for promo conversion (templates/examples)**  
   Add scannable proof assets (promo packet/report/tip menu/mod script placeholders) with non-negotiables and no-guarantee language.
6. **Platform alignment for promo scope (CB/CamSoda/Bonga; Stripchat coming soon)**  
   Ensure promo-related platform UI uses one source of truth for platform scope and marks Stripchat as coming soon with CTA to `/apply/promo`.

## Notes
- GitHub issues should be created in the same order above, each including: summary, acceptance criteria, files likely touched, and any data files to introduce.
- Use repo labels consistently when available (for example: `promo`, `site`, `intake`).
