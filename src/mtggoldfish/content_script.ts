import { get_cheapest, fetch_cards } from '../common/scryfall'
import { navButtonFactory, newDropdownItem, setCheapestTotal, setTotal } from './components'
import type { IScryfallCard } from '../common/interfaces'
import { get_printable_list_blob, get_title, parse_row, saveToPC } from './utilities'
import { sleep } from '../common/utilities'
import { getSyncSetting, setSyncSetting } from '../common/storage'

interface PageState {
  total: number
  sizeToggle: boolean
  card_list: IScryfallCard[]
}

interface BorisComponents {
  prices: Element
  nav: Element
  toggleOuter: Element
  toggle: Element
  clipboard: Element
  saveAs: Element
  cheapest: Element
  pinButton: Element
  unpinButton: Element
}

let state: PageState = { total: 0, sizeToggle: true, card_list: [] }
let boris: BorisComponents | null = null

function removePinnedList(toDelete: string): void {
  getSyncSetting('pinned_lists').then(lists => {
    if (!boris) return
    if (toDelete === window.location.href) {
      boris.nav.appendChild(boris.pinButton)
      boris.pinButton.addEventListener('click', addToPinnedDecksList)
      boris.unpinButton.remove()
    }

    const updated = lists.filter(l => l.url !== toDelete)
    if (!updated.length) document.getElementById('saved-lists-dropdown')?.remove()
    setSyncSetting('pinned_lists', updated).then(() => updatePinnedListsDropdown())
  })
}

function togglePinDeck(): void {
  if (!boris) return
  boris.pinButton.remove()
  boris.nav.appendChild(boris.unpinButton)
  boris.unpinButton.addEventListener('click', () => removePinnedList(window.location.href))
}

function updatePinnedListsDropdown(): void {
  getSyncSetting('pinned_lists').then(lists => {
    if (!lists.length || !boris) return

    if (lists.some(l => l.url === window.location.href)) togglePinDeck()

    document.getElementById('saved-lists-dropdown')?.remove()

    const li = document.createElement('li')
    li.style.padding = '0.5em'
    li.id = 'saved-lists-dropdown'
    li.classList.add('dropdown', 'nav-item')

    const a = document.createElement('a')
    a.classList.add('nav-link', 'dropdown-toggle')
    a.textContent = 'Pinned Lists'
    a.href = '#'
    a.addEventListener('click', e => {
      e.preventDefault()
      e.stopPropagation()
      div.classList.toggle('show')
    })

    const div = document.createElement('div')
    div.classList.add('dropdown-menu')

    document.addEventListener('click', () => div.classList.remove('show'), { capture: false })

    document.head.insertAdjacentHTML('beforeend', `<style>
      .dropdown-item:hover,.dropdown-item:focus{background-color:#d6d6d6}
      @media (prefers-color-scheme:dark){
        #saved-lists-dropdown .dropdown-menu{background-color:#2d2d2d;color:#fff}
        #saved-lists-dropdown .dropdown-item{color:#fff}
        #saved-lists-dropdown .dropdown-item:hover,#saved-lists-dropdown .dropdown-item:focus{background-color:#444}
      }
    </style>`)

    for (const list of lists) {
      div.appendChild(newDropdownItem(list, removePinnedList))
    }

    li.appendChild(a)
    li.appendChild(div)
    boris.nav.appendChild(li)
  })
}

// Extract a real EUR unit price, or null when Scryfall has no EUR price for the
// card. Returning null (rather than 0) lets callers distinguish "unpriced" from
// a genuine €0.00 instead of silently rendering a fake price.
function eur_unit_price(card: IScryfallCard | null | undefined): number | null {
  const raw = card?.prices?.eur ?? card?.prices?.eur_foil
  return raw != null ? parseFloat(raw) : null
}

