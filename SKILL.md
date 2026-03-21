---
name: git-flow-skill
description: Use when Codex needs Git Flow branch planning, branch selection, release or hotfix coordination, or branch-state recovery in repositories that use Git Flow conventions. This skill helps choose, explain, repair, or validate feature, release, hotfix, bugfix, support, merge, tag, and back-merge workflows without assuming the repo matches canonical Git Flow.
---

# Git Flow Skill

## Overview

Use this skill for repositories that follow Git Flow or something close to it: long-lived `main` plus `develop`, short-lived `feature/*`, `release/*`, and `hotfix/*` branches, and version tags cut from production-ready history.

This skill is for branch strategy and safe execution, not generic Git teaching. Detect the repo's real conventions first, then either act or explain why the requested Git Flow step does not fit this repository.

## When To Use

- The user explicitly mentions `gitflow` or `git flow`.
- The user wants to start or finish a `feature`, `release`, `hotfix`, `bugfix`, or `support` branch.
- The user wants to cut a release, tag a version, backport a production fix, or merge production changes back into `develop`.
- The user wants to audit whether a repository is actually following Git Flow.
- The user wants `git flow` CLI commands or wants the same workflow executed with plain `git`.

Skip this skill when the repository is clearly trunk-based, GitHub Flow only, or uses a different release model and the user did not ask to move toward Git Flow.

## First Pass

Before editing branches, inspect the repository and report the detected variant.

1. Read local repo docs if present: `README*`, `CONTRIBUTING*`, release docs, CI docs, team scripts.
2. Capture state with non-destructive commands:

```powershell
git status --short --branch
git branch --all --verbose --no-abbrev
git remote -v
git tag --sort=-creatordate
git config --get-regexp "gitflow\\..*"
```

3. Identify:
   - production branch: usually `main` or `master`
   - integration branch: usually `develop`
   - branch prefixes: `feature/`, `release/`, `hotfix/`, sometimes `bugfix/`
   - namespace variants such as `codex/feature/...` that still behave like feature work
   - tag pattern: `v1.2.3`, `1.2.3`, or a team-specific variant
   - whether the repo expects direct merges, pull requests, or `git flow` CLI
4. If `develop` is missing or branch roles are unclear, pause and explain the mismatch before continuing.
5. Never assume the canonical Git Flow names when the repository says otherwise.

## Workflow Decision Tree

- Net-new work for the next release: branch from `develop` into `feature/<ticket>-<slug>`.
- Agent-owned net-new work may use a namespaced variant such as `codex/feature/<slug>` if the team wants agent branches to be easy to spot.
- Stabilizing the next version: branch from `develop` into `release/<version>`.
- Urgent production fix: branch from `main` into `hotfix/<version>` or the repo equivalent.
- Non-production defect for the next release: use `bugfix/` only if the repo already uses it; otherwise treat it as a feature branch from `develop`.
- Long-lived maintenance line: use `support/` only if the repo already has maintenance branches.
- If the request conflicts with the detected model, say so plainly and suggest the closest safe flow.

## Core Rules

- Start from a clean or intentionally stashed working tree.
- Fetch and inspect remote state before creating or finishing branches when a remote exists.
- Base `feature/*` and most `bugfix/*` work on `develop`, not `main`.
- Base `release/*` on `develop`, then limit changes to stabilization work, version updates, release notes, and release-only fixes.
- Base `hotfix/*` on `main`, then merge the finished fix back to both `main` and `develop` unless the repo defines a different maintenance branch.
- Tag releases from the production branch after the finish merge succeeds.
- Do not delete local or remote branches until the required merge targets and tags are verified.
- Prefer explicit non-interactive git commands and show the exact branch pair before every merge.
- Use `git flow` CLI only when it is installed and the repository actually uses it; otherwise execute the same workflow with plain `git`.
- Never rewrite shared history unless the user explicitly requests it and the risk is understood.
- For agent-authored feature work, default completion is end-to-end finish, not "code changes are ready". Unless the user explicitly asks to stop early or the repo is PR-gated, carry the work through validated commits, feature-branch push, merge into `develop`, `develop` push, and local plus remote feature-branch cleanup.

## Execution Pattern

For every request, return:

- detected branch model and any deviations from canonical Git Flow
- chosen flow and why
- exact commands run, or the exact commands proposed if execution is risky
- affected branches and tags
- validation already run
- remaining manual steps such as PR creation, CI approval, or release publication

When the request is execution rather than explanation, do the finish steps instead of merely listing them whenever the repo policy allows it. Do not present a feature task as complete while still parked on the feature branch unless the user explicitly asked to stop before merge or a PR-only rule blocks the local finish.

## Standard Flows

