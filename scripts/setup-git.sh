#!/bin/bash
# Run this script to complete Git setup: commit, create branches, and prepare for GitHub

set -e
cd "$(dirname "$0")/.."

echo "=== Staging files ==="
git add .

echo "=== Making initial commit ==="
git commit -m "Initial hackathon template with 3-group structure"

echo "=== Creating branches ==="
git branch Antony
git branch Shriya
git branch Sreya

echo "=== All branches ==="
git branch -a

echo ""
echo "✅ Done! Next steps:"
echo "1. Create a new repo on GitHub: https://github.com/new"
echo "2. Run: git remote add origin git@github.com:YOUR_USERNAME/HackAI.git"
echo "3. Run: git push -u origin main"
echo "4. Run: git push origin Antony Shriya Sreya"
echo ""
echo "Each teammate: git clone <repo> && git checkout Antony|Shriya|Sreya"
