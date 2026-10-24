# Cardmarket content script

Guidance for `src/cardmarket/`. Shared Scryfall, storage and build notes live in the root `CLAUDE.md`.

## Routing

`content_script.ts` holds a `routes` table: each entry has a `match` regex tested against `window.location.pathname`, an optional boolean `setting` that must be on, and `run`, the list of feature functions. Every matching route runs (more than one can match the same page); the settings they need are read in one `getSyncSettings` call. Each feature runs on its own, so one that throws or rejects is logged with `logError` and doesn't stop the others. Add a feature by adding a row.

| `match` | `setting` | Calls |
|---|---|---|
| any page | `images` | `Sitewide.addImages()` |
| `/Magic/Users/` | | `Users.addUserToTitle()` + `Users.showTrend()` |
| `/Products/Singles/` | | `Singles.addLinkToSingles()` + `addCheckboxes()` + `addScryfallButton()` + `Cart.highlightCartSellers()` |
| `/ShoppingCart` | | `Cart.saveCartSellers()` + `addAllPrintingsToCart()` + `Singles.addLinkToSingles()` |
| `/Cards/` | | `Singles.addLinkToSingles()` |
| `ShoppingWizard/Results` | | `Singles.addLinkToSingles()` |
| `/Magic/Wants/…ShoppingWizard/Results` | `shoppingWizard` | `ShoppingWizard.addDisclaimer()` + `addLinkToCards()` |
| `/Wants/\d+` | | `Wants.addPrintListButton()` |
| `/Magic/Wants/\d+` | | `Wants.saveAllUrls()` |

The Shopping Wizard feature is a two-step flow: `Wants.saveAllUrls()` caches card URLs into local storage (`urls`), and `ShoppingWizard.addLinkToCards()` reads them back on the results page.

## Cardmarket DOM

Selector and attribute constants live in `page_elements.ts` — update them there when the markup changes. Known quirks:

- **Two tooltip attributes coexist.** Card thumbnails (`.thumbnail-icon`) carry their tooltip HTML (with the image `src` and `alt`) in `data-bs-title`; other tooltips such as `.expansion-symbol` and the Foil icon still use `data-bs-original-title`. `get_thumbnail_title()` in `utilities.ts` reads the former with the latter as fallback; `title_attribute` is still correct for the non-thumbnail cases.
- **Offer rows were renamed** from `articleRow…` to `stockRow…` ids; `Users.showTrend()` matches both.
- **Masonry grids.** Some pages (e.g. Shopping Wizard results) lay out cards with Masonry (`[data-masonry]`, absolutely positioned columns), measured before Boris changes them (images, rewritten rows). `masonry.ts` runs in the page's `MAIN` world, because the isolated content script can't see `window.Masonry`, and calls `layout()` again whenever a grid item changes size (`ResizeObserver`).
- **Icon links.** `icons.ts` builds the small icon links used next to names (`iconLink()` with a `data-boris-tip` tooltip, `divider()`, and the SVG icons); their styles are `.boris-icon-link` / `.boris-divider` in `boris_mkm.css`.
- **All printings.** Cardmarket's `/Magic/Cards/<slug>` page lists every printing of a card; `allPrintingsUrl()` in `utilities.ts` derives it from a product URL (dropping the `-V2` suffix). Scryfall's `purchase_uris.cardmarket` is *not* that page: it links one product (`Products?idProduct=…`).
- **Theme:** Cardmarket sets `data-bs-theme="dark"` for its dark mode. Colours Boris adds go in `boris_mkm.css` as classes, never as inline colours: `boris-lower` / `boris-higher` / `boris-foil` have a `[data-bs-theme="dark"]` variant, and `boris-price-link` uses `color: inherit` so it follows the page text.

## Testing

- Wants and Shopping Wizard pages need a logged-in account with the user's own lists; product, search and user-offer pages work logged out.
- `Users.showTrend()` annotates rows at the pace of the Scryfall rate gate (≈0.55 s per row), so a full offer page takes several seconds; that is expected, not a hang.
