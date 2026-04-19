# Bubble Arcade

Un portale di giochi HTML5 creato come **esperimento di sviluppo assistito dall'intelligenza artificiale**, da zero a prodotto funzionante senza dipendenze esterne.

## Origine del progetto

Il progetto nasce da un design system e da un primo wireframe generati con **[Stitch](https://stitch.withgoogle.com/)** (tool di Google per la prototipazione UI assistita da AI). Il design e il codice iniziale della schermata principale sono stati recuperati tramite **MCP (Model Context Protocol)** direttamente all'interno di **Claude Code** (interfaccia CLI di Anthropic), poi raffinati ed estesi manualmente.

Tutti i giochi e la logica di portale sono stati sviluppati da **Claude** (claude-sonnet-4-6) in sessioni di pair programming, con supervisione umana per revisione, debug e integrazione.

## Stack tecnologica

### Portale

| Layer | Tecnologia |
|---|---|
| Markup | HTML5 semantico |
| Stile | CSS3 custom (variabili, grid, flexbox) — nessun framework |
| Design system | `css/design-system.css` — palette, tipografia, componenti UI generati da Stitch |
| Script | Vanilla JS, nessun bundler, nessuna dipendenza npm |
| Esecuzione | Funziona su `file://` senza server locale |

### Engine di gioco (`js/engine.js`)

`window.BubbleEngine` — singleton globale che espone:

- **Game loop** — `requestAnimationFrame` con delta time, pausa automatica on blur
- **Input** — tastiera (`justPressed` / `justReleased`) e puntatore (mouse + touch)
- **Canvas** — init con DPR scaling per display Retina
- **Web Audio API** — lazy init al primo gesto utente; synth procedurale (`beep`, `noise`)
- **UI helpers** — `showGameOver()`, `showLevelUp()`

### Sprite sheet (`js/sprites.js`)

`window.Sprites` — atlas disegnato proceduralmente su Canvas (nessuna immagine esterna), usato da tutti i giochi come risorsa condivisa.

### Leaderboard (`shared/scores.js`)

`window.BubbleScores` — persistenza punteggi in `localStorage`, top-5 per gioco.

### Giochi (10 titoli)

Ogni gioco è una singola pagina `games/<id>/game.html` autocontenuta che carica le shared lib e implementa loop `update(dt)` / `render(ctx)`.

| Titolo | Genere |
|---|---|
| Galaxy Hopper | Space Invaders |
| Jelly Blocks | Tetris |
| Crystal Maze | Breakout |
| Sky Surfer | Flappy Bird |
| Dragon Path | Snake |
| Meteor Dash | Asteroids |
| Nutty Ninja | Frogger |
| Turbo Karts | Endless Racer pseudo-3D |
| Beat Bouncer | Rhythm 4-corsie |
| Groove Battle | Simon Says + RPG battle |

## Struttura del repository

```
BubbleArcade/
├── index.html              # Portale principale
├── css/
│   └── design-system.css   # Design system Stitch
├── js/
│   ├── engine.js           # BubbleEngine (game loop, input, audio)
│   └── sprites.js          # Atlas procedurale
├── shared/
│   └── scores.js           # BubbleScores (localStorage)
└── games/
    ├── _template/          # Starter per nuovi giochi
    └── <game-id>/
        └── game.html       # Gioco autocontenuto
```

## Come eseguire

Apri `index.html` nel browser. Nessun server, nessun build step, nessuna installazione.

```bash
# Opzionale — server locale per evitare restrizioni file://
python3 -m http.server 8080
# poi apri http://localhost:8080
```

## Filosofia di sviluppo

- **Zero dipendenze**: nessun npm, nessun bundler, nessun framework UI.
- **Funziona offline**: tutto gira da `file://`, inclusi audio e canvas.
- **Localizzazione italiana**: tutta l'interfaccia utente è in italiano.
- **AI-first workflow**: design → Stitch → MCP → Claude Code → codice; il ruolo umano è revisione, direzione e decisioni di design.

## Crediti

- Design system iniziale: **Stitch** (Google)
- Sviluppo assistito: **Claude** (Anthropic, claude-sonnet-4-6)
- Supervisione e integrazione: **Jean-Marie Clément**
