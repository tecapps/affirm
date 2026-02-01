/**
 * Composable that returns reactive app metadata.
 *
 * Composables in `app/composables/` are auto-imported everywhere in your Nuxt
 * app — you never need to write `import { useAppInfo } from '...'`.
 *
 * `ref` creates a reactive mutable value; `computed` derives a read-only
 * reactive value that updates automatically when its dependencies change.
 */
import pkg from "../../package.json";

export function useAppInfo() {
  const appName = ref("Affirm");
  const version = ref(pkg.version);

  const greeting = computed(() => `Welcome to ${appName.value} ${version.value}`);

  return { appName, version, greeting };
}
