# Contributing Guide

## Branch Strategy

- **`main`** – Stable, merged code. Protected.
- **`group-1`** – Group 1's development branch
- **`group-2`** – Group 2's development branch  
- **`group-3`** – Group 3's development branch

## Workflow

### 1. Start Your Day

```bash
git checkout <your-group-branch>
git pull origin <your-group-branch>
```

### 2. Make Changes

- Work in your group's folder: `group-1/`, `group-2/`, or `group-3/`
- Use `shared/` for code that multiple groups need
- Write clear commit messages

### 3. Commit & Push

```bash
git add .
git commit -m "feat: add [description]"
git push origin <your-group-branch>
```

### Commit Message Format

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting
- `refactor:` Code restructure
- `test:` Tests

### 4. Merge to Main (when ready)

Only merge when your feature is complete and tested:

```bash
git checkout main
git pull origin main
git merge group-1
git push origin main
```

## Rules

1. **Stay on your branch** – Don't commit to main directly
2. **Communicate** – Coordinate with other groups for shared changes
3. **Don't break shared/** – Test before modifying shared code
4. **Pull before push** – Avoid merge conflicts

## Need Help?

Reach out to your team lead or create an issue/discussion in the repo.
