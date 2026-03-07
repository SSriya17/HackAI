# Complete GitHub Setup for Your Hackathon

## Step 1: Complete Local Git Setup

Open Terminal and run:

```bash
cd /Users/sreya/Downloads/HACKAI

# Make the setup script executable and run it
chmod +x scripts/setup-git.sh
./scripts/setup-git.sh
```

**Or run manually:**

```bash
cd /Users/sreya/Downloads/HACKAI

git add .
git commit -m "Initial hackathon template with 3-group structure"

git branch group-1
git branch group-2
git branch group-3
```

---

## Step 2: Create Repository on GitHub

1. Go to **https://github.com/new**
2. **Repository name:** `HACKAI` (or your choice)
3. **Description:** "3-group hackathon project"
4. **Visibility:** Public
5. **Do NOT** check "Add a README" (we already have one)
6. Click **Create repository**

---

## Step 3: Connect & Push

Replace `YOUR_USERNAME` with your GitHub username:

```bash
cd /Users/sreya/Downloads/HACKAI

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/HACKAI.git

# Push main branch
git push -u origin main

# Push all group branches
git push origin group-1
git push origin group-2
git push origin group-3
```

---

## Step 4: Invite Teammates

1. Repo → **Settings** → **Collaborators** → **Add people**
2. Add each teammate by GitHub username
3. They accept the invite

---

## Step 5: Teammate Setup

Each teammate runs:

```bash
git clone https://github.com/YOUR_USERNAME/HACKAI.git
cd HACKAI

# Switch to their group's branch
git checkout group-1   # or group-2, group-3
```

---

## Branch Summary

| Branch   | Purpose              |
|----------|----------------------|
| `main`   | Merged, stable code  |
| `group-1`| Group 1 development  |
| `group-2`| Group 2 development  |
| `group-3`| Group 3 development  |

---

## Troubleshooting

**"trailer" error when committing?**  
You may have a global git hook. Try:
```bash
git commit --no-verify -m "Initial hackathon template"
```

**Permission denied?**  
Run `chmod +x scripts/setup-git.sh` first.
