import { getSessionSetting, setSessionSetting } from '../../common/storage'
import { allPrintingsUrl, userFromPath } from '../utilities'
import { prependAllPrintings } from '../icons'

export function saveCartSellers(): Promise<void> {
  const sellers = [...document.querySelectorAll<HTMLAnchorElement>('.shipment-block a[href*="/Users/"]')]
    .map(link => userFromPath(link.pathname))
    .filter((seller): seller is string => !!seller)
  return setSessionSetting('cartSellers', [...new Set(sellers)])
}

export function addAllPrintingsToCart(): void {
  for (const name of document.querySelectorAll<HTMLAnchorElement>('.shipment-block td.name a')) {
    const href = allPrintingsUrl(name.href)
    if (href) prependAllPrintings(name, href)
  }
}

export async function highlightCartSellers(): Promise<void> {
  const sellers = new Set(await getSessionSetting('cartSellers') ?? [])
  if (!sellers.size) return

  const highlight = () => {
    for (const row of document.querySelectorAll('[id^=articleRow], [id^=stockRow]')) {
      const href = row.querySelector<HTMLAnchorElement>('.seller-name a')?.pathname ?? ''
      const seller = userFromPath(href)
      row.classList.toggle('boris-in-cart', !!seller && sellers.has(seller))
    }
  }

  highlight()
  // "Load more" appends offer rows without a page load.
  const table = document.querySelector('[id^=articleRow], [id^=stockRow]')?.parentElement
  if (table) new MutationObserver(highlight).observe(table, { childList: true })
}
