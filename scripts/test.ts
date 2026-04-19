/*
 * bun test.ts and you can run standalone type script
 *
 * */
import { users } from "#server/database/schema";
import { useDB } from "../server/utils/db";
const db = useDB();
const select = await db.select().from(users).all();
console.log("hello world");
