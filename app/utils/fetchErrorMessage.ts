/**
 * Returns the user-facing message from a failed `$fetch` call.
 *
 * Server handlers throw `createError({ statusMessage })`, which arrives in the response body as
 * `data.statusMessage`. Anything else (network failure, unexpected throw) gets `fallback`.
 */
export function fetchErrorMessage(error: unknown, fallback: string): string {
  const statusMessage = (error as { data?: { statusMessage?: unknown } } | null)?.data?.statusMessage;
  return typeof statusMessage === "string" && statusMessage ? statusMessage : fallback;
}
