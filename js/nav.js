/**
 * nav.js
 * Comportamento compartilhado da barra de navegação (menu mobile + link ativo).
 * Incluído em todas as páginas.
 */

(function () {
  'use strict';

  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');

  if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('open'));
  }

  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-links a').forEach((a) => {
    const href = a.getAttribute('href');
    if (href === currentPage) a.classList.add('active');
  });
})();
