/*
 * we no longer use bun.
 * node can run typescript directly now assuming it's strippable syntax.
 * node scripts/test.ts
 * */
/* this doesn't really work for testing the database I'll be honest
  import { users } from '#server/database/schema';
  import { useDB } from "../server/utils/db";
  const _db = useDB();
*/
//const _select = await db.select().from(users).all();
console.log("hello world");
