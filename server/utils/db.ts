import { drizzle } from "drizzle-orm/d1";
import type { H3Event } from "h3";
import * as schema from "../database/schema";

export type Database = ReturnType<typeof drizzle<typeof schema>>;

export function useDB(event: H3Event): Database {
  return drizzle(event.context.cloudflare.env.DB, { schema });
}
