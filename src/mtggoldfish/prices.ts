import { cached, cheapestPrintings, eurUnit } from '../common/cards'
import type { IScryfallCard } from '../common/interfaces'
import { fetch_collection, find_by_name } from '../common/scryfall'
import type { DeckRow } from './deck'

export interface PriceInfo {
  unit: number | null
  url: string | null
}

const printingCache = new Map<string, Promise<PriceInfo>>()
const printingKey = (row: DeckRow) => `${row.name.toLowerCase()}|${row.set ?? ''}`

function findPrinting(cards: IScryfallCard[], row: DeckRow): IScryfallCard | undefined {
  const sameSet = cards.filter(card => card.set?.toLowerCase() === row.set?.toLowerCase())
  return find_by_name(sameSet, row.name) ?? find_by_name(cards, row.name)
}

const isUsable = (card: IScryfallCard | undefined): card is IScryfallCard =>
  !!card && eurUnit(card) !== null && card.border_color !== 'gold'

// The deck's own printings come from one collection request; rows whose printing has no EUR
// price fall back to the cheapest printing, looked up for all of them at once.
async function lookupPrintings(rows: DeckRow[]): Promise<Array<IScryfallCard | null>> {
  const cards = await fetch_collection(rows.map(({ name, set }) => (set ? { name, set } : { name })))
  const printings = rows.map(row => findPrinting(cards, row))
  const fallbackRows = rows.filter((_, i) => !isUsable(printings[i]))
  const fallbacks = await cheapestPrintings(fallbackRows.map(row => row.name))

  return rows.map((row, i) => {
    const printing = printings[i]
    return isUsable(printing) ? printing : fallbacks[fallbackRows.indexOf(row)]
  })
}

export function resolvePrices(rows: DeckRow[]): Promise<PriceInfo[]> {
  const missing = rows.filter((row, i) =>
    !printingCache.has(printingKey(row)) && rows.findIndex(r => printingKey(r) === printingKey(row)) === i)

  if (missing.length) {
    const lookup = lookupPrintings(missing)
    missing.forEach((row, i) => cached(printingCache, printingKey(row), async () => {
      const card = (await lookup)[i]
      return { unit: eurUnit(card), url: card ? card.purchase_uris?.cardmarket ?? card.scryfall_uri : null }
    }, info => info.unit === null))
  }
  return Promise.all(rows.map(row => printingCache.get(printingKey(row))!))
}
