// shared/scores.js — BubbleScores: localStorage leaderboard
window.BubbleScores = (() => {
  const key = id => `ba_scores_${id}`;

  function get(gameId) {
    try { return JSON.parse(localStorage.getItem(key(gameId))) || []; }
    catch { return []; }
  }

  function save(gameId, score, name = 'Tu') {
    const scores = get(gameId);
    scores.push({ name, score, date: new Date().toLocaleDateString('it-IT') });
    scores.sort((a, b) => b.score - a.score);
    localStorage.setItem(key(gameId), JSON.stringify(scores.slice(0, 10)));
    return scores;
  }

  function getBest(gameId) {
    const s = get(gameId);
    return s.length ? s[0].score : 0;
  }

  function isHighScore(gameId, score) {
    return score > getBest(gameId);
  }

  function renderList(gameId, olElement) {
    if (!olElement) return;
    const scores = get(gameId);
    olElement.innerHTML = scores.length
      ? scores.map((s, i) =>
          `<li><span class="lb-rank">#${i+1}</span> <span class="lb-name">${s.name}</span> <span class="lb-score">${s.score.toLocaleString('it-IT')}</span></li>`
        ).join('')
      : '<li class="lb-empty">Nessun punteggio ancora</li>';
  }

  return { get, save, getBest, isHighScore, renderList };
})();
