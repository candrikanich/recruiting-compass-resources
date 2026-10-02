import { subscribeToNewsletter } from '../utils/newsletter'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  return subscribeToNewsletter(await readBody(event), {
    beehiivApiKey: config.beehiivApiKey,
    beehiivPublicationId: config.beehiivPublicationId,
  })
})
