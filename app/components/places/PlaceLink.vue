<script setup lang="ts">
defineProps<{
  place: {
    id: number;
    name: string;
    rating: number;
    description: string;
  };
}>();
</script>

<template>
  <NuxtLink
    :to="`/place/${place.id}`"
    class="block p-4 bg-base-200 border-base-300 rounded-box hover:bg-base-300 transition-colors"
  >
    <h2 class="text-lg font-semibold">{{ place.name }}</h2>
    <p class="text-secondary-content">{{ place.description }}</p>
    <div class="mt-2">
      <PlacesRatingDisplay :rating="place.rating" />
    </div>
  </NuxtLink>
</template>
