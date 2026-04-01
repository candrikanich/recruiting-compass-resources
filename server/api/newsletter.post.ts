export default defineEventHandler(async (event) => {
  const body = await readBody<{ email?: string }>(event)

  if (!body?.email || !body.email.includes('@')) {
    throw createError({ statusCode: 400, statusMessage: 'Valid email required' })
  }

  const config = useRuntimeConfig()

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
        email: body.email,
        reactivate_existing: true,
        send_welcome_email: true,
        utm_source: 'resources-site',
        utm_medium: 'article-cta',
      }),
    }
  )

  if (!response.ok) {
    console.error('Beehiiv error:', response.status, await response.text())
    throw createError({ statusCode: 502, statusMessage: 'Failed to subscribe — please try again' })
  }

  return { success: true }
})
