// nuxt.config.ts
import { defineOrganization } from 'nuxt-schema-org/schema'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',

  app: {
    baseURL: '/resources',
    // Public assets serve at baseURL root; head hrefs are literal, so prefix /resources.
    head: {
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/resources/favicon.ico' },
        { rel: 'icon', type: 'image/svg+xml', href: '/resources/favicon.svg' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/resources/apple-touch-icon.png' },
      ],
    },
  },

  // @nuxtjs/seo must load before @nuxt/content for asSeoCollection()
  modules: ['@nuxtjs/seo', '@nuxt/content', '@nuxtjs/tailwindcss'],

  css: ['~/assets/css/main.css'],

  site: {
    url: 'https://therecruitingcompass.com',
    name: 'The Recruiting Compass',
    description: 'Free guides for college athletics recruiting — eligibility, timelines, contacting coaches, scholarships, and more.',
  },

  // Served under /resources behind the landing-site rewrite, so we cannot own
  // the domain-root robots.txt — the landing site does. We still emit a sitemap
  // at /resources/sitemap.xml for that root robots.txt to reference.
  robots: {
    robotsTxt: false,
  },

  // Static (SSG) deploy: skip the satori/eject runtime OG pipeline. Pages set a
  // static og:image (per-article heroImage, else /resources/og-default.png).
  ogImage: {
    enabled: false,
  },

  schemaOrg: {
    identity: defineOrganization({
      name: 'The Recruiting Compass',
      url: 'https://therecruitingcompass.com',
      logo: 'https://therecruitingcompass.com/resources/og-default.png',
    }),
  },

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