import type { IScryfallCard } from './interfaces'
import { load_cards } from '../mtggoldfish/utilities'
import { mapPool } from './utilities'

// Max concurrent Scryfall requests. The API is public/keyless and asks clients to
// stay near ~10 req/s, so per-row lookups run through a bounded pool rather than an
// unbounded Promise.all. Tune here to trade speed against politeness.
export const SCRYFALL_CONCURRENCY = 8

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T | null> {
  try {
    const response = await fetch(url, init)
    if (!response.ok) return null
    return await response.json() as T
  } catch {
    return null
  }
}

export async function fetch_collection(ids: Array<{ name: string; set?: string }>): Promise<{ data: IScryfallCard[]; not_found: Array<{ name: string }> } | null> {
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

export async function get_set_from_code(code: string): Promise<unknown> {
  return fetchJson(`https://api.scryfall.com/sets/${code}`)
}

async function fetch_cheapest_page(name: string): Promise<{ data: IScryfallCard[]; has_more: boolean; next_page: string } | null> {
  return fetchJson(
    `https://api.scryfall.com/cards/search?order=eur&unique=prints&dir=asc&q=${encodeURIComponent(name)}`
  )
}

export async function get_cheapest(name: string): Promise<IScryfallCard | null> {
  const response = await fetch_cheapest_page(name)
  if (!response) return null

  let cards = response.data
  if (response.has_more) {
    const more = await fetchJson<{ data: IScryfallCard[] }>(response.next_page)
    if (more) cards = [...cards, ...more.data]
  }

  return cards.find(c => (c.prices?.eur || c.prices?.eur_foil) && c.border_color !== 'gold') ?? null
}

export async function fetch_cards(): Promise<IScryfallCard[]> {
  const text_list = load_cards()
  let card_list: IScryfallCard[] = []

  const batches: Array<Array<{ name: string; set?: string }>> = []
  const remaining = [...text_list]
  while (remaining.length) {
    batches.push(
      remaining.splice(0, 75).map(c =>
        c.set.length >= 3 && c.set.length <= 5 ? { name: c.name, set: c.set } : { name: c.name }
      )
    )
  }

  const responses = await Promise.all(batches.map(fetch_collection))

  const notFoundNames: string[] = []
  for (const response of responses) {
    if (!response) continue
    card_list = [...card_list, ...response.data]
    notFoundNames.push(...response.not_found.map(c => c.name))
  }

  const cheapest = await mapPool(notFoundNames, SCRYFALL_CONCURRENCY, name => get_cheapest(name))
  card_list.push(...cheapest.filter((c): c is IScryfallCard => c !== null))

  return card_list
}
