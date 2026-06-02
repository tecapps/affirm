import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  password: text("password"), // TODO: make this not null in prod
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});
export const businesses = sqliteTable("businesses", {});

export const tags = sqliteTable("tags", {});

export const locations = sqliteTable("locations", {});

export const responses = sqliteTable("responses", {});

export const questions = sqliteTable("questions", {});
