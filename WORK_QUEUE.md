# NCS — Codex Work Queue (Phase 1)

## Rules
- Branch: **main**. **No PRs.**
- Always start with: `git checkout -f main && git pull --rebase origin main`.
- Build gate: `npm ci || npm install` then `npm run build` must pass.
- Pages must **never** emit `/go/*` (check with `grep -R "/go/" dist`).
- Commit must include: `Closes #<issue-number>`.
- After finishing an item, mark it checked here and commit with:
  `chore(queue): mark #<issue-number> done`.
- On any failure (build/tests/git), STOP and print the failing command + output.

## Queue
- [x] #26 Programs registry hardening + tests
- [x] #27 Banners: data + safe placements
- [x] #28 Gear Kits V0 (curated, compliant)
- [x] #29 StartRight: choose V0 static wizard or fold into page
- [ ] #30 Content fill: core pages
- [ ] #31 Blog: publish 5 Phase-1 posts
- [ ] #32 SEO & sitemap/robots + OG/Twitter
- [ ] #33 Analytics (env-gated)
- [ ] #34 CI: pin Node 20.17 + build + /go/ guardrail
