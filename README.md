# `affirm`

![CI status](https://github.com/tecapps/affirm/actions/workflows/ci.yaml/badge.svg) ![DevSkim status](https://github.com/tecapps/affirm/actions/workflows/devskim.yaml/badge.svg)

Your first port of call should be the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn
more.

> [!IMPORTANT]
> Opinions ahead! The following are recommendations. Feel free to ignore them if you have better ideas.

All Nuxt modules except [NuxtUI](https://ui.nuxt.com) are installed and enabled. Notably, this
includes [Nuxt Content](https://content.nuxtjs.org/), which will make our lives easier for copywriting by letting them
write Markdown instead of HTML/Vue.

But what are we going to use if not [NuxtUI](https://ui.nuxt.com)? Simple. [Tailwind](https://tailwindcss.com/)
with [DaisyUI](https://daisyui.com/). This gives us a lot of flexibility while still providing a component library to
speed up development.

The benefit of [DaisyUI](https://daisyui.com/) is that they don't dick about by having a "pro" version. The open-source
version of DaisyUI is it.

I'm not a frontend developer but I'd encourage use of the [Catppuccin](https://github.com/catppuccin) palette. There are
dedicated packages
for [the palette](https://github.com/catppuccin/palette), [DaisyUI](https://github.com/catppuccin/daisyui),
and [Tailwind](https://github.com/catppuccin/tailwindcss).

Recommended VS Code extensions are configured for this workspace. Check the extensions view's _Recommended_ section.
Feel free to add any you find useful.

> [!IMPORTANT]
> Opinions end here. It's objectivity from here on. Mostly.

## Branch protections

The `staging` branch is the integration branch. The `production` branch is the live deployment. Both are protected;
changes can only come from pull requests.

Do your work in a branch named `username/purpose`; eg `daveio/fix-header`.

When it's ready to merge, submit a pull request targeting `staging`. Two approvals are required on each PR.
I ([@daveio](https://github.com/daveio)) will try to review all PRs and you can function as the other approver if you
like. If I'm unavailable to review a PR, ask another team member to review it for you. Anyone can.

The purpose of this isn't to be a pain in the arse, it's to minimise the possibility of broken code reaching production.
Your pushes to branches generate preview versions on the `affirm-staging` Worker, so you can validate things before
submitting a PR and save everyone a bunch of time.

> [!TIP]
> Please **sign your commits**. It's a major security win and it's not enormous hassle. You don't need a GnuPG key any
> more; Git supports signing with SSH keys now, and you probably use one of those to push anyway.
> See [the documentation](https://docs.github.com/en/authentication/managing-commit-signature-verification/signing-commits)
> for more information.

## Setup

Install [`bun`](https://bun.sh) if you haven't already. I suggest using [`mise`](https://github.com/jdx/mise), which you
can also use to manage Node versions and a bunch of other stuff too.

There is a `mise.toml` file included in this repo. It will install everything you need.

The only exception is `trunk` which is a _massive_ pain in the arse to manage using `mise`. It'll be installed as a dev
dependency and can be invoked through `bun run trunk`, or read
the [installation documentation](https://docs.trunk.io/code-quality/overview/initialize-trunk) to install it globally if
you prefer.

> [!NOTE]
> It will also install a few extras; the CLIs for the major coding agents, and `rust` in case we decide to use `wasm` in
> the future. Feel free to edit it if you need to, just be aware you'll be changing it for everyone else too.
>
> There are also `.tool-versions` and `.node-version` files, but they're more for Workers Builds. `mise` should be
> treated as the source of truth.

If you are using `mise`, simply run:

```bash
# trust the mise.toml file
mise trust

# set up the environment
mise install
```

When everything is set up, install dependencies:

```bash
# we are using bun for package management
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
bun dev
```

## Development

This repository hosts a **Nuxt 4** web application deployed to **Cloudflare Workers**. It uses **Bun** as the package
manager and runtime for development scripts.

### Essential Commands

Run these commands with `bun`.

- **Install dependencies**: `bun install` (or `bun run postinstall` to setup Trunk)
- **Development Server**: `bun run dev` (starts Nuxt dev server with local D1)
- **Build**:
  - `bun run build` (builds for production — uses `--envName=production`)
  - `bun run build:staging` (builds for staging — uses `--envName=staging`)
- **Deploy** (prefer Workers Builds — see [Deployment](#deployment)):
  - `bun run deploy` (build + deploy to production via `wrangler.jsonc`)
  - `bun run deploy:staging` (build staging + upload version via `wrangler.staging.jsonc`)
- **Database**:
  - `bun run db:generate` (generate migrations after schema changes)
  - `bun run db:migrate` (apply migrations to local D1)
  - `bun run db:migrate:staging` (apply migrations to staging D1 via `wrangler.staging.jsonc`)
  - `bun run db:migrate:prod` (apply migrations to production D1 via `wrangler.jsonc`)
  - `bun run db:studio:staging` / `bun run db:studio:prod` (Drizzle Studio)
- **Lint & Format**:
  - `bun run lint:fix` (Run all linters and fix issues)
  - `bun run format` (Format code with Prettier and Trunk)
- **Testing**:
  - `bun run test` (Unit tests via Vitest)
  - `bun run test:e2e` (E2E tests via Playwright)

### Project Structure

This project follows the **Nuxt 4** directory structure (source in `app/`).

- **`app/`**: Main Vue application source.
  - **`pages/`**: File-based routing.
  - **`components/`**: Auto-imported Vue components.
  - **`composables/`**: Auto-imported state/logic.
  - **`layouts/`**: Page layouts.
  - **`middleware/`**: Route middleware.
  - **`assets/`**: CSS and static assets (Tailwind entry point).
- **`server/`**: Nitro server backend.
  - **`api/`**: API endpoints (e.g., `/api/hello`).
  - **`database/`**: Drizzle schema and migrations.
  - **`utils/`**: Auto-imported server utilities (e.g., `useDB`).
- **`shared/`**: Code shared between client and server.
- **`public/`**: Static files served at root (favicon, robots.txt).

### Development Patterns

#### Vue & TypeScript

- Use **Composition API** with `<script setup lang="ts">`.
- Rely on **auto-imports** for Nuxt composables (`useFetch`, `useRouter`) and directory-based imports (components,
  composables).
- Do not manually import components found in `app/components`.

#### Styling

- **Tailwind CSS v4**: Use utility classes for layout and spacing.
- **DaisyUI**: Use component classes (e.g., `btn`, `card`) for UI elements.
- **Catppuccin Theme**: The app uses the Catppuccin Mocha theme.

#### Data Fetching

- Use **`useFetch`** for data fetching in pages/components. It handles SSR hydration automatically.
  ```ts
  const { data } = await useFetch("/api/hello");
  ```

#### Server API

- Create API routes in `server/api/`.
- Export a default event handler:
  ```ts
  export default defineEventHandler((event) => {
    return { message: "Hello" };
  });
  ```

### Database

The app uses Cloudflare D1 (SQLite) with Drizzle ORM. There are two Workers and two D1 databases:

| Worker           | Database         | Branch       | Purpose         |
| ---------------- | ---------------- | ------------ | --------------- |
| `affirm`         | `affirm`         | `production` | Live traffic    |
| `affirm-staging` | `affirm-staging` | `staging`    | Staging/preview |

#### Environment configuration

Each environment has its own wrangler config file with the correct D1 binding:

| File                     | Worker           | D1 Database      | Used by                          |
| ------------------------ | ---------------- | ---------------- | -------------------------------- |
| `wrangler.jsonc`         | `affirm`         | `affirm`         | Production builds and migrations |
| `wrangler.staging.jsonc` | `affirm-staging` | `affirm-staging` | Staging builds and migrations    |
| `wrangler.dev.jsonc`     | (local)          | `affirm-local`   | Dev server and local migrations  |

D1 bindings are **also** in `nuxt.config.ts` using Nuxt's `$env` overrides, because Nitro's `deployConfig: true`
generates a separate wrangler config at build time. The `$env` mechanism builds a flat config targeting exactly one
database.

- `bun run build` → production D1 binding (`--envName=production`)
- `bun run build:staging` → staging D1 binding (`--envName=staging`)
- `bun run dev` → local D1 via `wrangler.dev.jsonc`

> [!WARNING]
> Every build **must** specify an `--envName`. A build without one produces no D1 binding. The `build` and
> `build:staging` scripts handle this automatically.

#### Schema changes

1. Edit `server/database/schema.ts`
2. Run `bun run db:generate` to create a migration
3. Run `bun run db:migrate` to apply it locally
4. Commit the migration files — Workers Builds handles staging/production migrations on deploy

### Tooling & Configuration

- **Trunk**: Manages linting and formatting tools. Use `bun run lint:fix` to ensure compliance.
- **Wrangler**: Handles Cloudflare deployment. Each environment has its own config file.
- **Nuxt Config**: Located in `nuxt.config.ts`. D1 environment overrides use the `$env` key.
- **TypeScript**: Strict mode is enabled. Ensure types are valid.

### Gotchas

- **Nuxt 4**: This project uses Nuxt 4. Nuxt 3 documentation might differ significantly (e.g., `app/` directory usage).
- **D1 in both places**: D1 bindings exist in both the wrangler config files (for wrangler CLI commands like migrations
  and deploys) and in `nuxt.config.ts` (for Nuxt/Nitro build-time config). Keep them in sync.
- **Always use `--envName`**: Bare `nuxt build` produces no D1 binding. Use the `build` / `build:staging` scripts.
- **No `--database-id` flag**: Wrangler's `d1 migrations apply` reads the database ID from the config file's
  `d1_databases` binding. There is no `--database-id` CLI flag.

## Production

Build the application for production:

```bash
# `bun run` required because `bun build` clashes with internal bun command
bun run build
```

Locally preview production build:

```bash
bun preview
```

## Deployment

Deployment is handled by [**Cloudflare Workers Builds**](https://developers.cloudflare.com/workers/ci-cd/builds/) — Cloudflare's built-in CI/CD that triggers on push. There is no GitHub Actions deployment workflow.

### How it works

There are two separate Cloudflare Workers, each connected to this Git repo:

| Worker           | Production branch | Build command                          | Deploy command                                                                         |
| ---------------- | ----------------- | -------------------------------------- | -------------------------------------------------------------------------------------- |
| `affirm`         | `production`      | `bun install && bun run build`         | `bun run db:migrate:prod && npx wrangler deploy -c wrangler.jsonc`                     |
| `affirm-staging` | `staging`         | `bun install && bun run build:staging` | `bun run db:migrate:staging && npx wrangler versions upload -c wrangler.staging.jsonc` |

- **Push to `staging`**: Workers Builds triggers on `affirm-staging`, runs migrations on the staging D1, uploads a new version.
- **Push to `production`**: Workers Builds triggers on `affirm`, runs migrations on the production D1, deploys to live traffic.
- **PR targeting `staging`**: `affirm-staging` uploads a preview version (no migrations — the preview uses the existing staging D1 schema).

### CI workflow

The `ci.yaml` GitHub Action runs on all pushes and PRs. It performs lint, typecheck, and build checks only — it does **not** deploy.

### Manual deployment

If you need to deploy outside of Workers Builds:

```bash
# Production: build + promote
bun run deploy

# Staging: build + upload version
bun run deploy:staging
```

Eventually, we'll point a domain. Currently we don't configure any routing, adding a domain is a simple enough change
to [`wrangler.jsonc`](wrangler.jsonc). If someone else handles it, remember to point at `www.domain.tld` as well as the
bare `domain.tld`.

## Everything Else

If you have further questions, just contact Dave. I'm more than happy to help.
