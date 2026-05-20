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

export default defineEventHandler(async (event) => {
  const db = useDB(event);
  const body = await readBody(event);
  const select = (await db.select().from(users).where(eq(users.email, body.email)))?.[0];
  if (!select) {
    const salt = new Uint8Array(16); // allocate salt buffer of 16 bytes
    crypto.getRandomValues(salt); // fill salt with random bytes
    const hash = await argon2id({
      password: body.password,
      salt,
      parallelism: 1,
      iterations: 256,
      memorySize: 2 ** 16,
      hashLength: 32, // output size = 32 bytes
      outputType: "encoded", // return standard encoded string containing parameters needed to verify the key
    });
    const _insert = db.insert(users).values({ name: body.name, email: body.email, password: hash });
  }
  return {
    error: undefined,
    message: `${body.email} attempted registration`,
  } as ApiResponse;
});
