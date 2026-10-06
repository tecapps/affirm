<script setup lang="ts">
const { loggedIn } = useUserSession();
</script>

<template>
  <nav>
    <h1 class="mb-8 text-xl font-bold ml-4">Affirm</h1>
    <ul class="menu menu-lg w-full p-0">
      <li>
        <NuxtLink to="/" class="link link-hover" active-class="menu-active">Home</NuxtLink>
      </li>
      <li>
        <NuxtLink to="/about" class="link link-hover" active-class="menu-active">About</NuxtLink>
      </li>
      <li>
        <NuxtLink to="/list" class="link link-hover" active-class="menu-active">List</NuxtLink>
      </li>
      <li v-if="loggedIn">
        <NuxtLink to="/login" class="link link-hover" active-class="menu-active">Login</NuxtLink>
      </li>
      <li v-else>
        <NuxtLink to="/me" class="link link-hover" active-class="menu-active">Me</NuxtLink>
      </li>
    </ul>
  </nav>
</template>
