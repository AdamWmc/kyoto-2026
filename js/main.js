/* ═══════════════════════════════════════
   Kyoto Trip Site · main.js
═══════════════════════════════════════ */

// ── Sticky nav: appears after hero leaves viewport ──
(function initNav() {
  const nav = document.getElementById('nav');
  const hero = document.getElementById('hero');
  if (!nav || !hero) return;

  const observer = new IntersectionObserver(
    ([entry]) => nav.classList.toggle('visible', !entry.isIntersecting),
    { threshold: 0 }
  );
  observer.observe(hero);
})();

// ── Active nav day highlight on scroll ──
(function initNavHighlight() {
  const navDays = document.querySelectorAll('.nav-day[data-day]');
  const daySections = Array.from({ length: 5 }, (_, i) =>
    document.getElementById(`day${i + 1}`)
  ).filter(Boolean);

  if (!daySections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          const dayNum = id.replace('day', '');
          navDays.forEach((el) => {
            el.classList.toggle('active', el.dataset.day === dayNum);
          });
        }
      });
    },
    { threshold: 0.25 }
  );

  daySections.forEach((el) => observer.observe(el));
})();

// ── Scroll-triggered reveal animation ──
(function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger siblings in same parent
          const siblings = Array.from(
            entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')
          );
          const delay = siblings.indexOf(entry.target) * 80;
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, Math.min(delay, 320));
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  items.forEach((el) => observer.observe(el));
})();

// ── Back to top button ──
(function initBackTop() {
  const btn = document.getElementById('backTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 600);
  }, { passive: true });
})();

// ── Day 4 Route Picker ──
(function initRoutePicker() {
  const tabs = document.querySelectorAll('.route-tab');
  const contents = document.querySelectorAll('.route-content');
  const recommendEl = document.getElementById('routeRecommend');
  const recommendBox = recommendEl?.parentElement;

  const recommendations = {
    a: { text: '最推薦 · 適合放慢步調，想吃抹茶甜點', color: '#2d7a3d', bg: '#e8f5ec' },
    b: { text: '最穩妥 · 天氣熱或爸媽體力較疲時的最佳選擇', color: '#1a4a6e', bg: '#e8f0f8' },
    c: { text: '打卡首選 · 爸媽一定想看金色那座寺', color: '#7a5010', bg: '#f8f0e0' },
  };

  function switchRoute(target) {
    tabs.forEach((t) => t.classList.toggle('active', t.dataset.route === target));
    contents.forEach((c) => c.classList.toggle('active', c.dataset.route === target));

    if (recommendEl && recommendBox) {
      const rec = recommendations[target];
      if (rec) {
        recommendEl.textContent = rec.text;
        recommendEl.style.color = rec.color;
        recommendEl.style.background = rec.bg;
        recommendBox.style.height = recommendBox.scrollHeight + 'px';
        recommendBox.style.padding = '0';
      }
    }
  }

  // Show recommendation bar height correctly after first layout
  if (recommendBox) {
    requestAnimationFrame(() => {
      recommendBox.style.height = recommendBox.scrollHeight + 'px';
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => switchRoute(tab.dataset.route));
  });

  // Init
  switchRoute('a');
})();

// ── Smooth scroll for anchor links (fallback for older Safari) ──
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navHeight = document.getElementById('nav')?.offsetHeight || 0;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

// ── Lazy-load external links with rel safety ──
(function secureExternalLinks() {
  document.querySelectorAll('a[target="_blank"]').forEach((link) => {
    if (!link.rel.includes('noopener')) {
      link.rel = 'noopener noreferrer';
    }
  });
})();
