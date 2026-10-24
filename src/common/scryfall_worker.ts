import { cached } from './cards'
import { SCRYFALL_API, SCRYFALL_MESSAGE, type ScryfallRequest } from './scryfall'
import { sleep } from './utilities'

// Scryfall allows 2 req/s on /cards/search, /cards/named and /cards/collection and 10 req/s
// elsewhere; a 429 locks the client out for 30 seconds. Each gate hands out start slots spaced by
// its interval; a request whose slot falls inside a lockout queues again behind it.
function createGate(intervalMs: number) {
  let nextSlot = 0
  let pausedUntil = 0
  const wait = async (): Promise<void> => {
    const slot = Math.max(Date.now(), nextSlot)
    nextSlot = slot + intervalMs
    await sleep(slot - Date.now())
    if (Date.now() < pausedUntil) return wait()
  }
  const pause = (ms: number) => {
    pausedUntil = Date.now() + ms
    nextSlot = Math.max(nextSlot, pausedUntil)
  }
  return { wait, pause }
}

const LOCKOUT_MS = 30_000
const slowEndpoint = /\/cards\/(search|named|collection)\b/
const slowGate = createGate(550)
const defaultGate = createGate(110)

async function fetchJson({ url, body }: ScryfallRequest): Promise<unknown> {
  await (slowEndpoint.test(url) ? slowGate : defaultGate).wait()
  try {
    const response = await fetch(
      url,
      body === undefined ? undefined : { method: 'POST', headers: { 'Content-Type': 'application/json' }, body },
    )
    if (response.status === 429) {
      slowGate.pause(LOCKOUT_MS)
      defaultGate.pause(LOCKOUT_MS)
    }
    if (!response.ok) return null
    return await response.json()
  } catch {
    return null
  }
}

// Lives as long as the worker, so lookups repeated across tabs in the same burst are fetched once.
const getCache = new Map<string, Promise<unknown>>()

export function isScryfallRequest(message: unknown): message is ScryfallRequest {
  return (message as ScryfallRequest | null)?.type === SCRYFALL_MESSAGE
}

export function scryfallFetch(request: ScryfallRequest): Promise<unknown> {
  if (!request.url.startsWith(SCRYFALL_API)) return Promise.resolve(null)
  if (request.body !== undefined) return fetchJson(request)
  return cached(
    getCache,
    request.url,
    () => fetchJson(request),
    value => value === null,
  )
}
