<script setup lang="ts">
/**
 * About page — demonstrates file-based routing and composable reuse.
 *
 * This file at `app/pages/about.vue` automatically maps to the `/about` route.
 * No router configuration is needed — Nuxt reads the file tree and generates
 * the route table at build time.
 */
const { appName, version } = useAppInfo();

const techStack = [
  { name: "Nuxt 4", icon: "logos:nuxt-icon", description: "The Intuitive Vue Framework" },
  { name: "Vue 3", icon: "logos:vue", description: "Progressive JavaScript Framework" },
  { name: "Tailwind CSS 4", icon: "logos:tailwindcss-icon", description: "Utility-First CSS" },
  { name: "DaisyUI 5", icon: "logos:daisyui-icon", description: "Component Library" },
  { name: "Cloudflare Workers", icon: "logos:cloudflare-icon", description: "Edge Deployment" },
  { name: "TypeScript", icon: "logos:typescript-icon", description: "Type-Safe Development" },
];

const projectStructure = [
  { path: "app/pages/", desc: "File-based routing", icon: "heroicons:document-text", color: "primary" },
  { path: "app/components/", desc: "Auto-imported Vue components", icon: "heroicons:cube", color: "secondary" },
  { path: "app/composables/", desc: "Shared reactive logic", icon: "heroicons:arrow-path", color: "accent" },
  { path: "app/layouts/", desc: "Page wrapper templates", icon: "heroicons:rectangle-group", color: "info" },
  { path: "app/middleware/", desc: "Route guards and logging", icon: "heroicons:shield-check", color: "warning" },
  { path: "app/plugins/", desc: "App-wide initialisation", icon: "heroicons:puzzle-piece", color: "success" },
  { path: "server/api/", desc: "Nitro API endpoints", icon: "heroicons:server", color: "error" },
  { path: "shared/", desc: "Code shared between app and server", icon: "heroicons:share", color: "primary" },
];
</script>

<template>
  <div class="space-y-12">
    <!-- Hero Section -->
    <section class="hero min-h-[30vh] bg-gradient-to-br from-base-200 to-base-300 rounded-2xl">
      <div class="hero-content text-center">
        <div class="max-w-2xl">
          <div class="mb-4">
            <span class="badge badge-secondary badge-lg">v{{ version }}</span>
          </div>
          <h1
            class="text-5xl md:text-6xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent"
          >
            About {{ appName }}
          </h1>
          <p class="mt-6 text-lg opacity-80">
            A modern Nuxt 4 application deployed to Cloudflare Workers, styled with Tailwind CSS v4, DaisyUI v5, and the
            Catppuccin Mocha colour palette.
          </p>
        </div>
      </div>
    </section>

    <!-- Tech Stack Section -->
    <section>
      <h2 class="text-3xl font-bold text-center mb-8">Tech Stack</h2>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div
          v-for="tech in techStack"
          :key="tech.name"
          class="card bg-base-100 shadow-md hover:shadow-xl transition-shadow duration-300 border border-base-300"
        >
          <div class="card-body items-center text-center p-4">
            <Icon :name="tech.icon" size="2rem" />
            <h3 class="font-semibold text-sm mt-2">{{ tech.name }}</h3>
            <p class="text-xs opacity-60">{{ tech.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Project Structure Section -->
    <section>
      <h2 class="text-3xl font-bold text-center mb-8">Project Structure</h2>
      <div class="grid gap-3 md:grid-cols-2">
        <div
          v-for="item in projectStructure"
          :key="item.path"
          class="flex items-center gap-4 p-4 rounded-xl bg-base-100 shadow-sm hover:shadow-md transition-shadow duration-300 border border-base-300"
        >
          <div :class="`text-${item.color}`">
            <Icon :name="item.icon" size="1.5rem" />
          </div>
          <div>
            <code class="text-sm font-bold">{{ item.path }}</code>
            <p class="text-sm opacity-70">{{ item.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Navigation -->
    <section class="text-center">
      <NuxtLink to="/" class="btn btn-outline btn-primary">
        <Icon name="heroicons:arrow-left" size="1.2rem" />
        Back Home
      </NuxtLink>
    </section>
  </div>
</template>
