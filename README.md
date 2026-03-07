# 🚀 Hackathon Project

> A collaborative hackathon project with 3 teams working together.

## 📋 Overview

This repository is structured for a **3-group hackathon**. Each group has its own branch and workspace to develop independently while contributing to a shared codebase.

## 🏗️ Project Structure

```
HACKAI/
├── group-1/          # Group 1's workspace
├── group-2/          # Group 2's workspace  
├── group-3/          # Group 3's workspace
├── shared/           # Shared resources, utils, assets
├── docs/             # Documentation
└── README.md
```

## 👥 Groups & Branches

| Group | Branch | Focus Area |
|-------|--------|------------|
| **Group 1** | `group-1` | _Define your focus_ |
| **Group 2** | `group-2` | _Define your focus_ |
| **Group 3** | `group-3` | _Define your focus_ |

## 🚀 Quick Start

### Prerequisites

- Git
- [Add your tech stack requirements here]

### First-Time Setup (Repo Owner)

See **[docs/GITHUB_SETUP.md](docs/GITHUB_SETUP.md)** for full instructions. Quick version:

```bash
./scripts/setup-git.sh   # Commit + create branches
# Then create repo on GitHub and push
```

### Teammate Setup

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/HACKAI.git
cd HACKAI

# Switch to your group's branch
git checkout group-1   # or group-2, group-3
```

### Development Workflow

1. **Always work on your group's branch** – don't push to `main` directly
2. **Pull before you push** – `git pull origin <your-branch>`
3. **Commit often** – small, descriptive commits
4. **Push to your branch** – `git push origin <your-branch>`

## 📥 Merging to Main

When your group's feature is ready:

```bash
git checkout main
git merge group-1   # or group-2, group-3
git push origin main
```

## 📁 Shared Resources

The `shared/` folder contains:
- Common utilities
- Shared components
- Assets (images, fonts, etc.)
- API configs

**Don't duplicate** – use shared resources when possible!

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📅 Hackathon Info

- **Event:** [Hackathon Name]
- **Date:** [Date]
- **Teams:** 3 groups

---

Built with ❤️ during the hackathon
