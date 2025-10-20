# Affiliate Program Registry

| Key | Program | Join Base | SubID Params | Status |
| --- | --- | --- | --- | --- |
| camsoda | CamSoda | https://www.camsoda.com/models?id=naughtycamboss | `subid` | approved |
| chaturbate | Chaturbate | https://chaturbate.com/in/?tour=5zjT&campaign=YIOhf&track=default | `track` | approved |
| bonga | BongaCams | https://bongacash.com/model-ref?c=828873 | `s1` | approved |
| jasmin | Jasmin | — | — | pending |
| stripchat | Stripchat | — | — | blocked |
| myclub | My.Club | — | — | low_priority |
| pornhub | Pornhub | — | — | research |
| crakrevenue | CrakRevenue | — | — | research |

Status badges and link behaviour are sourced from `src/data/programStatus.ts`. Pages builds never emit `/go/*`; production joins retain the guarded `/go/model-join.php` flow. The Bonga `s1` param encodes `src-camp-date` so concierge reconciliation remains accurate across surfaces.
