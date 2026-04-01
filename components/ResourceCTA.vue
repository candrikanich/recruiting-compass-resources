<script setup lang="ts">
defineProps<{ variant?: 'waitlist' | 'app' }>()

const { public: config } = useRuntimeConfig()

const email = ref('')
const status = ref<'idle' | 'loading' | 'success' | 'error'>('idle')
const errorMessage = ref('')

async function subscribe() {
  if (!email.value || !email.value.includes('@')) return
  status.value = 'loading'
  errorMessage.value = ''
  try {
    // apiPrefix: '/api' in dev, '/resources-api' in production (see .env.example)
    await $fetch(`${config.apiPrefix}/newsletter`, {
      method: 'POST',
      body: { email: email.value },
    })
    status.value = 'success'
    email.value = ''
  } catch {
    status.value = 'error'
    errorMessage.value = 'Something went wrong — please try again.'
  }
}
</script>

<template>
  <div class="bg-emerald-700 text-white rounded-xl p-6">
    <h3 class="font-bold text-lg">Track Your Recruiting Journey</h3>
    <p class="text-emerald-100 text-sm mt-1 mb-4">
      The Recruiting Compass helps student-athletes manage their college search in one place.
    </p>

    <a
      :href="variant === 'app' ? `${config.appUrl}/signup` : `${config.appUrl}/waitlist`"
      class="block w-full bg-white text-emerald-700 font-semibold text-center py-2.5 rounded-lg hover:bg-emerald-50 transition-colors mb-4"
    >
      {{ variant === 'app' ? 'Create Free Account' : 'Join the Waitlist' }}
    </a>

    <div class="border-t border-emerald-600 pt-4">
      <p class="text-sm text-emerald-200 mb-2">Get recruiting tips by email:</p>

      <div v-if="status === 'success'" class="text-sm text-emerald-100 bg-emerald-600 rounded-lg px-3 py-2">
        ✓ You're subscribed — check your inbox!
      </div>
      <form v-else @submit.prevent="subscribe" class="flex gap-2">
        <input
          v-model="email"
          type="email"
          placeholder="your@email.com"
          required
          class="flex-1 px-3 py-2 rounded-lg text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-white"
        />
        <button
          type="submit"
          :disabled="status === 'loading'"
          class="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-white text-sm font-medium px-3 py-2 rounded-lg transition-colors whitespace-nowrap"
        >
          {{ status === 'loading' ? '…' : 'Subscribe' }}
        </button>
      </form>
      <p v-if="status === 'error'" class="text-xs text-red-300 mt-1">{{ errorMessage }}</p>
    </div>
  </div>
</template>
