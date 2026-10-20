import { cheapestPrintings } from '../common/cards'
import { addPinnedList, canonicalDeckUrl, getPinnedLists, removePinnedList } from '../common/pinned'
import { getSyncSetting } from '../common/storage'
import { saveWithFilePicker } from '../common/utilities'
import { DECK_TABLE, deckFormat, deckListText, deckScope, deckTitle, isPaperTable, parseDeck } from './deck'
import { resolvePrices } from './prices'
import {
  type Action, ensureToolbar, flash, setCheapestButton, renderCheapest, renderPins, renderPrices, setTotal, toggleCurrency,
} from './ui'

const extensionAlive = () => Boolean(chrome.runtime?.id)
const currentUrl = () => canonicalDeckUrl(location.href)
const canPin = () => /^\/(deck|archetype)\//.test(location.pathname)

function paperTable(scope: ParentNode): HTMLTableElement | undefined {
  return [...scope.querySelectorAll<HTMLTableElement>(DECK_TABLE)].find(isPaperTable)
}

async function refreshPins(): Promise<void> {
  const lists = await getPinnedLists()
  document.querySelectorAll('.boris-nav').forEach(nav => renderPins(deckScope(nav), lists, currentUrl(), canPin()))
}

async function showCheapest(scope: HTMLElement, table: HTMLTableElement): Promise<void> {
  scope.dataset.borisCheapest = 'true'
  if (table.dataset.borisCheapest) return
  table.dataset.borisCheapest = 'true'
  setCheapestButton(scope, 'loading')

  const rows = parseDeck(table)
  const cards = await cheapestPrintings(rows.map(row => row.name))
  if (!table.isConnected) return
  setTotal(scope, 'cheapest', renderCheapest(table, rows, cards))
  setCheapestButton(scope, 'done')
}

async function processTable(table: HTMLTableElement): Promise<void> {
  table.dataset.borisProcessed = 'true'
  const rows = parseDeck(table)
  if (!rows.length) return

  const scope = deckScope(table)
  if (ensureToolbar(scope, table)) await refreshPins()

  const prices = await resolvePrices(rows)
  if (!table.isConnected) return
  setTotal(scope, 'price', renderPrices(rows, prices))

  if (scope.dataset.borisCheapest || await getSyncSetting('auto')) await showCheapest(scope, table)
}

function scan(): void {
  if (!extensionAlive()) {
    observer.disconnect()
    return
  }
  document.querySelectorAll<HTMLTableElement>(DECK_TABLE).forEach(table => {
    if (!table.dataset.borisProcessed && isPaperTable(table)) void processTable(table)
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
  navigator.clipboard.writeText(deckListText(rows)).then(() => flash(link, 'Copied'), () => flash(link, 'Copy failed'))
}

function saveList(scope: HTMLElement, link: HTMLElement): void {
  const rows = currentRows(scope)
  if (!rows.length) return flash(link, 'Save failed')
  const name = (deckTitle(scope) ?? '').replace(/[^a-zA-Z0-9 ]+/g, '').trim() || 'deck'
  saveWithFilePicker(new Blob([deckListText(rows)], { type: 'text/plain' }), `${name}.txt`)
    .catch(() => flash(link, 'Save failed'))
}

function onClick(event: MouseEvent): void {
  const link = (event.target as Element | null)?.closest<HTMLElement>('[data-boris-action]')
  if (!link || !extensionAlive()) return
  event.preventDefault()

  const scope = deckScope(link)
  switch (link.dataset.borisAction as Action) {
    case 'toggle':
      toggleCurrency(scope)
      break
    case 'cheapest': {
      const table = paperTable(scope)
      if (table) void showCheapest(scope, table)
      break
    }
    case 'copy':
      copyList(scope, link)
      break
    case 'save':
      saveList(scope, link)
      break
    case 'pin':
      void addPinnedList({ url: currentUrl(), title: deckTitle(scope) ?? currentUrl(), format: deckFormat(scope) })
      break
    case 'unpin':
      void removePinnedList(link.dataset.url ?? currentUrl())
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
document.addEventListener('turbo:load', () => void refreshPins())
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes.pinned_lists && extensionAlive()) void refreshPins()
})
scan()
