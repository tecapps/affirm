<script setup lang="ts">
const email = ref("");
const username = ref("");
const password = ref("");
const name = ref("");
const error = ref("");
async function handleRegister() {
  error.value = "";
  try {
    console.log("Start Fetch");
    if (email.value && password.value && username.value) {
      const res = await $fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: {
          email: email.value,
          username: username.value,
          password: password.value,
          name: name?.value,
        },
      });
      console.log("Fetch Complete");
      console.log(res);
    } else {
      error.value = "Enter your email, username and password";
    }
  } catch (err) {
    console.error("Register failed:", err);
    // createError's statusMessage arrives in the response body as data.statusMessage
    error.value = (err as { data?: { statusMessage?: string } }).data?.statusMessage || "Registration failed";
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
        <div v-if="error" role="alert" class="alert alert-error">
          <Icon name="heroicons:x-circle" size="1.5rem" />
          <span>{{ error }}</span>
        </div>
        <UiInput v-model="email" label="Email" placeholder="email@example.com" />
        <UiInput v-model="username" label="Username" placeholder="socks" />
        <UiInput v-model="name" label="Name" placeholder="Socks Smith" />
        <UiInput v-model="password" label="Password" type="password" placeholder="password" />

        <UiButton is-submit type="primary" class="mt-8">Register</UiButton>
      </fieldset>
    </form>
    <span class="text-secondary-content text-xs">or</span>
    <UiButton to="/login" type="secondary">Already have an account? Login</UiButton>
  </div>
</template>
