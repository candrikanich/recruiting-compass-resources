// Fails on high/critical production advisories unless explicitly accepted below.
// Accepted entries expire so they get re-reviewed instead of silently piling up.
import { execFileSync } from 'node:child_process'
import { pathToFileURL } from 'node:url'

const BLOCKING = new Set(['high', 'critical'])

// Each is reachable only through build/dev tooling (nuxt devtools, listhen dev
// server, tailwind/content file globbing) and has no non-breaking fix upstream.
export const ACCEPTED = [
  { id: 'GHSA-v5rq-49vh-5v5c', expires: '2026-11-08', reason: 'simple-git via nuxt devtools; fix needs simple-git 4 (breaks default export in nuxt)' },
  { id: 'GHSA-x6jw-m9v5-85vh', expires: '2026-11-08', reason: 'simple-git via nuxt devtools; same as above' },
  { id: 'GHSA-g4wm-2vf7-vfgr', expires: '2026-11-08', reason: 'simple-git via nuxt devtools; same as above' },
  { id: 'GHSA-858h-whjf-mvg5', expires: '2026-11-08', reason: 'simple-git via nuxt devtools; same as above' },
  { id: 'GHSA-86w9-cpqp-85rv', expires: '2026-11-08', reason: 'node-forge via listhen (dev server only); no patched release' },
  { id: 'GHSA-vfj7-8cjw-p6xm', expires: '2026-11-08', reason: 'braces via micromatch/chokidar at build time; no patched release' },
]

export function findBlocking(audit, accepted = ACCEPTED, today = new Date()) {
  const live = new Set(accepted.filter((a) => new Date(a.expires) >= today).map((a) => a.id))
  const found = new Map()
  for (const [name, vuln] of Object.entries(audit.vulnerabilities ?? {})) {
    for (const via of vuln.via) {
      if (typeof via === 'string' || !BLOCKING.has(via.severity)) continue
      const id = via.url.split('/').pop()
      if (!live.has(id)) found.set(id, `${name}: ${via.title} (${id})`)
    }
  }
  return [...found.values()]
}

function main() {
  let out
  try {
    out = execFileSync('npm', ['audit', '--omit=dev', '--json'], { encoding: 'utf8' })
  } catch (error) {
    // npm audit exits non-zero when it finds anything; the JSON is still on stdout.
    out = error.stdout
  }
  const blocking = findBlocking(JSON.parse(out))
  if (blocking.length) {
    console.error(`Unaccepted high/critical production advisories:\n${blocking.join('\n')}`)
    process.exit(1)
  }
  console.log('npm audit gate passed (accepted advisories in scripts/audit-gate.mjs).')
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) main()
