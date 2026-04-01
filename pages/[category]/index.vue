<script setup lang="ts">
const route = useRoute()
const categorySlug = route.params.category as string
const { getCategoryBySlug } = useCategories()
const category = getCategoryBySlug(categorySlug)

if (!category) {
  throw createError({ statusCode: 404, statusMessage: 'Category not found' })
}

const { data: articles } = await useAsyncData(`category-${categorySlug}`, () =>
  queryCollection('resources')
    .where('category', '=', categorySlug)
    .where('draft', '<>', true)
    .all()
)

const audienceFilter = ref<'all' | 'player' | 'parent'>('all')

const filteredArticles = computed(() => {
  if (audienceFilter.value === 'all') return articles.value ?? []
  return (articles.value ?? []).filter(
    a => a.audience === audienceFilter.value || a.audience === 'both'
  )
})

const { public: config } = useRuntimeConfig()

useSeoMeta({
  title: `${category.name} | The Recruiting Compass`,
  description: `${category.description} — free guides for college athletics recruiting.`,
  ogTitle: `${category.name} | The Recruiting Compass`,
  ogDescription: `${category.description} — free guides for college athletics recruiting.`,
  ogUrl: `${config.siteUrl}/resources/${categorySlug}`,
  ogType: 'website',
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <div>
    <section class="relative bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 overflow-hidden">
      <div class="field-lines absolute inset-0" />
      <div class="relative max-w-4xl mx-auto px-4 py-12 text-white">
        <BreadcrumbNav :category="category" />
        <div class="flex items-center gap-4 mt-4">
          <CategoryIcon :slug="categorySlug" class="w-12 h-12 text-emerald-200" />
          <div>
            <h1 class="text-3xl font-bold">{{ category.name }}</h1>
            <p class="text-emerald-100 mt-1">{{ category.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="max-w-6xl mx-auto px-4 py-10">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <p class="text-sm text-slate-500">
          {{ filteredArticles.length }} {{ filteredArticles.length === 1 ? 'article' : 'articles' }}
        </p>
        <AudienceFilter v-model="audienceFilter" />
      </div>

      <div v-if="filteredArticles.length === 0" class="text-center py-16 text-slate-400">
        <p class="text-lg">No articles yet in this category.</p>
        <p class="text-sm mt-2">Content is added regularly — check back soon.</p>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <ArticleCard v-for="article in filteredArticles" :key="article.slug" :article="article" />
      </div>
    </section>
  </div>
</template>
