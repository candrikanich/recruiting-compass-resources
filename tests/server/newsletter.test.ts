// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest'
import { subscribeToNewsletter } from '../../server/utils/newsletter'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)
vi.spyOn(console, 'error').mockImplementation(() => {})

const validConfig = {
  beehiivApiKey: 'test-key',
  beehiivPublicationId: 'pub_123',
}

const sentBody = () => JSON.parse(mockFetch.mock.calls[0][1].body)

describe('subscribeToNewsletter', () => {
  beforeEach(() => {
    mockFetch.mockReset()
    mockFetch.mockResolvedValue({ ok: true })
  })
  afterAll(() => vi.unstubAllGlobals())

  it('subscribes a valid email to the configured publication', async () => {
    const result = await subscribeToNewsletter({ email: 'user@example.com' }, validConfig)

    expect(result).toEqual({ success: true })
    expect(mockFetch).toHaveBeenCalledTimes(1)
    const [url, init] = mockFetch.mock.calls[0]
    expect(url).toBe('https://api.beehiiv.com/v2/publications/pub_123/subscriptions')
    expect(init.headers.Authorization).toBe('Bearer test-key')
    expect(sentBody()).toMatchObject({ email: 'user@example.com' })
  })

  it('trims whitespace before submitting', async () => {
    await subscribeToNewsletter({ email: '  user@example.com  ' }, validConfig)
    expect(sentBody().email).toBe('user@example.com')
  })

  it('requires the address owner to confirm (double opt-in)', async () => {
    await subscribeToNewsletter({ email: 'user@example.com' }, validConfig)
    expect(sentBody().double_opt_override).toBe('on')
  })

  it('never reactivates someone who unsubscribed', async () => {
    await subscribeToNewsletter({ email: 'user@example.com' }, validConfig)
    expect(sentBody().reactivate_existing).not.toBe(true)
  })

  it.each([
    ['a string that merely contains @', { email: '@' }],
    ['no domain', { email: 'user@' }],
    ['an array containing @', { email: ['@'] }],
    ['a non-string', { email: 42 }],
    ['a missing email', {}],
    ['a missing body', undefined],
    ['an over-long address', { email: `${'a'.repeat(250)}@example.com` }],
  ])('rejects %s with 400 and never calls Beehiiv', async (_label, body) => {
    await expect(subscribeToNewsletter(body, validConfig)).rejects.toMatchObject({ statusCode: 400 })
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('silently drops submissions that fill the honeypot field', async () => {
    const result = await subscribeToNewsletter(
      { email: 'victim@example.com', fax: '555-0100' },
      validConfig,
    )
    expect(result).toEqual({ success: true })
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('treats an empty honeypot field as a real submission', async () => {
    await subscribeToNewsletter({ email: 'user@example.com', fax: '' }, validConfig)
    expect(mockFetch).toHaveBeenCalledTimes(1)
  })

  it.each([
    ['beehiivApiKey', { ...validConfig, beehiivApiKey: '' }],
    ['beehiivPublicationId', { ...validConfig, beehiivPublicationId: '' }],
  ])('throws 500 when %s is not configured', async (_label, config) => {
    await expect(subscribeToNewsletter({ email: 'user@example.com' }, config)).rejects.toMatchObject({
      statusCode: 500,
    })
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('throws 502 without leaking the Beehiiv response when the upstream call fails', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 401, text: async () => 'invalid api key test-key' })

    const error = await subscribeToNewsletter({ email: 'user@example.com' }, validConfig).catch((e) => e)

    expect(error.statusCode).toBe(502)
    expect(JSON.stringify(error)).not.toContain('test-key')
  })
})
