declare global {
  interface Window {
    Masonry?: { data(element: Element): { layout(): void } | undefined }
  }
}

// Runs in the page's world: Cardmarket's Masonry grids (e.g. Shopping Wizard results) position
// their cards from the heights measured on load, so they must be laid out again whenever Boris
// changes a card's height (images, rewritten rows).
let pending = false
const relayout = new ResizeObserver(() => {
  if (pending) return
  pending = true
  requestAnimationFrame(() => {
    pending = false
    for (const grid of document.querySelectorAll('[data-masonry]')) window.Masonry?.data(grid)?.layout()
  })
})

for (const grid of document.querySelectorAll('[data-masonry]')) {
  for (const item of grid.children) relayout.observe(item)
}

export {}
