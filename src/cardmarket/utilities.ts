import type { IScryfallCard } from '../common/interfaces'
import { boris_img_class, camera_class, camera_icon, camera_icon_classlist, title_attribute } from './page_elements'

export function get_mkm_id(row: Element): string {
  const span = row.getElementsByClassName(camera_class)[0] ?? row.getElementsByClassName(boris_img_class)[0]
  const attr = span?.getAttribute(title_attribute) ?? ''
  return attr.split(/\.jpg/g)[0].split('/').at(-1) ?? ''
}

export function get_mkm_src(span: Element): string {
  return span.getAttribute(title_attribute)?.match(/src="(.*?)"/)?.[1] ?? ''
}

export function get_mkm_version(row: Element): string {
  const alt = row.getElementsByClassName(camera_class)[0]?.getAttribute(title_attribute)?.match(/alt="(.*?)"/)?.[1] ?? ''
  return alt.match(/\(V\.(.*?)\)/)?.[1] ?? ''
}

export function get_mkm_url(row: Element): string {
  return row.getElementsByClassName('name')[0]?.getElementsByTagName('a')[0]?.href.split('?')[0] ?? ''
}

export function parsePrice(price: string): number {
  const match = price.replace('.', '').match(/\d+,\d+/)
  return match ? parseFloat(match[0].replace(',', '.')) : 0
}

export function parsePPU(ppu: string): number {
  const match = ppu.match(/\d*\.?\d+(?:,\d+)?/g)
  return match ? parseFloat(match[0].replace('.', '').replace(',', '.')) : 0
}

export function get_card_src(card: IScryfallCard): string {
  if (!card) return ''
  if (card.image_uris) return card.image_uris.small
  if (card.card_faces) return card.card_faces[0].image_uris.small
  return ''
}

export function replaceCamera(span: Element, src: string): void {
  const img = document.createElement('img')
  img.src = src
  img.style.width = '100%'
  img.style.height = '100%'

  span.classList.remove(...camera_icon_classlist)
  span.classList.add(boris_img_class)
  span.appendChild(img)
  span.getElementsByClassName(camera_icon)[0]?.remove()
}
