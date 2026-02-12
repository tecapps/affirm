# Agent Guide for Affirm

This document outlines the development workflow, commands, and patterns for working in this codebase.

## Project Overview

- **Framework**: Nuxt 4 (Vue 3)
- **Runtime**: Cloudflare Workers (Compatibility Date: 2026-02-01)
- **Database**: Cloudflare D1 (SQLite) with Drizzle ORM
- **Package Manager**: Bun
- **Styling**: Tailwind CSS v4 + DaisyUI
- **Tooling**: Trunk (lint/format), Vitest (testing), Playwright (e2e)
- **Deployment**: Cloudflare Workers Builds (CI/CD triggered on push)

## Essential Commands

### Development

- **Start Dev Server**: `bun run dev` (Runs Nuxt dev server with Cloudflare binding proxies)
- **Lint & Fix**: `bun run lint:fix` (Runs ESLint and Trunk)
- **Format**: `bun run format` (Runs Prettier and Trunk)
- **Type Check**: `bun run lint:types`

### Database (Drizzle & D1)

- **Generate Migrations**: `bun run db:generate` (Run after changing `server/database/schema.ts`)
- **Migrate Local**: `bun run db:migrate` (Applies migrations to local D1 instance)
- **Migrate Staging**: `bun run db:migrate:staging` (Applies to `affirm-staging` DB via `wrangler.staging.jsonc`)
- **Migrate Production**: `bun run db:migrate:prod` (Applies to `affirm` DB via `wrangler.jsonc`)
- **Drizzle Studio**:
  - Staging: `bun run db:studio:staging`
  - Production: `bun run db:studio:prod`

### Testing

- **Run All Tests**: `bun run test`
- **Unit Tests**: `bun run test:unit`
- **Nuxt Tests**: `bun run test:nuxt`
- **E2E Tests**: `bun run test:e2e` (Playwright)

### Deployment

Deployment is handled by **Cloudflare Workers Builds** — there is no GitHub Actions deploy workflow.

- Pushing to `staging` triggers a build+deploy of the `affirm-staging` Worker.
- Pushing to `production` triggers a build+deploy of the `affirm` Worker.
- PRs targeting `staging` get preview versions uploaded to `affirm-staging`.

For manual/local deploys (rarely needed):

- **Deploy to Production**: `bun run deploy` (builds + `wrangler deploy -c wrangler.jsonc`)
- **Deploy to Staging**: `bun run deploy:staging` (builds + `wrangler versions upload -c wrangler.staging.jsonc`)

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
- **`wrangler.dev.jsonc`**: Local dev Cloudflare Workers config. Used by `bun run dev` and local migrations.
- **`nuxt.config.ts`**: Main Nuxt configuration. Uses `$env` to inject the correct D1 binding at build time.
- **`drizzle.config.ts`**: Drizzle Kit configuration (for `db:push` and `db:studio` commands).

## Gotchas & Guidelines

1. **Environment Variables**: Managed via wrangler config bindings for runtime. For local dev, `.dev.vars` is used.
2. **Migrations**: Always run `bun run db:generate` after modifying schema. Do not modify SQL files manually. Remote migrations use the D1 binding from the appropriate wrangler config file.
3. **Bindings**: The application relies on Cloudflare bindings (`DB`, `ASSETS`). Ensure `bun run dev` is used to properly proxy these during development.
4. **Imports**: Use `~` alias for project root (e.g., `~/server/utils/db`).
5. **Wrangler Configs**: Each environment has its own wrangler config. Migration and deploy scripts use `-c <config>` to target the right D1 database. Never pass `--database-id` to wrangler — it's not a valid flag for `d1 migrations apply`.
6. **Workers Builds**: Deployment is handled by Cloudflare Workers Builds, not GitHub Actions. The `ci.yaml` workflow only runs lint/typecheck/build checks.
