/**
 * Global Route Middleware — log
 *
 * The `.global.ts` suffix tells Nuxt to run this middleware on *every* route
 * navigation automatically. Named middleware (without `.global`) must be
 * explicitly assigned to pages via `definePageMeta({ middleware: ['name'] })`.
 */
export default defineNuxtRouteMiddleware((to, from) => {
  if (import.meta.client) {
    console.log(`[middleware] navigating from "${from.path}" to "${to.path}"`);
  }
});
