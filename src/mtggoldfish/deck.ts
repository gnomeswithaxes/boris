export const DECK_TABLE = 'table.deck-view-deck-table'

type Section = 'main' | 'side' | 'maybe'

export interface DeckRow {
  amount: number
  name: string
  set?: string
  section: Section
  row: HTMLTableRowElement
  priceCell?: HTMLTableCellElement
}

export function isPaperTable(table: Element): boolean {
  const pane = table.closest('.tab-pane[data-type]')
  return !pane || pane.getAttribute('data-type') === 'paper'
}

export function deckScope(table: Element): HTMLElement {
  return table.closest<HTMLElement>('.deck-container') ?? document.body
}

function sectionFromHeader(text: string): Section | null {
  if (/^maindeck\b/i.test(text)) return 'main'
  if (/^sideboard\b/i.test(text)) return 'side'
  if (/^maybeboard\b/i.test(text)) return 'maybe'
  return null
}

// data-card-id looks like "Haywire Mite <uuid> [SOC]"; the uuid part is not always present.
function setCode(cardId: string | null): string | undefined {
  const code = cardId?.match(/\[([^\]]+)\]\s*$/)?.[1]
  return code && code.length >= 3 && code.length <= 5 ? code : undefined
}

export function parseDeck(table: HTMLTableElement): DeckRow[] {
  const rows: DeckRow[] = []
  let section: Section = 'main'

  for (const tr of table.rows) {
    if (tr.classList.contains('deck-category-header')) {
      section = sectionFromHeader(tr.textContent?.trim() ?? '') ?? section
      continue
    }
    const link = tr.querySelector('a[data-card-id]')
    const amount = parseInt(tr.cells[0]?.textContent ?? '', 10)
    const name = link?.textContent?.trim()
    if (!link || !name || Number.isNaN(amount)) continue

    rows.push({
      amount,
      name,
      set: setCode(link.getAttribute('data-card-id')),
      section,
      row: tr,
      priceCell: tr.querySelector('.deck-preview-price-value')?.closest('td') ?? tr.cells[3],
    })
  }
  return rows
}

export function deckListText(rows: DeckRow[]): string {
  const lines = (section: Section) => rows.filter(r => r.section === section).map(r => `${r.amount} ${r.name}`)
  const main = lines('main')
  const side = lines('side')
  return [...main, ...(side.length ? ['', ...side] : [])].join('\n') + '\n'
}

export function deckTitle(scope: ParentNode): string | undefined {
  const heading = scope.querySelector('h1.title')?.cloneNode(true) as HTMLElement | undefined
  heading?.querySelector('.author')?.remove()
  return heading?.textContent?.replace(/\s+/g, ' ').trim() || undefined
}

export function deckFormat(scope: ParentNode): string | undefined {
  const info = scope.querySelector('p.deck-container-information')?.textContent ?? ''
  return info.match(/Format:\s*([^\n]+)/)?.[1].trim() || undefined
}
