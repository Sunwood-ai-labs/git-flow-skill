<p align="center">
  <img src="./assets/hero-mascot.png" alt="Git Flow Skill mascot hero image" width="300" />
</p>

<p align="center">
  <a href="./README.md"><strong>English</strong></a>
  |
  <a href="./README.ja.md">日本語</a>
</p>

<p align="center">
  <a href="https://github.com/Sunwood-ai-labs/git-flow-skill/actions/workflows/validate.yml"><img src="https://img.shields.io/github/actions/workflow/status/Sunwood-ai-labs/git-flow-skill/validate.yml?branch=main&label=validate&style=flat-square" alt="Validate workflow status" /></a>
  <img src="https://img.shields.io/badge/branch%20model-Git%20Flow-294B69?style=flat-square" alt="Git Flow branch model" />
  <img src="https://img.shields.io/github/license/Sunwood-ai-labs/git-flow-skill?style=flat-square" alt="License" />
</p>

<p align="center">
  A Codex skill for detection-first Git Flow branching, releases, hotfixes, and agent-friendly commit workflows.
</p>

## Overview

`git-flow-skill` helps Codex work safely in repositories that follow Git Flow or something close to it. Instead of assuming every repository uses canonical `main` + `develop`, it inspects the real branch model first and only then chooses the right feature, release, hotfix, or recovery path.

The repository also includes a small PowerShell initializer so a new repository can grow into Git Flow without hand-rolling the first `develop` branch every time.

## Highlights

- Detects the repository's actual branching model before proposing Git Flow commands.
- Handles `feature/*`, `release/*`, `hotfix/*`, and namespaced variants like `codex/feature/*`.
- Includes a reusable `init-git-flow.ps1` script for creating `develop` and optional `gitflow.*` config.
- Ships with a practical playbook for plain `git`, `git flow` CLI, PR-first teams, and recovery scenarios.
- Encourages rollback-friendly, task-scoped commits with a default floor of 2 commits for substantive work.
- Pushes agent-run feature work through commit, push, merge into `develop`, and branch cleanup unless repo policy blocks it.
- Validates itself in CI and smoke-tests the initialization script on Windows.

## Installation

1. Clone this repository or copy the `git-flow-skill` folder into your Codex skills directory.
2. Keep the folder name as `git-flow-skill`.
3. Invoke the skill in Codex with prompts such as:

```text
Use $git-flow-skill to initialize this repository for Git Flow and create develop safely.
Use $git-flow-skill to start a feature branch for PROJ-142 from develop.
Use $git-flow-skill to finish a release branch and merge it back to main and develop.
```

## Example Prompts

- `Use $git-flow-skill to detect whether this repo really uses Git Flow before touching branches.`
- `Use $git-flow-skill to initialize develop and configure gitflow prefixes in this repository.`
- `Use $git-flow-skill to create a codex/feature branch for a repository polish task.`
- `Use $git-flow-skill to repair a hotfix that reached main but never got back-merged into develop.`
- `Use $git-flow-skill to finish a release with plain git because git-flow CLI is not installed.`

## Branch Strategy

- `main` stays production-ready.
- `develop` is the integration branch for ongoing work.
- `feature/<ticket>-<slug>` is the standard feature lane.
- `codex/feature/<slug>` is supported when you want agent-authored work to stand out.
- `release/<version>` prepares a stable release candidate from `develop`.
- `hotfix/<version>` starts from `main` and returns to both `main` and `develop`.

## Commit Discipline

- Split work by task so a single rollback can undo one coherent unit.
- For substantive agent work, use at least 2 commits by default. Treat 1 commit as the exception for tiny single-purpose edits.
- Keep docs, assets, workflows, and code separate when they do not need to move together.
- Prefer natural boundaries such as scaffolding, implementation logic, and tests or docs.
- Start every commit title with an emoji.
- Write the commit body in English with at least 5 Markdown-style lines.
- Prefer `git commit -F` with [`templates/commit-message-template.md`](./templates/commit-message-template.md) so the message itself documents the change completely.

## Agent Finish Expectation

- If the user asks Codex to execute a feature task instead of merely explaining it, the default finish line is end-to-end completion.
- That means validated commits on the feature branch, feature-branch push, merge into `develop`, `develop` push, and local plus remote branch deletion.
- Stop earlier only when the user explicitly asks to pause or the repository is PR-gated.

## Included Files

| Path | Purpose |
| --- | --- |
| [`SKILL.md`](./SKILL.md) | Core skill behavior, triggers, guardrails, and branch decision logic |
| [`references/gitflow-playbook.md`](./references/gitflow-playbook.md) | Plain `git` recipes, recovery patterns, release/hotfix finish checklists |
| [`scripts/init-git-flow.ps1`](./scripts/init-git-flow.ps1) | Git Flow initialization helper for `develop`, remote push, and `gitflow.*` config |
| [`scripts/validate-skill.py`](./scripts/validate-skill.py) | Self-contained validator for `SKILL.md` and `agents/openai.yaml` |
| [`.github/workflows/validate.yml`](./.github/workflows/validate.yml) | CI validation and Windows smoke test for the init script |
| [`agents/openai.yaml`](./agents/openai.yaml) | Codex UI metadata including brand color and icons |

## Quick Validation

Run the same checks locally that CI runs:

```powershell
uv run --with pyyaml python .\scripts\validate-skill.py .
powershell -ExecutionPolicy Bypass -File .\scripts\init-git-flow.ps1 -ConfigureGitFlow
```

For a safe smoke test, run the PowerShell script inside a temporary test repository rather than inside a production repo.

## Design Direction

The visual system uses a parchment-ledger palette instead of generic purple gradients or default tech blues:

- `Parchment` for the base canvas
- `Ink Blue` for the trunk and structural emphasis
- `Moss Ledger` for stable feature movement
- `Copper Merge` for release and hotfix motion
- `Paper` for readable text and calm surfaces

That palette keeps the repo distinctive while still feeling stable, tool-like, and readable inside GitHub's Markdown renderer.

## License

This repository is released under the [MIT License](./LICENSE).
