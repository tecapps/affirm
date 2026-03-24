<script setup lang="ts">
async function handleLogin() {
  try {
    await console.log("Start Fetch");
    const res = await useFetch("/api/insertSample", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: {},
    });
    console.log("Fetch Complete"); //This doesnt work or log anywhere
    console.log(res); //This doesnt work or log anywhere
    //return res.data;
  } catch (e) {
    console.log(e.message);
  }
}
</script>

<template>
  <form @submit="handleLogin">
    <fieldset class="fieldset">
      <legend class="fieldset-legend">Login Page</legend>
      <label class="label">Email</label>
      <input id="email" type="text" class="input" placeholder="email@example.com" />

      <label class="label">Password</label>
      <input type="text" id="password" class="input" placeholder="password" />

      <button class="btn">Login</button>
    </fieldset>
  </form>
</template>
