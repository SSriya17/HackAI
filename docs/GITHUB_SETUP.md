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

git branch Antony
git branch Shriya
git branch Sreya
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

# Push all branches
git push origin Antony Shriya Sreya
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
git checkout Antony   # or Shriya, Sreya
```

---

## Branch Summary

| Branch   | Purpose              |
|----------|----------------------|
| `main`   | Merged, stable code  |
| `Antony` | Antony development   |
| `Shriya` | Shriya development   |
| `Sreya`  | Sreya development   |

---

## Troubleshooting

**"trailer" error when committing?**  
You may have a global git hook. Try:
```bash
git commit --no-verify -m "Initial hackathon template"
```

**Permission denied?**  
Run `chmod +x scripts/setup-git.sh` first.
