<script setup lang="ts">
const { fetch: refreshSession } = useUserSession();

const form = reactive({
  data: {
    email: "",
    password: "",
  },
  error: "",
  pending: false,
});

async function handleLogin() {
  try {
    console.log("Start Fetch");
    form.pending = true;
    form.error = "";
    if (form.data.email && form.data.password) {
      const res = await $fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: form.data,
      });
      console.log("Fetch Complete");
      console.log(res);
      if (res.error) {
        form.pending = false;
        form.error = String(res.message) || "Login failed";
      } else {
        // Refresh the session on client-side and redirect to the home page
        await refreshSession();
        await navigateTo("/me");
      }
    } else {
      form.pending = false;
      form.error = "Enter your email and password";
    }
  } catch (error) {
    form.pending = false;
    form.error = fetchErrorMessage(error, "Login failed");
  }
}
</script>

<template>
  <div class="bg-base-200 flex flex-col items-center justify-center gap-4 mt-4">
    <h1 class="text-xl my-8">Login to your account</h1>
    <form class="w-full" @submit.prevent="handleLogin">
      <fieldset class="fieldset border-base-300 border rounded-box w-full p-4 flex flex-col justify-stretch gap-4">
        <legend class="sr-only">Login Page</legend>
        <div v-if="form.error" role="alert" class="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{{ form.error }}</span>
        </div>
        <UiInput
          v-model="form.data.email"
          class="input validator"
          label="Email"
          type="email"
          placeholder="email@example.com"
        />
        <UiInput
          v-model="form.data.password"
          class="input validator"
          label="Password"
          type="password"
          placeholder="password"
        />
        <UiButton is-submit type="primary" class="mt-8">
          <span v-if="form.pending" class="loading loading-spinner loading-sm" />
          <span v-else>Login</span>
        </UiButton>
      </fieldset>
    </form>
    <span class="text-secondary-content text-sm">or</span>
    <UiButton to="/register" type="secondary">New? Create an account</UiButton>
  </div>
</template>
