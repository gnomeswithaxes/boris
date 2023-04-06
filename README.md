# Boris - <i>The Italian Goldfish</i>
Estensione Chrome per convertire i prezzi delle carte in [MTGGoldfish](https://www.mtggoldfish.com) da dollari a euro e aggiungere funzionalità a [cardmarket](https://www.cardmarket.com)

Per installare:
  - scaricare e decomprimere file `boris.zip` dalla sezione [Releases](https://github.com/gnomeswithaxes/boris/releases/latest) di GitHub
  - inserire in Chrome nella barra degli indirizzi `chrome://extensions/`
  - abilitare la modalità sviluppatore (in alto a destra)
  - cliccare su "carica estensione non pacchettizzata"
  - selezionare la cartella `dist/` (contenente il file `manifest.json`) 

Per installare da sorgente: 
  - come sopra, ma la cartella `dist/` è già presente

Per effettuare build manuale dell'estensione
  - aprire la cartella `boris/`
  - installare moduli: `> npm install`
  - eseguire build: `> npm run build`
