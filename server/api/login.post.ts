/**
 * POST /api/login
 *
 * Needs to take the password from the login page and encrypt it into argon2 for storage
 * Gotta figure out how to pass the password from the login
 */
import * as argon2 from "argon2";
const password = "password";
const hash = await argon2.hash(password);
console.log(hash);
export default defineEventHandler((data) => {
  return {
    message: capitalize("hello from the server! This was returned from the API." + data),
  };
});
