# Fixes

## `argon2`

The `argon2` package is `node-gyp` based. I've swapped it out for `hash-wasm` which should run on Workers and adapted the code.

## `ApiResponse` type

I've created a unified type for API responses, including an `error` boolean.

## `/api/hello` -> `/api/ping`

Repurposed the `hello` endpoint as a simple `ping` responder.

## Removal of `insertSample`

This was a dev artifact. If you need it back it will be in the commit log.

## `dotenv` doesn't work on Workers

You can use `.dev.vars` (or `.env` through `mise`) instead. You don't need to instantiate it inside the code and it's not in `package.json`. It only works because it's a transitive dependency.

What I do is use 1Password's env management and mount the fifo on `.env` and `.dev.vars`.

## Env vars should not be read from `process.env`

Use `event.context.cloudflare.env.SECRET` instead. It'll work for local dev too.

With `hash-wasm` we don't even need a static `SECRET`, so it's gone.

## Tests

We don't have any. That's fine for now, but we need to build a test suite with `vitest`.

## We don't actually log a user in

There are no cookies or code to validate them. Login tells you if it succeeds or not, but doesn't give the user anything to prove they're logged in as they make requests. I haven't addressed this, just wanted to flag it for next steps.

## Security

### User enumeration via response differentiation

`login.post.ts` returns three distinct messages:

- `"success, login was validated , you are a user"` with valid creds
- `"Wrong password try again"` user exists, wrong password
- `"No login found try again"` no such user

An attacker scripting against `/api/login` can enumerate which emails are registered just by reading the response. This is the classic _"sign up to see if you're already a member"_ leak, except here it's a free API endpoint.

Simple fix. Just return a failed login or a successful one.

### User enumeration via timing

Even if messages are equalised, the **time profile differs**: the "no such user" branch returns immediately after a SELECT, while the "wrong password" branch runs an argon2 verify (~tens to hundreds of ms by design). An attacker can distinguish on response time alone.

This one is low priority, so I haven't addressed it.

### Same issues with registration

Same enumeration on registration. `register.post.ts` returns `"hello from the server! You are already registered!"` if the email is taken

This is the same leak from the other direction.

I've expanded the type to allow `error: undefined` when we don't want to tell the user whether it worked or not. The same timing issue applies.

### `console.log` ALL THE THINGS

Privileged information was being reported to the log. That's gone.

### No input validation

Neither endpoint validates input. **Types do not mean validation**. `body.email` could be `null`, an array, a 50 MB string, or `{ $ne: null }`-style payload. Drizzle + parameterised D1 queries make SQL injection a non-issue here, but you can still crash the handler or burn CPU.

**Fix**: use `readValidatedBody` with Zod:

```ts
const body = await readValidatedBody(
  event,
  z.object({
    email: z.string().email().max(254),
    password: z.string().min(8).max(128),
    name: z.string().min(1).max(100).optional(),
  }).parse,
);
```

Preferably define the schema elsewhere and import it so that it can be reused.

### No rate limiting / CSRF

Both are out of scope for a "starting" branch, but worth noting:

- No rate limiting on `/api/login` means a trivial credential stuffing target. Cloudflare has [Rate Limiting Rules](https://developers.cloudflare.com/waf/rate-limiting-rules/) for free, we can do this in ops rather than code.
- The forms are unauthenticated state-changing POSTs without CSRF tokens. Workable for a JSON-only API if we enforce a custom header check, but the current code doesn't.

## Frontend

> These have been left unfixed, as they're out of scope for backend and just necessary for testing.

### Vue: don't `document.getElementById` in `<script setup>`

`login.vue` and `register.vue` both do:

```ts
const email = document.getElementById("email") as HTMLInputElement;
```

This works because the handler runs after hydration, but it's anti-idiomatic in Vue 3 — it bypasses reactivity, defeats Volar's type-checking on the template, and fails outright in SSR contexts. The Vue way:

```vue
<script setup lang="ts">
const email = ref("");
const password = ref("");

async function handleLogin() {
  if (!email.value || !password.value) return;
  const res = await $fetch("/api/login", {
    method: "POST",
    body: { email: email.value, password: password.value },
  });
  // …
}
</script>

<template>
  <form @submit.prevent="handleLogin">
    <input v-model="email" type="email" required />
    <input v-model="password" type="password" required />
    <button>Login</button>
  </form>
</template>
```

Bonus: `type="email"` + `required` gives you free browser validation, and `v-model` is automatically two-way bound.

### The `as HTMLInputElement` ladder in `register.vue`

```ts
const name =
  (document.getElementById("name") as HTMLInputElement)?.value != null
    ? (document.getElementById("name") as HTMLInputElement)
    : { value: "noname" };
```

- `document.getElementById("name")` is called twice (minor: cache it).
- `.value` on an `<input>` is a `string`, never `null`. The condition is always true when the element exists.
- The fallback `{ value: "noname" }` is therefore dead code in practice.
- Empty-string `name` still flows through.

Refactor with `ref()` and a default: `const name = ref("noname")`, then `v-model="name"`.
