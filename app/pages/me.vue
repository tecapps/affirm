<script setup lang="ts">
definePageMeta({
  middleware: ["authenticated"],
});

const { user, clear: clearSession } = useUserSession();

async function logout() {
  await clearSession();
  await navigateTo("/login");
}
</script>

<template>
  <div class="space-y-12">
    <!-- Hero Section -->
    <section class="hero min-h-[30vh] bg-gradient-to-br from-base-200 to-base-300 rounded-2xl">
      <div class="hero-content text-center">
        <div class="max-w-2xl">
          <h1
            class="text-5xl md:text-6xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent"
          >
            Welcome, {{ user?.name }}!
          </h1>
        </div>
      </div>
    </section>

    <!-- Navigation -->
    <section class="text-center">
      <button class="btn btn-outline btn-primary" @click="logout">
        <Icon name="heroicons:arrow-left-start-on-rectangle" size="1.2rem" />
        Logout
      </button>
    </section>
  </div>
</template>
