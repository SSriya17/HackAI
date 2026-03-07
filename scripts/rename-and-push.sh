#!/bin/bash
# Run this to rename branches and push - execute in Terminal

set -e
cd "$(dirname "$0")/.."

echo "=== Committing changes ==="
git add -A
git commit --no-verify -m "Rename groups to Antony, Shriya, Sreya"

echo "=== Creating new branches ==="
git branch Antony
git branch Shriya
git branch Sreya

echo "=== Pushing main and new branches ==="
git push origin main
git push origin Antony Shriya Sreya

echo "=== Deleting old remote branches ==="
git push origin --delete group-1 group-2 group-3

echo "=== Deleting old local branches ==="
git branch -d group-1 group-2 group-3

echo ""
echo "✅ Done! Branches are now: Antony, Shriya, Sreya"
