# Title
Add tap-to-reveal micro-interactions to reduce reading load

# Labels
- area:ux
- area:copy
- priority:P2
- effort:M

# Priority
P2

# Effort
M

## 1) Problem
Some sections require reading dense blocks before users understand next steps. On mobile, this creates fatigue and lowers engagement, especially for limited-English users who benefit from progressive disclosure.

Current interaction patterns may rely too much on static text or hover assumptions that do not translate to touch devices.

## 2) Goal
- Reduce reading load with concise, tap-to-reveal detail patterns.
- Keep core content scannable while preserving depth on demand.
- Ensure interactions are touch-first and accessible.

## 3) Proposed approach
- Homepage “Three steps”:
  - Add tappable expanders for “What happens next.”
- Platforms cards:
  - Add tap-to-expand sections for “Best for / Needs / Next step.”
  - Keep one clear CTA per card.
- Trust promises:
  - Add tooltip/expander details for claims like “No passwords.”
- UI notes:
  - Never rely on hover-only behavior.
  - Use clear expand/collapse icons and short state text.
  - Preserve keyboard and screen-reader discoverability.

## 4) Acceptance criteria
- [ ] All new disclosures can be opened via tap and keyboard.
- [ ] No interaction depends only on hover.
- [ ] Tap targets meet mobile usability expectations (thumb-friendly size/spacing).
- [ ] Expanded content is concise and simple-English.
- [ ] Each platform card retains a single unambiguous CTA.

## 5) Analytics/Measurement
- Track expand interaction rates per section.
- Track downstream CTA clicks after an expand action.
- Compare scroll depth and section exits before/after.

## 6) Test plan
- Mobile manual checks for tap behavior and visual states.
- Accessibility checks:
  - Keyboard navigation and focus visibility.
  - ARIA/state announcements where applicable.
- Limited-English scan test for reduced reading burden.
- Existing tests likely impacted:
  - Component interaction tests for accordions/tooltips.
  - Snapshot tests where expanded markup is present.

## 7) Dependencies/Risks
- Dependencies: none hard, but works best after naming simplification.
- Risks: too many expanders can hide critical info; mitigate by keeping one-line summaries always visible.
