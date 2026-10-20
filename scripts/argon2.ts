import { argon2id } from "hash-wasm";

console.log("inserting new user");
const salt = new Uint8Array(16); // allocate salt buffer of 16 bytes
crypto.getRandomValues(salt); // fill salt with random bytes
const hash = await argon2id({
  password: "password123",
  salt,
  parallelism: 1,
  iterations: 32,
  memorySize: 2 ** 16,
  hashLength: 32, // output size = 32 bytes
  outputType: "encoded", // return standard encoded string containing parameters needed to verify the key
});
console.log("hash", hash);
