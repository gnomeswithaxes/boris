import { sleep } from '../../common/utilities'
import { getSyncSetting, setSyncSetting } from '../../common/storage'
import { parsePPU, parsePrice } from '../utilities'

export function addLinkToSingles(): void {
  for (const user of document.getElementsByClassName('seller-name')) {
    const link = user.getElementsByTagName('a')[0]
    if (!link?.parentElement) continue
    link.title = link.textContent?.trim() ?? ''
    const singlesLink = document.createElement('a')
    singlesLink.className = 'boris-singles-link'
    singlesLink.href = `${link.href}/Offers/Singles`
    singlesLink.target = '_blank'
    singlesLink.dataset.borisTip = 'Go to Singles'
    singlesLink.dataset.borisTipAlign = 'start'
    singlesLink.setAttribute('aria-label', 'Go to Singles')
    singlesLink.append(storefrontIcon())
    link.parentElement.classList.add('boris-seller')
    link.before(divider(), singlesLink, divider())
  }
}

function divider(): HTMLSpanElement {
  const span = document.createElement('span')
  span.className = 'boris-singles-divider'
  return span
}

function storefrontIcon(): SVGSVGElement {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('viewBox', '0 0 16 16')
  svg.setAttribute('aria-hidden', 'true')
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  // Awning with a scalloped edge, shop front, door.
  path.setAttribute('d', 'M2 6 3 2h10l1 4M2 6a2 2 0 0 0 4 0a2 2 0 0 0 4 0a2 2 0 0 0 4 0M3 8v6h10V8M6.5 14v-3.5h3V14')
  svg.append(path)
  return svg
}

export async function addCheckboxes(): Promise<void> {
  // Coerce to Number: the previous build stored `reference` as a string, so an
  // existing user's synced value can arrive as e.g. "2" and break `i === reference`.
  let reference = Number(await getSyncSetting('reference'))

  const info = document.getElementsByClassName('info-list-container')[0]
  if (!info) return

  // The last five rows are "From" followed by the four reference prices; "From" (value -1)
  // means no reference, i.e. Cardmarket's own colours.
  const rows = info.getElementsByTagName('dd')
  const nrows = 4
  const prices: number[] = []

  for (let i = -1; i < nrows; i++) {
    const elem = rows[rows.length - nrows + i]
    if (!elem) continue
    if (i >= 0) prices.push(parsePrice(elem.innerHTML))
    const price = document.createElement('span')
    price.className = 'boris-reference-price'
    price.append(...elem.childNodes)
    const radio = document.createElement('input')
    radio.type = 'radio'
    radio.name = 'reference'
    radio.value = String(i)
    if (i === reference) radio.checked = true
    elem.classList.add('boris-reference')
    elem.append(price, radio)
  }

  colorPrices(prices[reference])

  for (const radio of document.querySelectorAll<HTMLInputElement>('input[name="reference"]')) {
    radio.addEventListener('change', async () => {
      const val = parseInt(radio.value)
      await setSyncSetting('reference', val)
      reference = val
      colorPrices(prices[val])
    })
  }

  document.getElementById('loadMoreButton')?.addEventListener('click', () =>
    sleep(3000).then(() => colorPrices(prices[reference]))
  )
}

function colorPrices(referencePrice: number | undefined): void {
  for (const elem of document.getElementsByClassName('price-container')) {
    const priceElem = elem.getElementsByClassName('fw-bold')[0]
    if (!priceElem) continue

    const playsetElems = elem.getElementsByClassName('text-muted')
    let ppu = 0
    if (playsetElems.length > 0) {
      ppu = parsePPU(playsetElems[0].innerHTML)
    }

    priceElem.classList.remove('boris-lower', 'boris-higher')
    if (referencePrice === undefined) {
      priceElem.classList.add('color-primary')
      continue
    }

    priceElem.classList.remove('color-primary')
    const price = parsePrice(priceElem.innerHTML.replace(' €', ''))
    const isCheap = (ppu > 0 && ppu <= referencePrice) || price <= referencePrice
    priceElem.classList.add(isCheap ? 'boris-lower' : 'boris-higher')
  }
}
