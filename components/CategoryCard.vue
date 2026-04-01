<!-- components/CategoryCard.vue -->
<script setup lang="ts">
import type { Category } from '~/composables/useCategories'

defineProps<{
  category: Category
  articleCount: number
}>()
</script>

<template>
  <NuxtLink
    :to="`/${category.slug}`"
    class="block bg-white rounded-xl border border-slate-200 p-6 hover:border-emerald-400 hover:shadow-lg transition-all duration-200 group"
  >
    <CategoryIcon :slug="category.slug" class="w-10 h-10 text-emerald-600 mb-4" />
    <h2 class="font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">
      {{ category.name }}
    </h2>
    <p class="text-sm text-slate-500 mt-1 leading-snug">{{ category.description }}</p>
    <span class="inline-block text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mt-3">
      {{ articleCount }} {{ articleCount === 1 ? 'article' : 'articles' }}
    </span>
  </NuxtLink>
</template>
