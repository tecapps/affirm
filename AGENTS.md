# Agent Guide for Affirm

This document outlines the development workflow, commands, and patterns for working in this codebase.

## Project Overview

- **Framework**: Nuxt 4 (Vue 3)
- **Runtime**: Cloudflare Workers (Compatibility Date: 2026-02-01)
- **Database**: Cloudflare D1 (SQLite) with Drizzle ORM
- **Package Manager**: `pnpm`
- **Styling**: Tailwind CSS v4 + DaisyUI
- **Tooling**: Trunk (lint/format), Vitest (testing), Playwright (e2e)
- **Deployment**: Cloudflare Workers Builds (CI/CD triggered on push)

## Essential Commands

### Development

- **Start Dev Server**: `pnpm run dev` (Runs Nuxt dev server with Cloudflare binding proxies)
- **Lint & Fix**: `pnpm run lint:fix` (Runs ESLint and Trunk)
- **Format**: `pnpm run format` (Runs Prettier and Trunk)
- **Type Check**: `pnpm run lint:types` (runs `nuxt typecheck`, which uses `vue-tsc` and covers `.vue` files)

### Database (Drizzle & D1)

- **Generate Migrations**: `pnpm run db:generate` (Run after changing `server/database/schema.ts`)
- **Migrate Local**: `pnpm run db:migrate` (Applies migrations to local D1 instance)
- **Migrate Staging**: `pnpm run db:migrate:staging` (Applies to `affirm-staging` DB via `wrangler.staging.jsonc`)
- **Migrate Production**: `pnpm run db:migrate:prod` (Applies to `affirm` DB via `wrangler.jsonc`)
- **Drizzle Studio**:
  - Staging: `pnpm run db:studio:staging`
  - Production: `pnpm run db:studio:prod`
  - Studio and `db:push:*` need `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_D1_TOKEN`, and the matching `CLOUDFLARE_*_DATABASE_ID` in the environment, and mise loads them from `.env`.

### Testing

- **Run All Tests**: `pnpm run test`
- **E2E Tests**: `pnpm run test:e2e` (Playwright). Specs live in `tests/e2e/` and the config in `playwright.config.ts`. The script applies local D1 migrations and starts `nuxt dev` on port 3010. Install the browser once with `pnpm exec playwright install chromium`.

Vitest uses a single configuration with no named projects. No Vitest test files are checked in; `pnpm run test --run --passWithNoTests` checks test discovery without failing on an empty suite.

### Deployment

Deployment is handled by **Cloudflare Workers Builds** — there is no GitHub Actions deploy workflow.

- Pushing to `staging` triggers a build+deploy of the `affirm-staging` Worker.
- Pushing to `production` triggers a build+deploy of the `affirm` Worker.
- Pushing to any other branch uploads a preview version to `affirm-staging` without deploying it or running migrations. The PR shows the build as a check.

For manual/local deploys (rarely needed):

- **Deploy to Production**: `pnpm run deploy` (builds + `pnpm exec wrangler deploy -c wrangler.jsonc`)
- **Deploy to Staging**: `pnpm run deploy:staging` (builds + `pnpm exec wrangler deploy -c wrangler.staging.jsonc`)

Manual deploy scripts don't apply D1 migrations; only the Workers Builds deploy commands do. Run `pnpm run db:migrate:prod` or `pnpm run db:migrate:staging` before a manual deploy, or new code goes live against the old schema.

## Code Structure

- **`app/`**: Nuxt 4 application source (pages, components, composables).
- **`server/`**: Server-side logic (Nitro).
  - **`server/database/`**: Drizzle schema and migrations.
  - **`server/utils/db.ts`**: Database connection utility (`useDB`).
  - **`server/api/`**: API event handlers.
- **`shared/`**: Shared utilities between client and server.
- **`.trunk/`**: Configuration for Trunk (linter/formatter manager).

## Database Patterns

### Schema Definition

Define tables in `server/database/schema.ts` using `drizzle-orm/sqlite-core`.

```typescript
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
});
```

### Accessing Database

Use the `useDB` utility in server routes. It uses the `DB` binding from the request context.

```typescript
import { useDB } from "../utils/db";

export default defineEventHandler(async (event) => {
  const db = useDB(event);
  return await db.query.users.findMany();
});
```

## Configuration

- **`wrangler.jsonc`**: Production Cloudflare Workers config. Includes the production D1 binding (`affirm`).
- **`wrangler.staging.jsonc`**: Staging Cloudflare Workers config. Includes the staging D1 binding (`affirm-staging`).
- **`wrangler.dev.jsonc`**: Local dev Cloudflare Workers config. Used by `pnpm run dev` and local migrations.
- **`nuxt.config.ts`**: Main Nuxt configuration. Uses `$env` to inject the correct D1 binding at build time.
- **`drizzle.config.ts`**: Drizzle Kit configuration (for `db:push` and `db:studio` commands).

## Gotchas & Guidelines

1. **Environment Variables**: Managed via wrangler config bindings for runtime. For local dev, `.dev.vars` (a symlink to `.env`) is used. Declare every Worker secret in `secrets.required` in `wrangler.jsonc` and `wrangler.dev.jsonc`. `wrangler types` builds `Env` from that list, not from local `.env` files, so `worker-configuration.d.ts` comes out the same on every machine. `wrangler deploy` also refuses to deploy if a listed secret isn't set on the Worker.
2. **Migrations**: Always run `pnpm run db:generate` after modifying schema. Do not modify SQL files manually. Remote migrations use the D1 binding from the appropriate wrangler config file.
3. **Bindings**: The application relies on Cloudflare bindings (`DB`, `ASSETS`). Ensure `pnpm run dev` is used to properly proxy these during development.
4. **Imports**: Use `~` alias for project root (e.g., `~/server/utils/db`).
5. **Wrangler Configs**: Each environment has its own wrangler config. Migration and deploy scripts use `-c <config>` to target the right D1 database. Never pass `--database-id` to wrangler — it's not a valid flag for `d1 migrations apply`.
6. **Workers Builds**: Deployment is handled by Cloudflare Workers Builds, not GitHub Actions. The `ci.yaml` workflow only runs lint/typecheck/build checks.
