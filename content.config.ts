// content.config.ts
import { defineContentConfig, defineCollection } from '@nuxt/content'
import { z } from 'zod'

export default defineContentConfig({
  collections: {
    resources: defineCollection({
      type: 'page',
      source: 'resources/**/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        slug: z.string(),
        category: z.enum([
          'eligibility', 'timelines', 'outreach', 'showcases',
          'scholarships', 'divisions', 'commitments', 'ncaa-rules',
        ]),
        audience: z.enum(['player', 'parent', 'both']),
        stage: z.enum(['freshman', 'sophomore', 'junior', 'senior', 'all']),
        lastUpdated: z.string(),
        lastReviewed: z.string(),
        tags: z.array(z.string()).optional(),
        heroImage: z.string().optional(),
        ogImage: z.string().optional(),
        draft: z.boolean().optional().default(false),
      }),
    }),
  },
})
