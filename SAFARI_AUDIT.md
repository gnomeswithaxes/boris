# Audit compatibilità Safari Web Extensions — Boris

Audit di sola lettura. Nessun file di codice è stato modificato.

**Legenda affidabilità**
- **[V-codice]** verificato leggendo il codice, `dist/` o i progetti Xcode locali.
- **[V-rete]** verificato con una richiesta reale (`curl`).
- **[Ipotesi]** comportamento di Safari noto dalla documentazione/esperienza ma NON provato qui (non ho eseguito l'estensione in Safari). Da confermare al primo test.

Ambiente rilevato: Xcode 27.1, `xcrun safari-web-extension-converter` presente.

---

## Riepilogo

| # | Gravità | Problema |
|---|---|---|
| 1 | Bloccante | Il progetto Xcode locale è obsoleto: punta a `dist/js`, `dist/popup.html` ecc. che non esistono più |
| 2 | Bloccante* | Permessi per sito: nessun host è concesso finché l'utente non lo abilita in Safari |
| 3 | Degradato | "Copy" negli appunti: `clipboard.write` dopo `await` perde il gesto utente |
| 4 | Degradato | Export `.txt`: download programmatico senza gesto + `revokeObjectURL` immediato |
| 5 | ✅ Risolto | `background.type: "module"` / service worker vuoto (rimosso) |
| 6 | Degradato | `storage.sync` su Safari non sincronizza e ha quota diversa |
| 7 | Degradato | `unlimitedStorage` ignorato/non supportato |
| 8 | Cosmetico | `options_page` vs `options_ui`; popup con percorsi assoluti |
| 9 | Cosmetico | `chrome.*` invece di `browser.*`; `chrome.runtime?.id` |
| 10 | Cosmetico | Versione minima Safari per `Array.prototype.at` |

\* bloccante all'uso, non alla build: è il modello di permessi di Safari, non un bug.

---

## BLOCCANTI

### 1. Progetto Xcode obsoleto rispetto alla build Vite
- **Dove:**
  - `Boris the Italian Goldfish (TS)/Boris the Italian Goldfish (TS).xcodeproj/project.pbxproj:112-117`
  - `Boris on Safari/Boris the Italian Goldfish (TS).app/.../Resources/manifest.json`
- **Cosa succede [V-codice]:**
  - Il progetto Xcode (Feb 2023) **referenzia** `dist/` invece di copiarlo, con percorsi relativi `../../dist/images`, `../../dist/js`, `../../dist/popup.html`, `../../dist/manifest.json`, `../../dist/options.html`, `../../dist/options.css`.
  - Il `dist/` attuale è prodotto da Vite e ha una struttura diversa: `dist/src/popup.html`, `dist/src/options.html`, `dist/src/background.js`, `dist/src/{mtggoldfish,cardmarket}/content_script.js`, più i chunk `dist/OptionsPanel.js` e `dist/OptionsPanel.css`. **Non esiste `dist/js/`, né `dist/popup.html` né `dist/options.html` né `dist/options.css` in radice.**
  - Il `.app` già compilato in `Boris on Safari/` contiene una **copia vecchia** dell'estensione (manifest "1.5", content script solo su `www.mtggoldfish.com`, `js/vendor.js`, webpack, `host_permissions: <all_urls>`, permessi `scripting`/`tabs`/`activeTab`). Non ha nulla di Cardmarket né della versione 0.2.1.
  - Le cartelle sono ignorate da git (`.gitignore`), quindi non c'è storia a cui ricorrere.
- **Perché è un problema:** compilando quel progetto, Xcode non trova le risorse (riferimenti rotti) oppure impacchetta l'estensione vecchia.
- **Correzione proposta:**
  - Non riparare il vecchio progetto: rigenerarlo con `xcrun safari-web-extension-converter dist/ --project-location <cartella> --app-name Boris --bundle-identifier <tuo.id> --no-open` dopo `npm run build` (vedi sezione "Passi").
  - Il convertitore copia i file di `dist/` nelle risorse (non li referenzia), quindi dopo ogni `npm run build` va rieseguita la copia (o il convertitore). Alternativa: aggiungere in Xcode un gruppo cartella che referenzi `dist/` ("Create folder references") per tenerlo allineato.
  - Il bundle id attuale è `com.yourCompany...` (placeholder, `project.pbxproj:655,726`): va sostituito con uno reale legato al proprio team (`DEVELOPMENT_TEAM = YKM465X5ST` già presente).

### 2. Modello di permessi per sito di Safari
- **Dove:** `manifest.json:18,22` (content_scripts `matches`), `manifest.json:32` (`host_permissions`).
- **Cosa succede:**
  - **[Ipotesi, documentazione Apple nota]** Su Safari le estensioni non hanno automaticamente accesso ai siti dichiarati: l'utente deve concederlo in Safari → Impostazioni → Estensioni → Boris ("Consenti"/"Chiedi" per ogni sito). Finché non è concesso, i content script **non vengono iniettati** su cardmarket.com e mtggoldfish.com.
  - **[V-codice]** I match sono `https://*.mtggoldfish.com/*` e `https://*.cardmarket.com/*`; l'host Scryfall è `https://api.scryfall.com/*`.
- **Perché è un problema:** l'estensione sembra "non fare nulla" al primo avvio.
- **Correzione proposta:**
  - Documentare nel README il passaggio manuale: abilitare l'estensione e impostare "Consenti" per `cardmarket.com`, `mtggoldfish.com` e `api.scryfall.com`.
  - Opzionale: nell'app contenitore mostrare le istruzioni, che il convertitore genera già in `Shared (App)/Base.lproj/Main.html` (testo e pulsante "Quit and Open Safari Settings").
  - **[Ipotesi]** Le chiamate a `api.scryfall.com` dai content script sono comunque soggette ai CORS del sito ospitante (vedi sotto, nessun problema), quindi la mancata concessione dell'host Scryfall dovrebbe incidere poco, ma conviene concederla.

---

## DEGRADATO

### 3. Copia negli appunti dopo `await` (perde il gesto utente)
- **Dove:** `src/mtggoldfish/content_script.ts:214-237` (`copyToClipboard`), in particolare la riga 234 `navigator.clipboard.write([new ClipboardItem(...)])`.
- **Perché [Ipotesi, comportamento Safari noto]:** Safari richiede che `clipboard.write` sia chiamato dentro un gesto utente attivo. Qui il click è seguito da `await get_printable_list_blob()` (una `fetch` di rete, righe 221-222) e solo dopo si scrive. Safari tende a rifiutare con `NotAllowedError` quando l'attivazione è scaduta; Chrome è più permissivo. Si noti che il codice è già in forma "async", quindi l'errore sarebbe una promise rifiutata non gestita e l'etichetta resterebbe in stato `btn-paper`.
- **Correzione proposta:** passare una *promise* a `ClipboardItem`, chiamando `clipboard.write` in modo sincrono nel click:
  `navigator.clipboard.write([new ClipboardItem({ 'text/plain': get_printable_list_blob().then(b => b ?? Promise.reject()) })])`,
  e gestire il `catch` ripristinando l'etichetta. Questa è la forma supportata da Safari (e da Chrome).

### 4. Download `.txt` fuori dal gesto utente e URL revocato subito
- **Dove:** `src/common/utilities.ts:29-36` (`downloadBlob`) e `:38-41`; chiamanti in `src/cardmarket/pages/Wants.ts:41` e `src/mtggoldfish/utilities.ts:42`.
- **Perché:**
  - **[V-codice]** `saveWithFilePicker` cade su `downloadBlob` quando `showSaveFilePicker` manca (Safari non lo implementa, **[Ipotesi]** nelle versioni attuali). Chrome non cambia.
  - **[V-codice]** In entrambi i chiamanti, il salvataggio avviene *dopo* operazioni asincrone (richieste Scryfall in `mapPool` per Wants; `fetch` del file per Goldfish).
  - **[Ipotesi]** Safari può bloccare `a.click()` programmatico non legato a un gesto, oppure scaricare un file vuoto/fallito se `URL.revokeObjectURL` viene chiamato immediatamente (riga 35), prima che il download parta. L'`<a>` non è inoltre attaccato al DOM: funziona in Chrome, in Safari è meno sicuro.
- **Correzione proposta:**
  - Attaccare l'`<a>` a `document.body`, cliccare e rimuoverlo.
  - Rimandare la `revokeObjectURL` (es. `setTimeout(..., 1000)` o dopo `click`).
  - Se Safari blocca ancora il download non-gestuale, mostrare un link/pulsante "Salva" a fine elaborazione (un secondo click dell'utente fornisce il gesto).
  - Le `catch` dei rifiuti di `showSaveFilePicker` (annullamento utente = `AbortError`) non sono gestite: riguarda Chrome, non Safari.

### 5. ✅ RISOLTO — Background service worker `type: "module"` ma file vuoto
- **Stato:** il file `src/background.ts` e la chiave `background` del manifest sono stati rimossi. Il resto di questa sezione è mantenuto come storico.
- **Dove:** `manifest.json:28-29`; `src/background.ts` (30 byte in `dist/src/background.js`).
- **Perché:**
  - **[V-codice]** Il background è vuoto, quindi non porta funzionalità.
  - **[Ipotesi]** Safari supporta il service worker non-persistente in MV3 (macOS 14/iOS 17+ per le versioni recenti); il supporto a `"type": "module"` nel background è meno certo e in passato ha dato problemi con il convertitore. Un background vuoto non ha però motivo di esistere su Safari.
- **Correzione proposta:** rimuovere del tutto la chiave `background` dal manifest (e il file) finché non serve, oppure toglierla solo per la build Safari. In alternativa usare `"scripts": ["src/background.js"]` per Safari. È la correzione più semplice e senza rischi.

### 6. `chrome.storage.sync` su Safari
- **Dove:** `src/common/storage.ts:27,34,39` (sync) e `:51,58` (local). Chiavi in sync: `auto`, `images`, `printVersion`, `shoppingWizard`, `favorite_decks`, `reference`.
- **Perché:**
  - **[Ipotesi, documentazione Apple]** In Safari `storage.sync` è disponibile ma **non sincronizza tra dispositivi**: si comporta come `storage.local`. Le quote Chrome (≈100 KB totali, 8 KB per elemento) non si applicano allo stesso modo.
  - **[V-codice]** `favorite_decks` può crescere (URL di mazzi), ma il rischio di superare quota è lo stesso su Chrome e non cambia con Safari.
- **Impatto:** nessun crash; solo la "sincronizzazione tra dispositivi" non esiste. Le impostazioni sono per-profilo Safari. Il fallback `?? syncDefaults[key]` resta valido.
- **Correzione proposta:** nessuna obbligatoria. Documentare la limitazione. Se si vuole una sync reale, andrebbe passata da iCloud/CloudKit nell'app contenitore (fuori scopo).

### 7. Permesso `unlimitedStorage`
- **Dove:** `manifest.json:31`.
- **Perché [Ipotesi]:** non è un permesso riconosciuto/utile in Safari; il convertitore può emettere un avviso ("unsupported permission") ma non dovrebbe bloccare l'installazione. Serve solo per Chrome (cache `urls` in `storage.local`, `src/common/storage.ts:51-58`).
- **Correzione proposta:** lasciarlo o rimuoverlo nella variante Safari. Verificare che `urls` (cache Shopping Wizard) resti sotto la quota `storage.local` di Safari (**[Ipotesi]** nell'ordine di diversi MB).

---

## COSMETICI / NOTE

### 8. `options_page` e percorsi assoluti nei popup
- **Dove:** `manifest.json:5`; `dist/src/popup.html` e `dist/src/options.html` (uno `<script type="module" crossorigin src="/src/popup.js">`, `modulepreload` e `stylesheet` su `/OptionsPanel.*`).
- **Cosa:**
  - **[Ipotesi]** `options_page` è accettata da Safari, ma `options_ui` è la forma raccomandata e permette l'apertura nella UI delle Impostazioni di Safari.
  - **[V-codice]** I percorsi assoluti (`/src/...`) funzionano perché sono risolti sull'origine `safari-web-extension://<id>/`; i `<script type="module">` nelle pagine d'estensione funzionano in Safari moderno. Nessun problema atteso.
  - **[V-codice]** `React` è bundlato, nessun CDN esterno: bene per la CSP.
- **Correzione proposta:** valutare `options_ui: { page: "src/options.html", open_in_tab: true }`. Verificare visivamente il popup (dimensioni, scroll) sia su macOS sia su iOS: i `button` fissi 30×30 px in `src/options.css:1-8` sono piccoli come target touch su iPhone (< 44 pt, linee guida Apple).

### 9. Namespace `chrome.*` e `chrome.runtime?.id`
- **Dove:** `src/common/storage.ts` (tutte le chiamate), `src/mtggoldfish/content_script.ts:317`.
- **Cosa:**
  - **[Ipotesi]** Safari espone sia `browser.*` sia `chrome.*`; le chiamate con callback (`storage.get(key, cb)`, righe 27/39/51) e quelle che restituiscono una Promise (`set`, righe 34/58) sono entrambe supportate in MV3. Nessun cambiamento obbligatorio.
  - **[V-codice]** `chrome.runtime?.id` serve a rilevare un contesto di estensione invalidato dopo un ricaricamento; su Safari `chrome.runtime` esiste, quindi il controllo funziona ma il caso "contesto invalidato" ha comportamenti diversi.
  - **[V-codice]** `getSyncSetting` non gestisce `chrome.runtime.lastError` nella callback: un errore darebbe `result` undefined e un `TypeError` su `result[key]`. Vale per tutti i browser; più rilevante se Safari restituisse errori di storage.
- **Correzione proposta:** (facoltativo) usare la forma Promise `await chrome.storage.sync.get(key)` in tutte le funzioni, che è supportata in MV3 da Chrome e Safari e elimina il rischio `lastError`.

### 10. API JavaScript moderne
- **Dove:** `Array.prototype.at`: `src/cardmarket/pages/ShoppingWizard.ts:68,100`, `src/cardmarket/utilities.ts:11`, `src/cardmarket/pages/Users.ts:44`. `ClipboardItem`: `src/mtggoldfish/content_script.ts:235`.
- **Cosa:**
  - **[V-codice]** Vite/esbuild di default non traspila né polyfilla le API di runtime; `tsconfig.json` ha target ESNext.
  - **[Ipotesi]** `.at()` richiede Safari ≥ 15.4; `ClipboardItem` con `clipboard.write` ≥ 13.1. Con un deployment target ragionevole (macOS 13+/iOS 16+) non è un problema.
- **Correzione proposta:** impostare `IPHONEOS_DEPLOYMENT_TARGET` e il target macOS ≥ questi valori (ora iOS 15.0 in `project.pbxproj`, e macOS `RECOMMENDED_MACOSX_DEPLOYMENT_TARGET`). Opzionale: `build.target: 'safari15'` in `vite.config.ts` per far transpilare la sintassi.

---

## Verificato senza problemi

- **`fetch` verso Scryfall da content script** [V-rete]: la preflight `OPTIONS` su `https://api.scryfall.com/cards/collection` con `Origin: https://www.cardmarket.com` risponde `access-control-allow-origin: *`, `allow-methods: GET, POST, DELETE, OPTIONS`, `allow-headers` che include `Content-Type`. Il `POST` con JSON in `src/common/scryfall.ts` funziona quindi dai content script anche sotto le regole CORS di Safari, a prescindere dai permessi host.
- **`fetch` same-origin** `src/cardmarket/pages/ShoppingWizard.ts:89` (cardmarket verso cardmarket) e `src/mtggoldfish/utilities.ts:29` (link "Text File" della pagina stessa): [V-codice] stessa origine della pagina, nessun problema CORS.
- **Content script come IIFE** [V-codice]: `dist/src/*/content_script.js` iniziano con `(function(){"use strict"...`, nessun `import` residuo: compatibili con l'iniezione di Safari (che non carica moduli ES come content script).
- **File System Access API** [V-codice]: gestita con fallback (`src/common/utilities.ts:39-42`); vedi però il punto 4 per il comportamento del fallback.
- **Nessun uso di** `chrome.tabs`, `scripting`, `webRequest`, `identity`, `alarms`, `declarativeNetRequest`, messaggistica runtime, `onChanged` [V-codice, grep su `src/`]: la superficie `chrome.*` è limitata a `storage` + `runtime.id`.

---

## Passi per costruire e caricare Boris in Safari a partire da `dist/`

Passi 1-3 sono comandi verificati come disponibili qui (Xcode 27.1); l'esito sul tuo account Apple/firma è un'**ipotesi**.

1. **Build**
   ```bash
   npm install && npm run build
   ```
   Controllare che `dist/manifest.json` abbia `version` e `dist/src/...` come sopra.
2. **(Consigliato) adattare il manifest per Safari**: togliere `background` (punto 5) e valutare `options_ui`. Per non toccare la build Chrome, farlo in un manifest derivato (es. variabile d'ambiente in `vite.config.ts`) oppure su una copia di `dist/`.
3. **Generare il progetto Xcode** da `dist/`:
   ```bash
   xcrun safari-web-extension-converter dist/ --project-location ../boris-safari --app-name "Boris" --bundle-identifier it.tuonome.boris --no-open
   ```
   Il convertitore stampa gli avvisi sulle chiavi del manifest non supportate (atteso: `unlimitedStorage`, eventuale `background.type`).
   Aggiungere `--macos-only` o `--ios-only` se serve una sola piattaforma.
4. **Aprire in Xcode**, selezionare il target macOS (o iOS), impostare il Team di firma e **Run**. Il convertitore *copia* i file, quindi dopo ogni nuovo `npm run build` rigenerare o ricopiare `dist/` nelle risorse dell'estensione.
5. **Abilitare in Safari**
   - macOS: Safari → Impostazioni → Estensioni → spuntare "Boris". Se non è visibile: Safari → Sviluppatore → "Consenti estensioni non firmate" (richiede di riattivarlo a ogni riavvio di Safari). Su macOS 15+ la voce può trovarsi altrove; **[Ipotesi]**, verificare nella propria versione.
   - Concedere i permessi sito: `cardmarket.com`, `mtggoldfish.com`, `api.scryfall.com` su "Consenti" (punto 2 sopra).
   - iOS: Impostazioni → Safari → Estensioni → Boris; installare il target iOS su simulatore o dispositivo.
6. **Debug**: Safari → Sviluppatore → Web Extension Background Content / Inspect Popup. Le sessioni dei content script si ispezionano dalla console della pagina.

### Checklist di test manuale (da fare in Safari)
- Popup e pagina opzioni si aprono e salvano/ricaricano le impostazioni (`auto`, `images`, ecc.).
- MTGGoldfish: conversione prezzi, pulsante "Copy" (punto 3), "Save as" (punto 4), mazzi preferiti (Favorite).
- Cardmarket: immagini carta, export Wants `.txt` (punto 4), Shopping Wizard (`urls` in storage).
- Layout del popup su iPhone (target touch, punto 8).

---

## Cosa non ho potuto verificare
- Nessuna esecuzione reale in Safari: ogni voce **[Ipotesi]** va confermata al primo test.
- Non ho aperto Xcode né compilato il progetto locale; l'obsolescenza (punto 1) deriva dalla lettura di `project.pbxproj` e del `manifest.json` dentro il `.app` già compilato.
- Non ho consultato la documentazione Apple online (sessione senza ricerca web): le affermazioni sulle differenze di Safari provengono dalla conoscenza pregressa.
