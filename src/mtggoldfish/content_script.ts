import { cheapestPrintings } from '../common/cards'
import { addFavorite, canonicalDeckUrl, FavoritesFullError, getFavorites, removeFavorite } from '../common/favorites'
import { getSyncSetting } from '../common/storage'
import { logError, saveWithFilePicker } from '../common/utilities'
import { DECK_TABLE, deckFormat, deckListText, deckScope, deckTitle, isPaperTable, parseDeck } from './deck'
import { resolvePrices } from './prices'
import {
  type Action,
  ensureToolbar,
  flash,
  renderCheapest,
  renderFavorites,
  renderPrices,
  setCheapestLoading,
  setTotal,
  showCheapest,
  showUsd,
  wantsCheapest,
} from './ui'

const extensionAlive = () => Boolean(chrome.runtime?.id)
const currentUrl = () => canonicalDeckUrl(location.href)
const canFavorite = () => /^\/(deck|archetype)\//.test(location.pathname)

function paperTable(scope: ParentNode): HTMLTableElement | undefined {
  return [...scope.querySelectorAll<HTMLTableElement>(DECK_TABLE)].find(isPaperTable)
}

async function refreshFavorites(): Promise<void> {
  const decks = await getFavorites()
  document
    .querySelectorAll('.boris-nav')
    .forEach(nav => renderFavorites(deckScope(nav), decks, currentUrl(), canFavorite()))
}

async function loadCheapest(scope: HTMLElement, table: HTMLTableElement): Promise<void> {
  showCheapest(scope, true)
  if (table.dataset.borisCheapest) return
  table.dataset.borisCheapest = 'true'
  setCheapestLoading(scope, true)

  const rows = parseDeck(table)
  const cards = await cheapestPrintings(rows.map(row => row.name))
  setCheapestLoading(scope, false)
  if (!table.isConnected) return
  setTotal(scope, 'cheapest', renderCheapest(rows, cards))
}

async function processTable(table: HTMLTableElement): Promise<void> {
  table.dataset.borisProcessed = 'true'
  const rows = parseDeck(table)
  if (!rows.length) return

  const scope = deckScope(table)
  if (ensureToolbar(scope, table)) await refreshFavorites()

  const prices = await resolvePrices(rows)
  if (!table.isConnected) return
  setTotal(scope, 'price', renderPrices(rows, prices))

  if (wantsCheapest(scope) || (await getSyncSetting('auto'))) await loadCheapest(scope, table)
}

function scan(): void {
  if (!extensionAlive()) {
    observer.disconnect()
    return
  }
  document.querySelectorAll<HTMLTableElement>(DECK_TABLE).forEach(table => {
    if (!table.dataset.borisProcessed && isPaperTable(table)) processTable(table).catch(logError)
  })
}

function currentRows(scope: ParentNode) {
  const table = paperTable(scope)
  return table ? parseDeck(table) : []
}

// Clipboard and file picker are called synchronously inside the click so Safari keeps the user gesture.
function copyList(scope: HTMLElement, link: HTMLElement): void {
  const rows = currentRows(scope)
  if (!rows.length) return flash(link, 'Copy failed')
  navigator.clipboard.writeText(deckListText(rows)).then(
    () => flash(link, 'Copied'),
    () => flash(link, 'Copy failed'),
  )
}

function saveList(scope: HTMLElement, link: HTMLElement): void {
  const rows = currentRows(scope)
  if (!rows.length) return flash(link, 'Save failed')
  const name = (deckTitle(scope) ?? '').replace(/[^a-zA-Z0-9 ]+/g, '').trim() || 'deck'
  saveWithFilePicker(new Blob([deckListText(rows)], { type: 'text/plain' }), `${name}.txt`).catch(() =>
    flash(link, 'Save failed'),
  )
}

function favoriteFailed(link: HTMLElement, error: unknown): void {
  logError(error)
  flash(link, error instanceof FavoritesFullError ? 'Favorites full' : 'Not saved')
}

function onClick(event: MouseEvent): void {
  const link = (event.target as Element | null)?.closest<HTMLElement>('[data-boris-action]')
  if (!link || !extensionAlive()) return
  event.preventDefault()

  const scope = deckScope(link)
  switch (link.dataset.borisAction as Action) {
    case 'eur':
    case 'usd':
      showUsd(scope, link.dataset.borisAction === 'usd')
      break
    case 'exact':
      showCheapest(scope, false)
      break
    case 'cheapest': {
      const table = paperTable(scope)
      if (table) loadCheapest(scope, table).catch(logError)
      break
    }
    case 'copy':
      copyList(scope, link)
      break
    case 'save':
      saveList(scope, link)
      break
    case 'favorite':
      addFavorite({ url: currentUrl(), title: deckTitle(scope) ?? currentUrl(), format: deckFormat(scope) }).catch(
        error => favoriteFailed(link, error),
      )
      break
    case 'unfavorite':
      removeFavorite(link.dataset.url ?? currentUrl()).catch(error => favoriteFailed(link, error))
      break
  }
}

// MTGGoldfish renders deck tables asynchronously (Turbo streams, editor preview, view options),
// so tables are picked up whenever they appear instead of once at load.
let scanPending = false
const observer = new MutationObserver(() => {
  if (scanPending) return
  scanPending = true
  setTimeout(() => {
    scanPending = false
    scan()
  }, 100)
})

observer.observe(document.documentElement, { childList: true, subtree: true })
document.addEventListener('click', onClick)
document.addEventListener('turbo:load', () => refreshFavorites().catch(logError))
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes.favorite_decks && extensionAlive()) refreshFavorites().catch(logError)
})
scan()
