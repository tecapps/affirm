<script setup lang="ts">
async function handleLogin() {
  try {
    console.log("Start Fetch");
    const res = await $fetch("/api/insertSample", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: {},
    });
    console.log("Fetch Complete");
    console.log(res);
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
