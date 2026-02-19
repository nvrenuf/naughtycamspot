# Title
Simplify Apply into one-screen Fast Lane and move the rest optional

# Labels
- area:ux
- area:forms
- area:copy
- priority:P0
- effort:L

# Priority
P0

# Effort
L

## 1) Problem
The current Apply flow likely asks for too much too soon, increasing abandonment before the lead is captured. Early high-effort forms create friction, especially on mobile users with limited time and attention.

For limited-English users, long forms with mixed intent fields can be hard to parse. A short “minimum viable submit” improves completion while preserving follow-up enrichment later.

## 2) Goal
- Reduce required fields to a true one-screen Fast Lane.
- Keep consent explicit and required.
- Preserve existing claim endpoint POST behavior and success flow requirements.
- Move non-essential questions into an optional “Improve my match” follow-up.

## 3) Proposed approach
- Define a primary one-screen Fast Lane with required fields only:
  - Telegram
  - Platform interest
  - Consent checkbox
  - Submit
- Move all other qualification/enrichment fields into optional Step 2 (“Improve my match”) shown after submit or as non-blocking continuation.
- Integration requirements (no implementation in this issue):
  - Maintain POST contract to existing claim endpoint.
  - Preserve successful submission flow and user confirmation behavior.
  - Ensure lead logging persists even when optional step is skipped.
- UI notes:
  - Single-column, thumb-friendly layout.
  - Short labels and helper text in simple English.
  - Error states should be concise and field-local.

## 4) Acceptance criteria
- [ ] Required fields are limited to Telegram, platform interest, consent, and submit.
- [ ] Optional enrichment fields are moved out of required submission path.
- [ ] Consent remains mandatory; submission blocked only when consent is missing.
- [ ] Existing claim endpoint POST contract is explicitly documented and preserved.
- [ ] Success flow remains functional and lead is logged for Fast Lane-only submissions.
- [ ] Mobile-first layout allows one-screen completion without horizontal scroll.

## 5) Analytics/Measurement
- Track Apply start-to-submit conversion rate before/after.
- Track median time-to-submit.
- Track Fast Lane-only submissions vs optional-step completions.

## 6) Test plan
- Mobile manual checks across common small widths for one-screen completion.
- Limited-English scan test: users can complete core fields without extra explanation.
- Regression checks:
  - Verify claim endpoint payload compatibility.
  - Verify success page/state and analytics event continuity.
  - Verify consent enforcement still blocks non-consenting submits.
- Existing tests likely impacted:
  - Form validation tests.
  - Endpoint payload contract tests.
  - Apply success-flow e2e coverage.

## 7) Dependencies/Risks
- Dependencies: progress indicator issue (if multi-step optional path is retained).
- Risks: lowering required fields may reduce profile completeness; mitigate with optional post-submit enrichment prompts.
