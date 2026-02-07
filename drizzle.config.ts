import "dotenv/config";
import { defineConfig } from "drizzle-kit";

// TODO: We need to figure out how we deal with a staging database and local dev databases. The solution may be ditching Drizzle.

export default defineConfig({
  out: "./drizzle",
  schema: "./drizzle/schema.ts",
  dialect: "sqlite",
  driver: "d1-http",
  dbCredentials: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
    databaseId: process.env.CLOUDFLARE_DATABASE_ID!,
    token: process.env.CLOUDFLARE_D1_TOKEN!,
  },
});
