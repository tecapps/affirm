/**
 * Composable that returns reactive app metadata.
 *
 * Composables in `app/composables/` are auto-imported everywhere in your Nuxt
 * app — you never need to write `import { useAppInfo } from '...'`.
 *
 * `ref` creates a reactive mutable value; `computed` derives a read-only
 * reactive value that updates automatically when its dependencies change.
 */
export function useAppInfo() {
  const appName = ref("Affirm");
  const version = ref("0.1.0");

  const greeting = computed(() => `Welcome to ${appName.value} v${version.value}`);

  return { appName, version, greeting };
}
