#!/bin/bash
# Run this script to complete Git setup: commit, create branches, and prepare for GitHub

set -e
cd "$(dirname "$0")/.."

echo "=== Staging files ==="
git add .

echo "=== Making initial commit ==="
git commit -m "Initial hackathon template with 3-group structure"

echo "=== Creating group branches ==="
git branch group-1
git branch group-2
git branch group-3

echo "=== All branches ==="
git branch -a

echo ""
echo "✅ Done! Next steps:"
echo "1. Create a new repo on GitHub: https://github.com/new"
echo "2. Run: git remote add origin https://github.com/YOUR_USERNAME/HACKAI.git"
echo "3. Run: git push -u origin main"
echo "4. Run: git push origin group-1 group-2 group-3"
echo ""
echo "Each teammate: git clone <repo> && git checkout group-X"
