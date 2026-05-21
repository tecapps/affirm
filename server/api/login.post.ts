/**
 * POST /api/login
 *
 * Needs to take the password from the login page and encrypt it into argon2 for storage
 * Gotta figure out how to pass the password from the login
 */
import { users } from "#server/database/schema";
import { eq } from "drizzle-orm";
import { argon2Verify } from "hash-wasm";
import type { ApiResponse } from "~~/shared/types";

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

export default defineEventHandler(async (request) => {
  const db = useDB(request);
  const body = await readBody(request);
  const result = (await db.select().from(users).where(eq(users.email, body.email)))[0];
  if (result?.password) {
    const check = await argon2Verify({
      password: body.password,
      hash: result.password,
    });
    if (check) {
      return {
        error: false,
        message: `${body.email} logged in`,
      } as ApiResponse;
    }
  }
  return {
    error: true,
    message: `${body.email} failed login`,
  } as ApiResponse;
});
