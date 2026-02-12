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
      nodeCompat: true,
      wrangler: {
        d1_databases: [],
      },
    },
    cloudflareDev: {
      configPath: "./wrangler.dev.jsonc",
    },
  },
  vite: {
    plugins: [tailwindcss() as unknown as undefined],
  },
  modules: [
    "@nuxt/a11y",
    "@nuxt/content",
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/hints",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxt/scripts",
    "nitro-cloudflare-dev",
  ],
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
