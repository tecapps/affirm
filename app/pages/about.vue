<script setup lang="ts">
/**
 * About page — demonstrates file-based routing and composable reuse.
 *
 * This file at `app/pages/about.vue` automatically maps to the `/about` route.
 * No router configuration is needed — Nuxt reads the file tree and generates
 * the route table at build time.
 */
const { appName, version } = useAppInfo();
</script>

<template>
  <div class="prose mx-auto">
    <h1>About {{ appName }}</h1>
    <p>
      <strong>{{ appName }}</strong> (v{{ version }}) is a Nuxt 4 application deployed to Cloudflare Workers. It uses
      Tailwind CSS v4 with DaisyUI v5 for styling.
    </p>

    <h2>Project Structure</h2>
    <ul>
      <li><code>app/pages/</code> — File-based routing</li>
      <li><code>app/components/</code> — Auto-imported Vue components</li>
      <li><code>app/composables/</code> — Shared reactive logic</li>
      <li><code>app/layouts/</code> — Page wrapper templates</li>
      <li><code>app/middleware/</code> — Route guards and logging</li>
      <li><code>app/plugins/</code> — App-wide initialisation</li>
      <li><code>server/api/</code> — Nitro API endpoints</li>
      <li><code>shared/</code> — Code shared between app and server</li>
    </ul>

    <NuxtLink to="/" class="btn btn-outline mt-4">Back Home</NuxtLink>
  </div>
</template>
