// ====== ISI TAUTAN PROFIL DI SINI ======
// Tempel URL lengkap di antara tanda kutip. Tautan yang dikosongkan tidak akan ditampilkan.
var PROFILE_LINKS = {
  scholar:  '',  // contoh: 'https://scholar.google.com/citations?user=XXXX'
  sinta:    '',  // contoh: 'https://sinta.kemdikbud.go.id/authors/profile/XXXX'
  orcid:    '',  // contoh: 'https://orcid.org/0000-0000-0000-0000'
  garuda:   '',  // contoh: 'https://garuda.kemdikbud.go.id/author/view/XXXX'
  github:   '',  // contoh: 'https://github.com/XXXX'
  linkedin: ''   // contoh: 'https://www.linkedin.com/in/XXXX'
};
// Tautan per artikel, mata kuliah, dan proyek diisi lewat atribut data-url di index.html.
// Tombol "Unduh CV" muncul otomatis jika file cv.pdf ada di folder ini.
// =======================================

(function () {
  var root = document.documentElement;

  // Profile links
  var LINK_META = {
    scholar:  { label: 'Google Scholar', icon: '<path d="M12 3 1 9l11 6 9-4.9V17h2V9L12 3z"/><path d="M5 13.2v4L12 21l7-3.8v-4L12 17l-7-3.8z"/>' },
    sinta:    { label: 'SINTA', icon: '<path d="M4 4h16v16H4z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 15V9m4 6V7m4 8v-4"/>' },
    orcid:    { label: 'ORCID', icon: '<circle cx="12" cy="12" r="10"/><path d="M8 10v7M8 7v.01M11 10v7h2.5a3.5 3.5 0 0 0 0-7z" fill="none" stroke="#fff" stroke-width="1.6"/>' },
    garuda:   { label: 'Garuda', icon: '<path d="M4 5h11a4 4 0 0 1 4 4v10H8a4 4 0 0 1-4-4z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 10h7M8 14h5" fill="none" stroke="currentColor" stroke-width="2"/>' },
    github:   { label: 'GitHub', icon: '<path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.4-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.3-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.2-.4-1.3.1-2.7 0 0 .8-.3 2.7 1a9.4 9.4 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.5.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.9V21c0 .3.2.6.7.5A10 10 0 0 0 12 2z"/>' },
    linkedin: { label: 'LinkedIn', icon: '<path d="M4 9h3v11H4zM5.5 3.5a1.75 1.75 0 1 1 0 3.5 1.75 1.75 0 0 1 0-3.5zM10 9h2.9v1.6c.5-.9 1.6-1.8 3.4-1.8 3.3 0 3.7 2.1 3.7 4.9V20h-3v-5.6c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9V20H10z"/>' }
  };
  var html = Object.keys(LINK_META).filter(function (k) {
    return /^https?:\/\//.test(PROFILE_LINKS[k] || '');
  }).map(function (k) {
    var m = LINK_META[k];
    return '<li><a href="' + encodeURI(PROFILE_LINKS[k]) + '" target="_blank" rel="noopener">' +
      '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" stroke="currentColor" stroke-width="0">' + m.icon + '</svg>' +
      m.label + '</a></li>';
  }).join('');
  document.querySelectorAll('[data-links]').forEach(function (ul) {
    if (html) ul.innerHTML = html; else ul.remove();
  });

  // Per-item links (publikasi, mata kuliah, proyek) from data-url
  function addLink(el, text, cls, parent) {
    var url = (el.getAttribute('data-url') || '').trim();
    if (!/^https?:\/\//.test(url) && !/\.pdf$/i.test(url)) return;
    var a = document.createElement('a');
    a.href = url; a.className = cls; a.target = '_blank'; a.rel = 'noopener';
    a.textContent = text;
    (parent || el).appendChild(a);
  }
  document.querySelectorAll('.pubs li[data-url]').forEach(function (li) {
    addLink(li, 'Baca artikel ↗', 'pub-link', li.querySelector('div'));
  });
  document.querySelectorAll('.course[data-url]').forEach(function (el) { addLink(el, 'Materi & RPS ↗', 'item-link'); });
  document.querySelectorAll('.project[data-url]').forEach(function (el) { addLink(el, 'Lihat proyek ↗', 'item-link'); });

  // CV button: only shown when cv.pdf exists
  var cvBtn = document.querySelector('[data-cv]');
  if (cvBtn) {
    if (location.protocol === 'file:') { /* cannot check on file://, keep visible */ }
    else fetch(cvBtn.getAttribute('href'), { method: 'HEAD' })
      .then(function (r) { if (!r.ok) cvBtn.remove(); })
      .catch(function () { cvBtn.remove(); });
  }

  // Theme toggle
  document.getElementById('themeToggle').addEventListener('click', function () {
    var current = root.dataset.theme ||
      (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    var next = current === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

  // Mobile menu
  var menuBtn = document.getElementById('menuToggle');
  var links = document.getElementById('navLinks');
  menuBtn.addEventListener('click', function () {
    var open = links.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open);
  });
  links.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') { links.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); }
  });

  // Filter pengabdian
  var filterBtns = document.querySelectorAll('.filter button');
  var cards = document.querySelectorAll('#pkmGrid .card');
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var f = btn.dataset.filter;
      cards.forEach(function (c) {
        c.classList.toggle('hidden', f !== 'all' && c.dataset.year !== f);
      });
    });
  });

  // Reveal on scroll
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  // Active nav link
  var sections = document.querySelectorAll('main section[id]');
  var navA = links.querySelectorAll('a');
  if ('IntersectionObserver' in window) {
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          navA.forEach(function (a) {
            a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id);
          });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { so.observe(s); });
  }

  document.getElementById('year').textContent = new Date().getFullYear();
})();
