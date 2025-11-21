# Unused or removable files

The following files and directories no longer participate in the current Astro site and can be removed to reduce noise. Each item lists the justification and where it still appears (if anywhere).

## Legacy Astro pages
- `src/_archive/` (including `claim.astro`, `join.astro`, `models.astro`, training pages, and related routes)
  - These pages were superseded by the current `src/pages/*` routes and are kept only in the `_archive` folder. Nothing in the active navigation or layout imports them, and the only references to their helpers stay inside `_archive` itself, so they no longer ship in the live build.

## Unused training gate and content
- `src/components/TrainingAccess.astro`
- `src/content/training/`
  - The training collection and gate component are only imported by the archived training pages. There is no `src/pages/training` route in the active site, so the gate and the training Markdown files never render.

## Bootstrap scaffolding artifacts
- `scripts/ncs_phase1_scaffold.sh`
- `docs/ARCHITECTURE.md`
- `docs/PHASE1_SCOPE.md`
- `WORK_QUEUE.md`
  - These files came from an early bootstrap script that writes placeholder docs and a short-term work queue. The script is self-contained and not referenced by any other build or test tooling, and the generated docs duplicate information now captured in the main `README.md` and production pages.
