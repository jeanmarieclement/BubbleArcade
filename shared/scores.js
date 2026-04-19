// shared/scores.js — BubbleScores: localStorage leaderboard
window.BubbleScores = (() => {
  const key = id => `ba_scores_${id}`;

  function get(gameId) {
    try { return JSON.parse(localStorage.getItem(key(gameId))) || []; }
    catch { return []; }
  }

  function getBest(gameId) {
    const s = get(gameId);
    return s.length ? s[0].score : 0;
  }

  function isHighScore(gameId, score) {
    return score > getBest(gameId);
  }

  // Salva il punteggio e mostra il prompt nome se è un nuovo record.
  // Restituisce true se è un nuovo record, false altrimenti.
  function save(gameId, score, name = 'Tu') {
    const wasNew = isHighScore(gameId, score);

    const scores = get(gameId);
    scores.push({ name, score, date: new Date().toLocaleDateString('it-IT') });
    scores.sort((a, b) => b.score - a.score);
    localStorage.setItem(key(gameId), JSON.stringify(scores.slice(0, 10)));

    if (wasNew) _showNamePrompt(gameId, score);

    return wasNew;
  }

  function renderList(gameId, olElement) {
    if (!olElement) return;
    const scores = get(gameId);
    olElement.innerHTML = scores.length
      ? scores.map((s, i) =>
          `<li><span class="lb-rank">#${i + 1}</span><span class="lb-name">${s.name}</span><span class="lb-score">${s.score.toLocaleString('it-IT')}</span></li>`
        ).join('')
      : '<li class="lb-empty">Nessun punteggio ancora</li>';
  }

  // ── Modal nome ────────────────────────────────────────────
  function _showNamePrompt(gameId, score) {
    const existing = document.getElementById('ba-name-prompt');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'ba-name-prompt';
    modal.style.cssText = [
      'position:fixed', 'inset:0', 'z-index:9999',
      'display:flex', 'align-items:center', 'justify-content:center',
      "background:rgba(55,39,77,0.55)", 'backdrop-filter:blur(6px)',
      '-webkit-backdrop-filter:blur(6px)',
    ].join(';');

    modal.innerHTML = `
      <div style="
        background:#fff; border-radius:2rem; padding:2rem 2.5rem;
        text-align:center; width:min(320px,90vw);
        box-shadow:0 24px 48px -12px rgba(182,0,81,0.28);
        font-family:'Plus Jakarta Sans',system-ui,sans-serif;
        animation:ba-pop .35s cubic-bezier(0.34,1.56,0.64,1) both;
      ">
        <div style="font-size:2.2rem;margin-bottom:.4rem">🏆</div>
        <div style="font-size:1.25rem;font-weight:800;color:#37274d;margin-bottom:.25rem">Nuovo Record!</div>
        <div style="font-size:.88rem;color:#66547d;margin-bottom:1.4rem">Come vuoi firmare nella classifica?</div>
        <input id="ba-name-input" type="text" maxlength="16"
               placeholder="Il tuo nome"
               value="Tu"
               style="
                 width:100%;box-sizing:border-box;
                 padding:.7rem 1.1rem; margin-bottom:1rem;
                 border:2px solid #e9d5ff; border-radius:999px;
                 font-size:1rem; font-family:inherit; color:#37274d;
                 background:#fcf4ff; text-align:center; outline:none;
                 transition:border-color .18s;
               " />
        <button id="ba-name-confirm" style="
          background:#b60051; color:#ffeff0; border:none;
          border-radius:999px; padding:.8rem 2rem; width:100%;
          font-size:1rem; font-weight:700; cursor:pointer;
          font-family:inherit;
          box-shadow:inset 0 -3px 0 #7a0038, 0 8px 20px -6px rgba(182,0,81,0.35);
          transition:background .15s, transform .1s;
        ">Salva il punteggio</button>
      </div>
      <style>
        @keyframes ba-pop {
          from { opacity:0; transform:scale(.85) translateY(12px); }
          to   { opacity:1; transform:scale(1)   translateY(0); }
        }
        #ba-name-input:focus { border-color:#b60051; }
        #ba-name-confirm:hover  { background:#c8005a; }
        #ba-name-confirm:active { transform:translateY(2px); box-shadow:inset 0 -1px 0 #7a0038; }
      </style>`;

    document.body.appendChild(modal);

    const input = modal.querySelector('#ba-name-input');
    const btn   = modal.querySelector('#ba-name-confirm');

    setTimeout(() => { input.select(); input.focus(); }, 80);

    const confirm = () => {
      const name = input.value.trim() || 'Tu';
      // Aggiorna l'entry salvata con il nome definitivo
      const scores = get(gameId);
      const idx = scores.findIndex(s => s.score === score && s.name === 'Tu');
      if (idx !== -1) {
        scores[idx].name = name;
        localStorage.setItem(key(gameId), JSON.stringify(scores));
      }
      modal.remove();
      // Aggiorna eventuali classifiche visibili sulla pagina
      document.querySelectorAll('#leaderboardList').forEach(el => renderList(gameId, el));
    };

    btn.addEventListener('click', confirm);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') confirm(); });
    // click fuori chiude senza modificare il nome
    modal.addEventListener('click', e => { if (e.target === modal) confirm(); });
  }

  return { get, save, getBest, isHighScore, renderList };
})();
