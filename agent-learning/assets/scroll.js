/* ============================================================
   scroll.js — 滚动驱动 + reveal 入场（带兜底）
   ~1.5KB, 零依赖
   ============================================================ */
(() => {
  const root = document.documentElement;
  const navbar = document.querySelector('.topnav');

  // ---------- 1) Scroll → CSS variables (parallax fuel) ----------
  let ticking = false;
  let lastY = -1;

  function updateScroll() {
    const y = window.scrollY;
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const progress = Math.min(1, Math.max(0, y / max));
    if (y !== lastY) {
      root.style.setProperty('--scroll-y', y);
      root.style.setProperty('--scroll-progress', progress.toFixed(4));
      lastY = y;
    }
    if (navbar) navbar.classList.toggle('scrolled', y > 12);
    ticking = false;
  }
  function onScroll() {
    if (!ticking) { requestAnimationFrame(updateScroll); ticking = true; }
  }

  // Real --vh fallback for mobile address-bar quirks
  function setVH() { root.style.setProperty('--vh', `${window.innerHeight * 0.01}px`); }
  setVH();
  window.addEventListener('resize', setVH, { passive: true });
  updateScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // ---------- 2) Reveal engine (lenient + safety net) ----------
  // Strategy:
  //   • IO with rootMargin '0px 0px 25% 0px' (fire 25% BEFORE entering viewport)
  //     and threshold 0 (ANY pixel of intersection wakes it up).
  //   • For everything still hidden after 1.5 s — force `.in-view`.
  //     Worst case: animation skipped, content still shown.
  //   • Expose `window.revealEngine.observe(els)` so dynamically-injected
  //     elements (course grid, compact rows, lesson templates) plug in too.
  const SAFETY_DELAY_MS = 1500;

  let io = null;
  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('in-view');
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: '0px 0px 25% 0px', threshold: 0 },
    );
  }

  function observeAll(elements) {
    const list = Array.from(elements);
    if (!io) {
      // No IO support → just show everything
      list.forEach(el => el.classList.add('in-view'));
      return;
    }
    list.forEach(el => {
      if (!el.classList.contains('in-view')) io.observe(el);
    });
    // Per-batch safety net: even if IO never fires for these (off-screen,
    // display:none parent, viewport edge race), force-show after 1.5 s.
    // Animation may be skipped, content is visible.
    setTimeout(() => {
      list.forEach(el => {
        if (!el.classList.contains('in-view')) {
          el.classList.add('in-view');
          io.unobserve(el);
        }
      });
    }, SAFETY_DELAY_MS);
  }

  function forceShowStragglers() {
    document.querySelectorAll('.reveal:not(.in-view)').forEach(el => {
      el.classList.add('in-view');
      if (io) io.unobserve(el);
    });
  }

  // Public API
  window.revealEngine = { observe: observeAll, forceAll: forceShowStragglers };

  // Initial pass: observe anything already in DOM
  observeAll(document.querySelectorAll('.reveal'));

  // Safety net — guarantees content is visible even if IO never fires
  setTimeout(forceShowStragglers, SAFETY_DELAY_MS);

  // Re-arm safety net once on full window load (in case slow networks delayed
  // injection). Dynamic content (course cards) calls `revealEngine.observe()`
  // directly so this is mostly belt-and-suspenders.
  window.addEventListener('load', () => setTimeout(forceShowStragglers, 800), { once: true });
})();
