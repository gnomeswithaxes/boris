import type { ISavedUrl } from '../../common/interfaces'
import { get_cardmarket, SCRYFALL_CONCURRENCY } from '../../common/scryfall'
import { mapPool, saveWithFilePicker } from '../../common/utilities'
import { getSyncSetting, getLocalSetting, setLocalSetting } from '../../common/storage'
import { get_mkm_id, get_mkm_url } from '../utilities'

export function addPrintListButton(): void {
  const table = document.getElementById('WantsListTable')?.getElementsByTagName('tbody')[0]
  if (!table) return

  const addDeckBtn = document.querySelectorAll("a[href$='AddDeckList']")[0]
  if (!addDeckBtn) return

  addDeckBtn.classList.add('mr-3')

  const printBtn = document.createElement('div')
  printBtn.classList.add('btn')
  printBtn.style.color = 'rgb(240, 173, 78)'
  printBtn.style.borderColor = 'rgb(240, 173, 78)'
  printBtn.textContent = 'Save as...'

  printBtn.addEventListener('click', async () => {
    const printVersion = await getSyncSetting('printVersion')
    const wantsTitle = document.getElementsByClassName('page-title-container')[0]
      ?.getElementsByTagName('h1')[0]?.textContent ?? 'wants'

    // Resolve each row's line through a bounded pool; mapPool preserves row
    // order so the exported list matches the on-page order.
    const lines = await mapPool([...table.getElementsByTagName('tr')], SCRYFALL_CONCURRENCY, async row => {
      const amount = row.querySelector('td.amount')?.getAttribute('data-amount') ?? '1'
      const name = row.querySelector('td.name a')?.textContent ?? ''

      if (printVersion) return `${amount} ${name}\n`

      const cardId = get_mkm_id(row)
      if (!cardId) return ''
      const card = await get_cardmarket(cardId)
      return `${amount} ${card?.name ?? name}\n`
    })

    saveWithFilePicker(new Blob([lines.join('')]), `${wantsTitle}.txt`)
  })

  addDeckBtn.after(printBtn)
}

export async function saveAllUrls(): Promise<void> {
  const saved_urls: ISavedUrl[] = (await getLocalSetting('urls')) ?? []
  const rows = document.getElementById('WantsListTable')
    ?.getElementsByTagName('tbody')[0]
    ?.getElementsByTagName('tr')

  if (!rows) return

  // Fetch card names in parallel through a bounded pool, then merge into
  // saved_urls sequentially so concurrent lookups don't race on the array.
  const resolved = await mapPool([...rows], SCRYFALL_CONCURRENCY, async (row): Promise<{ cardId: string; name: string; url: string } | null> => {
    const cardUrl = get_mkm_url(row)
    if (!cardUrl?.includes('/Products/Singles/')) return null

    const cardId = get_mkm_id(row)
    if (!cardId) return null

    const card = await get_cardmarket(cardId)
    if (!card?.name) return null

    return { cardId, name: card.name, url: cardUrl }
  })

  for (const entry of resolved) {
    if (!entry) continue
    const existing = saved_urls.find(u => u.mkm_id === entry.cardId)
    if (existing) {
      existing.url = entry.url
    } else {
      saved_urls.push({ name: entry.name, mkm_id: entry.cardId, url: entry.url })
    }
  }

  await setLocalSetting('urls', saved_urls)
}
