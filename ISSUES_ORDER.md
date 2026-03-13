# Issue Implementation Order

This file is the prioritized execution queue for the **signup-first, low-friction funnel**.

## Strategic objective
Build a simpler funnel for stressed, mobile-first, low-patience 18+ creators:
- one clear homepage promise
- one primary CTA
- one guided apply flow
- strong trust/rules
- minimal top navigation
- deep promo/resources content kept secondary

## Current queue status (refresh)
- Legacy promo-first queue **#119–#124 is treated as completed history** and not part of active priority.
- Active implementation focus is now the signup-first queue **#157–#161**.
- Consolidation tracking for legacy signup fragmentation lives in **#162**.
- Legacy issues **#142 and #144–#150** should be handled through the consolidation guidance below, not as the primary execution queue.

## New execution sequence (signup-first)
1. **#157: Homepage simplification (one promise + one CTA)**
   - Rewrite hero around “get set up and start earning”.
   - Reduce competing homepage paths and demote package/promo complexity.
   - Keep “How it works” and “Resources” available but secondary.
   - Place trust signals near the primary CTA.

2. **#158: Unified guided apply flow (mobile-first, <10 fields)**
   - Replace split promo-vs-signup decision with one guided intake.
   - Steps: (1) age/country/language, (2) goal, (3) existing platforms, (4) best contact method, (5) consent.
   - Keep flow fast, scannable, and easy to complete on mobile.

3. **#159: Hard trust/rules block (non-negotiables)**
   - No passwords ever.
   - No fake ID, no underage, no exceptions.
   - Only legitimate setup and promotion help.
   - If a platform bans for fraud, we cannot reverse it.
   - Keep ownership/privacy language simple and prominent.

4. **#160: Navigation reduction**
   - Target top nav: **Apply / Models / Resources**.
   - Move non-core links to footer where possible.
   - Ensure all core routes reinforce the same single apply funnel.

5. **#161: Secondary-content demotion pass**
   - Keep packages/proof/platform comparisons/earnings education/explainer content live but non-primary.
   - Remove these pages as top-funnel decision blockers.
   - Add clean pathways from secondary pages back to the primary apply CTA.

## Consolidation guidance for current open issues
- Use **#162** as the consolidation meta-issue for legacy signup/promo fragmentation.
- Prefer merging fragmented signup UX/copy issues into fewer implementation issues tied to **#157–#161**.
- Default legacy mapping:
  - **#142 -> CLOSE**
  - **#144 -> MERGE INTO #158**
  - **#145 -> MERGE INTO #159**
  - **#146 -> MERGE INTO #161**
  - **#147 -> MERGE INTO #161**
  - **#148 -> MERGE INTO #161**
  - **#149 -> KEEP**
  - **#150 -> REWRITE LATER**
- Keep issue count lean; avoid separate issues for micro-copy unless blocked by ownership/review flow.

## Working rules
- One issue per PR.
- Before moving to next issue, run tests/build checks relevant to changed scope.
- No broad refactors outside active issue scope.
