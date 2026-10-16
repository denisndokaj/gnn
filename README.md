# G.N.N. — Gestione Preventivi

Mini gestionale con un solo scopo: creare, modificare e stampare/esportare in PDF i preventivi di **G.N.N. s.n.c.** (Costruzioni e Ristrutturazioni).

Applicazione web client-side (nessun server, nessun database esterno): i preventivi sono salvati nel browser tramite `localStorage`. Adatta all'uso da parte dei soci direttamente da computer o tablet in cantiere/ufficio.

## Funzionalità

- Elenco preventivi con ricerca per numero, cliente o oggetto
- Numerazione automatica progressiva per anno (es. `001/2026`)
- Dati cliente, oggetto dei lavori, luogo cantiere, validità offerta
- Righe di preventivo con descrizione, unità di misura, quantità e prezzo unitario, riordinabili
- Sconto % e IVA % configurabili, totali calcolati automaticamente
- Condizioni di pagamento e note libere
- Stato del preventivo (Bozza / Inviato / Accettato / Rifiutato)
- Duplica un preventivo esistente come base per uno nuovo
- Anteprima live del documento con intestazione aziendale (logo, contatti) pronta per la stampa
- Esportazione in PDF tramite la stampa del browser ("Salva come PDF")
- Dati fiscali facoltativi (P.IVA, C.F., REA, IBAN) da impostazioni, stampati in intestazione/piè di pagina

## Avvio in sviluppo

```bash
npm install
npm run dev
```

## Build di produzione

```bash
npm run build
npm run preview
```

L'app compilata (`dist/`) è statica: può essere pubblicata su qualunque hosting statico (es. GitHub Pages, Netlify, Vercel) o aperta localmente.

## Note sui dati

I preventivi vengono salvati solo nel browser in uso (`localStorage`). Per non perdere lo storico:

- usare sempre lo stesso browser/dispositivo per la gestione dei preventivi, oppure
- esportare in PDF i preventivi importanti non appena completati.
