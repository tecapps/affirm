<script setup lang="ts">
/**
 * Home page — demonstrates composables, components, and server data fetching.
 *
 * `useAppInfo()` is auto-imported from `app/composables/`.
 * `useFetch` is a Nuxt composable that fetches data during SSR and hydrates
 * on the client — no loading spinners needed for the initial render.
 */
const { greeting } = useAppInfo();
const { data: hello } = await useFetch("/api/hello");
</script>

<template>
  <div class="space-y-8">
    <section class="text-center py-8">
      <h1 class="text-4xl font-bold">{{ greeting }}</h1>
      <p v-if="hello" class="mt-2 text-lg opacity-70">Server says: {{ hello.message }}</p>
    </section>

    <section class="grid gap-6 md:grid-cols-3">
      <FeatureCard
        title="File-Based Routing"
        description="Pages in app/pages/ automatically become routes. No router config needed."
      />
      <FeatureCard
        title="Auto-Imports"
        description="Composables, components, and utilities are auto-imported — zero boilerplate."
      />
      <FeatureCard
        title="Server API"
        description="Drop a .ts file in server/api/ and you have a type-safe API endpoint."
      >
        <NuxtLink to="/about" class="btn btn-primary btn-sm">Learn More</NuxtLink>
      </FeatureCard>
    </section>
  </div>
</template>
