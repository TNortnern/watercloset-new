<template>
  <div class="min-h-screen flex flex-col bg-slate-50">
    <Header />
    <main class="flex-grow flex items-center justify-center p-4">
      <div class="w-full max-w-md">
        <div class="text-center mb-8">
          <NuxtLink to="/" class="inline-block">
            <span class="text-2xl font-bold text-primary">MyWaterCloset</span>
          </NuxtLink>
        </div>
        <div class="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
          <slot />
        </div>
      </div>
    </main>
    <Footer />
  </div>
</template>
