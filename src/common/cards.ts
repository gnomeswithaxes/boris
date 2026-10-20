import type { IScryfallCard } from './interfaces'
import { get_cardmarket, get_cheapest_many } from './scryfall'

export function eurUnit(card: IScryfallCard | null | undefined): number | null {
  const raw = card?.prices?.eur ?? card?.prices?.eur_foil
  return raw != null ? parseFloat(raw) : null
}

// Failed lookups are evicted so that a later call retries them.
export function cached<T>(cache: Map<string, Promise<T>>, key: string, load: () => Promise<T>, failed: (value: T) => boolean): Promise<T> {
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

const cardmarketCache = new Map<string, Promise<IScryfallCard | null>>()

export function cardmarketCard(id: string): Promise<IScryfallCard | null> {
  return cached(cardmarketCache, id, () => get_cardmarket(id), card => !card)
}

const cheapestCache = new Map<string, Promise<IScryfallCard | null>>()

export function cheapestPrintings(names: string[]): Promise<Array<IScryfallCard | null>> {
  const key = (name: string) => name.toLowerCase()
  const missing = names.filter((name, i) =>
    name && !cheapestCache.has(key(name)) && names.findIndex(n => key(n) === key(name)) === i)

  if (missing.length) {
    const batch = get_cheapest_many(missing)
    missing.forEach((name, i) => cached(cheapestCache, key(name), () => batch.then(cards => cards[i]), card => !card))
  }
  return Promise.all(names.map(name => (name ? cheapestCache.get(key(name))! : Promise.resolve(null))))
}
