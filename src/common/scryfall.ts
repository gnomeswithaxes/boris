import type { IScryfallCard } from './interfaces'

// Max lookups in flight at once. The request rate itself is bounded by the gates below.
export const SCRYFALL_CONCURRENCY = 8

// Scryfall allows 2 req/s on /cards/search, /cards/named and /cards/collection and 10 req/s
// elsewhere; a 429 locks the client out for 30 seconds. Each gate hands out start slots
// spaced by its interval, shared by every caller on the page.
function createGate(intervalMs: number): () => Promise<void> {
  let nextSlot = 0
  return () => {
    const now = Date.now()
    const slot = Math.max(now, nextSlot)
    nextSlot = slot + intervalMs
    return new Promise(resolve => setTimeout(resolve, slot - now))
  }
}

const slowEndpoint = /\/cards\/(search|named|collection)\b/
const slowGate = createGate(550)
const defaultGate = createGate(110)

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T | null> {
  await (slowEndpoint.test(url) ? slowGate : defaultGate)()
  try {
    const response = await fetch(url, init)
    if (!response.ok) return null
    return await response.json() as T
  } catch {
    return null
  }
}

interface SearchPage {
  data: IScryfallCard[]
  has_more: boolean
  next_page?: string
}

async function search_all(query: string): Promise<IScryfallCard[]> {
  const cards: IScryfallCard[] = []
  let url: string | undefined = `https://api.scryfall.com/cards/search?q=${encodeURIComponent(query)}`
  while (url) {
    const page: SearchPage | null = await fetchJson<SearchPage>(url)
    if (!page) break
    cards.push(...page.data)
    url = page.has_more ? page.next_page : undefined
  }
  return cards
}

function chunks<T>(items: T[], size: number): T[][] {
  const result: T[][] = []
  for (let i = 0; i < items.length; i += size) result.push(items.slice(i, i + size))
  return result
}

export interface CardIdentifier {
  name: string
  set?: string
}

export async function fetch_single(name: string): Promise<IScryfallCard | null> {
  return fetchJson(
    `https://api.scryfall.com/cards/named?include_multilingual=true&fuzzy=${encodeURIComponent(name)}`
  )
}

export async function get_cardmarket(id: string): Promise<IScryfallCard | null> {
  return fetchJson(`https://api.scryfall.com/cards/cardmarket/${id}`)
}

// The /cards/collection endpoint accepts at most 75 identifiers per request.
export async function fetch_collection(ids: CardIdentifier[]): Promise<IScryfallCard[]> {
  const responses = await Promise.all(chunks(ids, 75).map(batch =>
    fetchJson<{ data: IScryfallCard[] }>('https://api.scryfall.com/cards/collection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifiers: batch }),
    })))
  return responses.flatMap(response => response?.data ?? [])
}

// A name can also be the face of another card ("Lightning Bolt" is a face of
// "Emeritus of Conflict // Lightning Bolt"), so a full-name match wins over a face match.
export function find_by_name(cards: IScryfallCard[], name: string): IScryfallCard | undefined {
  const wanted = name.toLowerCase()
  return cards.find(card => card.name.toLowerCase() === wanted)
    ?? cards.find(card => card.name.toLowerCase().split(' // ').includes(wanted))
}

// One search returns the cheapest EUR printing of every requested card (prefer:eur-low with the
// default unique:cards). Names are sent in groups to keep the query short.
export async function get_cheapest_many(names: string[]): Promise<Array<IScryfallCard | null>> {
  const found = await Promise.all(chunks(names, 40).map(group => {
    const terms = group.map(name => `!"${name.replaceAll('"', '')}"`).join(' or ')
    return search_all(`(${terms}) prefer:eur-low -border:gold`)
  }))
  const cards = found.flat()
  return names.map(name => find_by_name(cards, name) ?? null)
}
