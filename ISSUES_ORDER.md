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
- Core signup-first implementation issues **#157–#161 are complete and closed**.
- Standalone signup routing cleanup **#149 is complete and closed**.
- Consolidation tracking for legacy signup fragmentation lives in **#162** and should close once tracker/docs are aligned.
- Remaining related backlog item: **#150** stays open as a rewrite-later follow-up, not as part of the completed core rollout.

## Completed signup-first sequence
1. **#157: Homepage simplification (one promise + one CTA)** - closed
2. **#158: Unified guided apply flow (mobile-first, <10 fields)** - closed
3. **#159: Hard trust/rules block (non-negotiables)** - closed
4. **#160: Navigation reduction** - closed
5. **#161: Secondary-content demotion pass** - closed

## Consolidation guidance status
- **#162** tracks the consolidation cleanup and should reflect the applied final state.
- Applied legacy mapping:
  - **#142 -> CLOSED**
  - **#144 -> MERGED INTO #158 and CLOSED**
  - **#145 -> MERGED INTO #159 and CLOSED**
  - **#146 -> MERGED INTO #161 and CLOSED**
  - **#147 -> MERGED INTO #161 and CLOSED**
  - **#148 -> MERGED INTO #161 and CLOSED**
  - **#149 -> KEPT AS STANDALONE, COMPLETED, AND CLOSED**
  - **#150 -> OPEN BACKLOG ITEM, REWRITE LATER**
- Keep issue count lean; avoid separate issues for micro-copy unless blocked by ownership/review flow.

## Working rules
- One issue per PR.
- Before moving to next issue, run tests/build checks relevant to changed scope.
- No broad refactors outside active issue scope.
