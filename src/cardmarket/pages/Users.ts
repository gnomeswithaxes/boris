import { get_cheapest, get_cardmarket, SCRYFALL_CONCURRENCY } from '../../common/scryfall'
import { get_mkm_id, parsePPU, parsePrice } from '../utilities'
import { title_attribute } from '../page_elements'
import { mapPool } from '../../common/utilities'

export async function showTrend(): Promise<void> {
  const table = document.getElementById('UserOffersTable')
  if (!table) return

  const legend = document.createElement('div')
  legend.innerHTML = `
    <hr>
    <p class="font-weight-bold">
      E = Exact set / L = Lowest Available<br>
      <span style="color:green">Lower price</span> /
      <span style="color:red">Higher price</span> /
      <span style="color:darkviolet">Foil [<i>not supported</i>]</span> /
      <span class="color-primary">Price not found</span>
    </p>
  `
  table.before(legend)

  const rows = table.querySelectorAll('[id^=articleRow]')
  // Annotate rows through a bounded pool so lookups overlap instead of blocking
  // each row on the previous row's two requests.
  await mapPool([...rows], SCRYFALL_CONCURRENCY, annotateRow)
}

async function annotateRow(row: Element): Promise<void> {
  const cardUrl = row.getElementsByClassName('col-seller')[0]
    ?.getElementsByTagName('a')[0]?.href.split('?')[0].split('/') ?? []

  const cardName = cardUrl.at(-1)?.replace(/-V\d+/, '') ?? ''
  const cardId = get_mkm_id(row)

  const [cheapest, exact] = await Promise.all([
    get_cheapest(cardName),
    get_cardmarket(cardId),
  ])

  const priceElem = row.getElementsByClassName('price-container')[0]
    ?.getElementsByClassName('fw-bold')[0]
  if (!priceElem) return

  const originalPrice = parsePrice(priceElem.innerHTML.replace(' €', ''))

  const playsetElems = priceElem.parentElement?.parentElement?.getElementsByClassName('text-muted')
  let ppu = 0
  if (playsetElems?.length) {
    ppu = parsePPU(playsetElems[0].innerHTML)
  }

  const cheapestPrice = cheapest ? parseFloat(cheapest.prices?.eur ?? cheapest.prices?.eur_foil ?? '0') : 0
  const exactPrice = exact ? parseFloat(exact.prices?.eur ?? exact.prices?.eur_foil ?? '0') : 0

  const cheapestColor = cheapestPrice ? color_from_price(originalPrice, cheapestPrice, ppu) : ''
  const exactColor = exactPrice ? color_from_price(originalPrice, exactPrice, ppu) : ''

  const isFoil = row.querySelectorAll(`[${title_attribute}="Foil"]`).length > 0
  // Prefer the exact-set comparison for the headline colour when it's known;
  // only fall back to the cheapest-print comparison when there's no exact price.
  const mainColor = isFoil ? 'darkviolet' : (exactColor || cheapestColor)

  priceElem.innerHTML = `<span style="color:${mainColor}">${priceElem.innerHTML}</span>`

  if (!isFoil) {
    if (exactPrice > 0 && exact?.id !== cheapest?.id) {
      priceElem.innerHTML += `<br><span style="color:${exactColor}">E </span><a style="color:black" href="${exact?.scryfall_uri ?? '#'}"> ${exactPrice.toLocaleString('it-IT', { minimumFractionDigits: 2 })} €</a>`
    }
    if (cheapestPrice > 0) {
      const label = exact?.id === cheapest?.id ? 'E=L' : 'L'
      priceElem.innerHTML += `<br><span style="color:${cheapestColor}">${label} </span><a style="color:black" href="${cheapest?.scryfall_uri ?? '#'}"> ${cheapestPrice.toLocaleString('it-IT', { minimumFractionDigits: 2 })} €</a>`
    }
  }
}

function color_from_price(oldPrice: number, newPrice: number, ppu: number): string {
  return (ppu > 0 && ppu > newPrice) || oldPrice > newPrice ? 'red' : 'green'
}
