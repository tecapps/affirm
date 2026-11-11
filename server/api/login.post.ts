/**
 * POST /api/login
 *
 * Needs to take the password from the login page and verify it against the stored scrypt hash
 * Gotta figure out how to pass the password from the login
 */
import { users } from "#server/database/schema";
import { eq } from "drizzle-orm";
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
  await assertLoginSourceAllowed(request);
  const db = useDB(request);
  const body = await readBody(request);
  if (typeof body?.email !== "string" || typeof body.password !== "string") {
    throw createError({ statusCode: 400, statusMessage: "Email and password are required" });
  }
  await assertLoginAccountAllowed(db, body.email);
  const result = (await db.select().from(users).where(eq(users.email, body.email)))[0];
  if (result?.password) {
    const check = await verifyPassword(result.password, body.password);
    if (check) {
      await clearLoginAttempts(db, body.email);
      if (passwordNeedsReHash(result.password)) {
        await db
          .update(users)
          .set({ password: await hashPassword(body.password) })
          .where(eq(users.id, result.id));
      }
      const message = { ...result };
      message.password = "";

      await setUserSession(request, {
        user: message,
      });

      return {
        status: 200,
        error: false,
        message,
      } as ApiResponse;
    }
  }

  // !!todo use express to set http status codes
  return {
    status: 401,
    error: true,
    message: `${body.email} failed login`,
  } as ApiResponse;
});
