<script setup lang="ts">
async function handleLogin() {
  const email = document.getElementById("email") as HTMLInputElement;
  const password = document.getElementById("password") as HTMLInputElement;
  try {
    console.log("Start Fetch"); //Browser has these
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
  <form @submit.prevent="handleLogin">
    <fieldset class="fieldset">
      <legend class="fieldset-legend">Login Page</legend>
      <label class="label">Email</label>
      <input id="email" type="text" class="input" placeholder="email@example.com" />

      <label class="label">Password</label>
      <input id="password" type="text" class="input" placeholder="password" />

      <button class="btn">Login</button>
    </fieldset>
  </form>
</template>
