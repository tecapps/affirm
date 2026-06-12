<script setup lang="ts">
/**
 * Home page — demonstrates composables, components, and server data fetching.
 *
 * `useAppInfo()` is auto-imported from `app/composables/`.
 * `useFetch` is a Nuxt composable that fetches data during SSR and hydrates
 * on the client — no loading spinners needed for the initial render.
 */
import PlaceLink from "~/components/places/PlaceLink.vue";

const PLACES = useFakePlaceDataDeletMe();
</script>

<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Places</h1>
    <div class="flex flex-col gap-1">
      <PlaceLink v-for="place in PLACES" :key="place.id" :place="place" />
    </div>
  </div>
</template>
