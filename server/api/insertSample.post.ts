import { drizzle } from "drizzle-orm/d1";
import { users } from "#server/database/schema";

type D1Database = any;

export interface Env {
  DB: D1Database;
}

export default {
  async fetch(request: Request, env: Env) {
    console.log("starting DB stuff");
    const db = drizzle(env.DB);
    await db.insert(users).values({ name: "selene", email: "selene.s.posada@gmail.com", password: "test" });
    const result = await db.select().from(users).all();
    console.log(result);
    // Default
    return new Response("Drizzle & D1 are live!");
  },
};
