<script setup lang="ts">
const email = ref("");
const password = ref("");
const name = ref("");
async function handleRegister() {
  try {
    console.log("Start Fetch");
    if (email?.value && password?.value) {
      const res = await $fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: { email: email.value, password: password.value, name: name.value },
      });
      console.log("Fetch Complete");
      console.log(res);
    } else {
      console.log("Nothing to insert");
    }
  } catch (error) {
    console.error("Register failed:", error);
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 mt-4">
    <h1 class="text-xl my-8">Create an account</h1>
    <form class="w-full" @submit.prevent="handleRegister">
      <fieldset
        class="fieldset bg-base-200 border-base-300 border rounded-box w-full p-4 flex flex-col justify-stretch gap-4"
      >
        <legend class="sr-only">Register Page</legend>
        <UiInput v-model="email" label="Email" placeholder="email@example.com" />
        <UiInput v-model="name" label="Name" placeholder="Socks Smith" />
        <UiInput v-model="password" label="Password" type="password" placeholder="password" />

        <UiButton is-submit type="primary" class="mt-8">Register</UiButton>
      </fieldset>
    </form>
    <span class="text-secondary-content text-xs">or</span>
    <UiButton to="/login" type="secondary">Already have an account? Login</UiButton>
  </div>
</template>
