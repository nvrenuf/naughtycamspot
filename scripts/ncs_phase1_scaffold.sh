# scripts/ncs_phase1_scaffold_v2.sh
#!/usr/bin/env bash
set -euo pipefail

CREATE_ISSUES="${1:-}"   # pass --create-issues to open GH issues and use real numbers

git checkout -f main
git pull --rebase origin main

mkdir -p docs .github/workflows .codex

# --- docs/ARCHITECTURE.md (abridged, same content you planned) ---
cat > docs/ARCHITECTURE.md <<'MD'
# ARCHITECTURE
NaughtyCamSpot (NCS) is a model-signup funnel (not an agency). Pages must never emit `/go/*`; StartRight is the single primary CTA; preserve `?src,camp,date`. Pages = Astro static; prod = ViceTemple (`/public/go/*`, future VIP API).
MD

# --- docs/PHASE1_SCOPE.md (abridged) ---
cat > docs/PHASE1_SCOPE.md <<'MD'
# PHASE 1 SCOPE
Home trim + nav cleanup; First-90-Days block; Milestones strip; Payout panel; VIP teasers; /gear cohort banner. No VIP backend yet.
MD

# ---------- helpers ----------
need_gh() { command -v gh >/dev/null 2>&1 || { echo "gh CLI required"; exit 1; }; }
repo_slug() {
  gh repo view --json nameWithOwner -q .nameWithOwner 2>/dev/null || \
  git remote get-url origin | sed -E 's#.*github.com[:/](.+/.+)(\.git)?$#\1#'
}
create_issue_api() {
  local title="$1" body="$2" labels="$3" repo="$4"
  # Preferred: gh api with built-in --jq
  if gh api repos/"$repo"/issues -f title="$title" -f body="$body" -f labels="$labels" --jq .number >/dev/null 2>&1; then
    gh api repos/"$repo"/issues -f title="$title" -f body="$body" -f labels="$labels" --jq .number
  else
    # Fallback: create, parse URL
    local url
    url=$(gh issue create -t "$title" -b "$body" -l "$labels")
    sed -E 's#.*/issues/([0-9]+).*#\1#' <<<"$url"
  fi
}
# -----------------------------

A="#A"; B="#B"; C="#C"; D="#D"; E="#E"; F="#F"

if [[ "$CREATE_ISSUES" == "--create-issues" ]]; then
  need_gh
  REPO=$(repo_slug)
  echo "Repo: $REPO"

  A_NUM=$(create_issue_api "Home: trim sections + nav cleanup" \
        "Remove non-core nav; merge proof/builds/concierge/blog into 3-tile strip; one primary CTA; no /go/* on Pages." \
        "content" "$REPO")
  B_NUM=$(create_issue_api "Home: First-90-Days block with countdown + slots" \
        "Add newbie block with countdown and cohort slots chip; ethical urgency." \
        "content" "$REPO")
  C_NUM=$(create_issue_api "Home: Milestones + Assignments strip" \
        "Week 1–4 tasks with progress bar; responsive." \
        "content" "$REPO")
  D_NUM=$(create_issue_api "Home: Payout readiness micro-panel" \
        "Small panel: KYC, payout link to /earnings, test payout note." \
        "content" "$REPO")
  E_NUM=$(create_issue_api "VIP: teasers on Home + StartRight" \
        "Teaser tiles for VIP Kit and VIP Posts; Unlock VIP → /claim; no VIP body in Pages." \
        "vip" "$REPO")
  F_NUM=$(create_issue_api "Gear: cohort urgency banner on /gear" \
        "Countdown + slots banner; VIP badge if vip=1; maintain aesthetic." \
        "gear" "$REPO")

  A="#$A_NUM"; B="#$B_NUM"; C="#$C_NUM"; D="#$D_NUM"; E="#$E_NUM"; F="#$F_NUM"
fi

cat > WORK_QUEUE.md <<MD
# NCS — Codex Work Queue

## Rules
- Branch: **main**. **No PRs.**
- Build gate: \`npm ci && npm run build\` must pass.
- Commit must include: \`Closes #<issue-number>\`.
- Pages must **never** emit \`/go/*\`.
- Preserve \`?src=...&camp=...&date=YYYYMMDD\`.

## Queue
- [ ] $A Home: trim sections + nav cleanup
- [ ] $B Home: First-90-Days block with countdown + slots
- [ ] $C Home: Milestones + Assignments strip
- [ ] $D Home: Payout readiness micro-panel
- [ ] $E VIP: teasers on Home + StartRight
- [ ] $F Gear: cohort urgency banner on /gear

---

### $A — Home: trim sections + nav cleanup
Goal: remove clutter, keep one primary CTA, merge noncritical rows into one 3-tile strip.
Do:
- Nav: remove Contests, Models, Join models, Claim from top nav; move needed links to footer.
- Merge proof/builds/concierge/blog preview into a single “What you get” 3-tile strip.
- Ensure StartRight is the only primary CTA on Home.
- Ensure no \`/go/*\` links render on Pages.
Tests: build green; exactly one primary CTA; grep dist for \`/go/\` returns nothing.
Commit_message:
feat(home): trim sections + nav cleanup

Closes $A

---

### $B — Home: First-90-Days block with countdown + slots
Goal: explain first 90 days and add ethical urgency.
Do:
- Add “Your first 90 days” section with 3 bullets (visibility push, weekly assignments, concierge review).
- Countdown component seeded from placeholder date (env or static).
- Cohort chip like “18/50 kits left”.
Tests: build green; countdown + chip render on mobile.
Commit_message:
feat(home): first-90-days block with countdown + cohort slots

Closes $B

---

### $C — Home: Milestones + Assignments strip
Goal: week-by-week plan with progress bar.
Do:
- Add horizontal milestones strip with Week 1–4 tasks.
- Add simple progress bar component; ensure mobile layout.
Tests: build green; strip visible and responsive.
Commit_message:
feat(home): milestones + assignments strip

Closes $C

---

### $D — Home: Payout readiness micro-panel
Goal: reduce payout friction.
Do:
- Small panel near bottom: KYC ✅, payout method link to /earnings, “test payout” note.
- Neutral copy; maintain aesthetic.
Tests: build green; link points to /earnings.
Commit_message:
feat(home): payout readiness micro-panel

Closes $D

---

### $E — VIP: teasers on Home + StartRight
Goal: surface VIP value without exposing content on Pages.
Do:
- Add two teaser tiles: VIP Kit, VIP Posts. If not VIP, show teaser + “Unlock VIP” → /claim.
- No VIP content in static build; teasers only.
Tests: build green; no VIP body in dist; links route correctly.
Commit_message:
feat(vip): teasers on Home and StartRight

Closes $E

---

### $F — Gear: cohort banner on /gear
Goal: add cohort countdown + slots without cheapening look.
Do:
- Banner at top of /gear with countdown + slots; show VIP badge if \`vip=1\`.
- Keep palette/typography consistent.
Tests: build green; banner visible; VIP badge toggles by query param.
Commit_message:
feat(gear): cohort banner with countdown and slots

Closes $F
MD

# optional: minimal rules file to keep Codex in-bounds
mkdir -p .codex
cat > .codex/rules.txt <<'TXT'
- Work on branch: main
- No PRs
- npm ci && npm run build must pass
- Commit must include Closes #<issue-number>
- Pages must never emit /go/*
- Preserve src,camp,date
TXT

git add -A
git commit -m "chore: bootstrap Phase 1 docs + WORK_QUEUE (compat with older gh CLI)"
git push origin main
