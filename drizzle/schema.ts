import { sqliteTable, AnySQLiteColumn, integer, text, numeric, uniqueIndex } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const d1Migrations = sqliteTable("d1_migrations", {
  id: integer().primaryKey({ autoIncrement: true }),
  name: text(),
  appliedAt: numeric("applied_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});

export const metadata = sqliteTable(
  "metadata",
  {
    key: text().primaryKey().notNull(),
    value: text().notNull(),
  },
  (table) => [uniqueIndex("metadata_key_unique").on(table.key)],
);
