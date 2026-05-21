import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/cypress/**",
      "**/.{idea,git,cache,output,temp}/**",
      "**/{karma,rollup,webpack,vite,vitest,jest,ava,tsup,build,farm}.config.*",
      "**/.trunk/**",
      "**/.nuxt/**",
      "**/.nitro/**",
      "**/.wrangler/**",
      "**/.data/**",
      "**/tests/e2e/**",
    ],
  },
});
