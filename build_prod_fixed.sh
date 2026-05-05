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
# Tailwind v4 + @astrojs/tailwind v6 currently trips npm peer resolution on clean installs.
# Use legacy peer resolution for reproducible production packaging until deps are aligned.
npm ci --legacy-peer-deps

# build with PROD config (and run prebuild hooks like build-stamp generation)
npm run build

# --- verify build stamp
echo "Build stamp in dist/build.txt:"
cat dist/build.txt || { echo "Missing dist/build.txt"; exit 1; }

# --- prod robots
if [ -f "dist/robots.prod.txt" ]; then
  cp -f dist/robots.prod.txt dist/robots.txt
fi

# --- verify required prod files for current architecture
REQ=( "dist/.htaccess" "dist/go/affiliates.php" )
for f in "${REQ[@]}"; do
  [ -f "$f" ] || { echo "Missing $f"; exit 1; }
done

# --- optional platform handlers (warn, don't fail)
OPTIONAL=(
  "dist/go/chaturbate.php"
  "dist/go/camsoda.php"
  "dist/go/bongacams.php"
  "dist/go/fansly.php"
)
for f in "${OPTIONAL[@]}"; do
  if [ ! -f "$f" ]; then
    echo "Warning: optional handler not found: $f"
  fi
done

# --- zip artifact
cd dist
if command -v zip >/dev/null; then
  zip -r "../$ZIP_NAME" . -x "*.DS_Store"
else
  # Windows fallback: use PowerShell's Compress-Archive if zip CLI is unavailable
  powershell.exe -NoLogo -Command "Compress-Archive -Path * -DestinationPath ..\\$ZIP_NAME -Force"
fi
cd - >/dev/null

echo "Built and zipped: $ZIP_NAME"
echo "Next: upload $ZIP_NAME to ViceTemple and unzip into your web root."
