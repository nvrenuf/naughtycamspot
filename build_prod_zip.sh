#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || true)
if [[ -z "$REPO_ROOT" ]]; then
  echo "Run from within a git repository." >&2
  exit 1
fi

cd "$REPO_ROOT"

for cmd in git npm zip; do
  if ! command -v "$cmd" >/dev/null 2>&1; then
    echo "Missing required command: $cmd" >&2
    exit 1
  fi
done

if [[ ! -f package.json || ! -f astro.config.mjs ]]; then
  echo "Run this script from the project root." >&2
  exit 1
fi

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
ZIP_NAME="ncs_dist_$(date +%Y%m%d_%H%M).zip"

echo "→ Fetching latest main"
git fetch origin --prune
if git show-ref --verify --quiet refs/heads/main; then
  git checkout main
else
  echo "Branch 'main' not found." >&2
  exit 1
fi
git pull --ff-only origin main

echo "→ Installing dependencies & building"
rm -rf dist
npm ci
npx astro build

if [[ -f dist/robots.prod.txt ]]; then
  cp dist/robots.prod.txt dist/robots.txt
fi

if [[ ! -d dist/go ]]; then
  echo "dist/go missing after build." >&2
  exit 1
fi
PHP_COUNT=$(find dist/go -maxdepth 1 -type f -name '*.php' | wc -l | tr -d ' ')
if [[ "$PHP_COUNT" == "0" ]]; then
  echo "No PHP redirectors found in dist/go." >&2
  exit 1
fi

echo "→ Creating $ZIP_NAME"
(cd dist && zip -r "../$ZIP_NAME" . -x "*.DS_Store")

echo "✅ Build complete: $ZIP_NAME"

echo "→ Restoring branch $CURRENT_BRANCH"
if [[ "$CURRENT_BRANCH" != "main" ]]; then
  git checkout "$CURRENT_BRANCH"
fi
