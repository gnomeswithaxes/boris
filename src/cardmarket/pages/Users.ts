import { cardmarketCard, cheapestPrintings, eurUnit } from '../../common/cards'
import type { IScryfallCard } from '../../common/interfaces'
import { fetch_single, SCRYFALL_CONCURRENCY } from '../../common/scryfall'
import { get_mkm_id, parsePPU, parsePrice } from '../utilities'
import { title_attribute } from '../page_elements'
import { mapPool } from '../../common/utilities'

export function addUserToTitle(): void {
  const parts = window.location.pathname.split('/')
  const user = parts[parts.indexOf('Users') + 1]
  if (!user) return

  const name = decodeURIComponent(user)
  if (!document.title.startsWith(name)) {
    document.title = `${name} - ${document.title}`
  }
}

export async function showTrend(): Promise<void> {
  const table = document.getElementById('UserOffersTable')
  if (!table) return

  const legend = document.createElement('div')
  legend.innerHTML = `
    <hr>
    <p class="font-weight-bold">
      E = Exact set / L = Lowest Available<br>
      <span class="boris-lower">Lower price</span> /
      <span class="boris-higher">Higher price</span> /
      <span class="boris-foil">Foil [<i>not supported</i>]</span> /
      <span class="color-primary">Price not found</span>
    </p>
  `
  table.before(legend)

  const rows = [...table.querySelectorAll('[id^=articleRow], [id^=stockRow]')]
  const exacts = await mapPool(rows, SCRYFALL_CONCURRENCY, row => {
    const cardId = get_mkm_id(row)
    return cardId ? cardmarketCard(cardId) : Promise.resolve(null)
  })
  const names = await mapPool(rows, SCRYFALL_CONCURRENCY, async (row, i) =>
    exacts[i]?.name ?? (await fetch_single(nameFromUrl(row)))?.name ?? '')
  const cheapest = await cheapestPrintings(names)

  rows.forEach((row, i) => annotateRow(row, exacts[i], cheapest[i]))
}

// The product URL ends with a slug such as "Lightning-Bolt-V2"; only used when Scryfall
// doesn't know the Cardmarket id.
function nameFromUrl(row: Element): string {
  const slug = row.getElementsByClassName('col-seller')[0]
    ?.getElementsByTagName('a')[0]?.href.split('?')[0].split('/').at(-1) ?? ''
  return slug.replace(/-V\d+$/, '').replace(/-/g, ' ')
}

function annotateRow(row: Element, exact: IScryfallCard | null, cheapest: IScryfallCard | null): void {
  const priceElem = row.getElementsByClassName('price-container')[0]
    ?.getElementsByClassName('fw-bold')[0]
  if (!priceElem) return

  const originalPrice = parsePrice(priceElem.innerHTML.replace(' €', ''))

  const playsetElems = priceElem.parentElement?.parentElement?.getElementsByClassName('text-muted')
  let ppu = 0
  if (playsetElems?.length) {
    ppu = parsePPU(playsetElems[0].innerHTML)
  }

  const cheapestPrice = eurUnit(cheapest) ?? 0
  const exactPrice = eurUnit(exact) ?? 0

  const cheapestClass = cheapestPrice ? class_from_price(originalPrice, cheapestPrice, ppu) : ''
  const exactClass = exactPrice ? class_from_price(originalPrice, exactPrice, ppu) : ''

  const isFoil = row.querySelectorAll(`[${title_attribute}="Foil"]`).length > 0
  // Prefer the exact-set comparison for the headline colour when it's known;
  // only fall back to the cheapest-print comparison when there's no exact price.
  const mainClass = isFoil ? 'boris-foil' : (exactClass || cheapestClass)

  priceElem.innerHTML = `<span class="${mainClass}">${priceElem.innerHTML}</span>`

  if (!isFoil) {
    if (exactPrice > 0 && exact?.id !== cheapest?.id) {
      priceElem.innerHTML += `<br><span class="${exactClass}">E </span><a class="boris-price-link" href="${exact?.scryfall_uri ?? '#'}"> ${exactPrice.toLocaleString('it-IT', { minimumFractionDigits: 2 })} €</a>`
    }
    if (cheapestPrice > 0) {
      const label = exact?.id === cheapest?.id ? 'E=L' : 'L'
      priceElem.innerHTML += `<br><span class="${cheapestClass}">${label} </span><a class="boris-price-link" href="${cheapest?.scryfall_uri ?? '#'}"> ${cheapestPrice.toLocaleString('it-IT', { minimumFractionDigits: 2 })} €</a>`
    }
  }
}

function class_from_price(oldPrice: number, newPrice: number, ppu: number): string {
  return (ppu > 0 && ppu > newPrice) || oldPrice > newPrice ? 'boris-higher' : 'boris-lower'
}
