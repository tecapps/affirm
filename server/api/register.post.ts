/**
 * POST /api/login
 *
 * Needs to take the password from the login page and encrypt it into argon2 for storage
 * Gotta figure out how to pass the password from the login
 */
import type { ApiResponse } from "~~/shared/types";
import { users } from "#server/database/schema";
import { eq } from "drizzle-orm";
import { argon2id } from "hash-wasm";

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
    if (typeof body.username !== "string" || !body.username.trim()) {
      throw createError({ statusCode: 400, statusMessage: "Username is required" });
    }
    const usernameTaken = (await db.select({ id: users.id }).from(users).where(eq(users.username, body.username)))?.[0];
    if (usernameTaken) {
      throw usernameTakenError();
    }
    console.log("inserting new user");
    const salt = new Uint8Array(16); // allocate salt buffer of 16 bytes
    crypto.getRandomValues(salt); // fill salt with random bytes
    const hash = await argon2id({
      password: body.password,
      salt,
      parallelism: 1,
      iterations: 32, // 32 iterations takes about 1 second on my machine
      memorySize: 2 ** 16,
      hashLength: 32, // output size = 32 bytes
      outputType: "encoded", // return standard encoded string containing parameters needed to verify the key
    });
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
