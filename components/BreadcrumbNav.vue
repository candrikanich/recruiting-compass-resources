<!-- components/BreadcrumbNav.vue -->
<script setup lang="ts">
import type { Category } from '~/composables/useCategories'

defineProps<{
  category: Category
  articleTitle?: string
}>()
</script>

<template>
  <nav aria-label="Breadcrumb" class="flex items-center gap-2 text-sm text-emerald-200 flex-wrap">
    <NuxtLink to="/" class="hover:text-white transition-colors">Resources</NuxtLink>
    <span aria-hidden="true">›</span>
    <NuxtLink :to="`/${category.slug}`" class="hover:text-white transition-colors">
      {{ category.name }}
    </NuxtLink>
    <template v-if="articleTitle">
      <span aria-hidden="true">›</span>
      <span class="text-white truncate max-w-[200px]">{{ articleTitle }}</span>
    </template>
  </nav>
</template>
