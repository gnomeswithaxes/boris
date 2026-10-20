import type { IPinnedList, IScryfallCard } from '../common/interfaces'
import type { DeckRow } from './deck'
import { eurUnit } from '../common/cards'
import type { PriceInfo } from './prices'

export type Action = 'toggle' | 'cheapest' | 'copy' | 'save' | 'pin' | 'unpin'

const SHOW_USD = 'boris-show-usd'

function element<K extends keyof HTMLElementTagNameMap>(tag: K, className = '', text = ''): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag)
  if (className) node.className = className
  if (text) node.textContent = text
  return node
}

function actionLink(text: string, action: Action, className = 'nav-link'): HTMLAnchorElement {
  const link = element('a', className, text)
  link.href = '#'
  link.setAttribute('role', 'button')
  link.dataset.borisAction = action
  return link
}

function navButton(text: string, action: Action): HTMLLIElement {
  const item = element('li', 'nav-item')
  item.append(actionLink(text, action))
  return item
}

const formatEur = (value: number) =>
  value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

function eurElement(value: number | null, url: string | null, className: string): HTMLElement {
  const node = url ? element('a') : element('span')
  if (node instanceof HTMLAnchorElement && url) node.href = url
  node.className = value === null ? `${className} boris-na` : className
  node.textContent = `€\u00a0${value === null ? 'n/a' : formatEur(value)}`
  return node
}

export function ensureToolbar(scope: HTMLElement, table: HTMLTableElement): boolean {
  scope.classList.add('boris-scope')
  if (scope.querySelector('.boris-nav')) return false

  const nav = element('ul', 'nav nav-pills deck-type-menu boris-nav')
  const pinned = element('li', 'dropdown nav-item boris-pinned')
  pinned.hidden = true
  nav.append(
    navButton('Boris', 'toggle'),
    navButton('Cheapest', 'cheapest'),
    navButton('Copy', 'copy'),
    navButton('Save as...', 'save'),
    navButton('Pin', 'pin'),
    pinned,
  )

  const menu = scope.querySelector('ul.deck-type-menu:not(.boris-nav)')
  if (menu) menu.after(nav)
  else table.before(nav)

  syncToggle(scope)
  return true
}

function syncToggle(scope: HTMLElement): void {
  const showingEur = !scope.classList.contains(SHOW_USD)
  const toggle = scope.querySelector('.boris-nav [data-boris-action="toggle"]')
  toggle?.classList.toggle('btn-online', showingEur)
  toggle?.classList.toggle('btn-online-muted', !showingEur)
}

export function toggleCurrency(scope: HTMLElement): void {
  scope.classList.toggle(SHOW_USD)
  syncToggle(scope)
}

export function renderPrices(rows: DeckRow[], prices: PriceInfo[]): number {
  let total = 0
  rows.forEach((row, i) => {
    const cell = row.priceCell
    if (!cell) return
    const { unit, url } = prices[i]
    const value = unit === null ? null : unit * row.amount
    if (value !== null) total += value

    cell.querySelector('.boris-eur')?.remove()
    cell.classList.add('boris-price-cell')
    const eur = eurElement(value, url, 'boris-eur')
    const usd = cell.querySelector('.deck-preview-price-value')
    if (usd) usd.after(eur)
    else cell.append(eur)
  })
  return total
}

export function renderCheapest(table: HTMLTableElement, rows: DeckRow[], cards: Array<IScryfallCard | null>): number {
  table.querySelectorAll<HTMLTableCellElement>('tr.deck-category-header > th').forEach(th => th.colSpan++)

  let total = 0
  rows.forEach((row, i) => {
    const unit = eurUnit(cards[i])
    const value = unit === null ? null : unit * row.amount
    if (value !== null) total += value

    const cell = element('td', 'text-end boris-cheapest-cell')
    cell.append(eurElement(value, cards[i]?.scryfall_uri ?? null, 'boris-cheapest-eur'))
    row.row.append(cell)
  })
  return total
}

export function setTotal(scope: HTMLElement, kind: 'price' | 'cheapest', total: number): void {
  let container = scope.querySelector('.header-prices-boris')
  if (!container) {
    const anchor = scope.querySelector('div.header-prices-currency')
    if (!anchor) return
    container = element('div', 'header-prices-currency header-prices-boris')
    anchor.after(container)
  }

  container.querySelector(`.boris-${kind}`)?.remove()
  const [units, cents] = formatEur(total).split('.')
  const div = element('div', `deck-price-v2 boris-${kind}`, `€\u00a0${units}`)
  div.append(element('span', 'cents', `.${cents}`))
  if (kind === 'cheapest') container.prepend(div)
  else container.append(div)
}

export function setCheapestButton(scope: HTMLElement, state: 'loading' | 'done'): void {
  const button = scope.querySelector<HTMLElement>('.boris-nav [data-boris-action="cheapest"]')
  if (!button) return
  button.textContent = 'Loading...'
  button.parentElement!.hidden = state === 'done'
}

function pinnedItem(list: IPinnedList): HTMLElement {
  const item = element('div', 'dropdown-item')
  const remove = actionLink('X', 'unpin', 'boris-unpin')
  remove.dataset.url = list.url

  const link = element('a', 'boris-pinned-link')
  link.href = list.url
  if (list.format) link.append(element('strong', '', list.format), ' | ')
  link.append(list.title)

  item.append(remove, link)
  return item
}

export function renderPins(scope: HTMLElement, lists: IPinnedList[], currentUrl: string, canPin: boolean): void {
  const pin = scope.querySelector<HTMLElement>('.boris-nav [data-boris-action="pin"], .boris-nav [data-boris-action="unpin"]')
  if (pin) {
    const isPinned = lists.some(list => list.url === currentUrl)
    pin.parentElement!.hidden = !canPin
    pin.dataset.borisAction = isPinned ? 'unpin' : 'pin'
    pin.dataset.url = currentUrl
    pin.textContent = isPinned ? 'Pinned' : 'Pin'
  }

  const dropdown = scope.querySelector<HTMLElement>('.boris-nav .boris-pinned')
  if (!dropdown) return
  dropdown.hidden = !lists.length

  const toggle = element('a', 'nav-link dropdown-toggle', 'Pinned Lists')
  toggle.href = '#'
  toggle.setAttribute('role', 'button')
  toggle.dataset.bsToggle = 'dropdown'
  const menu = element('div', 'dropdown-menu')
  menu.append(...lists.map(pinnedItem))
  dropdown.replaceChildren(toggle, menu)
}

export function flash(link: HTMLElement, text: string): void {
  const original = link.dataset.label ?? link.textContent ?? ''
  link.dataset.label = original
  link.textContent = text
  setTimeout(() => {
    link.textContent = original
    delete link.dataset.label
  }, 2000)
}
