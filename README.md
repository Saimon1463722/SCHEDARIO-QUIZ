# SCHEDARIO-QUIZ
Quiz, schede, flashcard

App di studio in un'unica pagina (`index.html`): quiz a crocette, archivio errori, statistiche e flashcard con ripasso Leitner.

## App installabile (PWA)
Funziona come app installabile e anche senza connessione:

- `manifest.webmanifest`: nome, colori e icone dell'app
- `sw.js`: service worker che salva l'app sul dispositivo; i font vengono salvati al primo utilizzo
- `icons/`: icone (anche "maskable" per Android e `apple-touch-icon` per iPhone)

I dati restano nel browser del dispositivo (localStorage): niente account e niente server.

## Backup dei dati
In **Impostazioni** (ingranaggio in home, oppure "Backup e ripristino" nelle impostazioni di un progetto):

- **Esporta** scarica tutti i dati in `schedario-backup-AAAA-MM-GG.json`.
- **Importa** carica un file di backup (anche trascinandolo sulla scheda). Prima controlla che sia valido e mostra cosa contiene, poi chiede se:
  - **unire** i dati a quelli attuali (gli elementi nuovi si aggiungono, quelli con lo stesso identificativo prendono la versione del file);
  - **sostituire** tutto (serve una seconda conferma).

Così puoi spostare i dati da un dispositivo all'altro o tenerne una copia di sicurezza.

### Pubblicarla con GitHub Pages
1. Su GitHub: **Settings → Pages → Build and deployment**, sorgente "Deploy from a branch", poi scegli il branch e la cartella `/ (root)`.
2. Apri l'indirizzo `https://<utente>.github.io/<repo>/`.
3. Installala:
   - **Android / Chrome / Edge**: pulsante **Installa** nella home dell'app, o menu del browser → "Installa app".
   - **iPhone / iPad (Safari)**: Condividi → "Aggiungi alla schermata Home".

Il service worker serve HTTPS (o `localhost`). Per provarla in locale: `python3 -m http.server` e apri `http://localhost:8000`.

### Aggiornare l'app
Dopo aver cambiato `index.html` o le icone, incrementa `VERSION` in `sw.js` (es. `schedario-v2`): chi è online riceve la nuova versione alla prossima apertura.
