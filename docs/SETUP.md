# Hackathon Setup Guide

## Initial GitHub Setup

### 1. Create the Repository on GitHub

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `HACKAI` (or your preferred name)
3. Add description: "3-group hackathon project"
4. Choose **Public**
5. **Do NOT** initialize with README (we have one)
6. Click **Create repository**

### 2. Connect Local Repo to GitHub

```bash
cd /Users/sreya/Downloads/HACKAI

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/HACKAI.git

# Push all branches
git push -u origin main
git push origin Antony Shriya Sreya
```

### 3. Invite Teammates

1. Go to repo → **Settings** → **Collaborators**
2. Add each teammate by GitHub username
3. They can clone and checkout their group's branch

## Per-Group Setup

Each teammate should run:

```bash
git clone https://github.com/YOUR_USERNAME/HACKAI.git
cd HACKAI
git checkout Antony   # Replace with Shriya or Sreya
```

## Branch Overview

| Branch | Purpose |
|--------|---------|
| `main` | Production-ready merged code |
| `Antony` | Antony development |
| `Shriya` | Shriya development |
| `Sreya` | Sreya development |
