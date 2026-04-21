# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Esecuzione

Nessun build step, nessun server richiesto:

```bash
# Apri direttamente nel browser
open index.html

# Oppure lancia un server locale (evita restrizioni file://)
python3 -m http.server 8080
```

Non esiste test suite, linter, né package.json. La "verifica" consiste nell'aprire le pagine nel browser e giocare.

## Architettura

Il portale è vanilla HTML/CSS/JS senza dipendenze. Tutto funziona su `file://`.

### Globali condivisi (caricati in ordine)

```
js/engine.js   → window.BubbleEngine
js/sprites.js  → window.Sprites
shared/scores.js → window.BubbleScores
```

I giochi includono questi tre file nell'ordine sopra prima del proprio script inline.

### BubbleEngine — `js/engine.js`

Singleton IIFE. Ogni gioco fa:
```js
BubbleEngine.init(canvas, { width: 480, height: 640 });
BubbleEngine.setCallbacks(dt => Game.update(dt), ctx => Game.render(ctx));
BubbleEngine.loop.start();
```

API rilevanti:
- `BubbleEngine.input.justPressed` — Set di `event.code` appena premuti (azzerato dopo ogni frame)
- `BubbleEngine.input.keys` — Set di tasti tenuti premuti
- `BubbleEngine.input.pointer` — `{ x, y, down, justDown, justUp }` (mouse + touch, già scalato per DPR)
- `BubbleEngine.audio.beep(freq, duration, type, volume)` — synth procedurale, lazy-init
- `BubbleEngine.audio.noise(duration, volume)` — rumore bianco
- `BubbleEngine.utils.AABB(ax,ay,aw,ah, bx,by,bw,bh)` — collision check
- `BubbleEngine.utils.lerp / clamp / randInt / randFloat`
- `BubbleEngine.loop.stop() / pause() / resume()`

Il canvas viene scalato per DPR automaticamente in `init()`. Non scalare mai manualmente. Le coordinate in `update`/`render` sono sempre in pixel logici (es. 480×640).

Il canvas si adatta alla larghezza del container su mobile tramite un listener `resize`.

### Sprites — `js/sprites.js`

Pixel art procedurale. Nessuna immagine esterna.

```js
const MY_DEF = {
  scale: 3,           // pixel logici × 3 = pixel schermo
  palette: ['#hex1', '#hex2', ...],  // indice 0 = pixel value 1
  frames: [           // array di frame, ognuno array di righe, ogni riga array di pixel
    [[0,1,2,...], ...],
  ]
};
const rendered = Sprites.prerender(MY_DEF);   // compila in OffscreenCanvas[]
Sprites.blit(ctx, rendered, frameIdx, x, y);  // disegna
Sprites.blit(ctx, rendered, frameIdx, x, y, true);  // flipX
```

Pixel `0` = trasparente. Pixel `n` = `palette[n-1]`.

### BubbleScores — `shared/scores.js`

localStorage con chiave `ba_scores_<gameId>`. Top-10 per gioco.

```js
BubbleScores.save(GAME_ID, score);          // salva; mostra modal nome se nuovo record; ritorna boolean
BubbleScores.isHighScore(GAME_ID, score);   // boolean
BubbleScores.getBest(GAME_ID);              // numero
BubbleScores.renderList(GAME_ID, olEl);     // popola <ol id="leaderboardList">
```

`save()` inietta automaticamente un modal "Nuovo Record!" nel `document.body` se il punteggio supera il record.

### Nav e footer condivisi — `shared/nav.js` / `shared/footer.js`

Usati dalle pagine portale (non dai giochi). Usano `document.write()` inline con `data-base` per gestire i path relativi:

```html
<script src="shared/nav.js" data-base=""></script>       <!-- root -->
<script src="../../shared/nav.js" data-base="../../"></script>  <!-- games/* -->
```

I giochi usano invece un `<nav class="game-nav">` proprio (non il nav condiviso).

### Design system — `css/design-system.css`

Variabili CSS, reset, componenti UI (`.btn-primary`, `.btn-primary-sm`, `.btn-ghost-arrow`, `.logo`, `.chip`, `.badge`), nav, footer, temi thumb (`.th-galaxy`, ecc.), animazioni reveal. Non duplicare queste classi inline.

## Aggiungere un nuovo gioco

1. Copia `games/_template/game.html` in `games/<id-kebab-case>/game.html`
2. Sostituisci `GAME_ID_HERE`, `TITOLO_GIOCO`, `DESCRIZIONE_GIOCO`
3. Imposta `GAME_ID` uguale al nome della cartella (usato come chiave localStorage)
4. Implementa l'oggetto `Game` con `reset()`, `update(dt)`, `render(ctx)` e `state`
5. Chiama `showGameOver(score)` per terminare la partita
6. Aggiungi la card in `index.html` e il gioco nell'array `GAMES` in `all-games.html`

Canvas consigliati: 480×480 o 480×640 (portrait). Per landscape usare 480×320 e ridurre `max-width` del `.game-layout`.

## Convenzioni codice

- ES2020, no transpiler, no `var`
- Indentazione 2 spazi, punto e virgola sempre
- Tutto il testo visibile all'utente in **italiano**
- `ctx.roundRect` richiede polyfill su browser datati — aggiungilo nel file se lo usi
- Audio lazy-init: `AudioContext` si crea solo al primo gesto utente (gestito dall'engine)
- Commit: `tipo: descrizione breve` in inglese (`feat`, `fix`, `refactor`, `style`, `docs`)
