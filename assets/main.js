/* ============================================================
   main.js — render product grid + scroll-driven UI
   ============================================================ */
(() => {
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

    grid.innerHTML = products.map((p, i) => `
      <a class="product reveal d${(i % 4) + 1}"
         href="${p.disabled ? '#' : p.href}"
         ${p.disabled ? 'data-disabled="true"' : ''}
         ${p.external ? 'target="_blank" rel="noopener"' : ''}>
        <div class="head">
          <div class="icon">${escapeHtml(p.icon)}</div>
          <div class="spacer"></div>
          <span class="status ${p.status}">${statusLabel[p.status] ?? ''}</span>
        </div>
        <h3>${escapeHtml(p.title)}</h3>
        <p class="desc">${escapeHtml(p.description)}</p>
        ${(p.tags || []).length ? `<div class="tags">${p.tags.map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join('')}</div>` : ''}
        <div class="footer">
          <span class="visit">
            ${p.disabled ? '即将上线' : (p.cta ?? '查看详情')}
            ${p.disabled ? '' : `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>`}
          </span>
          ${p.repo ? `<a class="repo" href="${p.repo}" target="_blank" rel="noopener" onclick="event.stopPropagation();">${escapeHtml(p.repoLabel ?? p.repo.replace(/^https?:\/\/github\.com\//, ''))}</a>` : ''}
        </div>
      </a>
    `).join('');

    observeReveal(grid.querySelectorAll('.reveal'));
  })();

  function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
})();
