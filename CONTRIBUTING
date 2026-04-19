# Contributing to Bubble Arcade

Grazie per l'interesse nel contribuire! Questo documento descrive le linee guida per proporre modifiche.

## Prima di iniziare

Apri una **issue** per discutere la modifica prima di scrivere codice, soprattutto per nuove funzionalità o nuovi giochi. Per bug fix evidenti puoi aprire direttamente una PR.

## Requisiti tecnici

- Nessuna dipendenza esterna — niente npm, niente CDN, niente framework.
- Il portale deve continuare a funzionare su `file://` senza server.
- Tutto il testo visibile all'utente deve essere in **italiano**.
- Il codice deve girare su Chrome, Firefox e Safari recenti (no transpiler, usa ES2020).

## Aggiungere un gioco

1. Copia `games/_template/` in `games/<id-kebab-case>/`.
2. Implementa `update(dt)` e `render(ctx)` nel template.
3. Usa esclusivamente `window.BubbleEngine`, `window.Sprites`, `window.BubbleScores` come API condivise.
4. Imposta `GAME_ID` uguale al nome della cartella.
5. Aggiungi la card del gioco in `index.html` (sezione *new-releases* o *trending*).

### Convenzioni per i giochi

- Canvas consigliato: 480×480 o 480×640.
- Audio: usa `BubbleEngine.audio.beep()` / `.noise()` — niente file audio esterni.
- Game over: usa `BubbleEngine.ui.showGameOver(score)` — mai `setTimeout` per questo.
- DPR scaling: non scalare manualmente — `BubbleEngine.init()` lo gestisce.
- `ctx.roundRect`: aggiungi il polyfill nel file se lo usi (supporto non universale).

## Modificare il portale o il design system

- Le variabili CSS sono in `css/design-system.css` — non duplicarle inline.
- Non aggiungere stili scoped a `index.html` se sono riutilizzabili.

## Workflow Pull Request

1. Forka il repository e crea un branch descrittivo (`feat/nome-gioco`, `fix/descrizione-bug`).
2. Fai commit atomici con messaggi in inglese, formato `tipo: descrizione breve`.  
   Tipi validi: `feat`, `fix`, `refactor`, `style`, `docs`.
3. Verifica che il portale funzioni aprendo `index.html` direttamente da filesystem.
4. Apri la PR verso `master` con una descrizione che includa:
   - Cosa fa la modifica e perché.
   - Screenshot o GIF se tocca UI o gameplay.
5. Una PR = una modifica logica coerente. Non mescolare fix e nuove feature.

## Code style

- Indentazione: 2 spazi.
- Nessun punto e virgola opzionale omesso — usa sempre `;`.
- Preferisci `const` / `let` a `var`.
- Nessun commento che descriva *cosa* fa il codice — solo il *perché* quando non è ovvio.
- Niente `console.log` nel codice committato.

## Segnalare un bug

Apri una issue con:
- Browser e versione.
- Passi per riprodurre il problema.
- Comportamento atteso vs. effettivo.
- Screenshot se utile.

## Licenza

Contribuendo accetti che il tuo codice sia distribuito sotto la stessa licenza del progetto.
