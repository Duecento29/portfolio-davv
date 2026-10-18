# DAVV — Portfolio online (prima revisione)

Sito statico pronto per **GitHub Pages**. Le fotografie, i PNG e i testi provengono dal portfolio originale.

## Cosa è stato sistemato
- `index.html` è ora il punto di ingresso unico (il vecchio `Home_0.5.html` rimanda qui).
- Gli SVG mantengono **le coordinate originali** di sfondi e oggetti sovrapposti.
- Uno script unico (`JS/portfolio.js`) applica una parallasse leggera, anziché diversi script generati automaticamente con spostamenti diversi.
- Le immagini SVG prima incorporate nei file HTML sono ora file esterni in `assets/layers/`: nessuna perdita di qualità.
- Navigazione utilizzabile su cellulare e da tastiera, anche quando il ritaglio della stanza nasconde alcuni oggetti.
- Sistemato il nome del PNG di *Così parlò Zarathustra* per evitare un'immagine mancante sul web.
- Corretto l'avvio delle gallerie, per non sovrapporre la navigazione e l'apertura di un carosello.

## Pubblicazione GitHub Pages (repository nuovo)
1. Accedere a github.com e premere **New repository**. Nome suggerito: `portfolio-davv`; impostare il repository su **Public**.
2. Caricare **tutti i file e le cartelle all'interno di questa cartella** nella radice del repository (non caricare il solo ZIP). I file `index.html`, `CSS`, `JS`, `IMG` e `assets` devono trovarsi allo stesso livello.
3. Aprire **Settings → Pages**. In **Build and deployment**, scegliere **Deploy from a branch**, branch **main** e cartella **/(root)**, quindi **Save**.
4. Aspettare la pubblicazione. Il link avrà di norma la forma `https://NOMEUTENTE.github.io/portfolio-davv/`. Controllare l'indirizzo effettivo dentro Settings → Pages.
5. Per gli aggiornamenti successivi, sostituire solo i file modificati e salvare un commit: il sito si aggiornerà senza cambiare URL.

**Nota:** il sito non è ancora pubblicato automaticamente. Per ottenere il link pubblico serve creare/abilitare un repository GitHub Pages.

## Come avviare in locale
Aprire un terminale nella cartella e lanciare `python3 -m http.server 8000`, poi aprire `http://localhost:8000`. È preferibile a `file://` per controllare i percorsi relativi.

## Modifiche successive
- Velocità della parallasse: modificare i coefficienti `layerDepths` in `JS/portfolio.js`.
- Navigazione e visualizzazione: `CSS/portfolio.css`.
- Pagine progetto e caroselli: HTML originali e `JS/carousel.js`.

Un'app installabile (PWA) può essere aggiunta in un secondo momento, senza cambiare l'URL o le fotografie.
