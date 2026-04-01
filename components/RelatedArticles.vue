<!-- components/RelatedArticles.vue -->
<script setup lang="ts">
const props = defineProps<{
  categorySlug: string
  currentSlug: string
}>()

const { data: related } = await useAsyncData(`related-${props.currentSlug}`, () =>
  queryCollection('resources')
    .where('category', '=', props.categorySlug)
    .where('slug', '<>', props.currentSlug)
    .where('draft', '<>', true)
    .limit(3)
    .all()
)
</script>

<template>
  <div v-if="related && related.length > 0" class="bg-emerald-50 rounded-xl p-5">
    <h3 class="font-semibold text-slate-800 text-sm uppercase tracking-wide mb-3">Related Articles</h3>
    <ul class="space-y-3">
      <li v-for="article in related" :key="article.slug">
        <NuxtLink
          :to="`/${article.category}/${article.slug}`"
          class="text-sm text-emerald-700 hover:text-emerald-900 font-medium leading-snug"
        >
          {{ article.title }}
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>
