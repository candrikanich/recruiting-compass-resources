<script setup lang="ts">
interface Article {
  title: string
  description: string
  slug: string
  category: string
  audience: string
  stage: string
  lastReviewed: string
  heroImage?: string
}

defineProps<{ article: Article }>()

const stageLabel: Record<string, string> = {
  freshman: 'Freshman', sophomore: 'Sophomore',
  junior: 'Junior', senior: 'Senior', all: 'All Years',
}
</script>

<template>
  <NuxtLink
    :to="`/${article.category}/${article.slug}`"
    class="flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-emerald-400 hover:shadow-md transition-all duration-200 group"
  >
    <!-- Hero image -->
    <div class="h-40 bg-emerald-50 overflow-hidden flex items-center justify-center">
      <img
        v-if="article.heroImage"
        :src="article.heroImage"
        :alt="article.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        loading="lazy"
      />
      <CategoryIcon v-else :slug="article.category" class="w-12 h-12 text-emerald-200" />
    </div>

    <div class="flex-1 p-5">
      <div class="flex items-center gap-2 mb-2 flex-wrap">
        <span class="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
          {{ stageLabel[article.stage] ?? article.stage }}
        </span>
        <span v-if="article.audience !== 'both'" class="text-xs text-slate-400">
          {{ article.audience === 'player' ? 'Players' : 'Parents' }}
        </span>
      </div>
      <h3 class="font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
        {{ article.title }}
      </h3>
      <p class="text-sm text-slate-500 mt-1 line-clamp-2">{{ article.description }}</p>
    </div>

    <div class="px-5 pb-4 text-xs text-slate-400">
      Reviewed {{ article.lastReviewed }}
    </div>
  </NuxtLink>
</template>
