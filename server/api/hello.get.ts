/**
 * GET /api/hello
 *
 * A sample Nitro API route. The `.get.ts` suffix restricts this handler to
 * HTTP GET requests only. Nuxt auto-registers every file under `server/api/`
 * as an API endpoint matching its file path.
 */
export default defineEventHandler(() => {
  return {
    message: capitalize("hello from the server!"),
  };
});
