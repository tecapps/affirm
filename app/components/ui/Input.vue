<script setup lang="ts">
withDefaults(
  defineProps<{
    type?: string;
    placeholder: string;
    label: string;
  }>(),
  {
    type: "text",
  },
);

const model = defineModel<string>();
const id = useId();
</script>

<template>
  <div>
    <label :for="id" class="label mb-1">{{ label }}</label>
    <input id="id" v-model="model" :type="type" :placeholder="placeholder" class="input w-full" />
  </div>
</template>
