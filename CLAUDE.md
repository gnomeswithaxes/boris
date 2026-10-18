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
| `src/popup.html` + `src/popup.tsx` | `dist/src/popup.html` | React popup — pinned MTGGoldfish deck lists + settings |
| `src/options.html` + `src/options.tsx` | `dist/src/options.html` | React options page — same settings, standalone view |
| `src/background.ts` | `dist/src/background.js` | MV3 service worker (currently empty) |
| `src/mtggoldfish/content_script.ts` | `dist/src/mtggoldfish/content_script.js` | Injected on mtggoldfish.com |
| `src/cardmarket/content_script.ts` | `dist/src/cardmarket/content_script.js` | Injected on cardmarket.com |
| `src/cardmarket/boris_mkm.css` | `dist/src/cardmarket/boris_mkm.css` | CSS injected on cardmarket.com |

Static assets in `public/` are copied to `dist/` by Vite automatically. Icons live in `public/images/` and are referenced from `manifest.json` as `images/boris*.png`.

Versioning: `package.json` is the single source of the extension version — `vite.config.ts` injects it into the built manifest, so `manifest.json` has no `version` field. Bump with `npm version patch|minor|major`.

### Repo layout notes

- `Boris on Safari/` and `Boris the Italian Goldfish (TS)/` are untracked local Xcode/Safari Web Extension wrappers, not part of the Vite build.
- `boris.zip` (tracked) is the release bundle of `dist/` that the README points users to.
- `.github/workflows/build.yml` is stale: it targets the `master` branch (the repo uses `main`) and Node 14/15, which is too old for Vite 5.

### React UI layer

The `Options` component (`src/OptionsPanel.tsx`) is shared between the popup and the options page. It is imported by both `popup.tsx` and `options.tsx`. **Do not put `ReactDOM` render calls in `OptionsPanel.tsx`** — only in the `*.tsx` entry point files — to avoid double-rendering when imported.

### Cardmarket content script routing

`src/cardmarket/content_script.ts` checks `window.location.pathname` with a series of independent `if`s (more than one can match the same page) and calls into page modules under `src/cardmarket/pages/`:

| Path match | Calls |
|---|---|
| any page **except** `ShoppingWizard/Results`, `Magic/Orders`, `Magic/ShoppingCart` — only if `images` is on | `Sitewide.addImages()` |
| `Magic/Users` | `Users.showTrend()` |
| `Products/Singles/` | `Singles.addLinkToSingles()` + `addCheckboxes()` |
| `Cards/` | `Singles.addLinkToSingles()` |
| `ShoppingWizard/Results` | `addLinkToSingles()`; plus `ShoppingWizard.addDisclaimer()` / `addLinkToCards()` if under `/Magic/Wants` and `shoppingWizard` is on |
| `/Wants/\d+` | `Wants.addPrintListButton()`; plus `saveAllUrls()` under `/Magic/Wants` |

The Shopping Wizard feature is a two-step flow: `Wants.saveAllUrls()` caches card URLs into local storage (`urls`), and `ShoppingWizard.addLinkToCards()` reads them back on the results page.

CSS class name constants for the Cardmarket DOM live in `src/cardmarket/page_elements.ts` — update these when Cardmarket's markup changes.

### Scryfall integration

`src/common/scryfall.ts` wraps the Scryfall API (no key required; declared in `host_permissions`). Key behaviours:
- `fetch_cards()` batches deck cards into groups of 75 (API limit per `/cards/collection` call), fires them in parallel, then falls back to `get_cheapest()` for unrecognised cards.
- `get_cheapest(name)` queries `/cards/search?order=eur&unique=prints` and returns the cheapest non-gold-border EUR printing.
- All fetch calls return `null` on error rather than throwing, so callers must null-check.

### Typed storage module

All `chrome.storage` access should go through `src/common/storage.ts`, which also applies the defaults below when a key is unset. Never use raw `chrome.storage.sync.get/set` elsewhere — raw reads return `undefined` for unset keys and silently ignore the defaults. New storage keys must be added to the `SyncStorage`/`LocalStorage` interfaces and `syncDefaults` in that file.

```ts
getSyncSetting('auto')           // → Promise<boolean>
setSyncSetting('images', true)   // → Promise<void>
getSyncSettings(['auto', 'images'])  // → Promise<Pick<SyncStorage, 'auto' | 'images'>>
getLocalSetting('urls')          // → Promise<ISavedUrl[] | undefined>
setLocalSetting('urls', list)    // → Promise<void>
```

### Chrome storage keys

| Key | Store | Type | Default |
|---|---|---|---|
| `auto` | sync | boolean | false — auto-show cheapest prices on MTGGoldfish |
| `images` | sync | boolean | true — show card art on Cardmarket |
| `printVersion` | sync | boolean | false — use localised names in want-list export |
| `shoppingWizard` | sync | boolean | false — experimental Shopping Wizard links |
| `pinned_lists` | sync | `IPinnedList[]` | [] — saved MTGGoldfish deck URLs |
| `reference` | sync | number | 1 — reference price index on Singles pages |
| `urls` | local | `ISavedUrl[]` | — URL cache for Shopping Wizard feature |
