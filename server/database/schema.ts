import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  username: text("username").notNull().unique(),
  name: text("name").notNull(),
  password: text("password").notNull(),
  businessRepresentative: integer("businessRepresentative", { mode: "boolean" }).default(false),
  business: integer("business").references(() => businesses.id),
  verified: integer("verified", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date()),
});
export const businesses = sqliteTable("businesses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
});
// Per-account login throttle: one row per submitted email, counting attempts in a fixed window.
export const loginAttempts = sqliteTable("login_attempts", {
  email: text("email").primaryKey(),
  attempts: integer("attempts").notNull(),
  windowStartedAt: integer("window_started_at", { mode: "timestamp_ms" }).notNull(),
});

// export const tags = sqliteTable("tags", {});

// export const locations = sqliteTable("locations", {});

// export const responses = sqliteTable("responses", {});

// export const questions = sqliteTable("questions", {});
