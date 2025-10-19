# NCS Work Queue (commit directly to main, no PR)

## [#72] Programs registry + UI wiring
- [ ] Add src/data/programs.json (camsoda approved, chaturbate approved, bonga pending, jasmin pending, stripchat blocked, myclub low_priority, pornhub research)
- [ ] Compare + StartRight read status; pending = disabled join, approved = join_base (Pages)
- [ ] Build passes; Pages HTML has no /go/*

## [#] Models data source + pages
- [ ] Add src/data/models.json (Anna links filled; Mia approved:false)
- [ ] /models and /models/[slug] render from data; buttons add ?src=model_page&camp=<slug>&date=YYYYMMDD
- [ ] Build passes

## [#] Hero strip icon + text
- [ ] Replace broken image with inline SVG camera icon- [ ] RText: "STARTRIGHT — GE- [ ] RFREE KIT", href "/startright-
- [ ] Build passes; visible on- [ ] 
## [#40] Blog index + se## [#[ ] /blog shows list with tag##  [ ] Client-side search across title+excerpt; no external calls
- [ ] Build passes

## [#] Banner placeholders
- [ ] Implement slots: home(top,mid,footer), post(top,inline,end), model(sidebar,mid)
- [ ] src/data/banners.ts with {slot, img, alt, href_pages:'/startright', href_prod:'<kept>'}
- [ ] Banners render where slots exist; Pages point to /startright

## [#] Affiliate inventory doc
- [ ] Create docs/affiliates.md (Program | Type | Status | Join URL | SubID param | Notes)
- [ ] Keep programs.json in sync

## [#] Rotator uses central program map
- [ ] public/go/programs.map.php with {base, subid_key}
- [ ] Builders read from the map; headers no-store
- [ ] Build passes (Pages unaffected)
