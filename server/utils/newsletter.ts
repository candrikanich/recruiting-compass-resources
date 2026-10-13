import { createError } from 'h3'
import { z } from 'zod'

const subscriptionSchema = z.object({
  // 254 = longest deliverable address (RFC 5321 path limit)
  email: z.string().trim().max(254).email(),
  // Honeypot: the form hides this field from people, so only bots fill it.
  fax: z.string().optional(),
})

interface NewsletterConfig {
  beehiivApiKey: string
  beehiivPublicationId: string
}

export async function subscribeToNewsletter(body: unknown, config: NewsletterConfig) {
  const parsed = subscriptionSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Valid email required' })
  }

  // Report success so a bot gets no signal to adapt to.
  if (parsed.data.fax) {
    return { success: true }
  }

  if (!config.beehiivApiKey || !config.beehiivPublicationId) {
    throw createError({ statusCode: 500, statusMessage: 'Newsletter not configured' })
  }

  const response = await fetch(
    `https://api.beehiiv.com/v2/publications/${config.beehiivPublicationId}/subscriptions`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.beehiivApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: parsed.data.email,
        // This endpoint is unauthenticated, so the address owner must confirm:
        // otherwise anyone could subscribe (or re-subscribe) someone else.
        double_opt_override: 'on',
        send_welcome_email: true,
        utm_source: 'resources-site',
        utm_medium: 'article-cta',
      }),
    },
  )

  if (!response.ok) {
    console.error('Beehiiv error:', response.status, await response.text())
    throw createError({ statusCode: 502, statusMessage: 'Failed to subscribe — please try again' })
  }

  return { success: true }
}
