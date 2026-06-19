<template>
  <div class="flex min-h-screen flex-row justify-center">
    <div class="flex min-h-screen flex-column gap-6 max-w-240 w-full">
      <AppHeader class="flex-0 min-w-40 sticky top-0 h-fit py-12" />
      <main class="flex-1 py-12">
        <slot />
        <AppFooter />
      </main>
    </div>
  </div>
</template>
