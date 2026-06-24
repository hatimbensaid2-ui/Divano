/* DIVANO — interactions globales */
(function () {
  'use strict';

  // En-tête superposé au hero (accueil) : mesurer la hauteur + solidifier au scroll
  const header = document.querySelector('[data-header]');
  if (header) {
    const setH = function () {
      document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px');
    };
    setH();
    window.addEventListener('resize', setH);
    if (document.body.classList.contains('template-index') && document.querySelector('.hero-banner')) {
      const onScroll = function () { header.classList.toggle('header--solid', window.scrollY > 40); };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    } else {
      header.classList.add('header--solid');
    }
  }

  // Diaporama hero plein écran
  document.querySelectorAll('[data-hero-slideshow]').forEach(function (root) {
    const slides = Array.prototype.slice.call(root.querySelectorAll('[data-slide]'));
    if (slides.length < 2) return;
    let i = 0, timer = null;
    const show = function (n) {
      i = (n + slides.length) % slides.length;
      slides.forEach(function (s, idx) { s.classList.toggle('is-active', idx === i); });
    };
    const next = function () { show(i + 1); };
    const prev = function () { show(i - 1); };
    const start = function () { stop(); timer = setInterval(next, 6000); };
    const stop = function () { clearInterval(timer); timer = null; };
    const p = root.querySelector('[data-hero-prev]');
    const n = root.querySelector('[data-hero-next]');
    if (p) p.addEventListener('click', function () { prev(); start(); });
    if (n) n.addEventListener('click', function () { next(); start(); });
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
    start();
  });

  // Image shoppable (produits épinglés) — multi-images
  document.querySelectorAll('[data-shopimage]').forEach(function (root) {
    const slides = Array.prototype.slice.call(root.querySelectorAll('[data-slide]'));
    if (!slides.length) return;

    // Hotspots scoped à chaque diapositive
    slides.forEach(function (slide) {
      const dots = Array.prototype.slice.call(slide.querySelectorAll('[data-hotspot]'));
      const products = Array.prototype.slice.call(slide.querySelectorAll('[data-hsproduct]'));
      let h = 0;
      const showHot = function (n) {
        h = (n + dots.length) % dots.length;
        dots.forEach(function (d, idx) { d.classList.toggle('is-active', idx === h); });
        products.forEach(function (p, idx) { p.classList.toggle('is-active', idx === h); });
      };
      dots.forEach(function (d, idx) { d.addEventListener('click', function () { showHot(idx); }); });
      // flèches produit (cas d'une seule image)
      const hp = slide.querySelector('[data-hs-prev]');
      const hn = slide.querySelector('[data-hs-next]');
      if (hp) hp.addEventListener('click', function () { showHot(h - 1); });
      if (hn) hn.addEventListener('click', function () { showHot(h + 1); });
      if (dots.length) showHot(0);
    });

    // Carrousel entre les images
    let s = 0;
    const showSlide = function (n) {
      s = (n + slides.length) % slides.length;
      slides.forEach(function (sl, idx) { sl.classList.toggle('is-active', idx === s); });
    };
    root.querySelectorAll('[data-slide-prev]').forEach(function (b) { b.addEventListener('click', function () { showSlide(s - 1); }); });
    root.querySelectorAll('[data-slide-next]').forEach(function (b) { b.addEventListener('click', function () { showSlide(s + 1); }); });
    showSlide(0);
  });

  // Menu mobile
  const burger = document.querySelector('[data-burger]');
  const nav = document.querySelector('[data-nav]');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      const open = nav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
  }

  // Apparition au scroll
  const reveals = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // Carrousels horizontaux
  document.querySelectorAll('[data-scroller]').forEach(function (scroller) {
    const track = scroller.querySelector('[data-track]');
    const prev = scroller.querySelector('[data-prev]');
    const next = scroller.querySelector('[data-next]');
    if (!track) return;
    const amount = function () { return track.clientWidth * 0.8; };
    if (prev) prev.addEventListener('click', function () { track.scrollBy({ left: -amount(), behavior: 'smooth' }); });
    if (next) next.addEventListener('click', function () { track.scrollBy({ left: amount(), behavior: 'smooth' }); });
  });

  // Carrousel centré « Curated Eras » — boucle infinie + lecture auto
  document.querySelectorAll('[data-eras]').forEach(function (root) {
    const track = root.querySelector('[data-eras-track]');
    if (!track) return;
    const originals = Array.prototype.slice.call(track.querySelectorAll('.eras__card'));
    const N = originals.length;
    if (N < 2) return;

    // Cloner l'ensemble avant et après pour un défilement sans fin
    const beforeFrag = document.createDocumentFragment();
    const afterFrag = document.createDocumentFragment();
    originals.forEach(function (card) {
      const a = card.cloneNode(true); a.setAttribute('aria-hidden', 'true'); a.setAttribute('tabindex', '-1'); a.classList.add('is-clone');
      const b = card.cloneNode(true); b.setAttribute('aria-hidden', 'true'); b.setAttribute('tabindex', '-1'); b.classList.add('is-clone');
      beforeFrag.appendChild(a); afterFrag.appendChild(b);
    });
    track.insertBefore(beforeFrag, track.firstChild);
    track.appendChild(afterFrag);

    const cards = Array.prototype.slice.call(track.querySelectorAll('.eras__card'));
    let setWidth = 0;

    function measure() {
      // distance entre deux cartes consécutives × nombre d'origines
      const stepW = cards[1].offsetLeft - cards[0].offsetLeft;
      setWidth = stepW * N;
    }

    function jump(delta) {
      const prevBehavior = track.style.scrollBehavior;
      track.style.scrollBehavior = 'auto';
      track.scrollLeft += delta;
      track.style.scrollBehavior = prevBehavior;
    }

    function update() {
      const box = track.getBoundingClientRect();
      const center = box.left + box.width / 2;
      let best = null, bestDist = Infinity;
      cards.forEach(function (card) {
        const r = card.getBoundingClientRect();
        const dist = Math.abs(r.left + r.width / 2 - center);
        if (dist < bestDist) { bestDist = dist; best = card; }
      });
      cards.forEach(function (card) { card.classList.toggle('is-active', card === best); });
    }

    let raf;
    track.addEventListener('scroll', function () {
      // boucle : repositionner silencieusement quand on entre dans une zone clonée
      if (track.scrollLeft >= setWidth * 2) { jump(-setWidth); }
      else if (track.scrollLeft <= 0) { jump(setWidth); }
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    });

    const step = function () { return cards[0].offsetLeft && (cards[1].offsetLeft - cards[0].offsetLeft) || cards[0].offsetWidth + 16; };
    const prev = root.querySelector('[data-eras-prev]');
    const next = root.querySelector('[data-eras-next]');
    if (prev) prev.addEventListener('click', function () { stopAuto(); track.scrollBy({ left: -step(), behavior: 'smooth' }); restartAuto(); });
    if (next) next.addEventListener('click', function () { stopAuto(); track.scrollBy({ left: step(), behavior: 'smooth' }); restartAuto(); });

    // Lecture automatique
    let auto = null, idleTimer = null;
    function tick() { track.scrollBy({ left: step(), behavior: 'smooth' }); }
    function startAuto() { if (!auto) auto = setInterval(tick, 3000); }
    function stopAuto() { clearInterval(auto); auto = null; }
    function restartAuto() { clearTimeout(idleTimer); idleTimer = setTimeout(startAuto, 4000); }

    ['pointerdown', 'wheel', 'touchstart'].forEach(function (ev) {
      track.addEventListener(ev, function () { stopAuto(); restartAuto(); }, { passive: true });
    });
    root.addEventListener('mouseenter', stopAuto);
    root.addEventListener('mouseleave', startAuto);
    document.addEventListener('visibilitychange', function () { document.hidden ? stopAuto() : startAuto(); });

    function init() {
      measure();
      // démarrer au début de l'ensemble central (les clones forment les tampons)
      jump(setWidth - track.scrollLeft);
      update();
    }
    init();
    window.addEventListener('load', init);
    let rz; window.addEventListener('resize', function () { clearTimeout(rz); rz = setTimeout(init, 200); });
    startAuto();
  });

  // Onglets de filtre (collection en vedette)
  document.querySelectorAll('[data-tabs]').forEach(function (tabsEl) {
    const tabs = tabsEl.querySelectorAll('[data-tab]');
    const panels = document.querySelectorAll('[data-panel="' + tabsEl.dataset.tabs + '"]');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.setAttribute('aria-selected', 'false'); });
        tab.setAttribute('aria-selected', 'true');
        const key = tab.dataset.tab;
        panels.forEach(function (p) {
          p.hidden = !(key === 'all' || p.dataset.key === key);
        });
      });
    });
  });

  // Filtre par catégorie (produits populaires)
  document.querySelectorAll('[data-filter-tabs]').forEach(function (tabsEl) {
    const featured = tabsEl.closest('.featured');
    const grid = featured ? featured.querySelector('[data-filter-grid]') : null;
    if (!grid) return;
    const cards = grid.querySelectorAll('[data-cat]');
    tabsEl.querySelectorAll('[data-filter]').forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabsEl.querySelectorAll('[data-filter]').forEach(function (t) { t.setAttribute('aria-selected', 'false'); });
        tab.setAttribute('aria-selected', 'true');
        const key = tab.dataset.filter;
        cards.forEach(function (card) {
          card.style.display = (key === 'all' || card.dataset.cat === key) ? '' : 'none';
        });
      });
    });
  });

  // Sélecteur de quantité
  document.querySelectorAll('[data-qty]').forEach(function (qty) {
    const input = qty.querySelector('input');
    qty.querySelectorAll('button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const step = btn.dataset.step === 'down' ? -1 : 1;
        const val = Math.max(1, (parseInt(input.value, 10) || 1) + step);
        input.value = val;
      });
    });
  });

  // Galerie produit
  document.querySelectorAll('[data-gallery]').forEach(function (gallery) {
    const main = gallery.querySelector('[data-main-img]');
    gallery.querySelectorAll('[data-thumb]').forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        if (main) main.src = thumb.dataset.full || thumb.querySelector('img').src;
      });
    });
  });
})();
