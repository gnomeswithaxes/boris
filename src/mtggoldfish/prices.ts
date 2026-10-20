import type { IScryfallCard } from '../common/interfaces'
import { fetch_collection, get_cheapest_exact, matches_card_name } from '../common/scryfall'
import type { DeckRow } from './deck'

export interface PriceInfo {
  unit: number | null
  url: string | null
}

export function eurUnit(card: IScryfallCard | null | undefined): number | null {
  const raw = card?.prices?.eur ?? card?.prices?.eur_foil
  return raw != null ? parseFloat(raw) : null
}

// Failed lookups are evicted so that a later re-render of the deck retries them.
function cached<T>(cache: Map<string, Promise<T>>, key: string, load: () => Promise<T>, failed: (value: T) => boolean): Promise<T> {
  let entry = cache.get(key)
  if (!entry) {
    entry = load().then(value => {
      if (failed(value)) cache.delete(key)
      return value
    })
    cache.set(key, entry)
  }
  return entry
}

const cheapestCache = new Map<string, Promise<IScryfallCard | null>>()

export function cheapestPrinting(name: string): Promise<IScryfallCard | null> {
  return cached(cheapestCache, name.toLowerCase(), () => get_cheapest_exact(name), card => !card)
}

const printingCache = new Map<string, Promise<PriceInfo>>()
const printingKey = (row: DeckRow) => `${row.name.toLowerCase()}|${row.set ?? ''}`

function findPrinting(cards: IScryfallCard[], row: DeckRow): IScryfallCard | undefined {
  const named = cards.filter(card => matches_card_name(card, row.name))
  return named.find(card => card.set?.toLowerCase() === row.set?.toLowerCase()) ?? named[0]
}

async function priceFor(row: DeckRow, cards: IScryfallCard[]): Promise<PriceInfo> {
  const printing = findPrinting(cards, row)
  const usable = printing && eurUnit(printing) !== null && printing.border_color !== 'gold'
  const card = usable ? printing : await cheapestPrinting(row.name)
  return {
    unit: eurUnit(card),
    url: card ? card.purchase_uris?.cardmarket ?? card.scryfall_uri : null,
  }
}

export function resolvePrices(rows: DeckRow[]): Promise<PriceInfo[]> {
  const missing = rows.filter((row, i) =>
    !printingCache.has(printingKey(row)) && rows.findIndex(r => printingKey(r) === printingKey(row)) === i)

  if (missing.length) {
    const collection = fetch_collection(missing.map(({ name, set }) => (set ? { name, set } : { name })))
    for (const row of missing) {
      cached(printingCache, printingKey(row), () => collection.then(cards => priceFor(row, cards)), info => info.unit === null)
    }
  }
  return Promise.all(rows.map(row => printingCache.get(printingKey(row))!))
}
