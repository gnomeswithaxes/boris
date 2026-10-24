import type { ISavedUrl } from '../../common/interfaces'
import { cardmarketCard } from '../../common/cards'
import { SCRYFALL_CONCURRENCY } from '../../common/scryfall'
import { mapPool, saveWithFilePicker } from '../../common/utilities'
import { getSyncSetting, getLocalSetting } from '../../common/storage'
import { get_mkm_id, get_mkm_url, saveUrlCache } from '../utilities'

export function addPrintListButton(): void {
  const table = document.getElementById('WantsListTable')?.getElementsByTagName('tbody')[0]
  if (!table) return

  const addDeckBtn = document.querySelectorAll("a[href$='AddDeckList']")[0]
  if (!addDeckBtn) return

  addDeckBtn.classList.add('me-2')

  const printBtn = document.createElement('button')
  printBtn.type = 'button'
  printBtn.className = 'btn btn-outline-warning'
  printBtn.textContent = 'Save as...'

  printBtn.addEventListener('click', () => {
    const wantsTitle =
      document.getElementsByClassName('page-title-container')[0]?.getElementsByTagName('h1')[0]?.textContent ?? 'wants'

    printBtn.disabled = true
    printBtn.textContent = 'Loading…'
    const contents = wantsListBlob(table)
    contents
      .finally(() => {
        printBtn.disabled = false
        printBtn.textContent = 'Save as...'
      })
      .catch(() => {})

    saveWithFilePicker(contents, `${wantsTitle}.txt`).catch(() => {
      printBtn.textContent = 'Save failed'
      setTimeout(() => (printBtn.textContent = 'Save as...'), 2000)
    })
  })

  addDeckBtn.after(printBtn)
}

async function wantsListBlob(table: HTMLTableSectionElement): Promise<Blob> {
  const printVersion = await getSyncSetting('printVersion')
  const lines = await mapPool([...table.getElementsByTagName('tr')], SCRYFALL_CONCURRENCY, async row => {
    const amount = row.querySelector('td.amount')?.getAttribute('data-amount') ?? '1'
    const name = row.querySelector('td.name a')?.textContent ?? ''

    if (printVersion) return `${amount} ${name}\n`

    const cardId = get_mkm_id(row)
    if (!cardId) return `${amount} ${name}\n`
    const card = await cardmarketCard(cardId)
    return `${amount} ${card?.name ?? name}\n`
  })
  return new Blob([lines.join('')], { type: 'text/plain' })
}

export async function saveAllUrls(): Promise<void> {
  const saved_urls: ISavedUrl[] = (await getLocalSetting('urls')) ?? []
  const rows = document.getElementById('WantsListTable')?.getElementsByTagName('tbody')[0]?.getElementsByTagName('tr')

  if (!rows) return

  // Fetch card names in parallel through a bounded pool, then merge into
  // saved_urls sequentially so concurrent lookups don't race on the array.
  const resolved = await mapPool(
    [...rows],
    SCRYFALL_CONCURRENCY,
    async (row): Promise<{ cardId: string; name: string; url: string } | null> => {
      const cardUrl = get_mkm_url(row)
      if (!cardUrl?.includes('/Products/Singles/')) return null

      const cardId = get_mkm_id(row)
      if (!cardId) return null

      const card = await cardmarketCard(cardId)
      if (!card?.name) return null

      return { cardId, name: card.name, url: cardUrl }
    },
  )

  for (const entry of resolved) {
    if (!entry) continue
    const existing = saved_urls.find(u => u.mkm_id === entry.cardId)
    if (existing) {
      existing.url = entry.url
    } else {
      saved_urls.push({ name: entry.name, mkm_id: entry.cardId, url: entry.url })
    }
  }

  await saveUrlCache(saved_urls)
}
