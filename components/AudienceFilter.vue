<script setup lang="ts">
defineProps<{ modelValue: 'all' | 'player' | 'parent' }>()
const emit = defineEmits<{ 'update:modelValue': ['all' | 'player' | 'parent'] }>()

const options = [
  { value: 'all',    label: 'All' },
  { value: 'player', label: 'Players' },
  { value: 'parent', label: 'Parents' },
] as const
</script>

<template>
  <div class="flex gap-2" role="group" aria-label="Filter by audience">
    <button
      v-for="option in options"
      :key="option.value"
      :class="[
        'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
        modelValue === option.value
          ? 'bg-emerald-600 text-white'
          : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-400',
      ]"
      @click="emit('update:modelValue', option.value)"
    >
      {{ option.label }}
    </button>
  </div>
</template>
