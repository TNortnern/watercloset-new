<template>
  <div class="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <NuxtLink to="/" class="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 text-sm mb-4 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
          Back to home
        </NuxtLink>
        <NuxtLink to="/" class="inline-block">
           <span class="text-2xl font-bold text-primary">MyWaterCloset</span>
        </NuxtLink>
      </div>
      <div class="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <slot />
      </div>
      <div class="text-center mt-6 text-sm text-slate-500">
        &copy; {{ new Date().getFullYear() }} MyWaterCloset. All rights reserved.
      </div>
    </div>
  </div>
</template>
