/**
 * POST /api/login
 *
 * Needs to take the password from the login page and encrypt it into argon2 for storage
 * Gotta figure out how to pass the password from the login
 */
import * as argon2 from "argon2";

const password = "password";
const hash = await argon2.hash(password);

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

export default defineEventHandler((request) => {
  console.log("POST LOGIN API was here");
  console.log(request);
  console.log(hash);
  console.log("Finished login");
  return {
    message: capitalize("hello from the server! This was returned from the API." + request),
  };
});
