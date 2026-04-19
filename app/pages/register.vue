<script setup lang="ts">
async function handleRegister() {
  try {
    console.log("Start Fetch"); //Browser has these
    const res = await $fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: { email: "test@gmail.com", password: "pass" },
    });
    console.log("Fetch Complete");
    console.log(res);
  } catch (error) {
    console.error("Register failed:", error);
  }
}
</script>

<template>
  <form @submit.prevent="handleRegister">
    <fieldset class="fieldset">
      <legend class="fieldset-legend">Register Page</legend>
      <label class="label">Email</label>
      <input id="email" type="text" class="input" placeholder="email@example.com" />

      <label class="label">Password</label>
      <input id="password" type="text" class="input" placeholder="password" />

      <button class="btn">Register</button>
    </fieldset>
  </form>
</template>
