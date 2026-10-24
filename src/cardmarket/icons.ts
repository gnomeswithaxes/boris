const SVG_NS = 'http://www.w3.org/2000/svg'

function icon(d: string): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, 'svg')
  svg.setAttribute('viewBox', '0 0 16 16')
  svg.setAttribute('aria-hidden', 'true')
  const path = document.createElementNS(SVG_NS, 'path')
  path.setAttribute('d', d)
  svg.append(path)
  return svg
}

// Awning with a scalloped edge, shop front, door.
export const storefrontIcon = () =>
  icon('M2 6 3 2h10l1 4M2 6a2 2 0 0 0 4 0a2 2 0 0 0 4 0a2 2 0 0 0 4 0M3 8v6h10V8M6.5 14v-3.5h3V14')

// Two cards fanned ±15° around their bottom centre: the front one whole, the back one only
// where it shows past the front card's left edge and bottom.
export const printingsIcon = () =>
  icon('M4.6 11.9 7.2 2.2 14 4 11.4 13.7zM8 12.8 4.6 13.7 2 4 7.1 2.7')

export function iconLink(href: string, tip: string, svg: SVGSVGElement): HTMLAnchorElement {
  const link = document.createElement('a')
  link.className = 'boris-icon-link'
  link.href = href
  link.target = '_blank'
  link.dataset.borisTip = tip
  link.dataset.borisTipAlign = 'start'
  link.dataset.borisTipFeature = ''
  link.setAttribute('aria-label', tip)
  link.append(svg)
  return link
}

export function divider(): HTMLSpanElement {
  const span = document.createElement('span')
  span.className = 'boris-divider'
  return span
}
