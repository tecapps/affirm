// import { drizzle } from "drizzle-orm/d1";
import { users } from "#server/database/schema";
import { eq } from "drizzle-orm";
// import { useDB } from "#server/utils/db";

// export interface Env {
//   DB: D1Database;

// export default defineEventHandler((request) => {
//   // console.log("starting DB stuff");
//   const db = useDB(event);
//
//
//   // console.log(result);
//   // Default
//   ;
// });

// export default defineEventHandler((event) => {
//   const db = useDB(event);
//   console.log("POST LOGIN API was here");
//   console.log(event);
//   console.log(hash);
//   console.log("Finished login");
//   return {
//     message: capitalize("hello from the server! This was returned from the API." + request + db),
//   };
// });

/**
 * POST /api/login
 *
 * Needs to take the password from the login page and encrypt it into argon2 for storage
 * Gotta figure out how to pass the password from the login

import { useDB } from "#server/utils/db"; // is this handled as an auto import or am I high?

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
  /*const insert = await db
    .insert(users)
    .values({ name: "selene", email: "selene.s.posada@gmail.com", password: "test" });*/
  const select = await db.select().from(users).where(eq(users.email, "selene.s.posada@gmail.com"));
  console.log(select);
  if (select.length > 0) console.log(select);
  else console.log("no such email");
  return {
    message: capitalize("hello from the server! This was returned from the API." + event),
    select,
  };
});
