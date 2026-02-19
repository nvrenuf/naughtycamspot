# Title
Reduce key-page terminology complexity to A2 English

# Labels
- area:ux
- area:copy
- priority:P1
- effort:M

# Priority
P1

# Effort
M

## 1) Problem
Key pages contain jargon and abstract phrases that are harder for limited-English users to parse quickly. Complex wording increases time-to-understand and can block action even when the underlying offer is strong.

This creates avoidable friction at critical conversion points.

## 2) Goal
- Lower vocabulary complexity to roughly A2-level English on key conversion pages.
- Replace jargon with short, plain alternatives without changing business intent.
- Provide a reusable glossary checklist for consistent updates.

## 3) Proposed approach
- Build a terminology checklist with:
  - Terms to remove.
  - Approved simple-English replacements.
  - Notes/examples for use in CTA text, headings, and helper copy.
- Apply checklist to priority pages first (home, apply, platforms, packages, trust/safety).
- UI notes:
  - Favor short sentences and common verbs.
  - Pair key actions with icons where possible for comprehension reinforcement.

## 4) Acceptance criteria
- [ ] Glossary/checklist exists with target terms and replacement terms.
- [ ] Priority page list is documented with applied status.
- [ ] Updated copy avoids identified jargon on in-scope pages.
- [ ] Limited-English review confirms improved comprehension of key CTAs.
- [ ] Copy remains consistent with canonical labels “Signup Help (Free)” and “Promotion (Paid).”

## 5) Analytics/Measurement
- Track CTA click-through on updated pages vs baseline.
- Track bounce/drop-off changes on key landing and apply pages.
- Capture internal comprehension test notes across representative examples.

## 6) Test plan
- Manual copy QA on mobile for line-length and scannability.
- Limited-English scan test focused on CTA understanding and page purpose.
- Regression checks:
  - Verify edited copy does not break links/components.
  - Re-run content assertions/snapshots if present.
- Existing tests likely impacted:
  - Copy/snapshot tests for key pages.
  - Any tests asserting exact CTA strings.

## 7) Dependencies/Risks
- Dependencies: naming standardization issue for canonical labels.
- Risks: oversimplification can remove nuance; mitigate with glossary review and side-by-side copy checks.
