<script setup lang="ts">
defineProps<{
  review: {
    id: number;
    author: string;
    rating: number;
    comment: string;
    date: string;
  };
}>();
</script>

<template>
  <div class="card card-border">
    <div class="card-body space-y-1">
      <div class="flex justify-between items-start">
        <h3 class="font-semibold">{{ review.author }}</h3>
        <span class="text-base-content/50">{{ review.date }}</span>
      </div>
      <p>{{ review.comment }}</p>
      <PlacesRatingDisplay :rating="review.rating" />
    </div>
  </div>
</template>
