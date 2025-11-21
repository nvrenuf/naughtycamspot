#!/usr/bin/env bash
set -euo pipefail

# Resolve owner/repo
REPO="${REPO:-}"
if [[ -z "${REPO}" ]]; then
  if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    url="$(git config --get remote.origin.url || true)"
    case "$url" in
      https://github.com/*/*.git) REPO="${url#https://github.com/}"; REPO="${REPO%.git}";;
      git@github.com:*.git)       REPO="${url#git@github.com:}";     REPO="${REPO%.git}";;
      *)                          REPO="$(gh repo view --json nameWithOwner -q .nameWithOwner)";;
    esac
  else
    REPO="$(gh repo view --json nameWithOwner -q .nameWithOwner)"
  fi
fi

# Ensure Issues are enabled
if [[ "$(gh repo view "$REPO" --json hasIssuesEnabled -q .hasIssuesEnabled)" != "true" ]]; then
  echo "Issues are disabled on $REPO. Enable them in GitHub and re-run." >&2
  exit 1
fi

ensure_label() {
  local name="$1" color="$2"
  gh label list --repo "$REPO" --search "^${name}\$" --limit 1 --json name -q '.[0].name' >/dev/null 2>&1 \
    || gh label create "$name" --color "$color" --repo "$REPO" >/dev/null
}

for l in phase1 affiliates banners content gear seo analytics ci; do
  ensure_label "$l" 0E8A16
done

make_issue() {
  local title="$1"; local body="$2"; shift 2
  local tmp; tmp="$(mktemp)"; printf "%s\n" "$body" > "$tmp"
  local label_flags=()
  for label in "$@"; do
    label_flags+=(--label "$label")
  done
  gh issue create --repo "$REPO" --title "$title" --body-file "$tmp" "${label_flags[@]}" >/dev/null || {
    echo "Failed to create: $title" >&2; rm -f "$tmp"; exit 1;
  }
  rm -f "$tmp"
}

make_issue "Programs registry hardening + tests" \
"Finalize src/data/programs.json; add env overrides NCS_<PROGRAM>_JOIN_BASE and NCS_<PROGRAM>_SUBIDS; encode src|camp|date; never emit /go/* on Pages; add unit tests for the link builder." \
phase1 affiliates ci

make_issue "Banners: data + safe placements" \
"Create src/data/banners.json; render via BannerSlot on Home/Compare; only approved programs; text CTA fallback; no raw affiliate URLs in components." \
phase1 banners affiliates content

make_issue "Gear Kits V0 (curated, compliant)" \
"Implement src/data/gear.json and render on /gear-kits; cards with vendor URL + tags; 'coming soon' state for out-of-stock; optionally hide header link until ready." \
phase1 gear content

make_issue "StartRight: choose V0 static wizard or fold into page" \
"Either ship a 3-step static wizard (no storage) or fold content into /startright. Update CTAs; remove half-built app affordances." \
phase1 content

make_issue "Content fill: core pages" \
"Finalize copy for /, /startright, /compare (from programs.json), /earnings (payout readiness), /gear-kits; mobile pass; remove dead links." \
phase1 content

make_issue "Blog: publish 5 Phase-1 posts" \
"Publish: viewers-2025; 14-day-launch; earnings-levers; camsoda-vs-chaturbate; starter-room-under-100. Optimize images; avoid /go/* in Pages." \
phase1 content seo

make_issue "SEO & sitemap/robots + OG/Twitter" \
"Add per-page meta; OG/Twitter images; sitemap.xml & robots.txt; canonical URLs; 404 check." \
phase1 seo

make_issue "Analytics (env-gated)" \
"Add Plausible/Umami snippet behind env; document enablement; verify no cookies without consent (simple mode)." \
phase1 analytics

make_issue "CI: pin Node 20.17 + build + /go/ guardrail" \
"Workflow: setup-node 20.17; npm ci || npm i; npm run build; grep -R '/go/' dist must be empty; upload dist artifact." \
phase1 ci

echo "DONE: created Phase-1 issues in $REPO"
BASH
