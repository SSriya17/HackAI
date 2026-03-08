# 🚀 Hackathon Project

> A collaborative hackathon project with 3 teams working together.

## 📋 Overview

This repository is structured for a **3-group hackathon**. Each group has its own branch and workspace to develop independently while contributing to a shared codebase.

## 🏗️ Project Structure

```
HACKAI/
├── Antony/           # Antony's workspace
├── Shriya/           # Shriya's workspace  
├── Sreya/            # Sreya's workspace
├── shared/           # Shared resources, utils, assets
├── docs/             # Documentation
└── README.md
```

## 👥 Teams & Branches

| Team | Branch | Focus Area |
|------|--------|------------|
| **Antony** | `Antony` | _Define your focus_ |
| **Shriya** | `Shriya` | _Define your focus_ |
| **Sreya** | `Sreya` | _Define your focus_ |

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

# Switch to your branch
git checkout Antony   # or Shriya, Sreya
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
git merge Antony   # or Shriya, Sreya
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
