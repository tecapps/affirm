import { defineConfig, devices } from "@playwright/test";

/**
 * End-to-end tests run against `nuxt dev`, which emulates the Worker bindings
 * (including the local D1 database) through Nitro's cloudflare-dev preset.
 *
 * A dedicated port keeps the suite from reusing a dev server that another
 * checkout or worktree already has running on the default port 3000.
 */
const e2ePort = 3010;
const e2eBaseUrl = `http://localhost:${e2ePort}`;
const runningInCi = Boolean(process.env.CI);

export default defineConfig({
  testDir: "./tests/e2e",
  forbidOnly: runningInCi,
  retries: runningInCi ? 2 : 0,
  reporter: runningInCi ? "github" : "list",
  use: {
    baseURL: e2eBaseUrl,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    // Apply local D1 migrations first so database-backed routes work on a fresh clone.
    command: `pnpm run db:migrate && pnpm exec nuxt dev --port ${e2ePort}`,
    url: `${e2eBaseUrl}/api/ping`,
    reuseExistingServer: !runningInCi,
    timeout: 180_000,
  },
});
