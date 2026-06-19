<template>
  <NuxtLink v-if="isLink" :to="to" :class="buttonClasses" v-bind="$attrs">
    <slot />
  </NuxtLink>
  <button v-else :class="buttonClasses" v-bind="$attrs" :type="buttonType">
    <slot />
  </button>
</template>

<script setup lang="ts">
const props = defineProps<{
  type: "primary" | "secondary" | "accent";
  isSubmit?: boolean;
  to?: string;
}>();

const buttonType = computed(() => (props.isSubmit ? "submit" : "button"));
const isLink = computed(() => !!props.to);

const buttonClasses = computed(() => {
  return ["btn", props.type === "primary" ? "btn-primary" : props.type === "accent" ? "btn-accent" : "btn-secondary"];
});
</script>
