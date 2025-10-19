#!/usr/bin/env bash
set -euo pipefail

if ! git rev-parse --git-dir >/dev/null 2>&1; then
  echo "Error: This script must be run inside a Git repository." >&2
  exit 1
fi

if [[ -n "$(git status --porcelain)" ]]; then
  echo "Error: Working tree has uncommitted changes. Please commit or stash them before syncing." >&2
  exit 1
fi

current_branch=$(git rev-parse --abbrev-ref HEAD)
trap 'git checkout -q "$current_branch" >/dev/null 2>&1 || true' EXIT

if [[ -z "$(git remote)" ]]; then
  echo "No remotes configured. Nothing to sync."
  exit 0
fi

echo "Fetching latest updates for all remotes..."
git fetch --all --prune

declare -a remote_refs
mapfile -t remote_refs < <(git for-each-ref --format='%(refname:lstrip=2)' refs/remotes)

if [[ ${#remote_refs[@]} -eq 0 ]]; then
  echo "No remote branches found. Nothing to sync."
  exit 0
fi

for ref in "${remote_refs[@]}"; do
  remote_name="${ref%%/*}"
  branch_name="${ref#*/}"

  if [[ -z "$branch_name" || "$branch_name" == "HEAD" ]]; then
    continue
  fi

  echo "Synchronizing $branch_name with $remote_name/$branch_name..."

  if git show-ref --verify --quiet "refs/heads/$branch_name"; then
    git checkout -q "$branch_name"
    if git merge --ff-only "$remote_name/$branch_name"; then
      echo "Fast-forwarded $branch_name to $remote_name/$branch_name."
    else
      echo "Warning: $branch_name has diverged from $remote_name/$branch_name; manual merge required." >&2
    fi
  else
    git branch --track "$branch_name" "$remote_name/$branch_name"
    echo "Created local branch $branch_name from $remote_name/$branch_name."
  fi

done

git checkout -q "$current_branch"
trap - EXIT
echo "Restored original branch $current_branch."
