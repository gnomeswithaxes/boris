import type { IInternalCardModel } from '../common/interfaces'
import { saveWithFilePicker } from '../common/utilities'

export function parse_row(rowParts: NodeListOf<HTMLTableCellElement>) {
  const card = rowParts[1]?.querySelector('a')
  const set = card?.getAttribute('data-card-id')
  if (!set) return null

  const firstBracket = set.indexOf('[')
  const secondBracket = set.indexOf(']')
  const setName = set.slice(firstBracket + 1, secondBracket)

  return {
    amount: parseInt(rowParts[0]?.innerHTML ?? '1'),
    card_line: card,
    name: card?.textContent ?? '',
    set: setName,
    mana_cost: rowParts[2]?.querySelector('span.manacost'),
    price: rowParts[3],
  }
}

// Returns null when there's no "Text File" link on the page or the fetch fails,
// so callers can detect failure rather than silently handling an empty blob.
export async function get_printable_list_blob(): Promise<Blob | null> {
  for (const a of document.querySelectorAll<HTMLAnchorElement>('a')) {
    if (a.innerText?.includes('Text File')) {
      try {
        const res = await fetch(a.href)
        return res.ok ? await res.blob() : null
      } catch {
        return null
      }
    }
  }
  return null
}

export const saveToPC = async (): Promise<void> => {
  const title = (get_title() ?? 'deck').replace(/[^a-zA-Z0-9 ]+/g, '').trim() + '.txt'
  const blob = await get_printable_list_blob()
  if (blob) saveWithFilePicker(blob, title)
}

export const get_title = (): string | undefined => {
  return document.querySelector('h1.title')?.textContent?.trim()
}

export function load_cards(): IInternalCardModel[] {
  const list: IInternalCardModel[] = []

  document.querySelector('table.deck-view-deck-table')
    ?.querySelectorAll('tr:not(.deck-category-header)')
    .forEach(tr => {
      const row = parse_row(tr.querySelectorAll('td'))
      if (!row) return
      list.push({ name: row.name, set: row.set, amount: row.amount })
      row.price?.classList.add('boris')
    })

  return list
}
