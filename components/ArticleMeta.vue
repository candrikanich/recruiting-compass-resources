<!-- components/ArticleMeta.vue -->
<script setup lang="ts">
defineProps<{
  lastReviewed: string
  audience: string
  stage: string
}>()

const audienceLabel: Record<string, string> = {
  player: 'Players', parent: 'Parents', both: 'Players & Parents',
}
const stageLabel: Record<string, string> = {
  freshman: 'Freshman Year', sophomore: 'Sophomore Year',
  junior: 'Junior Year', senior: 'Senior Year', all: 'All Years',
}
</script>

<template>
  <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
    <span class="inline-flex items-center gap-1 text-emerald-100 bg-emerald-600/50 px-3 py-1 rounded-full font-medium">
      ✓ Reviewed {{ lastReviewed }}
    </span>
    <span class="text-emerald-200">{{ stageLabel[stage] ?? stage }}</span>
    <span class="text-emerald-300">·</span>
    <span class="text-emerald-200">{{ audienceLabel[audience] ?? audience }}</span>
  </div>
</template>
