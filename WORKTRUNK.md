# Worktrunk (`wt`) guide and cheat sheet

Worktrunk is a CLI for managing Git worktrees, built for running AI agents in parallel. Read the docs at
<https://worktrunk.dev>, or the source at <https://github.com/max-sixty/worktrunk>.

This guide matches Worktrunk 0.80.0. For the full reference, run `wt <command> --help`.

---

## Why Worktrunk?

Git worktrees let you check out several branches at once, each in its own directory. Git's own worktree commands make
that painful because creating, switching between, and cleaning up worktrees means juggling paths and chaining several
commands together.

Worktrunk lets you refer to worktrees by branch name instead of by path. Here's the same feature branch done both ways:

```bash
# Without worktrunk
git worktree add -b feat ../repo.feat && cd ../repo.feat
# ... work ...
cd ../repo && git worktree remove ../repo.feat && git branch -d feat
```

```bash
# With worktrunk
wt switch -c feat
# ... work ...
wt merge
```

Its main draw is running several AI agents in parallel. Each Claude Code session gets its own worktree, so the agents
can't trample each other's changes.

---

## Installation

```bash
# macOS/Linux (Homebrew)
brew install worktrunk && wt config shell install

# Rust (Cargo)
cargo install worktrunk && wt config shell install
```

`wt switch` needs the shell integration from `wt config shell install` to change your working directory.

---

## Core commands

### `wt switch`

Switch to a worktree, or create one.

```bash
wt switch feature-auth          # Switch to existing worktree
wt switch -c new-feature        # Create new branch + worktree
wt switch -c hotfix -b prod     # Create from specific base branch
wt switch -                     # Previous worktree (like cd -)
wt switch ^                     # Default branch (main/master)
wt switch pr:123                # GitHub PR #123's branch
wt switch                       # Interactive picker (no args)
```

Most day-to-day work needs only these flags:

| Flag                    | Description                                  |
| ----------------------- | -------------------------------------------- |
| `-c`, `--create`        | Create a new branch                          |
| `-b`, `--base <branch>` | Base branch, defaulting to the repo default  |
| `-x`, `--execute <cmd>` | Program to run after switching               |
| `--branches`            | Include branches without worktrees in picker |
| `--remotes`             | Include remote branches in picker            |
| `-y`, `--yes`           | Skip approval prompts                        |
| `--no-cd`               | Skip directory change                        |
| `--clobber`             | Remove stale paths at target                 |

These shortcuts work anywhere `wt switch` takes a branch, including `--base`:

| Shortcut | Meaning                    |
| -------- | -------------------------- |
| `^`      | Default branch             |
| `@`      | Current branch or worktree |
| `-`      | Previous worktree          |
| `pr:N`   | GitHub PR #N               |
| `mr:N`   | GitLab MR !N               |

### `wt list`

List your worktrees and their status.

```bash
wt list                         # List with status info
wt list --full                  # Add CI status and branch summaries
wt list --branches              # Include branches without worktrees
```

The table shows each branch with its uncommitted changes, commits ahead of or behind the default branch, diff size, and
last commit. `--full` adds CI status, plus LLM summaries if you've set `summary = true` under `[list]` in your config.

### `wt remove`

Remove a worktree and delete its branch if it's merged.

```bash
wt remove                       # Remove current worktree
wt remove feature-branch        # Remove specific worktree
wt remove old-feat another      # Remove multiple
wt remove -D experimental       # Force-delete unmerged branch
wt remove -f feature            # Force-remove a worktree with uncommitted changes
wt remove --no-delete-branch x  # Keep the branch after removing worktree
```

`wt remove` deletes a branch when merging it adds nothing to the default branch. That check copes with squash-merge
and rebase workflows, where the commits differ but the file changes match. In `wt list`, a dimmed row marked `_` or `⊂`
is safe to delete.

### `wt merge`

Merge the current branch into the default branch, or into a target you name. One command squashes, rebases,
fast-forwards the target, and removes the worktree.

```bash
wt merge                        # Merge current branch → default branch
wt merge develop                # Merge into specific target
wt merge --no-squash            # Preserve commit history
wt merge --no-remove            # Keep worktree after merging
wt merge --no-commit            # Skip the commit and squash steps
```

It commits or squashes your changes, rebases onto the target, and runs the `pre-merge` hooks. Then it fast-forwards the
target, runs the `pre-remove` hooks, and removes the worktree. The `post-merge` and `post-remove` hooks run in the
background afterwards.

### `wt step`

`wt step` runs the stages of `wt merge` one at a time, along with a few standalone utilities.

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

## AI agent workflows

### Launch parallel agents

```bash
# Create worktrees and launch Claude Code in each
wt switch -c feature-auth -x claude -- 'Add authentication'
wt switch -c fix-pagination -x claude -- 'Fix the pagination bug'
```

`-x` runs a program in the new worktree once the switch finishes, and hands it the terminal. Anything after `--` goes
straight to that program, so `claude` starts with your prompt.

### Shell alias for launching agents

