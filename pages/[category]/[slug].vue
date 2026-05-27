<!-- pages/[category]/[slug].vue -->
<script setup lang="ts">
const route = useRoute()
const categorySlug = route.params.category as string
const slug = route.params.slug as string

const { getCategoryBySlug } = useCategories()
const category = getCategoryBySlug(categorySlug)

if (!category) {
  throw createError({ statusCode: 404, statusMessage: 'Category not found' })
}

// route.path = /[category]/[slug] (base stripped by Nuxt)
// Nuxt Content path = /resources/[category]/[slug]
const { data: article } = await useAsyncData(`article-${slug}`, () =>
  queryCollection('resources').path('/resources' + route.path).first()
)

if (!article.value) {
  throw createError({ statusCode: 404, statusMessage: 'Article not found' })
}

const { public: config } = useRuntimeConfig()
const canonicalUrl = `${config.siteUrl}/resources/${categorySlug}/${slug}`
const ogImage = article.value.ogImage ?? article.value.heroImage ?? `${config.siteUrl}/og-default.png`

useSeoMeta({
  title: article.value.title,
  description: article.value.description,
  ogTitle: article.value.title,
  ogDescription: article.value.description,
  ogImage,
  ogUrl: canonicalUrl,
  ogType: 'article',
  twitterCard: 'summary_large_image',
  twitterTitle: article.value.title,
  twitterDescription: article.value.description,
  twitterImage: ogImage,
})

useHead({
  link: [{ rel: 'canonical', href: canonicalUrl }],
  meta: [{ property: 'article:modified_time', content: article.value.lastReviewed }],
})

useSchemaOrg([
  defineArticle({
    headline: article.value.title,
    description: article.value.description,
    image: ogImage,
    datePublished: article.value.lastUpdated,
    dateModified: article.value.lastReviewed,
    author: { name: 'The Recruiting Compass', url: config.siteUrl },
  }),
])
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="relative bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 overflow-hidden">
      <div class="field-lines absolute inset-0" />
      <img
        v-if="article.heroImage"
        :src="article.heroImage"
        :alt="article.title"
        class="absolute inset-0 w-full h-full object-cover opacity-20"
      />
      <div class="relative max-w-4xl mx-auto px-4 py-12 text-white">
        <BreadcrumbNav :category="category" :article-title="article.title" />
        <h1 class="text-3xl md:text-4xl font-bold mt-4 leading-tight">{{ article.title }}</h1>
        <p class="text-emerald-100 mt-3 text-lg max-w-2xl">{{ article.description }}</p>
        <div class="mt-4">
          <ArticleMeta
            :last-reviewed="article.lastReviewed"
            :audience="article.audience"
            :stage="article.stage"
          />
        </div>
      </div>
    </section>

    <!-- Body -->
    <div class="max-w-4xl mx-auto px-4 py-10">
      <div class="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10">
        <article class="prose prose-slate max-w-none
          prose-headings:text-slate-900
          prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:underline
          prose-strong:text-slate-800">
          <ContentRenderer :value="article" />
        </article>
        <aside class="space-y-6">
          <ResourceCTA variant="waitlist" />
          <RelatedArticles :category-slug="categorySlug" :current-slug="slug" />
        </aside>
      </div>
    </div>
  </div>
</template>
