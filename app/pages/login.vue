<script setup lang="ts">
//Browser has the console logs not the server
async function handleLogin() {
  const email = document.getElementById("email") as HTMLInputElement;
  const password = document.getElementById("password") as HTMLInputElement;
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
  <form @submit.prevent="handleLogin" class="card card-border card-sm mb-8">
    <div class="card-body">
      <fieldset class="fieldset">
        <legend class="fieldset-legend">Login Page</legend>
        <label class="label">Email</label>
        <input id="email" type="text" class="input" placeholder="email@example.com" />

        <label class="label">Password</label>
        <input id="password" type="password" class="input" placeholder="password" />

        <UiButton isSubmit type="primary" class="mt-8">Login</UiButton>
      </fieldset>
    </div>
  </form>
  <UiButton to="/register" type="secondary">New? Create an account</UiButton>
</template>
