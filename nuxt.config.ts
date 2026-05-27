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

  // url is env-driven so staging/preview emit their own canonical, sitemap,
  // and OG URLs — never production's. @nuxtjs/seo also auto-marks non-production
  // Vercel envs (VERCEL_ENV=preview) as noindex; set NUXT_SITE_ENV to override.
  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'https://therecruitingcompass.com',
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
      url: process.env.NUXT_PUBLIC_SITE_URL || 'https://therecruitingcompass.com',
      logo: `${process.env.NUXT_PUBLIC_SITE_URL || 'https://therecruitingcompass.com'}/resources/og-default.png`,
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
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://therecruitingcompass.com',
      appUrl: process.env.NUXT_PUBLIC_APP_URL || 'https://myrecruitingcompass.com',
      // In dev: /api — in prod (behind landing site rewrite): /resources-api
      apiPrefix: process.env.NUXT_PUBLIC_API_PREFIX || '/api',
    },
  },

  devtools: { enabled: true },
})