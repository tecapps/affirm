# Copilot Instructions for Affirm

## Project Overview

This is a **Nuxt 4** web application deployed to **Cloudflare Workers**. It uses **Bun** as the package manager and runtime, **TypeScript** in strict mode, **Tailwind CSS v4** with **DaisyUI** components, and the **Catppuccin Mocha** theme.

## Tech Stack

- **Framework**: Nuxt 4 (Vue 3 with Composition API)
- **Runtime**: Cloudflare Workers (Nitro server)
- **Package Manager**: Bun 1.3.8
- **Languages**: TypeScript (strict mode), Vue SFC
- **Styling**: Tailwind CSS v4, DaisyUI components, Catppuccin Mocha theme
- **Database**: Cloudflare D1 (SQLite) with Drizzle ORM
- **Testing**: Vitest (unit), Playwright (E2E)
- **Linting**: ESLint, Trunk, Prettier

## Essential Commands

Always use `bun` for package management and script execution:

- **Install**: `bun install`
- **Dev**: `bun dev` (starts on http://localhost:3000)
- **Build**: `bun run build` (for Cloudflare)
- **Test**: `bun run test` (Vitest), `bun run test:e2e` (Playwright)
- **Lint**: `bun run lint:fix` (fixes all linting issues)
- **Format**: `bun run format` (Prettier + Trunk)
- **Type Check**: `bun run lint:types`

## Project Structure

- **`app/`**: Main Vue application source (Nuxt 4 directory structure)
  - `pages/`: File-based routing
  - `components/`: Auto-imported Vue components
  - `composables/`: Auto-imported state/logic
  - `layouts/`: Page layouts
  - `middleware/`: Route middleware
  - `assets/`: CSS and static assets
- **`server/`**: Nitro server backend
  - `api/`: API endpoints (e.g., `/api/hello`)
- **`shared/`**: Code shared between client and server
- **`public/`**: Static files served at root
- **`drizzle/`**: Database migrations

## Coding Standards

### Vue & TypeScript

- **ALWAYS** use Composition API with `<script setup lang="ts">`
- **NEVER** manually import components from `app/components` (auto-imported by Nuxt)
- Rely on auto-imports for Nuxt composables: `useFetch`, `useRouter`, `useState`, etc.
- TypeScript strict mode is enabled - ensure all types are valid
- **NEVER** use `any` type - use proper TypeScript types or `unknown` with type guards

### Styling

- Use **Tailwind CSS v4** utility classes for layout and spacing
- Use **DaisyUI** component classes (e.g., `btn`, `card`, `modal`, `dropdown`) for UI elements
- The app uses **Catppuccin Mocha** theme - respect existing color palette
- Keep styles consistent with existing patterns

### Data Fetching

- Use `useFetch` for data fetching in pages/components (handles SSR hydration)
  ```ts
  const { data } = await useFetch("/api/hello");
  ```
- For server-side API routes, use `defineEventHandler`:
  ```ts
  export default defineEventHandler((event) => {
    return { message: "Hello" };
  });
  ```

### Database

- Use Drizzle ORM for database operations
- Database is Cloudflare D1 (SQLite)
- Migrations are in `drizzle/migrations/`
- Run migrations: `bun run db:migrate`

## Testing

- Unit tests: Vitest in `*.test.ts` or `*.spec.ts` files
- E2E tests: Playwright in `tests/` directory
- **ALWAYS** write tests for new features
- Run tests before committing: `bun run test`

## Linting & Formatting

- **ALWAYS** run `bun run lint:fix` before committing
- Trunk manages linting and formatting tools
- Prettier handles code formatting
- ESLint enforces code quality
- All code must pass type checking: `bun run lint:types`

## Git & Deployment

- Work in branches named `username/purpose` (e.g., `daveio/fix-header`)
- **ALWAYS** sign commits (use SSH key signing)
- Two PR approvals required for merge to `main`
- Deployment is automatic via GitHub Actions
- Each branch gets its own `workers.dev` URL for testing

## Don'ts

- **DON'T** use NuxtUI (we use DaisyUI instead)
- **DON'T** manually import auto-imported components or composables
- **DON'T** use `any` in TypeScript
- **DON'T** commit without running linters: `bun run lint:fix`
- **DON'T** use `npm` or `yarn` - always use `bun`
- **DON'T** force push or rebase (branch protection prevents this)

## Special Considerations

- **Nuxt 4** has different patterns than Nuxt 3 (e.g., `app/` directory)
- Auto-imports are configured - check `.nuxt/imports.d.ts` if unsure
- Cloudflare Workers have size and runtime limitations
- Use Nuxt Content for markdown-based content pages

## Further Reading

- See `README.md` for detailed development guide
- Nuxt 4 docs: https://nuxt.com/docs
- Tailwind CSS v4: https://tailwindcss.com
- DaisyUI: https://daisyui.com
- Cloudflare Workers: https://developers.cloudflare.com/workers
