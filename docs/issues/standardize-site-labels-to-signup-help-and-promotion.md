# Title
Standardize site naming to Signup Help (Free) and Promotion (Paid)

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
User-facing naming is inconsistent across pages (e.g., recruiting/join/concierge and other variants). Mixed labels increase confusion and weaken trust because users cannot tell whether they are seeing the same service described differently.

For limited-English users, synonym-heavy copy increases reading burden and slows decision-making.

## 2) Goal
- Use only two canonical labels across user-facing copy:
  - Signup Help (Free)
  - Promotion (Paid)
- Remove competing synonyms and align navigation/CTA language.
- Improve scannability and comprehension site-wide.

## 3) Proposed approach
- Complete a copy audit of key user journeys and shared components.
- Replace non-canonical synonyms in headings, cards, buttons, helper text, and metadata visible to users.
- Build an audit checklist (pages/sections/components) to track replacement completion.
- UI notes:
  - Keep labels visually consistent (same case, punctuation, and qualifier style).
  - Where needed, add short clarifier text once per page rather than reintroducing synonyms.

## 4) Acceptance criteria
- [ ] Canonical labels are defined and documented once for contributors.
- [ ] User-facing synonyms (recruiting/join/concierge/etc.) are removed from in-scope pages.
- [ ] Audit checklist lists all targeted pages/sections and completion status.
- [ ] Navigation and primary CTA labels use the same two canonical names.
- [ ] Limited-English review confirms clearer understanding vs baseline copy.

## 5) Analytics/Measurement
- Monitor reduced bounce on decision pages after naming cleanup.
- Monitor lower cross-page backtracking between free/paid paths.
- Track CTA clarity feedback from internal user testing notes.

## 6) Test plan
- Manual copy QA on mobile first, then desktop.
- Limited-English scan test: users can map each CTA to one of two labels quickly.
- Regression checks:
  - Confirm updated copy does not break route assumptions in links/buttons.
  - Re-run any snapshot/content assertions tied to text labels.
- Existing tests likely impacted:
  - Content snapshot tests.
  - CTA text assertions in UI tests.

## 7) Dependencies/Risks
- Dependencies: issue defining first-screen free/paid decision block.
- Risks: over-aggressive copy replacement could alter SEO phrasing; mitigate by limiting canonical enforcement to user-facing conversion surfaces first.
