# Title
Make Signup Help (Free) vs Promotion (Paid) unmistakable on first screen

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
First-time visitors can miss the difference between free onboarding help and paid promotion services. When these tracks are not obvious immediately, users hesitate, misclick, or leave without selecting a clear next step.

This confusion is amplified on mobile and for limited-English users when terminology is dense or spread across multiple sections.

## 2) Goal
- Make the two service tracks instantly understandable on first screen.
- Reduce decision friction with icon-led, high-contrast choices.
- Reinforce where each path goes next (Apply / Platforms / Packages).

## 3) Proposed approach
- Add or replace the decision block directly under hero with two large cards:
  - Card A: “Signup Help (Free)”
  - Card B: “Promotion (Paid)”
- Each card includes:
  - Distinct icon and explicit price qualifier (Free/Paid).
  - One short sentence “best for” guidance.
  - Primary CTA aligned to track intent:
    - Free path → Apply / Platforms
    - Paid path → Packages
- UI notes:
  - Mobile-first stacked layout with large tap targets.
  - Keep text at simple-English level and avoid jargon.
  - Use clear visual contrast so cards are distinguishable at a glance.

## 4) Acceptance criteria
- [ ] Two-track decision block appears directly under hero on mobile and desktop.
- [ ] Each card contains visible “Free” or “Paid” label and supporting icon.
- [ ] Card CTAs map to the intended next actions (Apply / Platforms / Packages).
- [ ] First-time visitor comprehension test: users can explain both tracks within 5 seconds.
- [ ] Copy is concise, plain-English, and readable for limited-English users.

## 5) Analytics/Measurement
- Track click split by free vs paid card.
- Track first-click-to-conversion funnel per track.
- Measure reduction in wrong-path navigation (e.g., backtracks between apply/packages).

## 6) Test plan
- Mobile manual checks: ensure cards are above key fold transition and fully tappable.
- Limited-English scan test: 5-second clarity test on card meaning and next action.
- Regression checks:
  - CTA destinations remain correct.
  - No layout overlap with hero/announcement blocks.
- Existing tests likely impacted:
  - Homepage structure snapshots.
  - Navigation/assertions for hero-adjacent CTAs.

## 7) Dependencies/Risks
- Dependencies: naming standardization issue (“Signup Help (Free)” and “Promotion (Paid)”).
- Risks: adding another block under hero can push content down; mitigate with concise copy and compact mobile spacing.
