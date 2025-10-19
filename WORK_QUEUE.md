# NCS Work Queue (commit directly to main, no PR)

## [1] Programs registry + UI wiring
- [ ] Add src/data/programs.json (camsoda approved, chaturbate approved, bonga pending, jasmin pending, stripchat blocked, myclub low_priority, pornhub research)
- [ ] Compare + StartRight read status; pending = disabled join, approved = join_base (Pages)
- [ ] Build passes; Pages HTML has no /go/*

## [2] Models data source + pages
- [ ] Add src/data/models.json (Anna links filled; Mia approved:false)
- [ ] /models and /models/[slug] render from data; buttons add ?src=model_page&camp=<slug>&date=YYYYMMDD
- [ ] Build passes

## [3] Hero strip icon + text
- [ ] Replace broken image with inline SVG camera icon
- [ ] Text: "STARTRIGHT — GET YOUR FREE KIT", href "/startright"
- [ ] Build passes; visible on home

## [4] Blog index + search
- [ ] /blog shows list with tags
- [ ] Client-side search across title+excerpt; no external calls
- [ ] Build passes

## [5] Banner placeholders
- [ ] Implement slots: home(top,mid,footer), post(top,inline,end), model(sidebar,mid)
- [ ] src/data/banners.ts with {slot, img, alt, href_pages:'/startright', href_prod:'<kept>'}
- [ ] Banners render where slots exist; Pages point to /startright

## [6] Affiliate inventory doc
- [ ] Create docs/affiliates.md with table (Program | Type | Status | Join URL | SubID param | Notes)
- [ ] Keep programs.json in sync

## [7] Rotator map refactor
- [ ] public/go/programs.map.php: ['camsoda'=>{base,subid}, 'chaturbate'=>{...}, 'bonga'=>{...}]
- [ ] Builders read from map; headers include Cache-Control:no-store
- [ ] Build passes (Pages unaffected)
