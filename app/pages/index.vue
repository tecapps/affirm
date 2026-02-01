<script setup lang="ts">
/**
 * Home page — demonstrates composables, components, and server data fetching.
 *
 * `useAppInfo()` is auto-imported from `app/composables/`.
 * `useFetch` is a Nuxt composable that fetches data during SSR and hydrates
 * on the client — no loading spinners needed for the initial render.
 */
const { version } = useAppInfo();
const { data: hello } = await useFetch("/api/hello");
</script>

<template>
  <div class="space-y-12">
    <!-- Hero Section -->
    <section class="hero min-h-[40vh] bg-gradient-to-br from-base-200 to-base-300 rounded-2xl">
      <div class="hero-content text-center">
        <div class="max-w-2xl">
          <div class="mb-4">
            <span class="badge badge-primary badge-lg">v{{ version }}</span>
          </div>
          <h1 class="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Welcome to Affirm
          </h1>
          <p v-if="hello" class="mt-6 text-xl opacity-80">
            {{ hello.message }}
          </p>
          <p class="mt-4 text-lg opacity-70">
            A modern Nuxt 4 application with Cloudflare Workers deployment
          </p>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats stats-vertical lg:stats-horizontal shadow-lg w-full bg-base-100">
      <div class="stat">
        <div class="stat-figure text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block h-8 w-8 stroke-current">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div class="stat-title">Framework</div>
        <div class="stat-value text-primary">Nuxt 4</div>
        <div class="stat-desc">The Intuitive Vue Framework</div>
      </div>

      <div class="stat">
        <div class="stat-figure text-secondary">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block h-8 w-8 stroke-current">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
        </div>
        <div class="stat-title">Styling</div>
        <div class="stat-value text-secondary">Tailwind 4</div>
        <div class="stat-desc">+ DaisyUI Components</div>
      </div>

      <div class="stat">
        <div class="stat-figure text-accent">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block h-8 w-8 stroke-current">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
          </svg>
        </div>
        <div class="stat-title">Deployment</div>
        <div class="stat-value text-accent">Cloudflare</div>
        <div class="stat-desc">Workers & Pages</div>
      </div>
    </section>

    <!-- Feature Cards Section -->
    <section>
      <h2 class="text-3xl font-bold text-center mb-8">Core Features</h2>
      <div class="grid gap-6 md:grid-cols-3">
        <FeatureCard
          title="File-Based Routing"
          description="Pages in app/pages/ automatically become routes. No router config needed."
          badge="Core Feature"
          badge-color="primary"
        />
        <FeatureCard
          title="Auto-Imports"
          description="Composables, components, and utilities are auto-imported — zero boilerplate."
          badge="Auto-Magic"
          badge-color="secondary"
        />
        <FeatureCard
          title="Server API"
          description="Drop a .ts file in server/api/ and you have a type-safe API endpoint."
          badge="API Ready"
          badge-color="accent"
        >
          <NuxtLink to="/about" class="btn btn-primary btn-sm">Learn More</NuxtLink>
        </FeatureCard>
      </div>
    </section>
  </div>
</template>
