// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',

  app: {
    baseURL: '/resources',
  },

  modules: [
    '@nuxt/content',
    '@nuxtjs/tailwindcss',
  ],

  css: ['~/assets/css/main.css'],

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/'],
    },
  },

  runtimeConfig: {
    beehiivApiKey: '',        // NUXT_BEEHIIV_API_KEY
    beehiivPublicationId: '', // NUXT_BEEHIIV_PUBLICATION_ID
    public: {
      siteUrl: 'https://therecruitingcompass.com',
      appUrl: 'https://myrecruitingcompass.com',
      // In dev: /api — in prod (behind landing site rewrite): /resources-api
      apiPrefix: '/api',
    },
  },

  devtools: { enabled: true },
})
