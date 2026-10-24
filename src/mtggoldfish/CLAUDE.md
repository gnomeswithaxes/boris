# MTGGoldfish content script

Guidance for `src/mtggoldfish/`. Shared Scryfall, storage and build notes live in the root `CLAUDE.md`.

## Modules

| File | Role |
|---|---|
| `content_script.ts` | Wiring only: finds deck tables, runs the price pipeline, handles clicks |
| `deck.ts` | Reads the MTGGoldfish DOM: `parseDeck()` → `DeckRow[]`, deck title/format, list text for copy/save |
| `prices.ts` | `resolvePrices(rows)`: EUR price per row, cached per `name|set` |
| `ui.ts` | Everything Boris inserts: the `.boris-nav` toolbar, EUR cells, totals, pinned-lists dropdown |
| `boris_goldfish.css` | Styles for the above (injected via `manifest.json`) |

## How a deck page is processed

1. MTGGoldfish renders deck tables asynchronously (Turbo streams, the deck editor preview, view options), so a debounced `MutationObserver` re-scans for `table.deck-view-deck-table` instead of running once at load. Each table is marked with `data-boris-processed`.
2. Only the **paper** tab is handled (`isPaperTable`: no `.tab-pane[data-type]` ancestor, or `data-type="paper"`). Everything is scoped to the table's `.deck-container` (`deckScope`), so several decks on one page don't interfere.
3. `resolvePrices` asks `/cards/collection` for the deck's own printings (set code parsed from `data-card-id`, e.g. `"Haywire Mite <uuid> [SOC]"`), then falls back to `cheapestPrintings()` for rows with no EUR price or a gold border.
4. **Cheapest** (button, or automatically when the `auto` setting is on) runs `cheapestPrintings()` over all names — one Scryfall search per 40 names.

## Conventions

- **Event delegation:** toolbar links carry `data-boris-action` (`toggle`, `cheapest`, `copy`, `save`, `pin`, `unpin`) and a single document-level click listener dispatches them. Add new actions to the `Action` type in `ui.ts` and the `switch` in `content_script.ts`.
- **User gesture:** copy and save call `navigator.clipboard.writeText` / `saveWithFilePicker` synchronously inside the click, reading rows already in the DOM — no `await` before them, or Safari drops the gesture.
- **Extension reload:** after the extension is reloaded, old content scripts keep running without `chrome.runtime`; `extensionAlive()` guards every entry point and disconnects the observer.

## Pinned lists

Pins are shared with the popup through `src/common/pinned.ts` (not this folder). URLs are canonicalised to `origin + pathname`; up to 0.2.2 the format was stored as HTML in the title and is migrated on read by `normalize()`. The toolbar refreshes on `chrome.storage.onChanged` for `pinned_lists` and on `turbo:load`.
