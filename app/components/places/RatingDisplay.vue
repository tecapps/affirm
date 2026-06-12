<script setup lang="ts">
defineProps<{
  rating: number;
}>();
</script>

<template>
  <div class="flex items-center">
    <span v-for="i in 5" :key="i" class="mr-1">
      <span :class="i <= rating ? 'text-yellow-500' : 'text-base-content/50'">★</span>
    </span>
    <span class="ml-2 text-sm text-base-content/80">{{ rating }}</span>
  </div>
</template>
