<!-- layouts/default.vue -->
<script setup lang="ts">
const { public: config } = useRuntimeConfig()
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex flex-col">
    <header class="bg-emerald-700 text-white shadow-md">
      <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-2 font-bold text-lg hover:text-emerald-200 transition-colors">
          <span>🧭</span>
          <span>Recruiting Resources</span>
        </NuxtLink>
        <a
          :href="config.appUrl"
          class="bg-white text-emerald-700 text-sm font-semibold px-4 py-1.5 rounded-full hover:bg-emerald-50 transition-colors"
        >
          Open App →
        </a>
      </div>
    </header>

    <main class="flex-1">
      <slot />
    </main>

    <footer class="bg-emerald-900 text-emerald-200 text-sm py-8">
      <div class="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <p class="font-semibold text-white">The Recruiting Compass</p>
          <p class="mt-1">Free resources for college athletics recruiting.</p>
        </div>
        <div class="flex flex-col gap-1">
          <a :href="config.appUrl" class="hover:text-white transition-colors">Open App →</a>
          <NuxtLink to="/" class="hover:text-white transition-colors">All Resources</NuxtLink>
        </div>
      </div>
    </footer>
  </div>
</template>
