// ===== KONFIGURASI =====
const labels = { id: 'ID', en: 'EN' };
const folder = { id: 'HTML', en: 'EN' };

const pageLang = document.documentElement.lang === 'en' ? 'en' : 'id';

// ===== GANTI BAHASA =====
function setLang(lang) {
  if (lang === pageLang) return;
  const url  = new URL(location.href);
  const file = url.pathname.split('/').pop() || 'index.html';
  const dir  = url.pathname.replace(/[^/]*$/, '');                       // ".../HTML/" atau ".../EN/"
  const base = dir.replace(new RegExp('/' + folder[pageLang] + '/$'), '/' + folder[lang] + '/');
  location.href = base + file + url.search + url.hash;
}

// ===== INISIALISASI =====
document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('.navbar');
  const label  = document.getElementById('langLabel');
  const btn    = document.getElementById('langBtn');
  const menu   = document.getElementById('langMenu');

  if (label) label.textContent = labels[pageLang];

  if (btn && menu) {
    menu.querySelectorAll('[data-lang]').forEach(b => {
      b.classList.toggle('active', b.dataset.lang === pageLang);
      b.addEventListener('click', () => {
        menu.classList.remove('open');
        setLang(b.dataset.lang);
      });
    });
    btn.addEventListener('click', e => {
      e.stopPropagation();
      menu.classList.toggle('open');
    });
    document.addEventListener('click', e => {
      if (!e.target.closest('.lang')) menu.classList.remove('open');
    });
  }

  if (navbar && navbar.classList.contains('navbar-auto')) {
    const NEAR = 110;  // jarak kursor dari atas layar (px) supaya navbar muncul
    document.addEventListener('mousemove', e => {
      const menuOpen = menu && menu.classList.contains('open');
      navbar.classList.toggle('show', e.clientY < NEAR || menuOpen);
    });
    document.addEventListener('mouseleave', () => {
      if (!(menu && menu.classList.contains('open'))) navbar.classList.remove('show');
    });
  }
});
