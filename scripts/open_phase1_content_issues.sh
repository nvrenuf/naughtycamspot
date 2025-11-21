#!/usr/bin/env bash
set -e

REPO="nvrenuf/naughtycamspot"

create_issue() {
  local TITLE="$1"
  local BODY="$2"
  local LABELS="$3"

  gh issue create \
    --repo "$REPO" \
    --title "$TITLE" \
    --body "$BODY" \
    --label "$LABELS"
}

# ----------------------------
# CONTENT ISSUES
# ----------------------------

create_issue \
"Home Page: Final Copy Pass" \
"Finalize all Home page text for Phase-1. Maintain high-end tone, single CTA, and structured sections (First 90 Days, Milestones, Payout Panel, VIP teasers). Codex edits text-only — no layout changes." \
"content,phase1"

create_issue \
"StartRight Page: Full Content Rewrite" \
"Write complete StartRight funnel copy: purpose, benefits, 14-day structure, independence message, clear CTA. Codex updates text in startright.astro only." \
"content,phase1"

create_issue \
"Compare Platforms: Content Pass" \
"Add final platform comparison copy: beginner friendliness, traffic patterns, token economy, earning models. Codex edits compare.astro text-only." \
"content,phase1,seo"

create_issue \
"Join Models: Referral Explanation Page" \
"Write clear, trust-building content explaining how referrals work and why NCS earns from platforms, not models. Codex edits join-models.astro." \
"content,phase1,affiliates"

create_issue \
"About Page: High-End Rewrite" \
"Create a clean, premium About page explaining the mission, philosophy, and independence-focused approach. Codex edits about.astro." \
"content,phase1"

create_issue \
"Gear Kits: Starter / Midrange / Pro Content" \
"Write well-structured gear kit content with 3 tiers and supporting recommendations. No affiliate links yet. Codex edits gear-kits.astro." \
"content,phase1,gear,affiliates"

create_issue \
"Blog Post: First 30 Days Blueprint" \
"700–1,000 words. Beginner roadmap with sections, guidance, and StartRight crosslink. Codex adds markdown blog file." \
"content,phase1,blog,seo"

create_issue \
"Blog Post: Where the Viewers Are (2025)" \
"700–1,000 words. Platform traffic patterns and visibility strategy. Codex adds markdown blog file." \
"content,phase1,blog,seo"

create_issue \
"Blog Post: Beginner Mistakes That Kill Growth" \
"600–900 words. List of 7–10 mistakes. Supportive corrective tone. Codex adds markdown blog file." \
"content,phase1,blog,seo"

create_issue \
"Blog Post: How to Pick Your First Cam Platform" \
"600–900 words. Beginner guide for selecting the best platform. Codex adds markdown blog file." \
"content,phase1,blog,seo"

create_issue \
"Blog Post: Earn Before Your First Stream" \
"600–900 words. Pre-stream tactics, goals, and gear tie-ins. Codex adds markdown blog file." \
"content,phase1,blog,seo"

echo "All content issues created."
