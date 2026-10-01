# `affirm`

![CI status](https://github.com/tecapps/affirm/actions/workflows/ci.yaml/badge.svg) ![DevSkim status](https://github.com/tecapps/affirm/actions/workflows/devskim.yaml/badge.svg)

Start with the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction).

> [!IMPORTANT]
> Opinions ahead. The following are recommendations, so ignore them if you have better ideas.

The app uses the first-party Nuxt ESLint, Fonts, Icon, Image, and Scripts modules, but not [NuxtUI](https://ui.nuxt.com). [Nuxt Content](https://content.nuxt.com) is installed as a dependency, but it isn't in the
`modules` list in `nuxt.config.ts` yet. Once it's enabled, our copywriters can write Markdown instead of HTML or Vue.

In place of NuxtUI, we use [Tailwind](https://tailwindcss.com/) with [DaisyUI](https://daisyui.com/). Tailwind gives us
flexibility, and DaisyUI adds a component library on top so we aren't building every button from scratch.

DaisyUI also doesn't dick about with a paid pro tier; the open-source version is the full package.

I'm not a frontend developer, but I'd encourage you to stick with the app's [Catppuccin](https://github.com/catppuccin)
Mocha palette. Catppuccin publishes dedicated packages for [the palette itself](https://github.com/catppuccin/palette),
[DaisyUI](https://github.com/catppuccin/daisyui), and [Tailwind](https://github.com/catppuccin/tailwindcss).

The workspace recommends a set of Visual Studio Code extensions, listed in the _Recommended_ section of the Extensions
view. Add any others you find useful.

> [!IMPORTANT]
> Opinions end here, and it's objectivity from here on. Mostly.

## Branch protections

`staging` is the integration branch and `production` is the live deployment. Rulesets protect both, so changes reach
them only through pull requests.

Do your work in a branch named `username/purpose`, for example `synmux/fix-header`.

When it's ready, open a pull request against `staging`. `mise run pr` opens a draft PR against `staging` for you. A PR
into `staging` needs one approval, and a PR into `production` needs two. I ([@synmux](https://github.com/synmux)) try to
review every PR, but if I'm not around, any other team member can review it.

Opening or updating a pull request against `staging` uploads a preview version to the `affirm-staging` Worker, so you can check your changes before they merge.

> [!TIP]
> Please sign your commits. It's a big security win for little effort. You don't need a GnuPG key any more, because
> Git can sign with the SSH key you probably already push with. GitHub's guide to
> [signing commits](https://docs.github.com/en/authentication/managing-commit-signature-verification/signing-commits)
> covers the setup.

## Setup

If you haven't already, install `pnpm`. I suggest [`mise`](https://mise.jdx.dev), which also manages Node versions and
plenty of other tools.

The repository's `mise.toml` installs `pnpm`, Node.js, and `rust`. Rust is there in case we ever use `wasm`. You can
edit the file, but your changes apply to everyone. The `.tool-versions` and `.node-version` files
exist mainly for Workers Builds, so treat `mise.toml` as the source of truth.

The one tool `mise` doesn't handle is `trunk`, which is a _massive_ pain in the arse to manage that way. It comes in as
a dev dependency instead, so you can run it with `pnpm exec trunk`, or follow the
[Trunk installation guide](https://docs.trunk.io/code-quality/overview/initialize-trunk) to install it globally.

If you use `mise`, run:

```bash
# trust the mise.toml file
mise trust

# set up the environment
mise install
```

Then install the dependencies:

```bash
# we are using pnpm for package management
pnpm install
```

## Development server

`pnpm run dev` serves the app at `http://localhost:3000`, backed by a local D1 database:

```bash
pnpm run dev
```

## Development

This repository holds a Nuxt 4 web application that runs on Cloudflare Workers. It uses pnpm as the package manager and
Node.js 26 for builds and tooling.

### Essential commands

`pnpm run <script>` runs a script from `package.json`, such as `pnpm run dev`. `pnpm exec <binary>` runs a binary from
`node_modules/.bin`, such as `pnpm exec wrangler --version`.

| Task                           | Command                                                   | Notes                                                                                    |
| ------------------------------ | --------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Install dependencies           | `pnpm install`                                            | Also runs `postinstall`, which runs `nuxt prepare`, `wrangler types`, and `format`       |
| Start the dev server           | `pnpm run dev`                                            | Uses a local D1 database                                                                 |
| Build for production           | `pnpm run build`                                          | Passes `--envName=production`                                                            |
| Build for staging              | `pnpm run build:staging`                                  | Passes `--envName=staging`                                                               |
| Deploy to production           | `pnpm run deploy`                                         | Prefer [Workers Builds](#deployment); this skips [migrations](#manual-deployment)        |
| Deploy to staging              | `pnpm run deploy:staging`                                 | Prefer [Workers Builds](#deployment); this skips [migrations](#manual-deployment)        |
| Generate migrations            | `pnpm run db:generate`                                    | Run after changing the schema                                                            |
| Apply migrations locally       | `pnpm run db:migrate`                                     | Uses `wrangler.dev.jsonc`                                                                |
| Apply migrations to staging    | `pnpm run db:migrate:staging`                             | Uses `wrangler.staging.jsonc`                                                            |
| Apply migrations to production | `pnpm run db:migrate:prod`                                | Uses `wrangler.jsonc`                                                                    |
| Open Drizzle Studio            | `pnpm run db:studio:staging` or `pnpm run db:studio:prod` | Needs `CLOUDFLARE_STAGING_DATABASE_ID` or `CLOUDFLARE_PRODUCTION_DATABASE_ID` set        |
| Lint and fix                   | `pnpm run lint:fix`                                       | Runs ESLint and Trunk with fixes                                                         |
| Format                         | `pnpm run format`                                         | Runs Prettier and Trunk, then stages all changes in the working tree with `git add -A .` |
| Run the Vitest suites          | `pnpm run test`                                           | Runs both the unit and Nuxt projects                                                     |
| Run end-to-end tests           | `pnpm run test:e2e`                                       | Uses Playwright                                                                          |

### Project structure

The project follows the Nuxt 4 directory structure, with the application source in `app/`.

| Path               | Contents                                                                       |
| ------------------ | ------------------------------------------------------------------------------ |
| `app/`             | Vue application source                                                         |
| `app/pages/`       | File-based routes                                                              |
| `app/components/`  | Auto-imported Vue components                                                   |
| `app/composables/` | Auto-imported state and logic                                                  |
| `app/layouts/`     | Page layouts                                                                   |
| `app/middleware/`  | Route middleware                                                               |
| `app/plugins/`     | Nuxt plugins                                                                   |
| `app/assets/`      | CSS and static assets, including the Tailwind entry point                      |
| `server/`          | Nitro server backend                                                           |
| `server/api/`      | API endpoints, such as `/api/ping`                                             |
| `server/database/` | Drizzle schema and migrations                                                  |
| `server/utils/`    | Auto-imported server utilities, such as `useDB`                                |
| `shared/`          | Code shared between client and server                                          |
| `public/`          | Static files served from the site root, such as `favicon.ico` and `robots.txt` |

### Development patterns

#### Vue and TypeScript

- Use the Composition API with `<script setup lang="ts">`.
- Rely on auto-imports for Nuxt composables such as `useFetch` and `useRouter`, and for anything in the `components`
  and `composables` directories.
- Don't import components from `app/components` by hand.

#### Styling

Use Tailwind CSS v4 utility classes for layout and spacing, and DaisyUI component classes such as `btn` and `card` for
UI elements. The app's theme is Catppuccin Mocha.

#### Data fetching

Fetch data in pages and components with `useFetch`. It handles hydration after server-side rendering for you:

```ts
const { data } = await useFetch("/api/ping");
```

#### Server API

Create API routes in `server/api/`, each exporting a default event handler:

```ts
export default defineEventHandler((event) => {
  return { message: "Hello" };
});
```

### Database

The app uses Cloudflare D1, which is built on SQLite, with Drizzle ORM. Each Worker has its own D1 database:

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

The D1 bindings also live in `nuxt.config.ts`, as Nuxt `$env` overrides, so keep the two in sync. Nitro's
`deployConfig: true` generates its own wrangler config at build time, and the `$env` overrides make that generated
config target exactly one database:

- `pnpm run build` passes `--envName=production` to get the production D1 binding.
- `pnpm run build:staging` passes `--envName=staging` to get the staging D1 binding.
- `pnpm run dev` uses the local D1 database from `wrangler.dev.jsonc`.

> [!WARNING]
> Every build must pass `--envName`, or it ends up with no D1 binding at all. The `build` and `build:staging` scripts
> pass it for you, so use them instead of a bare `nuxt build`.

#### Schema changes

1. Edit `server/database/schema.ts`.
2. Run `pnpm run db:generate` to create a migration.
3. Run `pnpm run db:migrate` to apply it locally.
4. Commit the migration files. When you push to `staging` or `production`, Workers Builds applies them to that environment's D1 database before deploying. The manual deploy scripts don't, so read [Manual deployment](#manual-deployment) before you deploy by hand.

### Tools and configuration

- Trunk manages the linters and formatters, and `pnpm run lint:fix` applies their fixes.
- Wrangler handles deployment and D1 migrations, with one config file per environment.
- `nuxt.config.ts` holds the Nuxt configuration, including the `$env` D1 overrides.
- TypeScript runs in strict mode, and `pnpm run lint:types` checks it.

### Gotchas

- Nuxt 3 differs from Nuxt 4 in places, such as how it uses the `app/` directory. When you read the Nuxt documentation,
  check which version a page covers.
- Wrangler's `d1 migrations apply` has no `--database-id` flag. It reads the database ID from the `d1_databases` binding
  in the config file.

## Production

Build the application for production:

```bash
pnpm run build
```

To build it and preview it locally with `wrangler dev`, run:

```bash
pnpm run preview
```

## Deployment

[Cloudflare Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/), Cloudflare's built-in CI/CD,
deploys the app when you push. GitHub Actions doesn't deploy anything.

### How it works

Each of the two Workers is connected to this repository:

| Worker           | Production branch | Build command                            | Deploy command                                                                                |
| ---------------- | ----------------- | ---------------------------------------- | --------------------------------------------------------------------------------------------- |
| `affirm`         | `production`      | `pnpm install && pnpm run build`         | `pnpm run db:migrate:prod && pnpm exec wrangler deploy -c wrangler.jsonc`                     |
| `affirm-staging` | `staging`         | `pnpm install && pnpm run build:staging` | `pnpm run db:migrate:staging && pnpm exec wrangler versions upload -c wrangler.staging.jsonc` |

- A push to `staging` builds `affirm-staging`, applies migrations to the staging D1 database, and uploads a new
  version.
- A push to `production` builds `affirm`, applies migrations to the production D1 database, and deploys to live
  traffic.
- A pull request against `staging` makes `affirm-staging` upload a preview version. Previews don't run migrations, so
  they use the existing staging schema.

### CI workflow

The `ci.yaml` GitHub Actions workflow runs on every push and pull request. It runs Trunk, a type check, and a build, and
it doesn't deploy.

### Manual deployment

> [!WARNING]
> The `deploy` and `deploy:staging` scripts only build and run `wrangler deploy`. They don't apply D1 migrations, so
> run the matching `db:migrate:*` script first, or the new code goes live against the old schema.

To deploy without Workers Builds, apply the migrations and then deploy:

```bash
# Production: migrate, then build + deploy
pnpm run db:migrate:prod
pnpm run deploy

# Staging: migrate, then build + deploy
pnpm run db:migrate:staging
pnpm run deploy:staging
```

`deploy:staging` sends the new version straight to live staging traffic. Workers Builds only uploads a version for
staging. To do that by hand, use `pnpm run deploy:snapshot`, which also skips migrations.

### Custom domain

The Workers have no custom domain or routes configured and serve only on `workers.dev`. Adding a domain is a small
change to [`wrangler.jsonc`](wrangler.jsonc). When you add one, route both the bare `domain.tld` and `www.domain.tld`.

## Questions

If you have questions, ask syn. I'm happy to help.
