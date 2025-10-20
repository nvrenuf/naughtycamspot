# NCS — Codex Work Queue

## Rules
- Branch: main. No PRs.
- Gate: `npm ci && npm run build` must pass.
- Commit must include: `Closes #<issue-number>`.
- Pages must never emit `/go/*`.
- Preserve `?src=...&camp=...&date=YYYYMMDD`.

## Queue
- [ ] #72 Central programs registry + UI wiring
- [ ] #39 Affiliate links inventory (CamSoda, Chaturbate, BongaCams)

---

### #72 — Programs registry + UI wiring
Goal: single `src/data/programs.json`; UI reads statuses.
Do:
- Add entries: camsoda, chaturbate, bonga, jasmin, stripchat, myclub, pornhub, crakrevenue.
- bonga.join_base = `https://bongacash.com/model-ref?c=828873`
- bonga.subid_params = `["s1"]`
- Update Compare + StartRight to consume registry; disable non-approved.
- Add `docs/affiliates.md` table.
Guardrail: Pages never output `/go/*`.
Commit_message:
feat(programs): central registry + UI integration

Closes #72

---

### #39 — Affiliate links inventory
Goal: confirm join bases and subid keys; finalize registry.
Do:
- Finalize join_base + subid keys for CamSoda, Chaturbate, Bonga.
- StartRight/Compare: Bonga is approved; tracked join uses `&s1=<subid>`, where `subid = encodeURIComponent([src,camp,date].filter(Boolean).join('-'))`.
- Leave Prod `/go` GEO-tier TODO.
Tests: link builder includes `&s1=` and preserves `c=828873`.
Commit_message:
chore(affiliates): finalize join URLs and subid params

Closes #39
