(function () {
  const base = (document.currentScript && document.currentScript.getAttribute('data-base')) || '';
  document.write(
    '<footer>' +
      '<div class="footer-grid">' +
        '<div class="footer-brand">' +
          '<a href="' + base + 'index.html" class="logo"><span class="logo-dot"></span>Bubble Arcade</a>' +
          '<p>Il miglior portale di giochi HTML5 gratuiti sul web. Nessun download, nessuna pubblicit\u00e0 invasiva \u2014 solo divertimento.</p>' +
        '</div>' +
        '<div class="footer-col">' +
          '<h4>Giochi</h4>' +
          '<ul>' +
            '<li><a href="' + base + 'index.html#trending">Popolari</a></li>' +
            '<li><a href="' + base + 'all-games.html">Tutti i Giochi</a></li>' +
            '<li><a href="' + base + 'guida.html">Guida</a></li>' +
          '</ul>' +
        '</div>' +
        '<div class="footer-col">' +
          '<h4>Legale</h4>' +
          '<ul>' +
            '<li><a href="' + base + 'privacy.html">Privacy Policy</a></li>' +
            '<li><a href="' + base + 'termini.html">Termini di Gioco</a></li>' +
            '<li><a href="' + base + 'guida.html">Guida Genitori</a></li>' +
            '<li><a href="' + base + 'cookie.html">Cookie Policy</a></li>' +
          '</ul>' +
        '</div>' +
      '</div>' +
      '<div class="footer-bottom">' +
        '<span>\u00a9 2026 Bubble Arcade. Tutti i diritti riservati.</span>' +
        '<span>Fatto con \u2764\ufe0f per i giocatori di tutto il mondo</span>' +
      '</div>' +
    '</footer>'
  );
})();
