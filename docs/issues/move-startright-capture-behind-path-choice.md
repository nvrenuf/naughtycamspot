# Title
Move StartRight capture behind path choice

# Labels
- area:ux
- area:copy
- priority:P0
- effort:M

# Priority
P0

# Effort
M

## 1) Problem
StartRight pre-check capture currently appears too early and can feel like a gate before visitors understand value. On first load, this creates friction and can reduce first-click momentum, especially on mobile where above-the-fold space is limited.

For limited-English users, seeing a form first increases cognitive load because intent is unclear before the user has context. Users should see clear choices and expected outcomes before any information request.

## 2) Goal
- Remove gate-feeling from first load.
- Present value and path choices before any capture ask.
- Preserve lead intent opportunities by moving capture to lower-friction moments.
- Keep the flow mobile-first and easy to understand for limited-English readers.

## 3) Proposed approach
- Reframe StartRight capture as a follow-up action after path intent is established.
- Validate and compare these UX variants:
  - Variant 1: Trigger capture after primary CTA click (path chosen first).
  - Variant 2: Move capture below hero after clear value + path cards.
  - Variant 3: Replace with one-tap contact choice bar (Telegram/WhatsApp/etc.), then collect details later.
- UI notes:
  - Keep first screen focused on “what you get” and “choose your path.”
  - Use icon-led buttons and short labels.
  - Ensure all variant microcopy is simple-English and scannable.

## 4) Acceptance criteria
- [ ] First viewport on mobile does not require filling any form before choosing a path.
- [ ] StartRight capture is moved to one of the approved variants and documented.
- [ ] CTA-first flow is clear with icon-led actions and short plain-English labels.
- [ ] Limited-English scan check passes: users can identify next action in under 5 seconds.
- [ ] No dead-end states: user can proceed without confusion if they skip immediate capture.

## 5) Analytics/Measurement
- Track CTR from hero/path-choice CTAs before vs after change.
- Track form-start rate and completion rate after the capture shift.
- Track drop-off between landing and first intent action.

## 6) Test plan
- Mobile manual checks (320px/375px/390px widths): verify first-screen flow and spacing.
- Limited-English scan test (internal): ask first-time readers to explain the next step after 5 seconds.
- Regression checks:
  - Ensure path CTAs still route correctly.
  - Ensure delayed capture still records lead intent where expected.
- Existing tests likely impacted:
  - Any page-flow tests asserting immediate capture visibility.
  - Any CTA routing tests tied to pre-check placement.

## 7) Dependencies/Risks
- Dependencies: alignment with issue “Make Signup Help (Free) vs Promotion (Paid) unmistakable on first screen.”
- Risks: delayed capture may lower early form starts; mitigate by testing variants and measuring downstream qualified leads, not only raw starts.
