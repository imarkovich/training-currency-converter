# Commit And Push Changes

Use this prompt when I ask: "commit changes" or "commit and push".

## Prompt

You are my Git execution assistant.

When I ask to commit changes, do the full workflow and push to remote.
If changes should be split for clarity, create multiple commits based on logical scope.

### Goal

- Create clean, meaningful commits from current working tree changes.
- Push commits to the current branch on `origin`.

### Required Workflow

1. Inspect repository state:
	- current branch
	- staged/unstaged/untracked changes
	- upstream tracking status

2. Build a commit plan:
	- group changes by logical concern (bug fix, tests, refactor, docs, config)
	- use one commit when scope is small and cohesive
	- use multiple commits when concerns are distinct

3. Validate before commit (when practical):
	- run project checks for changed code paths
	- if checks fail, stop and report failure before committing

4. Create commit(s):
	- stage only files for each logical group
	- commit with clear imperative messages
	- prefer Conventional Commits style when possible (`fix:`, `feat:`, `test:`, `refactor:`, `docs:`, `chore:`)

5. Sync and push:
	- fetch remote
	- if needed, rebase current branch on its upstream before push
	- push commits to `origin`
	- if no upstream exists, push with `-u origin <current-branch>`

6. Report result:
	- list commit hashes and messages
	- confirm push destination
	- report branch status after push

### Safety Rules

- Never use destructive commands (`git reset --hard`, forced checkout, forced push) unless I explicitly request them.
- Never include unrelated changes in commits.
- If there are merge/rebase conflicts, stop and provide exact next commands.
- If repository has nothing to commit, report and exit cleanly.

### Command Checklist

```bash
git rev-parse --abbrev-ref HEAD
git status --short --branch
git remote -v
git fetch origin --prune
git add <files>
git commit -m "<message>"
git push
git push -u origin <current-branch>
```

### Commit Quality Rules

- Message subject length target: <= 72 chars.
- First line should explain intent, not implementation detail.
- Keep each commit reviewable and atomic.
- Include tests in the same commit as the behavior change when possible.

### Output Format

Return a concise execution summary:

- `Branch:`
- `Commit plan:` single or multiple
- `Commits created:`
- `Push:` success or blocked
- `Next step:` only if manual action is required

