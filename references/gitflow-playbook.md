# Git Flow Playbook

## Contents

- Discovery Checklist
- Initialization Script
- Branch Roles And Naming
- Agent Commit Flow
- Plain Git Recipes
- `git flow` CLI Equivalents
- PR-First Variant
- Recovery Patterns
- Finish Checklists

## Discovery Checklist

Run this before changing branch state:

```powershell
git status --short --branch
git fetch --all --prune
git branch --all --verbose --no-abbrev
git remote -v
git tag --sort=-creatordate | Select-Object -First 20
git config --get-regexp "gitflow\\..*"
```

Useful follow-up inspection:

```powershell
git log --oneline --decorate --graph main develop -n 40
git for-each-ref refs/heads --format="%(refname:short) %(upstream:short)"
```

If the repo uses `master` instead of `main`, substitute it consistently. If `develop` does not exist, do not force Git Flow onto the repo without explicit user approval.

## Initialization Script

Use the built-in PowerShell helper when a repository needs Git Flow setup before normal feature, release, or hotfix work:

```powershell
.\scripts\init-git-flow.ps1
```

Common variants:

```powershell
.\scripts\init-git-flow.ps1 -Push
.\scripts\init-git-flow.ps1 -ConfigureGitFlow
.\scripts\init-git-flow.ps1 -ProductionBranch master -DevelopBranch develop
.\scripts\init-git-flow.ps1 -Push -ConfigureGitFlow
```

What it does:

- verifies the current directory is a Git repo
- refuses to run on a dirty working tree unless `-AllowDirty` is set
- fetches the remote if `origin` exists
- ensures the production branch exists
- creates or checks out `develop`
- optionally pushes `develop`
- optionally writes local `gitflow.*` configuration

## Branch Roles And Naming

- `main` or `master`: production-ready history
- `develop`: integration branch for the next release
- `feature/<ticket>-<slug>`: net-new work for the next release
- `codex/feature/<slug>`: optional namespaced variant for agent-owned feature work that still targets `develop`
- `release/<version>`: stabilization branch created from `develop`
- `hotfix/<version>`: urgent production fix created from `main`
- `bugfix/<ticket>-<slug>`: optional; only use if the repo already does
- `support/<major.minor>`: long-lived maintenance line; only use if the repo already has it

Prefer the repository's existing ticket and version format over a generic template.

## Agent Commit Flow

This is the default day-to-day path for agent-authored changes in a Git Flow repository:

```powershell
git switch develop
git pull --ff-only origin develop
git switch -c codex/feature/init-script
# edit scaffolding files
git add <files-for-scaffolding>
git commit -m "🧱 Add Git Flow initialization scaffolding" -m "- summary line 1`n- summary line 2`n- summary line 3"
# edit logic and validation files
git add <files-for-logic-and-tests>
git commit -m "🧪 Finalize init flow behavior and coverage" -m "- summary line 1`n- summary line 2`n- summary line 3"
git push -u origin codex/feature/init-script
git switch develop
git pull --ff-only origin develop
git merge --no-ff codex/feature/init-script
git push origin develop
git branch -d codex/feature/init-script
git push origin --delete codex/feature/init-script
```

Notes:

- use `feature/<ticket>-<slug>` when the repository does not namespace agent branches
- use `codex/feature/<slug>` when the team wants agent work to stand out
- keep `main` untouched during normal feature work
- if the repository is PR-first, replace the local merge with a PR into `develop`
- for non-trivial work, treat 2 commits as the floor and split further when the diff naturally separates into setup, logic, and tests or docs
- unless the user explicitly says to stop early, "done" means commit, push, merge to `develop`, push `develop`, and delete the feature branch both locally and remotely

### Commit Rules For Agent Work

- split commits by task so a rollback can target one logical unit at a time
- for substantive work, make at least 2 commits; keep single-commit features for truly tiny changes only
- keep docs, assets, workflows, and code in separate commits when the work naturally separates that way
- start the commit title with an emoji
- write the body in English as a Markdown-style note with at least 5 lines
- make the message descriptive enough that a reviewer can understand the change without opening the diff

Preferred pattern:

```powershell
Copy-Item .\templates\commit-message-template.md .\commit-message.md
# edit commit-message.md
git commit -F .\commit-message.md
```

## Plain Git Recipes

### Start A Feature

```powershell
git switch develop
git pull --ff-only origin develop
git switch -c feature/PROJ-142-login-audit
```

### Finish A Feature

Direct-merge variant:

```powershell
git switch develop
git pull --ff-only origin develop
git merge --no-ff feature/PROJ-142-login-audit
git branch -d feature/PROJ-142-login-audit
```

If the remote branch exists and the merge is verified:

```powershell
git push origin develop
git push origin --delete feature/PROJ-142-login-audit
```

### Start A Release

