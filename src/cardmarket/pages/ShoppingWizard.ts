import type { ISavedUrl } from '../../common/interfaces'
import { get_cardmarket, fetch_single, SCRYFALL_CONCURRENCY } from '../../common/scryfall'
import { getLocalSetting, setLocalSetting } from '../../common/storage'
import { get_mkm_id, get_mkm_version } from '../utilities'
import { title_attribute } from '../page_elements'
import { mapPool } from '../../common/utilities'
import type { IScryfallCard } from '../../common/interfaces'

export function addDisclaimer(): void {
  const section = document.getElementsByClassName('card-columns')[0]
  if (!section) return
  const disclaimer = document.createElement('h4')
  disclaimer.innerHTML = "<i style='color:red'>Experimental feature, some links may be wrong</i><hr>"
  section.before(disclaimer)
}

export async function addLinkToCards(): Promise<void> {
  const saved_urls: ISavedUrl[] = (await getLocalSetting('urls')) ?? []
  const rows = [...document.getElementsByTagName('tbody')]
    .flatMap(tbody => [...tbody.getElementsByTagName('tr')])

  // Resolve rows through a bounded pool. Each task only reads saved_urls and
  // returns any new entry; the array is mutated sequentially afterwards so
  // concurrent lookups can't race on it.
  const newEntries = await mapPool(rows, SCRYFALL_CONCURRENCY, async (row): Promise<ISavedUrl | null> => {
    const cardId = get_mkm_id(row)
    const cardVersion = get_mkm_version(row)
    const cardElem = row.getElementsByClassName('card-name')[0]
    const setTitle = row.getElementsByClassName('expansion-symbol')[0]?.getAttribute(title_attribute) ?? ''

    if (!cardId || !cardElem) return null

    const card = await get_cardmarket(cardId)
    if (!card) return null

    const saved = saved_urls.find(u => u.mkm_id === cardId)
    const url = saved?.url ?? await format_url(card, cardVersion, setTitle)

    if (url) {
      const allPrintings = card.purchase_uris?.cardmarket
        ? `<br>/ <a href='${card.purchase_uris.cardmarket}' target='_blank'>All printings</a>`
        : ''
      cardElem.innerHTML = `<a href='${url}' target='_blank'>${card.name}</a>${allPrintings}`
      return saved ? null : { name: card.name, mkm_id: cardId, url }
    }

    const fallback = await fetch_single(cardElem.textContent?.replace(/\(V\.\d+\)/g, '') ?? '')
    if (fallback?.purchase_uris?.cardmarket) {
      cardElem.innerHTML = `<a href='${fallback.purchase_uris.cardmarket}' target='_blank'>${fallback.name}<br>(All)</a>`
    }
    return null
  })

  saved_urls.push(...newEntries.filter((e): e is ISavedUrl => e !== null))
  await setLocalSetting('urls', saved_urls)
}

async function format_url(card: IScryfallCard, version: string, setTitle: string): Promise<string> {
  if (!card.name) return ''

  let name = card.name
  let set: string

  if (version) {
    set = setTitle
    name += ` V${version}`
  } else {
    const setType = setTitle.split(':').at(-1) ?? ''
    if (!card.set_name.includes('Extras') && !card.set_name.includes('Promos')) {
      set = card.set_name + (setType.includes('Extras') || setType.includes('Promos') ? setType : '')
    } else {
      set = card.set_name
    }
  }

  set = set.replace(' Set ', ' ')
  const path = (set + '/' + name)
    .replace(/ \/\/ /g, '-')
    .replace(/:/g, '')
    .replace(/,/g, '')
    .replace(/\s+/g, '-')
  const url = `https://www.cardmarket.com/Magic/Products/Singles/${path}`

  if (!url.includes("'")) return url

  for (const replacement of ['', '-']) {
    const candidate = url.replace(/'/g, replacement)
    try {
      const response = await fetch(candidate)
      if (response.ok && urls_are_equal(response.url, candidate)) return candidate
    } catch {
      // try next replacement
    }
  }

  return ''
}

function urls_are_equal(url1: string, url2: string): boolean {
  return url1.split('/').at(-1) === url2.split('/').at(-1)
}
