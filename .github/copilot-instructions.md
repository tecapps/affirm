# Agent Guide for Affirm Codebase

This repository hosts a **Nuxt 4** web application deployed to **Cloudflare Workers**. It uses **Bun** as the package manager and runtime for development scripts.

## ⚡️ Essential Commands

Run these commands with `bun`.

- **Install dependencies**: `bun install` (or `bun run postinstall` to setup Trunk)
- **Development Server**: `bun run dev` (starts Nuxt dev server)
- **Build**: `bun run build` (builds for Cloudflare)
- **Deploy**: `bun run deploy` (deploys to Cloudflare via Wrangler)
- **Lint & Format**:
  - `bun run lint:fix` (Run all linters and fix issues)
  - `bun run format` (Format code with Prettier and Trunk)
- **Testing**:
  - `bun run test` (Unit tests via Vitest)
  - `bun run test:e2e` (E2E tests via Playwright)

## 📂 Project Structure

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
- **`shared/`**: Code shared between client and server.
- **`public/`**: Static files served at root (favicon, robots.txt).

## 🧩 Development Patterns

### Vue & TypeScript

- Use **Composition API** with `<script setup lang="ts">`.
- Rely on **auto-imports** for Nuxt composables (`useFetch`, `useRouter`) and directory-based imports (components, composables).
- Do not manually import components found in `app/components`.

### Styling

- **Tailwind CSS v4**: Use utility classes for layout and spacing.
- **DaisyUI**: Use component classes (e.g., `btn`, `card`) for UI elements.
- **Catppuccin Theme**: The app uses the Catppuccin Mocha theme.

### Data Fetching

- Use **`useFetch`** for data fetching in pages/components. It handles SSR hydration automatically.
  ```ts
  const { data } = await useFetch("/api/hello");
  ```

### Server API

- Create API routes in `server/api/`.
- Export a default event handler:
  ```ts
  export default defineEventHandler((event) => {
    return { message: "Hello" };
  });
  ```

## 🛠 Tooling & Configuration

- **Trunk**: Manages linting and formatting tools. Use `bun run lint:fix` to ensure compliance.
- **Wrangler**: Handles Cloudflare deployment. Configured in `wrangler.jsonc`.
- **Nuxt Config**: Located in `nuxt.config.ts`.
- **TypeScript**: Strict mode is enabled. Ensure types are valid.

## ⚠️ Gotchas

- **Nuxt 4**: This project uses Nuxt 4. Nuxt 3 documentation might differ significantly (e.g., `app/` directory usage).
