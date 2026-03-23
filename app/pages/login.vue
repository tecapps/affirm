<script setup lang="ts">
import * as v from "valibot";
import type { FormSubmitEvent } from "@nuxt/ui";

const schema = v.object({
  email: v.pipe(v.string(), v.email("Invalid email")),
  password: v.pipe(v.string(), v.minLength(8, "Must be at least 8 characters")),
});
type Schema = v.InferOutput<typeof schema>;
async function handleLogin(event: FormSubmitEvent<Schema>) {
  const res = await useFetch("/api/login", {
    method: "POST",
    body: {
      //form data
    },
  });

  toast.add({ title: "Success", description: "The form has been submitted.", color: "success" });
  console.log(event.data);
  //console.log(res.data);
  return res.data;
}

const state = reactive({
  email: "",
  password: "",
});

const toast = useToast();
</script>

<template>
  <UForm :schema="schema" :state="state" class="space-y-4" @submit="handleLogin">
    <UFormField label="Email" name="email">
      <UInput v-model="state.email" />
    </UFormField>

    <UFormField label="Password" name="password">
      <UInput v-model="state.password" type="password" />
    </UFormField>

    <UButton type="submit"> Submit </UButton>
  </UForm>
</template>
