# NCS — Codex Work Queue

## Rules
- Branch: **main**. **No PRs.**
- Build gate: `npm ci && npm run build` must pass.
- Commit must include: `Closes #<issue-number>`.
- Pages must **never** emit `/go/*`.
- Preserve `?src=...&camp=...&date=YYYYMMDD`.

## Queue
- [x] #6 Home: trim sections + nav cleanup
- [ ] #7 Home: First-90-Days block with countdown + slots
- [ ] #8 Home: Milestones + Assignments strip
- [ ] #9 Home: Payout readiness micro-panel
- [ ] #10 VIP: teasers on Home + StartRight
- [ ] #11 Gear: cohort urgency banner on /gear

---

### #6 — Home: trim sections + nav cleanup
Goal: remove clutter, keep one primary CTA, merge noncritical rows into one 3-tile strip.
Do:
- Nav: remove Contests, Models, Join models, Claim from top nav; move needed links to footer.
- Merge proof/builds/concierge/blog preview into a single “What you get” 3-tile strip.
- Ensure StartRight is the only primary CTA on Home.
- Ensure no `/go/*` links render on Pages.
Tests: build green; exactly one primary CTA; grep dist for `/go/` returns nothing.
Commit_message:
feat(home): trim sections + nav cleanup

Closes #6

---

### #7 — Home: First-90-Days block with countdown + slots
Goal: explain first 90 days and add ethical urgency.
Do:
- Add “Your first 90 days” section with 3 bullets (visibility push, weekly assignments, concierge review).
- Countdown component seeded from placeholder date (env or static).
- Cohort chip like “18/50 kits left”.
Tests: build green; countdown + chip render on mobile.
Commit_message:
feat(home): first-90-days block with countdown + cohort slots

Closes #7

---

### #8 — Home: Milestones + Assignments strip
Goal: week-by-week plan with progress bar.
Do:
- Add horizontal milestones strip with Week 1–4 tasks.
- Add simple progress bar component; ensure mobile layout.
Tests: build green; strip visible and responsive.
Commit_message:
feat(home): milestones + assignments strip

Closes #8

---

### #9 — Home: Payout readiness micro-panel
Goal: reduce payout friction.
Do:
- Small panel near bottom: KYC ✅, payout method link to /earnings, “test payout” note.
- Neutral copy; maintain aesthetic.
Tests: build green; link points to /earnings.
Commit_message:
feat(home): payout readiness micro-panel

Closes #9

---

### #10 — VIP: teasers on Home + StartRight
Goal: surface VIP value without exposing content on Pages.
Do:
- Add two teaser tiles: VIP Kit, VIP Posts. If not VIP, show teaser + “Unlock VIP” → /claim.
- No VIP content in static build; teasers only.
Tests: build green; no VIP body in dist; links route correctly.
Commit_message:
feat(vip): teasers on Home and StartRight

Closes #10

---

### #11 — Gear: cohort banner on /gear
Goal: add cohort countdown + slots without cheapening look.
Do:
- Banner at top of /gear with countdown + slots; show VIP badge if `vip=1`.
- Keep palette/typography consistent.
Tests: build green; banner visible; VIP badge toggles by query param.
Commit_message:
feat(gear): cohort banner with countdown and slots

Closes #11
