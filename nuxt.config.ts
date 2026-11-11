import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2026-02-01",
  css: ["~/assets/css/tailwind.css"],
  devtools: { enabled: true },
  nitro: {
    preset: "cloudflare_module",
    cloudflare: {
      deployConfig: true,
      dev: {
        configPath: "./wrangler.dev.jsonc",
      },
      nodeCompat: true,
      wrangler: {
        d1_databases: [],
      },
    },
  },
  typescript: {
    nodeTsConfig: {
      compilerOptions: {
        types: ["node"],
      },
      // Type-check the Playwright config and end-to-end tests with the other Node-side files.
      include: ["../playwright.config.ts", "../tests/**/*.ts"],
    },
  },
  vite: {
    optimizeDeps: {
      include: ["@vue/devtools-core", "@vue/devtools-kit"],
    },
    plugins: [tailwindcss()],
  },
  modules: ["@nuxt/eslint", "@nuxt/fonts", "@nuxt/icon", "@nuxt/image", "@nuxt/scripts", "nuxt-auth-utils"],
  runtimeConfig: {
    hash: {
      // OWASP's N=2^14, r=8, p=5 tier: equal strength to N=2^17 but only 16 MiB, which fits the
      // 128 MB Worker memory limit. Costs ~80 ms CPU per hash, measured in workerd.
      scrypt: {
        cost: 2 ** 14,
        blockSize: 8,
        parallelization: 5,
        keyLength: 64,
        saltSize: 16,
        maxMemory: 32 * 1024 * 1024,
      },
    },
  },
  $env: {
    production: {
      nitro: {
        cloudflare: {
          wrangler: {
            d1_databases: [
              {
                binding: "DB",
                database_id: "cb7d337c-9e00-40e2-b597-00d7b8577409",
                database_name: "affirm",
                migrations_dir: "server/database/migrations",
              },
            ],
          },
        },
      },
    },
    staging: {
      nitro: {
        cloudflare: {
          wrangler: {
            d1_databases: [
              {
                binding: "DB",
                database_id: "1bb3778c-e922-4edc-8f86-dd25ce217b33",
                database_name: "affirm-staging",
                migrations_dir: "server/database/migrations",
              },
            ],
          },
        },
      },
    },
  },
});
