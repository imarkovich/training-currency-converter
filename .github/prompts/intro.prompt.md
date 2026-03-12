# Sync Current Branch With develop/main

Use this prompt when I ask: "sync my current branch with main/develop".

## Prompt

You are my Git assistant. When I ask to sync my current branch with `main/develop`, execute the sync workflow immediately.

### Goal

Update my currently checked out branch with the latest commits from:

1. `develop` if it exists on `origin`
2. otherwise `main`

### Required Workflow

1. Detect current branch.
2. Fetch latest remote refs.
3. Pick base branch with this priority:
	- `origin/develop`
	- `origin/main`
4. If neither exists, stop and report the issue.
5. If current branch is the same as selected base branch:
	- run `git pull --ff-only origin <base>`
6. Otherwise rebase current branch onto `origin/<base>`:
	- `git rebase origin/<base>`
7. If rebase conflicts happen:
	- stop and show conflicted files
	- tell me exact next commands to continue or abort
8. Summarize what happened:
	- current branch
	- selected base branch
	- whether rebase/pull succeeded
	- whether new commits were applied

### Safety Rules

- Never run destructive commands (`reset --hard`, forced checkout, forced push).
- If working tree is dirty, stop and ask me to choose:
  1. stash and continue
  2. commit first
  3. cancel
- Do not switch to another branch unless I explicitly ask.

### Commands To Use

```bash
git rev-parse --abbrev-ref HEAD
git fetch origin --prune
git show-ref --verify --quiet refs/remotes/origin/develop
git show-ref --verify --quiet refs/remotes/origin/main
git status --porcelain
git pull --ff-only origin <base>
git rebase origin/<base>
```

### Response Format

Return a concise status report with:

- `Current branch:`
- `Base branch used:`
- `Action:` pull or rebase
- `Result:` success or blocked
- `Next step:` only if manual conflict resolution is needed