async function convertPrice(row: ReturnType<typeof parse_row>, card: IScryfallCard): Promise<void> {
  if (!row) return

  let unit: number | null
  if ((!card.prices?.eur && !card.prices?.eur_foil) || card.border_color === 'gold') {
    unit = eur_unit_price(await get_cheapest(card.name))
  } else {
    unit = eur_unit_price(card)
  }

  const cardUri = card.purchase_uris?.cardmarket ?? card.scryfall_uri

  if (unit === null) {
    // No EUR price available — flag it in orange (matching the not-found
    // convention elsewhere) instead of showing €0.00, and leave the total alone.
    // The colour lives on an inner span so togglePrices' setAttribute('style', …)
    // on .boris-eur-price doesn't wipe it.
    row.price.innerHTML =
      `<a style="color:inherit" href="${cardUri}">` +
      `<span class="boris-usd-price"${state.sizeToggle ? '' : " style='font-size:0'"}>${row.price.innerHTML}</span>` +
      `<span class="boris-eur-price"${state.sizeToggle ? " style='font-size:0'" : ''}><span style="color:orange"> €&nbsp;n/a</span></span>` +
      `</a>`
    return
  }

  const eurPrice = unit * row.amount
  const formatted = eurPrice.toLocaleString('en-us', { minimumFractionDigits: 2 })

  row.price.innerHTML =
    `<a style="color:inherit" href="${cardUri}">` +
    `<span class="boris-usd-price"${state.sizeToggle ? '' : " style='font-size:0'"}>${row.price.innerHTML}</span>` +
    `<span class="boris-eur-price"${state.sizeToggle ? " style='font-size:0'" : ''}> €&nbsp;${formatted}</span>` +
    `</a>`

  state.total += eurPrice
}

async function convertAllPrices(): Promise<void> {
  const rows = document.querySelector('table.deck-view-deck-table')
    ?.querySelectorAll('tr:not(.deck-category-header)')
  if (!rows) return

  for (const tr of rows) {
    const row = parse_row(tr.querySelectorAll('td'))
    if (!row) continue
    const card = state.card_list.find(c => c.name.toLowerCase().includes(row.name.toLowerCase()))
    if (card) {
      await convertPrice(row, card)
    } else {
      row.price.innerHTML = `<span style="color:orange">${row.price.innerHTML}</span>`
    }
  }
}

async function addCheapestPrices(): Promise<void> {
  if (!boris) return
  boris.cheapest.remove()

  if (!state.card_list.length) return

  const cheapestCards = await Promise.all(state.card_list.map(c => get_cheapest(c.name)))

  document.querySelectorAll('tr.deck-category-header>th').forEach(th => {
    (th as HTMLTableCellElement).colSpan = 5
  })

  let total = 0
  for (const priceElem of document.querySelectorAll('.boris')) {
    const row = parse_row(priceElem.parentElement!.querySelectorAll('td'))
    if (!row) continue

    const card = cheapestCards.find(c => c?.name?.toLowerCase().includes(row.name.toLowerCase()))
    const td = document.createElement('td')
    td.classList.add('text-right')

    if (card) {
      const eurPrice = parseFloat(card.prices?.eur ?? card.prices?.eur_foil ?? '0') * row.amount
      total += eurPrice
      const formatted = eurPrice.toLocaleString('en-us', { minimumFractionDigits: 2 })
      td.innerHTML = `<a style="color:darkviolet" href="${card.scryfall_uri}"> €&nbsp;${formatted}</a>`
    } else {
      td.innerHTML = `<span style="color:orange"> €&nbsp;XX.XX </span>`
    }

    priceElem.parentElement!.appendChild(td)
  }

  setCheapestTotal(total)
}

const togglePrices = (): void => {
  if (!boris) return
  document.querySelectorAll('.boris').forEach(el => {
    const usd = el.querySelector<HTMLElement>('span.boris-usd-price')
    const eur = el.querySelector<HTMLElement>('span.boris-eur-price')
    if (state.sizeToggle) {
      usd?.setAttribute('style', 'font-size:0')
      eur?.setAttribute('style', '')
      boris!.toggle.classList.replace('btn-online-muted', 'btn-online')
    } else {
      usd?.setAttribute('style', '')
      eur?.setAttribute('style', 'font-size:0')
      boris!.toggle.classList.replace('btn-online', 'btn-online-muted')
    }
  })
  state.sizeToggle = !state.sizeToggle
}

const copyToClipboard = async (): Promise<void> => {
  if (!boris) return
  const label = boris.clipboard.children[0]
  label?.classList.add('btn-paper')

  const blob = await get_printable_list_blob()
  const text = blob ? await blob.text() : ''

  if (!text) {
    // No list to copy (missing Text File link or failed fetch) — tell the user
    // instead of silently writing an empty string to the clipboard.
    label?.classList.remove('btn-paper')
    if (label) {
      const original = label.innerHTML
      label.innerHTML = 'Copy failed'
      sleep(2000).then(() => (label.innerHTML = original))
    }
    return
  }

  await navigator.clipboard.write([
    new ClipboardItem({ 'text/plain': new Blob([text], { type: 'text/plain' }) }),
  ])
  label?.classList.remove('btn-paper')
}