```bash
# Add to your shell config
alias wsc='wt switch --create -x claude'

# Usage
wsc feature-auth -- 'Add OAuth2 login flow'
wsc fix-nav -- 'Fix navigation bug in sidebar'
```

### Workflow pattern

1. Start an agent with `wt switch -c feature -x claude -- 'task description'`.
2. Get on with something else, or start more agents.
3. When the agent finishes, review its changes with `wt step diff`.
4. Run `wt merge`, which runs your hooks, merges the branch, and cleans up.

---

## Hooks

Hooks are shell commands that Worktrunk runs at set points in a worktree's life. Define them in the project config at
`.config/wt.toml` or in your user config at `~/.config/worktrunk/config.toml`. Project hooks need your approval the
first time they run.

### Hook types

A `pre-*` hook blocks, and if it fails, Worktrunk aborts the operation. A `post-*` hook runs in the background.

| Hook          | When                                    | Blocking | Use for                         |
| ------------- | --------------------------------------- | -------- | ------------------------------- |
| `pre-switch`  | Before every switch                     | Yes      | Fetching the latest remote      |
| `post-switch` | After every switch                      | No       | tmux rename, notifications      |
| `pre-start`   | When a new worktree is created          | Yes      | Dependency install, env setup   |
| `post-start`  | When a new worktree is created          | No       | Dev servers, file copying       |
| `pre-commit`  | Before any Worktrunk commit             | Yes      | Linting, formatting             |
| `post-commit` | After any Worktrunk commit              | No       | CI triggers, notifications      |
| `pre-merge`   | After rebase, before merging the target | Yes      | Tests, build verification       |
| `post-merge`  | After a successful merge                | No       | Deploys, installing binaries    |
| `pre-remove`  | Before a worktree is deleted            | Yes      | Archiving artefacts             |
| `post-remove` | After a worktree is removed             | No       | Stopping servers and containers |

### Example project config

Affirm doesn't ship a `.config/wt.toml` yet. If you add one, something like this fits the repo's scripts:

```toml
# Install dependencies when creating a worktree
[pre-start]
install = "pnpm install"

# Copy build caches in the background
[post-start]
copy = "wt step copy-ignored"

# Lint before commit, test before merge
[pre-commit]
lint = "pnpm run lint:fix"
typecheck = "pnpm run lint:types"

[pre-merge]
test = "pnpm run test"
build = "pnpm run build"
```

### Template variables in hooks

Hook commands can use template variables and filters. The `hash_port` filter gives each branch its own stable port, so
dev servers in different worktrees don't collide:

```toml
[post-start]
server = "pnpm run dev -- --port {{ branch | hash_port }}"

[post-remove]
kill = "lsof -ti :{{ branch | hash_port }} -sTCP:LISTEN | xargs kill 2>/dev/null || true"
```

The most common variables are:

| Variable               | Description                                |
| ---------------------- | ------------------------------------------ |
| `{{ branch }}`         | Branch name                                |
| `{{ repo }}`           | Repository directory name                  |
| `{{ worktree_path }}`  | Absolute worktree path                     |
| `{{ default_branch }}` | Default branch name                        |
| `{{ target }}`         | Merge target (merge hooks only)            |
| `{{ base }}`           | Base branch (switch and create hooks only) |

Filters change a value before Worktrunk substitutes it:

| Filter        | Description                            |
| ------------- | -------------------------------------- |
| `sanitize`    | Replace `/` and `\` with `-`           |
| `sanitize_db` | Database-safe identifier               |
| `hash_port`   | Stable port number from 10000 to 19999 |

---

## LLM commit messages

Worktrunk can write commit messages from your diffs with any LLM command-line tool.

```toml
# ~/.config/worktrunk/config.toml
[commit.generation]
command = "llm -m claude-sonnet-4-5"
```

`wt step commit`, `wt step squash`, and `wt merge` all use it. Without a command configured, Worktrunk still commits,
but builds the message from the names of the staged files.

`--show-prompt` prints the prompt, so you can debug it or send it to a different model:

```bash
wt step commit --show-prompt | less
wt step commit --show-prompt | llm -m gpt-5-nano
```

`wt step commit --dry-run` also calls the LLM and prints the generated message, but doesn't commit.

---

## Configuration

| File                              | Scope   | Purpose                                |
| --------------------------------- | ------- | -------------------------------------- |
| `~/.config/worktrunk/config.toml` | Global  | Worktree paths, LLM config, user hooks |
| `.config/wt.toml`                 | Project | Project hooks (require approval)       |

### Worktree path template

`worktree-path` decides where new worktrees go. Relative paths resolve from the repository root.

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

### Useful config commands

```bash
wt config shell install         # Set up shell integration
wt config create                # Create user config from template
wt config create --project      # Create project config
wt config show                  # Show all config files + status
```

---

## Quick reference

```text
wt switch <branch>              Navigate to worktree
wt switch -c <branch>           Create branch + worktree
wt switch -c <branch> -x cmd    Create + run command
wt switch -                     Previous worktree
wt switch ^                     Default branch
wt switch pr:N                  GitHub PR
wt switch                       Interactive picker

wt list                         List all worktrees
wt list --full                  With CI status + summaries

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
