<script setup lang="ts">
defineProps<{ slug: string }>()
</script>

<template>
  <IconEligibility  v-if="slug === 'eligibility'" />
  <IconTimelines    v-else-if="slug === 'timelines'" />
  <IconOutreach     v-else-if="slug === 'outreach'" />
  <IconShowcases    v-else-if="slug === 'showcases'" />
  <IconScholarships v-else-if="slug === 'scholarships'" />
  <IconDivisions    v-else-if="slug === 'divisions'" />
  <IconCommitments  v-else-if="slug === 'commitments'" />
  <IconNcaaRules    v-else-if="slug === 'ncaa-rules'" />
</template>
