import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  username: text("username").notNull().unique(),
  name: text("name").notNull(),
  password: text("password").notNull(),
  businessRepresentative: integer("businessRepresentative", { mode: "boolean" }).default(false),
  business: integer("businessRepresentative")
    .default(0)
    .references(() => businesses.id),
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

export const tags = sqliteTable("tags", {});

export const locations = sqliteTable("locations", {});

export const responses = sqliteTable("responses", {});

export const questions = sqliteTable("questions", {});
