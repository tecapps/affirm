<template>
  <div class="flex min-h-screen flex-row justify-center">
    <div class="flex min-h-screen flex-column p-12 gap-8 max-w-240 w-full">
      <AppHeader class="flex-0 min-w-40" />
      <main class="flex-1">
        <slot />
        <AppFooter />
      </main>
    </div>
  </div>
</template>
