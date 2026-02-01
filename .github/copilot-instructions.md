# Affirm Codebase Guide for Agents

This document outlines the project structure, tooling, and workflows for the `affirm` repository. This is a **Nuxt 4** project deployed to **Cloudflare Workers**.

## 🛠 Tooling Stack

- **Runtime & Package Manager**: [Bun](https://bun.sh) (v1.3.8+)
- **Environment Management**: [Mise](https://mise.jdx.dev) (configuration in `mise.toml`)
- **Framework**: [Nuxt 4](https://nuxt.com)
- **Deployment**: [Cloudflare Workers](https://workers.cloudflare.com) via `wrangler`
- **Linting & Formatting**: [Trunk](https://trunk.io) (manages ESLint, Prettier, etc.)
- **Testing**: [Vitest](https://vitest.dev) (unit/integration) & [Playwright](https://playwright.dev) (E2E)

## ⚡️ Common Commands

Always use `bun run` to execute scripts.

### Development

- **Start Dev Server**: `bun dev` (runs at http://localhost:3000)
- **Preview Production Build**: `bun run preview` (uses wrangler dev)

### Quality Assurance

- **Lint Code**: `bun run lint` (ESLint + Trunk + Typecheck)
- **Fix Lint Issues**: `bun run lint:fix`
- **Format Code**: `bun run format` (Prettier + Trunk)
- **Typecheck**: `bun run lint:types` (runs `tsc --noEmit`)

### Testing

- **Run All Tests**: `bun run test` (Vitest)
- **Unit Tests**: `bun run test:unit`
- **Nuxt Tests**: `bun run test:nuxt`
- **E2E Tests**: `bun run test:e2e` (Playwright)
- **Watch Mode**: `bun run test:watch`
- **Coverage**: `bun run test:coverage`

### Build & Deploy

- **Build**: `bun run build` (Builds for Cloudflare Workers)
- **Deploy (Prod)**: `bun run deploy` (Builds + Deploys via Wrangler)
- **Deploy (Non-Prod)**: `bun run deploy:nonprod`

## 📂 Project Structure

- **`app/`**: Application source code (Nuxt 4 structure).
  - `app.vue`: Root component — renders `<NuxtLayout>` + `<NuxtPage />`.
  - `assets/css/tailwind.css`: Tailwind CSS + DaisyUI entry point.
  - `components/`: Auto-imported Vue components (e.g. `AppHeader`, `FeatureCard`).
  - `composables/`: Auto-imported reactive logic (e.g. `useAppInfo`).
  - `layouts/`: Page wrapper templates (`default.vue` provides header/footer chrome).
  - `middleware/`: Route middleware. Files ending in `.global.ts` run on every navigation.
  - `pages/`: File-based routing. `index.vue` → `/`, `about.vue` → `/about`.
  - `plugins/`: App initialisation. Runs once on startup; can `provide()` globals.
- **`server/`**: Nitro server directory.
  - `api/`: API endpoints. File name maps to route (e.g. `hello.get.ts` → `GET /api/hello`).
- **`shared/`**: Code shared between app and server (auto-imported in both).
  - `utils/`: Shared utility functions (e.g. `capitalize`).
- **`public/`**: Static assets.
- **`nuxt.config.ts`**: Nuxt configuration (includes Tailwind Vite plugin).
- **`wrangler.jsonc`**: Cloudflare Workers configuration.
- **`mise.toml`**: Environment tool versions and tasks.
- **`.trunk/`**: Trunk configuration for linters/formatters.
- **`eslint.config.mjs`**: ESLint flat config.

## 📝 Conventions & Opinions

- **UI Framework**: Prefer **Tailwind CSS** with **DaisyUI** (Open Source version) over NuxtUI.
- **Color Palette**: **Catppuccin** palette is recommended.
- **Package Management**: strict usage of `bun`. Do not use `npm` or `yarn`.
- **Nuxt Modules**:
  - `@nuxt/content`: For markdown-based content.
  - `@nuxt/image`, `@nuxt/fonts`, `@nuxt/icon`.
  - `@nuxt/eslint`.

## ⚠️ Gotchas

- **Trunk**: Managed as a dev dependency (`bun run trunk`).
- **Wrangler**: Configured via `wrangler.jsonc`. Ensure compatibility date is respected (`2026-02-01`).
- **Tailwind CSS v4**: Configured via `@tailwindcss/vite` plugin in `nuxt.config.ts` (not the `@nuxtjs/tailwindcss` module). Styling uses CSS-first config: `@import "tailwindcss"` and `@plugin "daisyui"` in `app/assets/css/tailwind.css`.
- **Nuxt 4**: This project uses Nuxt 4 features. `app/` directory contains pages, components, composables, layouts, middleware, and plugins. `shared/` directory auto-imports into both app and server.
