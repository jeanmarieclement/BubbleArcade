(function () {
  const base = (document.currentScript && document.currentScript.getAttribute('data-base')) || '';
  document.write(
    '<nav>' +
      '<a href="' + base + 'index.html" class="logo"><span class="logo-dot"></span>Bubble Arcade</a>' +
      '<ul class="nav-links">' +
        '<li><a href="' + base + 'index.html">Home</a></li>' +
        '<li><a href="' + base + 'all-games.html">Tutti i Giochi</a></li>' +
      '</ul>' +
    '</nav>'
  );
})();
