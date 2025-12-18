<template>
  <div class="min-h-screen flex flex-col bg-white dark:bg-gray-900">
    <Header />
    <main class="flex-grow">
      <slot />
    </main>
    <Footer />
  </div>
</template>

