<!-- pages/index.vue -->
<script setup lang="ts">
const { categories } = useCategories()
const { public: config } = useRuntimeConfig()

const { data: allArticles } = await useAsyncData('hub-articles', () =>
  queryCollection('resources').where('draft', '<>', true).all()
)

const countByCategory = computed(() => {
  const counts: Record<string, number> = {}
  for (const article of allArticles.value ?? []) {
    counts[article.category] = (counts[article.category] ?? 0) + 1
  }
  return counts
})

useSeoMeta({
  title: 'College Recruiting Resources | The Recruiting Compass',
  description: 'Free guides for college athletics recruiting — eligibility, timelines, contacting coaches, scholarships, and more.',
  ogTitle: 'College Recruiting Resources | The Recruiting Compass',
  ogDescription: 'Free guides for college athletics recruiting — eligibility, timelines, contacting coaches, scholarships, and more.',
  ogUrl: `${config.siteUrl}/resources`,
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: 'College Recruiting Resources | The Recruiting Compass',
  twitterDescription: 'Free guides for college athletics recruiting.',
})
</script>

<template>
  <div>
    <!-- Hero with field-lines motif -->
    <section class="relative bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 overflow-hidden">
      <div class="field-lines absolute inset-0" />
      <div class="relative max-w-4xl mx-auto px-4 py-16 text-center text-white">
        <h1 class="text-4xl md:text-5xl font-bold tracking-tight">Recruiting Resources</h1>
        <p class="mt-4 text-lg text-emerald-100 max-w-2xl mx-auto">
          Everything you need to navigate college athletics recruiting — free, clear, and always up to date.
        </p>
      </div>
    </section>

    <!-- Category grid -->
    <section class="max-w-6xl mx-auto px-4 py-12">
      <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-6">Browse by Topic</p>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <CategoryCard
          v-for="category in categories"
          :key="category.slug"
          :category="category"
          :article-count="countByCategory[category.slug] ?? 0"
        />
      </div>
    </section>
  </div>
</template>
