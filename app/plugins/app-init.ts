/**
 * Nuxt Plugin — app-init
 *
 * Plugins in `app/plugins/` run once when the app starts (both server and
 * client). Use `nuxtApp.provide()` to inject a value that becomes available
 * everywhere via `useNuxtApp().$appName`.
 *
 * This pattern is useful for making third-party SDKs, feature flags, or
 * other singletons globally accessible.
 */
export default defineNuxtPlugin(() => {
  return {
    provide: {
      appName: "Affirm",
    },
  };
});
