# Title
Add Step 1 of 4 progress indicator on Apply

# Labels
- area:ux
- area:forms
- priority:P2
- effort:S

# Priority
P2

# Effort
S

## 1) Problem
Users can lose confidence in multi-step Apply flows when they cannot see where they are. Unclear progress increases perceived effort and can raise abandonment.

Mobile users and limited-English users benefit from visible step context and short labels that reduce uncertainty.

## 2) Goal
- Show clear progress state (e.g., Step 1 of 4) throughout Apply.
- Make progress understandable on mobile and accessible via keyboard.
- Keep the experience account-free (no login dependency).

## 3) Proposed approach
- Add compact visual progress bar with text label (“Step X of 4”).
- Include short step names under or beside bar where space allows.
- Ensure progression updates with step navigation, including back/forward actions.
- UI notes:
  - Mobile-first compact design.
  - High-contrast active/inactive states.
  - Keyboard-focus visible for interactive step navigation (if clickable).

## 4) Acceptance criteria
- [ ] Progress label shows current step accurately as user advances/regresses.
- [ ] Progress UI displays and remains readable on mobile widths.
- [ ] Flow works without requiring account/login.
- [ ] Keyboard navigation and focus behavior are functional and understandable.
- [ ] Progress indicator does not obscure or push critical form fields off-screen on mobile.

## 5) Analytics/Measurement
- Track per-step drop-off rates before/after adding progress indicator.
- Track completion rate change for multi-step applies.

## 6) Test plan
- Mobile manual checks across step transitions and orientations.
- Keyboard-only manual checks for focus order and navigation.
- Limited-English scan test for “where am I?” comprehension.
- Existing tests likely impacted:
  - Apply step-navigation tests.
  - Snapshot tests covering form header/progress region.

## 7) Dependencies/Risks
- Dependencies: Apply flow definition, especially if Fast Lane issue changes step count.
- Risks: mismatch between actual and displayed step count; mitigate with single shared step config.
