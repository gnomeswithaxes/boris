# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Boris is a Chrome extension (Manifest V3) for Magic: The Gathering card shopping. It:
- Converts USD → EUR prices on **MTGGoldfish.com** using the Scryfall API
- Adds utility features to **Cardmarket.com** (card images, want-list export, Shopping Wizard links)

## Commands

```bash
npm run build   # production build → dist/
npm run dev     # dev build, rebuilds on file change (watch mode)
npm run lint    # ESLint check on src/
npm run format  # Prettier on src/**/*.{ts,tsx}
npx tsc --noEmit  # TypeScript type-check without building
```

Load the `dist/` folder as an unpacked extension in Chrome (`chrome://extensions/` → Developer Mode → Load Unpacked) to test manually. No automated test suite exists.

## Architecture

### Build system

Vite + `vite-plugin-web-extension`. The plugin reads `manifest.json` at the project root, treats TypeScript and HTML files referenced there as Vite entry points, and outputs the built extension to `dist/`. Each entry point is bundled independently (separate Vite passes) to satisfy Chrome's content script isolation requirements.

### Entry points (manifest.json → dist/)

| Source | Built output | Purpose |
|---|---|---|
| `src/popup.html` + `src/popup.tsx` | `dist/src/popup.html` | React popup — favorite MTGGoldfish decks + settings |
| `src/options.html` + `src/options.tsx` | `dist/src/options.html` | React options page — same settings, standalone view |
| `src/mtggoldfish/content_script.ts` | `dist/src/mtggoldfish/content_script.js` | Injected on mtggoldfish.com |
| `src/cardmarket/content_script.ts` | `dist/src/cardmarket/content_script.js` | Injected on cardmarket.com |
| `src/background.ts` | `dist/src/background.js` | Service worker, driven by runtime messages: performs every Scryfall request (`scryfall_worker.ts`) and grants content scripts access to `chrome.storage.session`. `getSessionSetting`/`setSessionSetting` first message it (`SESSION_ACCESS_MESSAGE`), which wakes it and grants access, since it may not have run yet (e.g. after the extension is re-enabled) |
| `src/cardmarket/masonry.ts` | `dist/src/cardmarket/masonry.js` | Injected on cardmarket.com in the page's `MAIN` world (can see the page's globals, but not `chrome.*`) |
| `src/mtggoldfish/boris_goldfish.css` | `dist/src/mtggoldfish/boris_goldfish.css` | CSS injected on mtggoldfish.com |
| `src/cardmarket/boris_mkm.css` | `dist/src/cardmarket/boris_mkm.css` | CSS injected on cardmarket.com |
| `src/common/boris_tooltip.css` | `dist/src/common/boris_tooltip.css` | Shared tooltip injected on both sites: set `data-boris-tip="text"` on an element (`data-boris-tip-align="start"` to anchor it left; `data-boris-tip-feature` adds the Boris fish, for tooltips that explain a Boris feature rather than show data) |

Static assets in `public/` are copied to `dist/` by Vite automatically. Icons live in `public/images/` and are referenced from `manifest.json` as `images/boris*.png`.

Versioning: `package.json` is the single source of the extension version — `vite.config.ts` injects it into the built manifest, so `manifest.json` has no `version` field. Bump with `npm version patch|minor|major`.

### Repo layout notes

- `Boris on Safari/` and `Boris the Italian Goldfish (TS)/` are untracked local Xcode/Safari Web Extension wrappers, not part of the Vite build. They are outdated; see the local, untracked `SAFARI_AUDIT.md` before starting the Safari port.
- `.github/workflows/ci.yml` lints, type-checks and builds every push to `main` and every PR, and keeps `dist/` as a downloadable artifact for 30 days.
- `.github/workflows/release.yml` runs on a `v*` tag (pushed by `npm version …` + `git push --follow-tags`): it builds, zips the contents of `dist/` into `boris.zip` (manifest at the zip root) and attaches it to a **draft** GitHub Release. Drafts are private; the maintainer decides which ones to publish. `boris.zip` is not tracked in the repo.

### React UI layer

The `Options` component (`src/OptionsPanel.tsx`) is shared between the popup and the options page. It is imported by both `popup.tsx` and `options.tsx`. **Do not put `ReactDOM` render calls in `OptionsPanel.tsx`** — only in the `*.tsx` entry point files — to avoid double-rendering when imported.

### Site-specific guidance

Each content script has its own `CLAUDE.md` with routing, DOM quirks and conventions: `src/cardmarket/CLAUDE.md` and `src/mtggoldfish/CLAUDE.md`. Code used by both sites (Scryfall, storage, favorite decks, file saving) lives in `src/common/`.

### Scryfall integration

Both sites share the Scryfall layer; keep site-specific code out of it and diverge only when needed.

- `src/common/scryfall.ts` — raw API (no key). Content scripts don't fetch Scryfall themselves: each request is sent as a `SCRYFALL_MESSAGE` to the service worker, which runs it through `src/common/scryfall_worker.ts`. That is why `api.scryfall.com` is in `host_permissions`, and it gives every tab one shared rate gate: 2 req/s for `/cards/search`, `/cards/named`, `/cards/collection`, 10 req/s elsewhere; on a 429 (a 30 s lockout) both gates pause for 30 s. The worker only fetches URLs under `SCRYFALL_API` and caches GET responses while it is alive. `fetch_collection()` batches 75 identifiers per call; `get_cheapest_many(names)` gets the cheapest EUR printing of many cards with one `prefer:eur-low` search per 40 names; `find_by_name()` prefers a full-name match over a card-face match. Fetches return `null`/empty on error instead of throwing.
- `src/common/cards.ts` — cached lookups used by both sites: `cardmarketCard(id)`, `cheapestPrintings(names)`, `eurUnit(card)`. Failed lookups are evicted from the cache so they get retried.

### Typed storage module

All `chrome.storage` access should go through `src/common/storage.ts`, which also applies the defaults below when a key is unset. Never use raw `chrome.storage.sync.get/set` elsewhere — raw reads return `undefined` for unset keys and silently ignore the defaults. New storage keys must be added to the `SyncStorage`/`LocalStorage`/`SessionStorage` interfaces and `syncDefaults` in that file.

```ts
getSyncSetting('auto')           // → Promise<boolean>
setSyncSetting('images', true)   // → Promise<void>
getSyncSettings(['auto', 'images'])  // → Promise<Pick<SyncStorage, 'auto' | 'images'>>
getLocalSetting('urls')          // → Promise<ISavedUrl[] | undefined>
setLocalSetting('urls', list)    // → Promise<void>
getSessionSetting('cartSellers') // → Promise<string[] | undefined>
```

### Chrome storage keys

| Key | Store | Type | Default |
|---|---|---|---|
| `auto` | sync | boolean | false — auto-show cheapest prices on MTGGoldfish |
| `images` | sync | boolean | true — show card art on Cardmarket |
| `printVersion` | sync | boolean | false — use localised names in want-list export |
| `shoppingWizard` | sync | boolean | false — experimental Shopping Wizard links |
| `favorite_decks` | sync | `IFavoriteDeck[]` | [] — favorite MTGGoldfish deck URLs |
| `reference` | sync | number | -1 — reference price on Singles pages (-1 = "From", no recolouring; 0–3 = trend and 30/7/1-day averages) |
| `urls` | local | `ISavedUrl[]` | — URL cache for Shopping Wizard feature |
| `cartSellers` | session | `string[]` | — Cardmarket usernames in the cart, saved on the cart page; `chrome.storage.session` is cleared when the browser closes, and `src/background.ts` opens it to content scripts |
