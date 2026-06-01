<script setup lang="ts">
withDefaults(
  defineProps<{
    type?: string;
    placeholder?: string;
    label: string;
  }>(),
  {
    type: "text",
  },
);

const model = defineModel();
const id = useId();
</script>

<template>
  <div>
    <label :for="id" class="label mb-1">{{ label }}</label>
    <input id="id" :value="modelValue" :type="type" :placeholder="placeholder" v-model="model" class="input w-full" />
  </div>
</template>
