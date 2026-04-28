<script setup lang="ts">
async function handleRegister() {
  const email = document.getElementById("email") as HTMLInputElement;
  const password = document.getElementById("password") as HTMLInputElement;
  console.log(email?.value);
  console.log(password?.value);
  try {
    console.log("Start Fetch"); //Browser has these
    if (email?.value && password?.value) {
      const res = await $fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: { email: email.value, password: password.value },
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
  <form @submit.prevent="handleRegister">
    <fieldset class="fieldset">
      <legend class="fieldset-legend">Register Page</legend>
      <label class="label">Email</label>
      <input id="email" type="text" class="input" placeholder="email@example.com" />

      <label class="label">Password</label>
      <input id="password" type="password" class="input" placeholder="password" />

      <button class="btn">Register</button>
    </fieldset>
  </form>
</template>
