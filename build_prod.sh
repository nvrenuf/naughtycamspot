#!/usr/bin/env bash
set -euo pipefail

# --- config
ZIP_NAME="ncs_dist_$(date +%Y%m%d_%H%M).zip"

# --- sanity checks
if ! command -v git >/dev/null || ! command -v npm >/dev/null; then
  echo "Missing git or npm"; exit 1
fi
if [ ! -f "package.json" ] || [ ! -f "astro.config.mjs" ]; then
  echo "Run from repo root"; exit 1
fi

# --- sync main
git fetch --prune
if git rev-parse --verify main >/dev/null 2>&1; then
  git checkout main
else
  echo "Branch 'main' not found"; exit 1
fi
git pull --ff-only

# --- clean build
rm -rf dist node_modules
npm ci
# build with PROD config (not the Pages config)
npx astro build

# --- prod robots
if [ -f "dist/robots.prod.txt" ]; then
  cp -f dist/robots.prod.txt dist/robots.txt
fi

# --- verify required prod files
REQ=( "dist/.htaccess" "dist/go/model-join.php" "dist/go/affiliates.php" )
for f in "${REQ[@]}"; do
  [ -f "$f" ] || { echo "Missing $f"; exit 1; }
done

# --- zip artifact
cd dist
if command -v zip >/dev/null; then
  zip -r "../$ZIP_NAME" . -x "*.DS_Store"
else
  # Windows fallback: use PowerShell's Compress-Archive if zip CLI is unavailable
  powershell.exe -NoLogo -Command "Compress-Archive -Path * -DestinationPath ..\\$ZIP_NAME -Force"
fi
cd -

echo "Built and zipped: $ZIP_NAME"
echo "Next: upload $ZIP_NAME to ViceTemple and unzip into your web root."
