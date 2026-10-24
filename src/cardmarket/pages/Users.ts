import { cardmarketCard, cheapestPrintings, eurUnit } from '../../common/cards'
import type { IScryfallCard } from '../../common/interfaces'
import { fetch_single, SCRYFALL_CONCURRENCY } from '../../common/scryfall'
import { get_mkm_id, parsePPU, parsePrice, priceClass, userFromPath } from '../utilities'
import { title_attribute } from '../page_elements'
import { mapPool } from '../../common/utilities'

export function addUserToTitle(): void {
  const name = userFromPath(window.location.pathname)
  if (!name) return

  if (!document.title.startsWith(name)) {
    document.title = `${name} - ${document.title}`
  }
}

export async function showTrend(): Promise<void> {
  const table = document.getElementById('UserOffersTable')
  if (!table) return

  table.before(trendLegend())

  const rows = [...table.querySelectorAll('[id^=articleRow], [id^=stockRow]')]
  const exacts = await mapPool(rows, SCRYFALL_CONCURRENCY, row => {
    const cardId = get_mkm_id(row)
    return cardId ? cardmarketCard(cardId) : Promise.resolve(null)
  })
  const names = await mapPool(
    rows,
    SCRYFALL_CONCURRENCY,
    async (row, i) => exacts[i]?.name ?? (await fetch_single(nameFromUrl(row)))?.name ?? '',
  )
  const cheapest = await cheapestPrintings(names)

  rows.forEach((row, i) => annotateRow(row, exacts[i], cheapest[i]))
}

// The product URL ends with a slug such as "Lightning-Bolt-V2"; only used when Scryfall
// doesn't know the Cardmarket id.
function nameFromUrl(row: Element): string {
  const slug =
    row.getElementsByClassName('col-seller')[0]?.getElementsByTagName('a')[0]?.href.split('?')[0].split('/').at(-1) ??
    ''
  return slug.replace(/-V\d+$/, '').replace(/-/g, ' ')
}

function annotateRow(row: Element, exact: IScryfallCard | null, cheapest: IScryfallCard | null): void {
  const priceElem = row.getElementsByClassName('price-container')[0]?.getElementsByClassName('fw-bold')[0]
  if (!priceElem) return

  const originalPrice = parsePrice((priceElem.textContent ?? '').replace(' €', ''))

  const playsetElems = priceElem.parentElement?.parentElement?.getElementsByClassName('text-muted')
  let ppu = 0
  if (playsetElems?.length) {
    ppu = parsePPU(playsetElems[0].textContent ?? '')
  }

  const cheapestPrice = eurUnit(cheapest) ?? 0
  const exactPrice = eurUnit(exact) ?? 0

  const cheapestClass = cheapestPrice ? priceClass(originalPrice, ppu, cheapestPrice) : ''
  const exactClass = exactPrice ? priceClass(originalPrice, ppu, exactPrice) : ''

  const isFoil = row.querySelectorAll(`[${title_attribute}="Foil"]`).length > 0
  const mainClass = isFoil ? 'boris-foil' : exactClass || cheapestClass

  const original = span(mainClass)
  original.append(...priceElem.childNodes)
  priceElem.append(original)

  if (!isFoil) {
    if (exactPrice > 0 && exact?.id !== cheapest?.id) {
      priceElem.append(document.createElement('br'), ...priceLine('E', exactClass, exactPrice, exact))
    }
    if (cheapestPrice > 0) {
      const label = exact?.id === cheapest?.id ? 'E=L' : 'L'
      priceElem.append(document.createElement('br'), ...priceLine(label, cheapestClass, cheapestPrice, cheapest))
    }
  }
}

function span(className: string, text = ''): HTMLSpanElement {
  const node = document.createElement('span')
  if (className) node.className = className
  node.textContent = text
  return node
}

function priceLine(label: string, className: string, price: number, card: IScryfallCard | null): Node[] {
  const link = document.createElement('a')
  link.className = 'boris-price-link'
  link.href = scryfallHref(card?.scryfall_uri)
  link.textContent = ` ${price.toLocaleString('it-IT', { minimumFractionDigits: 2 })} €`
  return [span(className, `${label} `), link]
}

function scryfallHref(uri: string | undefined): string {
  try {
    const url = new URL(uri ?? '')
    return url.protocol === 'https:' ? url.href : '#'
  } catch {
    return '#'
  }
}

function trendLegend(): HTMLDivElement {
  const foil = span('boris-foil', 'Foil [')
  const notSupported = document.createElement('i')
  notSupported.textContent = 'not supported'
  foil.append(notSupported, ']')

  const text = document.createElement('p')
  text.className = 'fw-bold'
  text.append(
    'E = Exact set / L = Lowest Available',
    document.createElement('br'),
    span('boris-lower', 'Lower price'),
    ' / ',
    span('boris-higher', 'Higher price'),
    ' / ',
    foil,
    ' / ',
    span('color-primary', 'Price not found'),
  )

  const legend = document.createElement('div')
  legend.append(document.createElement('hr'), text)
  return legend
}
