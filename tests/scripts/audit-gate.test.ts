import { describe, expect, it } from 'vitest'
import { findBlocking } from '../../scripts/audit-gate.mjs'

const audit = (severity: string, id: string) => ({
  vulnerabilities: {
    pkg: { via: ['other', { severity, title: 'bad', url: `https://github.com/advisories/${id}` }] },
  },
})
const today = new Date('2026-10-08')

describe('findBlocking', () => {
  it('flags unaccepted high advisories', () => {
    expect(findBlocking(audit('high', 'GHSA-new'), [], today)).toHaveLength(1)
  })
  it('ignores moderate advisories', () => {
    expect(findBlocking(audit('moderate', 'GHSA-new'), [], today)).toEqual([])
  })
  it('allows accepted advisories until they expire', () => {
    const accepted = [{ id: 'GHSA-new', expires: '2026-11-01', reason: 'x' }]
    expect(findBlocking(audit('high', 'GHSA-new'), accepted, today)).toEqual([])
    expect(findBlocking(audit('high', 'GHSA-new'), accepted, new Date('2026-11-02'))).toHaveLength(1)
  })
})
