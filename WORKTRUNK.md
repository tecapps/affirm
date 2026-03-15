# Worktrunk (`wt`) — Guide & Cheatsheet

A CLI for git worktree management, designed for running AI agents in parallel.

**Docs:** <https://worktrunk.dev> · **Repo:** <https://github.com/max-sixty/worktrunk>

---

## Why Worktrunk?

Git worktrees let you have multiple branches checked out simultaneously in separate directories — but the native experience is painful. Creating, switching, and cleaning up worktrees involves repetitive path management and multi-step commands.

Worktrunk fixes this by letting you **address worktrees by branch name** instead of filesystem paths. It turns a workflow like this:

```bash
# Without worktrunk
git worktree add -b feat ../repo.feat && cd ../repo.feat
# ... work ...
cd ../repo && git worktree remove ../repo.feat && git branch -d feat
```

Into this:

```bash
# With worktrunk
wt switch -c feat
# ... work ...
wt merge
```

The killer use case is **parallel AI agent workflows** — spin up isolated worktrees for multiple Claude Code sessions, each with its own working directory, so agents don't interfere with each other's changes.

---

## Installation

```bash
# macOS/Linux (Homebrew)
brew install worktrunk && wt config shell install

# Rust (Cargo)
cargo install worktrunk && wt config shell install
```

Shell integration is required for `wt switch` to change your working directory.

---

## Core Commands

### `wt switch` — Navigate & Create Worktrees

```bash
wt switch feature-auth          # Switch to existing worktree
wt switch -c new-feature        # Create new branch + worktree
wt switch -c hotfix -b prod     # Create from specific base branch
wt switch -                     # Previous worktree (like cd -)
wt switch ^                     # Default branch (main/master)
wt switch pr:123                # GitHub PR #123's branch
wt switch                       # Interactive picker (no args)
```

**Key flags:**

| Flag                    | Description                                  |
| ----------------------- | -------------------------------------------- |
| `-c`, `--create`        | Create a new branch                          |
| `-b`, `--base <branch>` | Base branch (default: main)                  |
| `-x`, `--execute <cmd>` | Run command after switching                  |
| `--branches`            | Include branches without worktrees in picker |
| `--remotes`             | Include remote branches in picker            |
| `-y`, `--yes`           | Skip approval prompts                        |
| `--no-cd`               | Skip directory change                        |
| `--clobber`             | Remove stale paths at target                 |

**Shortcuts:**

| Shortcut | Meaning                      |
| -------- | ---------------------------- |
| `^`      | Default branch (main/master) |
| `@`      | Current branch               |
| `-`      | Previous worktree            |
| `pr:N`   | GitHub PR #N                 |
| `mr:N`   | GitLab MR !N                 |

### `wt list` — Show All Worktrees

```bash
wt list                         # List with status info
wt list --full                  # Include CI status + diffstat
wt list --branches              # Include branches without worktrees
```

Shows branch names, staged changes, commit counts, merge status, and timestamps.

### `wt remove` — Clean Up Worktrees

```bash
wt remove                       # Remove current worktree
wt remove feature-branch        # Remove specific worktree
wt remove old-feat another      # Remove multiple
wt remove -D experimental       # Force-delete unmerged branch
wt remove -f feature            # Force remove with untracked files
wt remove --no-delete-branch x  # Keep the branch after removing worktree
```

**Merge detection:** Branches are auto-deleted when they've been merged (handles squash-merge and rebase workflows). Dimmed branches in `wt list` (showing `_` or `⊂`) are safe to delete.

### `wt merge` — Merge & Clean Up

Squash, rebase, fast-forward, and remove — all in one command.

```bash
wt merge                        # Merge current branch → default branch
wt merge develop                # Merge into specific target
wt merge --no-squash            # Preserve commit history
wt merge --no-remove            # Keep worktree after merging
wt merge --no-commit            # Skip auto-commit (for manual prep)
```

**Pipeline:** commit → squash → rebase → pre-merge hooks → merge → cleanup

### `wt step` — Individual Operations

The building blocks of `wt merge`, run separately:

```bash
wt step commit                  # Stage + commit with LLM message
wt step squash                  # Squash all branch commits into one
wt step rebase                  # Rebase onto target
wt step push                    # Fast-forward target to current
wt step diff                    # Show all changes since branching
wt step copy-ignored            # Copy gitignored files between worktrees
wt step prune                   # Remove merged worktrees
wt step for-each <cmd>          # Run command in every worktree
```

---

## AI Agent Workflows

### Launch Parallel Agents

```bash
# Create worktrees and launch Claude Code in each
wt switch -c feature-auth -x claude -- 'Add authentication'
wt switch -c fix-pagination -x claude -- 'Fix the pagination bug'
```

The `-x` flag replaces the `wt` process with the given command. Arguments after `--` are passed to that command.

### Shell Alias for Quick Agent Launch

```bash
# Add to your shell config
alias wsc='wt switch --create -x claude'

# Usage
wsc feature-auth -- 'Add OAuth2 login flow'
wsc fix-nav -- 'Fix navigation bug in sidebar'
```

