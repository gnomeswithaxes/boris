import type { IFavoriteDeck } from './interfaces'
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

function normalize(deck: IFavoriteDeck): IFavoriteDeck {
  const url = canonicalDeckUrl(deck.url)
  if (deck.format !== undefined || !deck.title.includes('<')) {
    return { url, title: deck.title, format: deck.format }
  }
  const legacy = deck.title.match(LEGACY_TITLE)
  return legacy
    ? { url, format: htmlToText(legacy[1]), title: htmlToText(legacy[2]) }
    : { url, title: htmlToText(deck.title) }
}

const sortKey = (deck: IFavoriteDeck) => `${deck.format ?? ''} ${deck.title}`

export async function getFavorites(): Promise<IFavoriteDeck[]> {
  const decks = (await getSyncSetting('favorite_decks')).map(normalize)
  return decks.filter((deck, i) => decks.findIndex(d => d.url === deck.url) === i)
}

async function saveFavorites(decks: IFavoriteDeck[]): Promise<void> {
  await setSyncSetting(
    'favorite_decks',
    [...decks].sort((a, b) => sortKey(a).localeCompare(sortKey(b))),
  )
}

export async function addFavorite(deck: IFavoriteDeck): Promise<void> {
  const decks = await getFavorites()
  const url = canonicalDeckUrl(deck.url)
  if (decks.some(d => d.url === url)) return
  await saveFavorites([...decks, { ...deck, url }])
}

export async function removeFavorite(url: string): Promise<void> {
  const target = canonicalDeckUrl(url)
  await saveFavorites((await getFavorites()).filter(d => d.url !== target))
}
