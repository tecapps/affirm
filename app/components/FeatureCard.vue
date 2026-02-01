<script setup lang="ts">
/**
 * FeatureCard — a reusable DaisyUI card component.
 *
 * `defineProps` declares the component's input API. Props are reactive and
 * type-checked at build time. The default `<slot />` lets parent components
 * inject arbitrary content into the card body.
 */
withDefaults(
  defineProps<{
    title: string;
    description: string;
    badge?: string;
    badgeColor?: "primary" | "secondary" | "accent" | "info" | "success" | "warning" | "error";
  }>(),
  {
    badge: undefined,
    badgeColor: "primary",
  }
);
</script>

<template>
  <div class="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-base-300">
    <div class="card-body">
      <div class="flex items-start justify-between">
        <h2 class="card-title">{{ title }}</h2>
        <span v-if="badge" :class="`badge badge-${badgeColor}`">{{ badge }}</span>
      </div>
      <p>{{ description }}</p>
      <div v-if="$slots.default" class="card-actions justify-end">
        <slot />
      </div>
    </div>
  </div>
</template>
