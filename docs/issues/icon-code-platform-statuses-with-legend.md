# Title
Icon-code platform statuses and add a simple legend

# Labels
- area:ux
- area:platforms
- area:copy
- priority:P1
- effort:S

# Priority
P1

# Effort
S

## 1) Problem
Platform availability/status is not immediately interpretable for fast scanners. Without standardized status semantics, users may misunderstand whether a platform is currently actionable.

Limited-English users benefit from icon + color + short phrase patterns more than text-only status labels.

## 2) Goal
- Make platform status instantly understandable with icon-coded badges.
- Provide a clear legend at the top of the grid.
- Keep status rendering tied to a single source of truth in `src/data/platforms.ts`.

## 3) Proposed approach
- Define supported status set based on existing config:
  - Open / Limited / Waitlist (or Live / Coming soon if currently used).
- Render each status with:
  - Icon
  - Color token
  - One-line meaning
- Add top-of-grid legend that explains each status in simple English.
- Ensure all UI status displays derive from `src/data/platforms.ts` mapping (no duplicate hardcoded meanings).
- UI notes:
  - Use high-contrast, color-blind-safe distinctions (icon + text, not color alone).

## 4) Acceptance criteria
- [ ] Legend appears at top of platform grid on mobile and desktop.
- [ ] Status badges are consistent with configured statuses from `src/data/platforms.ts`.
- [ ] Each badge includes icon + color + short text meaning.
- [ ] No page uses conflicting status terminology for the same state.
- [ ] Limited-English user can interpret status meaning without extra explanation.

## 5) Analytics/Measurement
- Track platform-card CTA click-through by status category.
- Track reduction in support/confusion feedback on platform availability.

## 6) Test plan
- Manual checks on mobile to verify legend visibility without excessive scrolling.
- Data integrity checks: change sample status in config and verify UI updates consistently.
- Limited-English scan test for legend comprehension.
- Existing tests likely impacted:
  - Platforms rendering tests bound to status text.
  - Data-driven UI snapshot tests.

## 7) Dependencies/Risks
- Dependencies: alignment with naming standardization for consistent wording.
- Risks: icon/color ambiguity; mitigate with explicit legend copy and accessible contrast.
