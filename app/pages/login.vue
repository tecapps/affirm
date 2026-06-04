<script setup lang="ts">
const email = ref("");
const password = ref("");

async function handleLogin() {
  try {
    console.log("Start Fetch");
    if (email?.value && password?.value) {
      const res = await $fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: { email: email.value, password: password.value },
      });
      console.log("Fetch Complete");
      console.log(res);
    } else console.log("Login Failed, empty input");
  } catch (error) {
    console.error("Login failed:", error);
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 mt-4">
    <h1 class="text-xl my-8">Login to your account</h1>
    <form class="w-full" @submit.prevent="handleLogin">
      <fieldset
        class="fieldset bg-base-200 border-base-300 border rounded-box w-full p-4 flex flex-col justify-stretch gap-4"
      >
        <legend class="sr-only">Login Page</legend>

        <UiInput v-model="email" label="Email" placeholder="email@example.com" />
        <UiInput v-model="password" label="Password" type="password" placeholder="password" />

        <UiButton is-submit type="primary" class="mt-8">Login</UiButton>
      </fieldset>
    </form>
    <span class="text-secondary-content text-xs">or</span>
    <UiButton to="/register" type="secondary">New? Create an account</UiButton>
  </div>
</template>
