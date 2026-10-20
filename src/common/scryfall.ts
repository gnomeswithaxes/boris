import type { IScryfallCard } from './interfaces'

// Max concurrent Scryfall requests (~10 req/s allowed). Calls to the rate-limited endpoints
// below are additionally queued at ~2 req/s regardless of this value, so raising it only
// speeds up lookups such as /cards/cardmarket.
export const SCRYFALL_CONCURRENCY = 8

// /cards/search, /cards/named and /cards/collection allow only 2 requests per second, and a 429
// locks the client out for 30 seconds, so calls to them are spaced out across the whole page.
const RATE_LIMITED_ENDPOINT = /\/cards\/(search|named|collection)\b/
const RATE_LIMITED_INTERVAL_MS = 550
let nextRateLimitedSlot = 0

function waitForRateLimitedSlot(): Promise<void> {
  const now = Date.now()
  const slot = Math.max(now, nextRateLimitedSlot)
  nextRateLimitedSlot = slot + RATE_LIMITED_INTERVAL_MS
  return new Promise(resolve => setTimeout(resolve, slot - now))
}

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T | null> {
  if (RATE_LIMITED_ENDPOINT.test(url)) await waitForRateLimitedSlot()
  try {
    const response = await fetch(url, init)
    if (!response.ok) return null
    return await response.json() as T
  } catch {
    return null
  }
}

export interface CardIdentifier {
  name: string
  set?: string
}

async function fetch_collection_page(ids: CardIdentifier[]): Promise<{ data: IScryfallCard[] } | null> {
  return fetchJson('https://api.scryfall.com/cards/collection', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifiers: ids }),
  })
}

export async function fetch_single(name: string): Promise<IScryfallCard | null> {
  return fetchJson(
    `https://api.scryfall.com/cards/named?include_multilingual=true&fuzzy=${encodeURIComponent(name)}`
  )
}

export async function get_cardmarket(id: string): Promise<IScryfallCard | null> {
  return fetchJson(`https://api.scryfall.com/cards/cardmarket/${id}`)
}

async function fetch_cheapest_page(query: string): Promise<{ data: IScryfallCard[]; has_more: boolean; next_page: string } | null> {
  return fetchJson(
    `https://api.scryfall.com/cards/search?order=eur&unique=prints&dir=asc&q=${encodeURIComponent(query)}`
  )
}

async function cheapest_matching(query: string, accept: (card: IScryfallCard) => boolean): Promise<IScryfallCard | null> {
  const isCandidate = (c: IScryfallCard) => Boolean(c.prices?.eur || c.prices?.eur_foil) && c.border_color !== 'gold' && accept(c)

  const response = await fetch_cheapest_page(query)
  if (!response) return null
  const found = response.data.find(isCandidate)
  if (found || !response.has_more) return found ?? null

  const more = await fetchJson<{ data: IScryfallCard[] }>(response.next_page)
  return more?.data.find(isCandidate) ?? null
}

export async function get_cheapest(name: string): Promise<IScryfallCard | null> {
  return cheapest_matching(name, () => true)
}

export function matches_card_name(card: IScryfallCard, name: string): boolean {
  const wanted = name.toLowerCase()
  const full = card.name.toLowerCase()
  return full === wanted || full.split(' // ').includes(wanted)
}

export async function get_cheapest_exact(name: string): Promise<IScryfallCard | null> {
  return cheapest_matching(`!"${name.replaceAll('"', '')}"`, card => matches_card_name(card, name))
}

// The /cards/collection endpoint accepts at most 75 identifiers per request.
export async function fetch_collection(ids: CardIdentifier[]): Promise<IScryfallCard[]> {
  const batches: CardIdentifier[][] = []
  for (let i = 0; i < ids.length; i += 75) batches.push(ids.slice(i, i + 75))
  const responses = await Promise.all(batches.map(fetch_collection_page))
  return responses.flatMap(response => response?.data ?? [])
}
