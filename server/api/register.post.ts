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

export default defineEventHandler(async (event) => {
  const db = useDB(event);
  console.log("----------------------------------------------");
  const body = await readBody(event);
  const select = (await db.select().from(users).where(eq(users.email, body.email)))?.[0];
  console.log(select);
  if (select) {
    console.log("Already registered");
    return {
      message: capitalize("hello from the server! You are already registered!"),
    };
  } else {
    console.log("no such email");
    const hash = await argon2.hash(body.password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      timeCost: 4,
      secret: Buffer.from(process.env.SECRET),
    });
    const insert = await db.insert(users).values({ name: body.name, email: body.email, password: hash });
    if (insert) {
      console.log("Insert complete " + insert);
    }
  }

  console.log("registration finished");
  return {
    message: capitalize("hello from the server! This was returned from the API. SUCCESS!"),
  };
});
