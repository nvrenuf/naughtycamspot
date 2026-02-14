# Issue Implementation Order for NaughtyCamSpot

This document defines the recommended order for Codex to tackle the outstanding issues for the NaughtyCamSpot site.  Addressing them in this sequence will ensure that core messaging and navigation updates are completed before more incremental improvements.

1. [x] **Clarify dual purpose (recruiting vs. promotion) — see issue #80**

   Update the site’s messaging so visitors immediately understand NaughtyCamSpot is both a model recruitment platform (via affiliate partnerships) and a paid promotion service (where models pay for marketing).  Adjust the homepage hero, meta description and CTAs accordingly:contentReference[oaicite:0]{index=0}.

2. [x] **Streamline navigation & fix the resource menu — see issue #81**

   Audit the `nav.ts` data and remove or fix broken links, collapse legal/terms links into the footer, and add top‑level navigation entries for Recruiting and Promotion.  Ensure the Resource dropdown works properly and that all menu items link somewhere meaningful:contentReference[oaicite:1]{index=1}.

3. [x] **Build dedicated recruiting & promotion pages — see issue #82**

   Create a `/recruiting` page listing partner platforms (Chaturbate, CamSoda, etc.) with descriptions and affiliate links, and a `/promotion` page outlining marketing packages with features, pricing and sign‑up forms.  Cross‑link these pages and update CTAs to point at them.

4. [x] **Rewrite homepage & hero section — see issue #83**

   Overhaul the homepage copy and visuals to clearly communicate the benefits of using NaughtyCamSpot.  Add a benefit‑driven hero headline and sub‑heading, a section comparing recruiting vs. promotion, and trust signals (non‑negotiables and testimonials).

5. **Expose proof & blog content — see issue #84**

   Surface real proof of results (anonymised earnings data, success stories, before/after promotions) in a `/proof` page and feature recent blog posts on the home page.  Build a `/blog` index page and link relevant posts from recruiting and promotion pages.

6. **Improve readability & accessibility — see issue #85**

   Adjust typography and colour contrast for better readability; adopt consistent casing in navigation labels; add focus states and ARIA attributes; and ensure alt text and labels for images and forms.  Aim for WCAG‑AA compliance.

7. **Optimise performance — see issue #86**

   Preload fonts, compress and lazy‑load images, enable Tailwind’s purge of unused styles, defer non‑essential JavaScript and configure caching headers.  Remove unused trackers or analytics.

8. **Strengthen privacy & security — see issue #87**

   Add CSRF tokens and input validation to all forms; restrict accepted file types and move uploads outside the web root; set security headers (CSP, HSTS, X‑Frame‑Options, etc.); and update privacy/terms pages to clarify data handling practices.

9. **Expand training & community resources — see issue #88**

   Produce educational guides for major platforms (OnlyFans, ManyVids, etc.), create blog posts or videos on pricing and audience growth, and launch a community forum or Discord.  Add a page for upcoming events and link community resources prominently.