```powershell
git switch develop
git pull --ff-only origin develop
git switch -c release/2.4.0
```

Typical allowed changes on a release branch:

- version bumps
- release notes
- packaging or deployment fixes
- low-risk stabilization fixes

Avoid mixing in unrelated feature work after the release branch starts.

### Finish A Release

```powershell
git switch main
git pull --ff-only origin main
git merge --no-ff release/2.4.0
git tag -a v2.4.0 -m "Release v2.4.0"
git switch develop
git pull --ff-only origin develop
git merge --no-ff release/2.4.0
```

After verification:

```powershell
git push origin main
git push origin develop
git push origin v2.4.0
git branch -d release/2.4.0
git push origin --delete release/2.4.0
```

### Start A Hotfix

```powershell
git switch main
git pull --ff-only origin main
git switch -c hotfix/2.4.1
```

Keep the change set minimal and production-focused.

### Finish A Hotfix

```powershell
git switch main
git pull --ff-only origin main
git merge --no-ff hotfix/2.4.1
git tag -a v2.4.1 -m "Hotfix v2.4.1"
git switch develop
git pull --ff-only origin develop
git merge --no-ff hotfix/2.4.1
```

After verification:

```powershell
git push origin main
git push origin develop
git push origin v2.4.1
git branch -d hotfix/2.4.1
git push origin --delete hotfix/2.4.1
```

### When The Repo Uses PR Gates

If the team requires pull requests:

- create the branch locally
- push it to the remote
- open a PR against the correct target branch
- do not bypass the required review or CI gates with a local-only finish sequence

For release and hotfix finishes, a PR-centric repo often needs two merge steps:

1. branch into `main`
2. same branch, or the merged `main` result, back into `develop`

State that explicitly so the user can see both targets.

## `git flow` CLI Equivalents

Use these only when `git flow` is installed and the repo already uses it.

Initialize if needed and explicitly approved:

```powershell
git flow init -d
```

Feature:

```powershell
git flow feature start PROJ-142-login-audit
git flow feature finish PROJ-142-login-audit
```

Release:

```powershell
git flow release start 2.4.0
git flow release finish 2.4.0
```

Hotfix:

```powershell
git flow hotfix start 2.4.1
git flow hotfix finish 2.4.1
```

The CLI can still trigger merges, tags, and branch deletions. Explain those side effects before running it.

## PR-First Variant

Some teams like Git Flow branch roles but still require PRs for every merge. In that case:

- feature branches target `develop`
- release branches target `main`, then the same release result must return to `develop`
- hotfix branches target `main`, then the same fix must return to `develop` or the active maintenance branch

Do not assume the back-merge already happened just because the production PR merged.

## Recovery Patterns

### Dirty Working Tree

- show `git status --short`
- ask whether to commit, stash, or exclude local changes
- do not switch branches until that is resolved

### Wrong Base Branch

For a local unshared branch, recreate it from the right base and cherry-pick or re-apply the work. For a shared branch, avoid rewriting history; create a new correctly based branch and move the needed commits.

### Existing Release Or Hotfix Branch

If `release/<version>` or `hotfix/<version>` already exists, treat it as the active line. Audit its state instead of creating a duplicate branch with the same version.

### Release Merged To `main` But Not `develop`

- identify the release merge commit or production tag on `main`
- merge that exact release result back into `develop`
- if direct merge is too noisy, cherry-pick only the release-specific commits that are still missing
- verify that `develop` now contains the release versioning and stabilization changes before deleting the release branch

### Hotfix Merged To `main` But Not `develop`

- identify the hotfix merge commit or tag on `main`
- merge or cherry-pick the equivalent change into `develop`
- verify the resulting graph before deleting the hotfix branch

### Missing Tag After Release

- find the intended release merge commit on `main`
- confirm the exact version string
- create the annotated tag on the correct commit
- push the tag after confirmation

### Merge Conflicts During Finish

- stop and summarize the conflicting files
- avoid auto-resolving unless the intended result is obvious and low risk
- resume only after the conflict strategy is agreed

### Repo Is Not Actually Git Flow

If the repo has no `develop`, uses short-lived branches directly off `main`, or releases continuously from trunk, say so explicitly and switch to the repository's actual workflow.

## Finish Checklists

### Before Any Finish Step

- working tree is clean
- source branch is the correct active branch
- target branches are up to date
- required tests, lint, build, or release checks are identified

### Before Deleting A Feature Branch

- merge into `develop` is complete
- remote target is updated if required
- CI or PR status is known

### Before Deleting A Release Branch

- merge into `main` is complete
- tag exists on the intended production commit
- back-merge into `develop` is complete
- version files and release notes are committed

### Before Deleting A Hotfix Branch

- merge into `main` is complete
- production tag exists if required
- back-merge into `develop` or the maintenance branch is complete
- the production fix was validated at the correct scope
