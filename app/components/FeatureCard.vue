<script setup lang="ts">
/**
 * FeatureCard — a reusable DaisyUI card component.
 *
 * `defineProps` declares the component's input API. Props are reactive and
 * type-checked at build time. The default `<slot />` lets parent components
 * inject arbitrary content into the card body.
 */
defineProps<{
  title: string;
  description: string;
}>();
</script>

<template>
  <div class="card bg-base-100 shadow-md">
    <div class="card-body">
      <h2 class="card-title">{{ title }}</h2>
      <p>{{ description }}</p>
      <div v-if="$slots.default" class="card-actions justify-end">
        <slot />
      </div>
    </div>
  </div>
</template>
