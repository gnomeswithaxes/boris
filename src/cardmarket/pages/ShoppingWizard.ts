import type { ISavedUrl } from '../../common/interfaces'
import { cardmarketCard } from '../../common/cards'
import { fetch_single, SCRYFALL_CONCURRENCY } from '../../common/scryfall'
import { getLocalSetting } from '../../common/storage'
import { allPrintingsUrl, get_mkm_id, get_mkm_version, saveUrlCache } from '../utilities'
import { title_attribute } from '../page_elements'
import { mapPool } from '../../common/utilities'
import { prependAllPrintings } from '../icons'
import type { IScryfallCard } from '../../common/interfaces'

export function addDisclaimer(): void {
  const section = document.getElementsByClassName('card-columns')[0]
  if (!section) return
  const disclaimer = document.createElement('h4')
  const text = document.createElement('i')
  text.className = 'text-danger'
  text.textContent = 'Experimental feature, some links may be wrong'
  disclaimer.append(text, document.createElement('hr'))
  section.before(disclaimer)
}

export async function addLinkToCards(): Promise<void> {
  const saved_urls: ISavedUrl[] = (await getLocalSetting('urls')) ?? []
  const rows = [...document.getElementsByTagName('tbody')].flatMap(tbody => [...tbody.getElementsByTagName('tr')])

  // Resolve rows through a bounded pool. Each task only reads saved_urls and
  // returns any new entry; the array is mutated sequentially afterwards so
  // concurrent lookups can't race on it.
  const newEntries = await mapPool(rows, SCRYFALL_CONCURRENCY, async (row): Promise<ISavedUrl | null> => {
    const cardId = get_mkm_id(row)
    const cardVersion = get_mkm_version(row)
    const cardElem = row.getElementsByClassName('card-name')[0]
    const setTitle = row.getElementsByClassName('expansion-symbol')[0]?.getAttribute(title_attribute) ?? ''

    if (!cardId || !cardElem) return null

    const card = await cardmarketCard(cardId)
    if (!card) return null

    const saved = saved_urls.find(u => u.mkm_id === cardId)
    const url = saved?.url ?? (await format_url(card, cardVersion, setTitle))

    if (url) {
      showCardLinks(cardElem, card.name, url, allPrintingsUrl(url))
      return saved ? null : { name: card.name, mkm_id: cardId, url }
    }

    const fallback = await fetch_single(cardElem.textContent?.replace(/\(V\.\d+\)/g, '') ?? '')
    if (fallback) {
      showCardLinks(
        cardElem,
        fallback.name,
        fallback.purchase_uris?.cardmarket ?? null,
        `https://www.cardmarket.com/Magic/Cards/${slug(fallback.name)}`,
      )
    }
    return null
  })

  saved_urls.push(...newEntries.filter((e): e is ISavedUrl => e !== null))
  await saveUrlCache(saved_urls)
}

function showCardLinks(cardElem: Element, name: string, url: string | null, allPrintings: string | undefined): void {
  const nameElem = document.createElement(url ? 'a' : 'span')
  if (nameElem instanceof HTMLAnchorElement && url) {
    nameElem.href = url
    nameElem.target = '_blank'
  }
  nameElem.textContent = name
  nameElem.title = name
  cardElem.replaceChildren(nameElem)
  if (allPrintings) prependAllPrintings(nameElem, allPrintings)
}

function slug(text: string): string {
  return text
    .replace(/ \/\/ /g, '-')
    .replace(/[:,]/g, '')
    .replace(/\s+/g, '-')
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
  const url = `https://www.cardmarket.com/Magic/Products/Singles/${slug(set)}/${slug(name)}`

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
