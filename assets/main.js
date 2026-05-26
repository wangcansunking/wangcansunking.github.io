/* ============================================================
   main.js — render product grid + scroll-driven UI
   ============================================================ */
(() => {
  // Guard against double execution (e.g. ViewTransitions, bfcache)
  if (window.__portfolio_main_loaded) {
    console.log('[main.js] already loaded — skipping');
    return;
  }
  window.__portfolio_main_loaded = true;

  const root = document.documentElement;
  root.classList.add('js');

  // -------- Scroll → CSS vars + topbar state --------
  const topbar = document.querySelector('.topbar');
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      root.style.setProperty('--scroll-y', y);
      root.style.setProperty('--scroll-progress', Math.min(1, y / max).toFixed(4));
      if (topbar) topbar.classList.toggle('scrolled', y > 16);
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // -------- Reveal engine (with per-batch safety net) --------
  const SAFETY_MS = 1500;
  const io = ('IntersectionObserver' in window)
    ? new IntersectionObserver(
        (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); } }),
        { rootMargin: '0px 0px 20% 0px', threshold: 0 }
      )
    : null;

  function observeReveal(els) {
    const list = Array.from(els);
    if (!io) { list.forEach((el) => el.classList.add('in-view')); return; }
    list.forEach((el) => { if (!el.classList.contains('in-view')) io.observe(el); });
    setTimeout(() => list.forEach((el) => { if (!el.classList.contains('in-view')) { el.classList.add('in-view'); io.unobserve(el); } }), SAFETY_MS);
  }
  observeReveal(document.querySelectorAll('.reveal'));

  // -------- Render products from JSON --------
  (async () => {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    let products = [];
    try {
      const res = await fetch('/products.json', { cache: 'no-store' });
      products = (await res.json()).products;
    } catch (e) {
      grid.innerHTML = '<p style="color:var(--ink-subtle);font-size:0.875rem;">无法加载 products.json</p>';
      return;
    }

    const statusLabel = {
      live:    'LIVE',
      public:  'PUBLIC',
      private: 'PRIVATE',
      soon:    'COMING SOON',
    };

    // Render fresh — clear any prior content first
    grid.replaceChildren();
    grid.innerHTML = products.map((p, i) => `
      <a class="product reveal d${(i % 4) + 1}"
         href="${p.disabled ? '#' : p.href}"
         ${p.disabled ? 'data-disabled="true"' : ''}
         ${p.external ? 'target="_blank" rel="noopener"' : ''}>
        <span class="status ${p.status}">${statusLabel[p.status] ?? ''}</span>
        <div class="head">
          <div class="icon">${escapeHtml(p.icon)}</div>
        </div>
        <h3>${escapeHtml(p.title)}</h3>
        <p class="desc">${escapeHtml(p.description)}</p>
        ${(p.tags || []).length ? `<div class="tags">${p.tags.map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join('')}</div>` : ''}
        ${p.repo ? `<div class="footer"><a class="repo" href="${p.repo}" target="_blank" rel="noopener" onclick="event.stopPropagation();"><svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .5C5.6.5.5 5.6.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.4-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2 1-.3 2-.4 3-.4s2 .1 3 .4c2.3-1.6 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.1.7.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.6 18.4.5 12 .5z"/></svg><span>${escapeHtml(p.repoLabel ?? p.repo.replace(/^https?:\/\/github\.com\//, ''))}</span></a></div>` : ''}
      </a>
    `).join('');

    observeReveal(grid.querySelectorAll('.reveal'));
  })();

  function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
})();
