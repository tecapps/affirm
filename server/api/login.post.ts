/**
 * POST /api/login
 *
 * Needs to take the password from the login page and encrypt it into argon2 for storage
 * Gotta figure out how to pass the password from the login
 */
import { users } from "#server/database/schema";
import { eq } from "drizzle-orm";
import * as argon2 from "argon2";
import * as dotenv from "dotenv";
dotenv.config();

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
  console.log(result);
  if (result?.password) {
    const check = await argon2.verify(result.password, body.password, {
      secret: Buffer.from(process.env.SECRET),
    });
    console.log(check);
    if (check) {
      return { Message: "success, login was validated , you are a user" };
    } else return { Message: "Wrong password try again" };
  }
  return {
    message: capitalize("No login found try again"),
  };
});