Use the condensed patterns below. Read [references/gitflow-playbook.md](./references/gitflow-playbook.md) when you need exact commands or recovery guidance.

### Feature

- Confirm `develop` exists and is current.
- Create `feature/<ticket>-<slug>` from `develop`.
- If the repository namespaces agent work, use a semantic variant such as `codex/feature/<slug>` and still treat it as a feature branch targeting `develop`.
- Implement, validate, and merge back into `develop`.
- Delete the branch only after the target merge is verified.

## Agent Commit Flow

Use this when Codex or another agent is making a normal change for the next release:

1. Initialize Git Flow first if the repository does not have `develop` yet.
2. Start from `develop`.
3. Create a feature branch such as `feature/<ticket>-<slug>` or `codex/feature/<slug>`.
4. Plan rollback-friendly commit boundaries before staging. For any non-trivial change set, make at least 2 focused commits. Use 3 or more when there is a natural split such as scaffolding, logic, and tests or docs.
5. Push the feature branch after the commits land so the remote has a recovery point and review surface.
6. Merge the finished feature branch back into `develop` with `--no-ff` unless the repository has a PR-only rule.
7. Push `develop` after the merge is verified.
8. Delete the feature branch locally and remotely after verification.
9. Leave the branch unmerged or undeleted only when the user explicitly asked to stop early or repository policy requires a PR flow.

Treat this as the default strategy for agent-authored changes. Reserve direct work on `main` for release and hotfix handling only.

### Commit Discipline

- Split work into the smallest rollback-friendly commits that still form a coherent unit.
- For substantive agent work, the default minimum is 2 commits. Treat a single commit as the exception for truly tiny, single-purpose edits.
- Do not lump unrelated docs, assets, workflows, and logic changes into one commit when they can be separated safely.
- Prefer natural boundaries such as file scaffolding or template moves, implementation logic, and tests or docs.
- Prefix every commit title with an emoji for quick scanning.
- Write commit messages in English.
- Use a Markdown-style commit body with at least 5 lines so the message alone explains the work clearly.
- Prefer `git commit -F` with [templates/commit-message-template.md](./templates/commit-message-template.md) or a filled copy of it instead of a terse single-line message.

### Release

- Confirm `develop` is stable enough to branch.
- Create `release/<version>` from `develop`.
- Restrict branch changes to stabilization work.
- Finish by merging to `main`, tagging, and merging the same result back to `develop`.

### Hotfix

- Confirm the issue affects production.
- Create `hotfix/<version>` from `main`.
- Apply the minimal safe fix and validate it.
- Finish by merging to `main`, tagging if appropriate, and back-merging to `develop`.

### Repair Or Audit

- Detect branch drift, missing back-merges, inconsistent tags, or an open release branch colliding with another request.
- Explain the safest repair sequence before executing it.
- Use cherry-picks or manual reconciliation only when the branch history requires it.

## Guardrails

- If the working tree is dirty, pause unless the user asked to include or stash those changes.
- If a release or hotfix branch already exists for the same version, treat it as the active line instead of silently creating a second branch.
- If the repo uses PR gates, do not force local finish steps that bypass review.
- If the user asked the agent to "do it" rather than explain it, do not stop after coding and testing. Finish the feature flow through commit, push, merge into `develop`, push `develop`, and branch cleanup unless a stated repo rule blocks that path.
- If CI, tests, or version files are part of the release contract, include them in the finish checklist.
- If branch naming or tag formats are inconsistent, mirror the repo's existing convention and call it out.
- If the repo is not actually using Git Flow, say so and fall back to the repo's real workflow.

## Example Requests

- `Start a Git Flow feature branch for PROJ-142 and show the safest next steps.`
- `Create release/2.4.0 for this repo's Git Flow process.`
- `Cut a production hotfix and make sure it returns to both main and develop.`
- `Audit the drift between main and develop and tell me how to repair it safely.`
- `Do the equivalent of git-flow release finish with plain git commands.`
- `Check whether this repository is actually following Git Flow before we touch branches.`
- `Initialize this repository for Git Flow and create develop safely.`

## Built-In Script

- Run [scripts/init-git-flow.ps1](./scripts/init-git-flow.ps1) when the user wants to initialize a repository for Git Flow.
- Default behavior assumes `main` is the production branch and creates `develop` from it if needed.
- Add `-Push` to publish `develop` to the remote, and `-ConfigureGitFlow` to write local `gitflow.*` config keys for `git flow` tooling.
- If the working tree is dirty, stop unless the user explicitly wants `-AllowDirty`.

## Reference Files

- Read [references/gitflow-playbook.md](./references/gitflow-playbook.md) for exact command recipes, finish checklists, and recovery patterns.
