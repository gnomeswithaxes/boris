import type { IFavoriteDeck, IScryfallCard } from '../common/interfaces'
import type { DeckRow } from './deck'
import { eurUnit } from '../common/cards'
import type { PriceInfo } from './prices'

export type Action = 'eur' | 'usd' | 'exact' | 'cheapest' | 'copy' | 'save' | 'favorite' | 'unfavorite'

const SHOW_USD = 'boris-show-usd'
const SHOW_CHEAPEST = 'boris-show-cheapest'

function element<K extends keyof HTMLElementTagNameMap>(tag: K, className = '', text = ''): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag)
  if (className) node.className = className
  if (text) node.textContent = text
  return node
}

function actionButton(text: string, action: Action, className = 'boris-btn'): HTMLButtonElement {
  const button = element('button', className, text)
  button.type = 'button'
  button.dataset.borisAction = action
  return button
}

function segmented(label: string, ...buttons: HTMLButtonElement[]): HTMLElement {
  const group = element('div', 'boris-segmented')
  group.setAttribute('role', 'group')
  group.setAttribute('aria-label', label)
  group.append(...buttons)
  return group
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

  const nav = element('div', 'boris-nav')
  const favorites = element('div', 'dropdown boris-favorites')
  favorites.hidden = true
  const favorite = actionButton('☆ Favorite', 'favorite')
  favorite.hidden = true
  nav.append(
    segmented('Currency', actionButton('€ EUR', 'eur'), actionButton('$ USD', 'usd')),
    segmented('Printing', actionButton('Exact', 'exact'), actionButton('Cheapest', 'cheapest')),
    element('span', 'boris-separator'),
    actionButton('Copy', 'copy'),
    actionButton('Save as…', 'save'),
    favorite,
    favorites,
  )

  const toolbar = scope.querySelector('.deck-display-toolbar-primary') ?? scope.querySelector('ul.deck-type-menu')
  if (toolbar) toolbar.after(nav)
  else table.before(nav)

  syncToggles(scope)
  return true
}

function syncToggles(scope: HTMLElement): void {
  const pressed: Record<string, boolean> = {
    eur: !scope.classList.contains(SHOW_USD),
    usd: scope.classList.contains(SHOW_USD),
    exact: !scope.classList.contains(SHOW_CHEAPEST),
    cheapest: scope.classList.contains(SHOW_CHEAPEST),
  }
  scope.querySelectorAll<HTMLElement>('.boris-segmented [data-boris-action]').forEach(button => {
    button.setAttribute('aria-pressed', String(pressed[button.dataset.borisAction!]))
  })
}

export function showUsd(scope: HTMLElement, usd: boolean): void {
  scope.classList.toggle(SHOW_USD, usd)
  syncToggles(scope)
}

export function showCheapest(scope: HTMLElement, cheapest: boolean): void {
  scope.classList.toggle(SHOW_CHEAPEST, cheapest)
  syncToggles(scope)
}

export const wantsCheapest = (scope: HTMLElement) => scope.classList.contains(SHOW_CHEAPEST)

export function renderPrices(rows: DeckRow[], prices: PriceInfo[]): number {
  let total = 0
  rows.forEach((row, i) => {
    const cell = row.priceCell
    if (!cell) return
    const { unit, url } = prices[i]
    const value = unit === null ? null : unit * row.amount
    if (value !== null) total += value

    cell.querySelector('.boris-exact')?.remove()
    cell.classList.add('boris-price-cell')
    const eur = eurElement(value, url, 'boris-eur boris-exact')
    const usd = cell.querySelector('.deck-preview-price-value')
    if (usd) usd.after(eur)
    else cell.append(eur)
  })
  return total
}

export function renderCheapest(rows: DeckRow[], cards: Array<IScryfallCard | null>): number {
  let total = 0
  rows.forEach((row, i) => {
    const cell = row.priceCell
    if (!cell) return
    const unit = eurUnit(cards[i])
    const value = unit === null ? null : unit * row.amount
    if (value !== null) total += value

    cell.querySelector('.boris-cheap')?.remove()
    cell.classList.add('boris-price-cell')
    const eur = eurElement(value, cards[i]?.scryfall_uri ?? null, 'boris-eur boris-cheap')
    const exact = cell.querySelector('.boris-exact')
    if (exact) exact.after(eur)
    else cell.append(eur)
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

  container.querySelector(`.boris-total-${kind}`)?.remove()
  const [units, cents] = formatEur(total).split('.')
  const div = element('div', `deck-price-v2 boris-total-${kind}`, `€\u00a0${units}`)
  div.append(element('span', 'cents', `.${cents}`))
  if (kind === 'cheapest') container.prepend(div)
  else container.append(div)
}

export function setCheapestLoading(scope: HTMLElement, loading: boolean): void {
  const button = scope.querySelector<HTMLButtonElement>('.boris-nav [data-boris-action="cheapest"]')
  if (!button) return
  button.disabled = loading
  button.textContent = loading ? 'Loading…' : 'Cheapest'
}

function favoriteItem(deck: IFavoriteDeck): HTMLElement {
  const item = element('div', 'dropdown-item boris-favorite-item')
  const remove = actionButton('×', 'unfavorite', 'boris-unfavorite')
  remove.dataset.url = deck.url
  remove.setAttribute('aria-label', `Remove ${deck.title} from favorites`)

  const link = element('a', 'boris-favorite-link')
  link.href = deck.url
  if (deck.format) link.append(element('strong', '', deck.format), ' · ')
  link.append(deck.title)

  item.append(remove, link)
  return item
}

export function renderFavorites(scope: HTMLElement, decks: IFavoriteDeck[], currentUrl: string, canFavorite: boolean): void {
  const favorite = scope.querySelector<HTMLElement>('.boris-nav > [data-boris-action="favorite"], .boris-nav > [data-boris-action="unfavorite"]')
  if (favorite) {
    const isFavorite = decks.some(deck => deck.url === currentUrl)
    favorite.hidden = !canFavorite
    favorite.dataset.borisAction = isFavorite ? 'unfavorite' : 'favorite'
    favorite.dataset.url = currentUrl
    favorite.setAttribute('aria-pressed', String(isFavorite))
    favorite.textContent = isFavorite ? '★ Favorite' : '☆ Favorite'
  }

  const dropdown = scope.querySelector<HTMLElement>('.boris-nav .boris-favorites')
  if (!dropdown) return
  dropdown.hidden = !decks.length

  const toggle = element('button', 'boris-btn dropdown-toggle', 'Favorite Decks')
  toggle.type = 'button'
  toggle.dataset.bsToggle = 'dropdown'
  toggle.setAttribute('aria-expanded', 'false')
  const menu = element('div', 'dropdown-menu dropdown-menu-end')
  menu.append(...decks.map(favoriteItem))
  dropdown.replaceChildren(toggle, menu)
}

export function flash(button: HTMLElement, text: string): void {
  const original = button.dataset.label ?? button.textContent ?? ''
  button.dataset.label = original
  button.textContent = text
  setTimeout(() => {
    button.textContent = original
    delete button.dataset.label
  }, 2000)
}
