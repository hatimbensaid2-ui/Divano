/* DIVANO — interactions globales */
(function () {
  'use strict';

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

  // Carrousel centré « Curated Eras »
  document.querySelectorAll('[data-eras]').forEach(function (root) {
    const track = root.querySelector('[data-eras-track]');
    if (!track) return;
    const cards = Array.prototype.slice.call(track.querySelectorAll('.eras__card'));
    if (!cards.length) return;

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
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    });

    const step = function () { return cards[0].offsetWidth + 16; };
    const prev = root.querySelector('[data-eras-prev]');
    const next = root.querySelector('[data-eras-next]');
    if (prev) prev.addEventListener('click', function () { track.scrollBy({ left: -step(), behavior: 'smooth' }); });
    if (next) next.addEventListener('click', function () { track.scrollBy({ left: step(), behavior: 'smooth' }); });

    function centerMiddle() {
      const mid = cards[Math.floor(cards.length / 2)];
      track.scrollLeft = mid.offsetLeft - (track.clientWidth / 2) + (mid.offsetWidth / 2);
      update();
    }
    centerMiddle();
    window.addEventListener('load', centerMiddle);
    window.addEventListener('resize', update);
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
