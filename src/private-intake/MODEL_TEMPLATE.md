# Private Model Intake Template

This file is used to add a new model card to the **private promo-links page**.
This page is NOT public, NOT indexed, and used only for internal affiliate verification.

---

## HOW TO USE (HUMAN)

1. Copy everything under **MODEL DATA (COPY & FILL)** into a new file:
   - Example: `src/private-intake/jane-doe.md`
2. Fill in all fields.
3. Save the file.
4. Copy the **entire contents** of that filled-out file.
5. Paste it into Codex using the prompt at the bottom of this template.

---

## MODEL DATA (COPY & FILL)

```yaml
name: 
slug: 
image: 

links:
  - label: 
    url: 
  - label: 
    url: 
  - label: 
    url: 
  - label: 
    url: 
Field notes
name: Display name (e.g. Anna Prince)

slug: lowercase, hyphenated (e.g. anna-prince)

image:

Use an existing asset (e.g. home-hero.webp) OR

A new image you dropped into src/private-intake/

links:

Use real, exact URLs

Labels should be platform names (Stripchat, Chaturbate, etc.)

CODEX PROMPT (PASTE WITH FILLED MODEL DATA)
Codex: Append a new model to the private promo-links data source.

Branch: private-model-links

Instructions:
- Read the MODEL DATA YAML below.
- Append this model as a new entry in src/data/privateModels.ts.
- Preserve existing formatting and ordering.
- If the image file exists in src/private-intake/, move or copy it into the existing model image directory and reference that path.
- If the image already exists elsewhere in the repo, reference it in place.
- Do NOT modify src/pages/promo-links.astro.
- Do NOT modify navigation, sitemap, robots, or any public-facing pages.
- Do NOT refactor unrelated code.

Commit message:
feat: add <MODEL_NAME> to private promo links

MODEL DATA:
<PASTE FILLED YAML BLOCK HERE>