const addToPinnedDecksList = (): void => {
  getSyncSetting('pinned_lists').then(lists => {
    const url = window.location.href
    if (lists.some(l => l.url === url)) return

    const formatText = document.querySelector('p.deck-container-information')?.innerHTML ?? ''
    const formatMatch = formatText.match(/Format: (.+?)<br>/)
    const format = formatMatch ? `<strong>${formatMatch[1]}</strong> | ` : ''
    lists.push({ url, title: format + (get_title() ?? url) })

    setSyncSetting('pinned_lists', lists.sort((a, b) => a.title.localeCompare(b.title)))
      .then(() => updatePinnedListsDropdown())
  })
}

function createBorisComponents(): void {
  const prices = document.createElement('div')
  prices.classList.add('header-prices-boris', 'header-prices-currency')
  document.querySelector('div.header-prices-currency')?.after(prices)

  const nav = document.createElement('ul')
  nav.id = 'boris-nav'
  nav.classList.add('nav', 'nav-pills', 'deck-type-menu')
  nav.style.justifyContent = 'start'
  document.querySelector('ul.deck-type-menu')?.after(nav)

  const toggleOuter = navButtonFactory('Boris')
  const toggle = toggleOuter.children[0]
  const clipboard = navButtonFactory('Copy')
  const saveAs = navButtonFactory('Save as...')
  const cheapest = navButtonFactory('Cheapest')
  const pinButton = navButtonFactory('Pin')
  const unpinButton = navButtonFactory('Pinned')

  toggle.classList.add('btn-online-muted')
  unpinButton.classList.add('show')

  document.head.insertAdjacentHTML('beforeend', `<style>
    #boris-nav .nav-link{color:#333!important}
    #boris-nav .btn-online{color:#fff!important}
    @media (prefers-color-scheme:dark){
      #boris-nav .nav-link{color:#e0e0e0!important}
      #boris-nav .btn-online{color:#fff!important}
      #boris-nav .btn-online-muted{color:#999!important}
    }
  </style>`)

  boris = { prices, nav, toggleOuter, toggle, clipboard, saveAs, cheapest, pinButton, unpinButton }
}

function addButtons(): void {
  if (!boris) return
  boris.nav.appendChild(boris.toggleOuter)
  boris.nav.appendChild(boris.cheapest)
  boris.nav.appendChild(boris.clipboard)
  boris.nav.appendChild(boris.saveAs)
  boris.nav.appendChild(boris.pinButton)
  boris.toggle.addEventListener('click', togglePrices)
  boris.clipboard.addEventListener('click', copyToClipboard)
  boris.saveAs.addEventListener('click', saveToPC)
  boris.cheapest.addEventListener('click', addCheapestPrices)
  boris.pinButton.addEventListener('click', addToPinnedDecksList)
}

function removeBorisComponents(): void {
  if (!boris) return
  Object.values(boris).forEach(el => (el as Element).remove?.())
  boris = null
}

function borisDecklist(): void {
  fetch_cards().then(async list => {
    state.card_list = list
    await convertAllPrices()
    setTotal(state.total)
    togglePrices()
  }).then(async () => {
    if (!chrome.runtime?.id) return
    const auto = await getSyncSetting('auto')
    if (auto) {
      await addCheapestPrices()
    }
    updatePinnedListsDropdown()
    addButtons()
  })
}

function borisDeckeditor(): void {
  document.getElementById('preview')?.addEventListener('click', () => {
    state = { total: 0, sizeToggle: true, card_list: [] }
    // MTGGoldfish re-renders the preview pane asynchronously after click
    sleep(2000).then(() => {
      removeBorisComponents()
      createBorisComponents()
      borisDecklist()
    })
  })
}

if (window.location.hostname.includes('mtggoldfish.com')) {
  const path = window.location.pathname

  if (path.includes('decks')) {
    borisDeckeditor()
  }

  if (path.includes('deck') || path.includes('archetype')) {
    createBorisComponents()
    borisDecklist()
  }
}
