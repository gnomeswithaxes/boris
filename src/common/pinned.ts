import type { IPinnedList } from './interfaces'
import { getSyncSetting, setSyncSetting } from './storage'

// Up to 0.2.2 the format was stored as HTML inside the title: "<strong>Modern</strong> | Deck name".
const LEGACY_TITLE = /^<strong>(.*?)<\/strong> \| (.*)$/s

function htmlToText(html: string): string {
  return new DOMParser().parseFromString(html, 'text/html').body.textContent?.trim() ?? ''
}

export function canonicalDeckUrl(url: string): string {
  const { origin, pathname } = new URL(url)
  return origin + pathname
}

function normalize(list: IPinnedList): IPinnedList {
  const url = canonicalDeckUrl(list.url)
  if (list.format !== undefined || !list.title.includes('<')) {
    return { url, title: list.title, format: list.format }
  }
  const legacy = list.title.match(LEGACY_TITLE)
  return legacy
    ? { url, format: htmlToText(legacy[1]), title: htmlToText(legacy[2]) }
    : { url, title: htmlToText(list.title) }
}

const sortKey = (list: IPinnedList) => `${list.format ?? ''} ${list.title}`

export async function getPinnedLists(): Promise<IPinnedList[]> {
  const lists = (await getSyncSetting('pinned_lists')).map(normalize)
  return lists.filter((list, i) => lists.findIndex(l => l.url === list.url) === i)
}

async function savePinnedLists(lists: IPinnedList[]): Promise<void> {
  await setSyncSetting('pinned_lists', [...lists].sort((a, b) => sortKey(a).localeCompare(sortKey(b))))
}

export async function addPinnedList(list: IPinnedList): Promise<void> {
  const lists = await getPinnedLists()
  const url = canonicalDeckUrl(list.url)
  if (lists.some(l => l.url === url)) return
  await savePinnedLists([...lists, { ...list, url }])
}

export async function removePinnedList(url: string): Promise<void> {
  const target = canonicalDeckUrl(url)
  await savePinnedLists((await getPinnedLists()).filter(l => l.url !== target))
}