### Workflow Pattern

1. `wt switch -c feature -x claude -- 'task description'` — spin up an agent
2. Work on other things (or spin up more agents)
3. Return when agent is done, review the diff
4. `wt merge` — validate with hooks, merge, clean up

---

## Hooks

Hooks are shell commands that run at lifecycle events. Defined in project config (`.config/wt.toml`) or user config (`~/.config/worktrunk/config.toml`).

### Hook Types

| Hook          | When                    | Blocking | Use for                       |
| ------------- | ----------------------- | -------- | ----------------------------- |
| `pre-switch`  | Before every switch     | Yes      | Fetching latest remote        |
| `post-create` | After worktree created  | Yes      | `npm ci`, env setup           |
| `post-start`  | After worktree created  | No (bg)  | Dev servers, file copying     |
| `post-switch` | After every switch      | No (bg)  | tmux rename, notifications    |
| `pre-commit`  | Before commit in merge  | Yes      | Linting, formatting           |
| `pre-merge`   | Before merge to target  | Yes      | Tests, build verification     |
| `post-merge`  | After successful merge  | Yes      | Deploy, install binaries      |
| `pre-remove`  | Before worktree deleted | Yes      | Archive artefacts             |
| `post-remove` | After worktree removed  | No (bg)  | Kill servers, stop containers |

### Example Project Config (`.config/wt.toml`)

```toml
# Install dependencies when creating a worktree
[post-create]
install = "bun install"

# Copy build caches in the background
[post-start]
copy = "wt step copy-ignored"

# Lint before commit, test before merge
[pre-commit]
lint = "bun run lint:fix"
typecheck = "bun run lint:types"

[pre-merge]
test = "bun run test"
build = "bun run build"
```

### Template Variables in Hooks

```toml
[post-start]
server = "bun run dev -- --port {{ branch | hash_port }}"

[post-remove]
kill = "lsof -ti :{{ branch | hash_port }} -sTCP:LISTEN | xargs kill 2>/dev/null || true"
```

| Variable               | Description                       |
| ---------------------- | --------------------------------- |
| `{{ branch }}`         | Branch name                       |
| `{{ repo }}`           | Repository directory name         |
| `{{ worktree_path }}`  | Absolute worktree path            |
| `{{ default_branch }}` | Default branch name               |
| `{{ target }}`         | Merge target (merge hooks only)   |
| `{{ base }}`           | Base branch (creation hooks only) |

| Filter        | Description                    |
| ------------- | ------------------------------ |
| `sanitize`    | Replace `/` and `\` with `-`   |
| `sanitize_db` | Database-safe identifier       |
| `hash_port`   | Deterministic port 10000–19999 |

---

## LLM Commit Messages

Worktrunk can generate commit messages from diffs using any LLM CLI tool.

```toml
# ~/.config/worktrunk/config.toml
[commit.generation]
command = "llm -m claude-sonnet-4-5"
```

Used automatically by `wt step commit`, `wt step squash`, and `wt merge`.

Debug or pipe to another tool:

```bash
wt step commit --show-prompt | less
wt step commit --show-prompt | llm -m gpt-5-nano
```

---

## Configuration

| File                              | Scope   | Purpose                                |
| --------------------------------- | ------- | -------------------------------------- |
| `~/.config/worktrunk/config.toml` | Global  | Worktree paths, LLM config, user hooks |
| `.config/wt.toml`                 | Project | Project hooks (require approval)       |

### Worktree Path Template

```toml
# ~/.config/worktrunk/config.toml

# Default — siblings in parent directory
# ~/code/myproject.feature-auth
worktree-path = "../{{ repo }}.{{ branch | sanitize }}"

# Inside the repository
worktree-path = ".worktrees/{{ branch | sanitize }}"

# Custom location
worktree-path = "/Users/you/worktrees/{{ repo }}.{{ branch | sanitize }}"
```

### Useful Config Commands

```bash
wt config shell install         # Set up shell integration
wt config create                # Create user config from template
wt config create --project      # Create project config
wt config show                  # Show all config files + status
```

---

## Quick Reference

```text
wt switch <branch>              Navigate to worktree
wt switch -c <branch>           Create branch + worktree
wt switch -c <branch> -x cmd    Create + run command
wt switch -                     Previous worktree
wt switch ^                     Default branch
wt switch pr:N                  GitHub PR
wt switch                       Interactive picker

wt list                         List all worktrees
wt list --full                  With CI status + diffstat

wt merge                        Squash + merge + clean up
wt merge --no-squash            Preserve commits
wt merge --no-remove            Keep worktree

wt remove                       Remove current worktree
wt remove -f -D <branch>        Force remove + delete branch

wt step commit                  LLM-generated commit
wt step squash                  Squash branch commits
wt step diff                    Show all branch changes
wt step copy-ignored            Share build caches
wt step prune                   Clean up merged worktrees

wt hook show                    Show configured hooks
wt hook pre-merge               Run pre-merge hooks manually
wt config show                  Show configuration
```
