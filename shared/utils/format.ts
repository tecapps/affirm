/**
 * Capitalize the first letter of a string.
 *
 * This utility lives in `shared/` so it is auto-imported in both the
 * Nuxt app (client + SSR) and the Nitro server — no manual imports needed.
 */
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}
