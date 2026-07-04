import { sleep } from '../../common/utilities'
import { getSyncSetting, setSyncSetting } from '../../common/storage'
import { parsePPU, parsePrice } from '../utilities'

export function addLinkToSingles(): void {
  for (const user of document.getElementsByClassName('seller-name')) {
    const link = user.getElementsByTagName('a')[0]
    if (!link) continue
    const singlesLink = document.createElement('a')
    singlesLink.href = `${link.href}/Offers/Singles`
    singlesLink.target = '_blank'
    singlesLink.textContent = 'Singles'
    link.parentElement?.append(' - ', singlesLink)
  }
}

export async function addCheckboxes(): Promise<void> {
  // Coerce to Number: the previous build stored `reference` as a string, so an
  // existing user's synced value can arrive as e.g. "2" and break `i === reference`.
  let reference = Number(await getSyncSetting('reference'))

  const info = document.getElementsByClassName('info-list-container')[0]
  if (!info) return

  const rows = info.getElementsByTagName('dd')
  const nrows = 4
  const prices: number[] = []

  for (let i = 0; i < nrows; i++) {
    const elem = rows[rows.length - nrows + i]
    if (!elem) continue
    prices.push(parsePrice(elem.innerHTML))
    const radio = document.createElement('input')
    radio.type = 'radio'
    radio.name = 'reference'
    radio.value = String(i)
    if (i === reference) radio.checked = true
    elem.append(' ', radio)
  }

  colorPrices(prices[reference] ?? 0)

  for (const radio of document.querySelectorAll<HTMLInputElement>('input[name="reference"]')) {
    radio.addEventListener('change', async () => {
      const val = parseInt(radio.value)
      await setSyncSetting('reference', val)
      reference = val
      colorPrices(prices[val] ?? 0)
    })
  }

  document.getElementById('loadMoreButton')?.addEventListener('click', () =>
    sleep(3000).then(() => colorPrices(prices[reference] ?? 0))
  )
}

function colorPrices(referencePrice: number): void {
  for (const elem of document.getElementsByClassName('price-container')) {
    const priceElem = elem.getElementsByClassName('fw-bold')[0] as HTMLElement | undefined
    if (!priceElem) continue

    const playsetElems = elem.getElementsByClassName('text-muted')
    let ppu = 0
    if (playsetElems.length > 0) {
      ppu = parsePPU(playsetElems[0].innerHTML)
    }

    priceElem.classList.remove('color-primary')
    const price = parsePrice(priceElem.innerHTML.replace(' €', ''))
    const isCheap = (ppu > 0 && ppu <= referencePrice) || price <= referencePrice
    priceElem.style.color = isCheap ? 'green' : 'red'
  }
}
