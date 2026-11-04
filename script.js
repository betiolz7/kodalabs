(() => {
  const nav = document.getElementById('nav');
  const menuToggle = document.getElementById('menu-toggle');
  const langToggle = document.getElementById('lang-toggle');

  document.getElementById('year').textContent = new Date().getFullYear();

  // ── Nav background on scroll ──
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // ── Mobile menu ──
  const setMenu = (open) => {
    nav.classList.toggle('open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  };
  menuToggle.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
  document.querySelectorAll('.nav-links a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  // ── Reveal on scroll ──
  // Hero is above the fold: animate it in on load instead of waiting for the observer
  requestAnimationFrame(() => document.querySelectorAll('.hero .reveal').forEach((el) => el.classList.add('in')));
  const reveals = document.querySelectorAll('.reveal:not(.hero .reveal)');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('in'));
  }

  // ── Active section in nav ──
  const links = [...document.querySelectorAll('.nav-links a')];
  const sections = links.map((a) => document.querySelector(a.getAttribute('href')));
  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => s && spy.observe(s));
  }

  // ── PT / EN ──
  const translatable = [...document.querySelectorAll('[data-en]')];
  translatable.forEach((el) => { el.dataset.pt = el.innerHTML; });

  const setLang = (lang) => {
    translatable.forEach((el) => { el.innerHTML = lang === 'en' ? el.dataset.en : el.dataset.pt; });
    document.documentElement.lang = lang === 'en' ? 'en' : 'pt-BR';
    langToggle.textContent = lang === 'en' ? 'PT' : 'EN';
    langToggle.setAttribute('aria-label', lang === 'en' ? 'Mudar para português' : 'Switch to English');
    try { localStorage.setItem('koda-lang', lang); } catch (e) { /* storage unavailable */ }
  };

  langToggle.addEventListener('click', () => setLang(document.documentElement.lang === 'en' ? 'pt' : 'en'));

  let saved = null;
  try { saved = localStorage.getItem('koda-lang'); } catch (e) { /* storage unavailable */ }
  if (saved === 'en') setLang('en');
})();
