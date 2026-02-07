# Agent Guide for Affirm

This document outlines the development workflow, commands, and patterns for working in this codebase.

## Project Overview

- **Framework**: Nuxt 4 (Vue 3)
- **Runtime**: Cloudflare Workers (Compatibility Date: 2026-02-01)
- **Database**: Cloudflare D1 (SQLite) with Drizzle ORM
- **Package Manager**: Bun
- **Styling**: Tailwind CSS v4 + DaisyUI
- **Tooling**: Trunk (lint/format), Vitest (testing), Playwright (e2e)

## Essential Commands

### Development

- **Start Dev Server**: `bun run dev` (Runs Nuxt dev server with Cloudflare binding proxies)
- **Lint & Fix**: `bun run lint:fix` (Runs ESLint and Trunk)
- **Format**: `bun run format` (Runs Prettier and Trunk)
- **Type Check**: `bun run lint:types`

### Database (Drizzle & D1)

- **Generate Migrations**: `bun run db:generate` (Run after changing `server/database/schema.ts`)
- **Migrate Local**: `bun run db:migrate:local` (Applies migrations to local D1 instance)
- **Migrate Staging**: `bun run db:migrate:staging` (Applies to `affirm-staging` DB)
- **Migrate Production**: `bun run db:migrate:prod` (Applies to `affirm` DB)
- **Drizzle Studio**:
  - Staging: `bun run db:studio:staging`
  - Production: `bun run db:studio:prod`

### Testing

- **Run All Tests**: `bun run test`
- **Unit Tests**: `bun run test:unit`
- **Nuxt Tests**: `bun run test:nuxt`
- **E2E Tests**: `bun run test:e2e` (Playwright)

### Deployment

- **Deploy to Production**: `bun run deploy`
- **Deploy to Staging**: `bun run deploy:nonprod` (Uploads versions without immediate promotion)

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

- **`nuxt.config.ts`**: Main Nuxt configuration.
- **`wrangler.jsonc`**: Cloudflare Workers configuration. Defines `DB` bindings for `prod` and `staging` environments.
- **`drizzle.config.ts`**: Drizzle Kit configuration.

## Gotchas & Guidelines

1. **Environment Variables**: Managed via `wrangler.jsonc` bindings for runtime. For local dev, `.dev.vars` is used.
2. **Migrations**: Always run `bun run db:generate` after modifying schema. Do not modify SQL files manually.
3. **Bindings**: The application relies on Cloudflare bindings (`DB`, `ASSETS`). Ensure `bun run dev` is used to properly proxy these during development.
4. **Imports**: Use `~` alias for project root (e.g., `~/server/utils/db`).
