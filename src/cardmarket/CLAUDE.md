# Cardmarket content script

Guidance for `src/cardmarket/`. Shared Scryfall, storage and build notes live in the root `CLAUDE.md`.

## Routing

`content_script.ts` checks `window.location.pathname` with a series of independent `if`s (more than one can match the same page) and calls into page modules under `pages/`:

| Path match | Calls |
|---|---|
| any page **except** `ShoppingWizard/Results`, `Magic/Orders`, `Magic/ShoppingCart` — only if `images` is on | `Sitewide.addImages()` |
| `Magic/Users` | `Users.addUserToTitle()` + `Users.showTrend()` |
| `Products/Singles/` | `Singles.addLinkToSingles()` + `addCheckboxes()` |
| `Cards/` | `Singles.addLinkToSingles()` |
| `ShoppingWizard/Results` | `addLinkToSingles()`; plus `ShoppingWizard.addDisclaimer()` / `addLinkToCards()` if under `/Magic/Wants` and `shoppingWizard` is on |
| `/Wants/\d+` | `Wants.addPrintListButton()`; plus `saveAllUrls()` under `/Magic/Wants` |

The Shopping Wizard feature is a two-step flow: `Wants.saveAllUrls()` caches card URLs into local storage (`urls`), and `ShoppingWizard.addLinkToCards()` reads them back on the results page.

## Cardmarket DOM

Selector and attribute constants live in `page_elements.ts` — update them there when the markup changes. Known quirks:

- **Two tooltip attributes coexist.** Card thumbnails (`.thumbnail-icon`) carry their tooltip HTML (with the image `src` and `alt`) in `data-bs-title`; other tooltips such as `.expansion-symbol` and the Foil icon still use `data-bs-original-title`. `get_thumbnail_title()` in `utilities.ts` reads the former with the latter as fallback; `title_attribute` is still correct for the non-thumbnail cases.
- **Offer rows were renamed** from `articleRow…` to `stockRow…` ids; `Users.showTrend()` matches both.
- **Theme:** Cardmarket sets `data-bs-theme="dark"` for its dark mode. Colours Boris adds go in `boris_mkm.css` as classes, never as inline colours: `boris-lower` / `boris-higher` / `boris-foil` have a `[data-bs-theme="dark"]` variant, and `boris-price-link` uses `color: inherit` so it follows the page text.

## Testing

- Wants and Shopping Wizard pages need a logged-in account with the user's own lists; product, search and user-offer pages work logged out.
- `Users.showTrend()` annotates rows at the pace of the Scryfall rate gate (≈0.55 s per row), so a full offer page takes several seconds; that is expected, not a hang.
