/**
 * POST /api/register
 *
 * Needs to take the password from the login page and hash it with scrypt for storage
 * Gotta figure out how to pass the password from the login
 */
import type { ApiResponse } from "~~/shared/types";
import { users } from "#server/database/schema";
import { eq } from "drizzle-orm";

//const dataBaseHash = await query();
/*try {
  if (await argon2.verify("<big long hash>", "password")) {
    // password match
  } else {
    // password did not match
  }
} catch (err) {
  // internal failure
*/

const usernameTakenError = () => createError({ statusCode: 409, statusMessage: "Username already taken" });

export default defineEventHandler(async (event) => {
  const db = useDB(event);
  const body = await readBody(event);
  const select = (await db.select().from(users).where(eq(users.email, body.email)))?.[0];
  if (!select) {
    if (typeof body.password !== "string" || !body.password) {
      throw createError({ statusCode: 400, statusMessage: "Password is required" });
    }
    if (typeof body.username !== "string" || !body.username.trim()) {
      throw createError({ statusCode: 400, statusMessage: "Username is required" });
    }
    const usernameTaken = (await db.select({ id: users.id }).from(users).where(eq(users.username, body.username)))?.[0];
    if (usernameTaken) {
      throw usernameTakenError();
    }
    console.log("inserting new user");
    const hash = await hashPassword(body.password);
    try {
      await db.insert(users).values({
        name: body.name,
        email: body.email,
        username: body.username,
        password: hash,
      });
    } catch (error) {
      // Concurrent requests can both pass the lookups above while hashing; the unique indexes are the real guard.
      const cause = error instanceof Error && error.cause instanceof Error ? error.cause.message : "";
      if (cause.includes("UNIQUE constraint failed: users.username")) {
        throw usernameTakenError();
      }
      // A taken email gets the same response as the existing-email path below.
      if (!cause.includes("UNIQUE constraint failed: users.email")) {
        throw error;
      }
    }
    console.log("inserted inserted");
  }
  return {
    error: undefined,
    message: `${body.email} attempted registration`,
  } as ApiResponse;
});
