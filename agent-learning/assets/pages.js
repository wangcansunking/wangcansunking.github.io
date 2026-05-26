/* ============================================================
   pages.js — 页面级交互（双视图切换、compact 行展开）
   ============================================================ */
(() => {
  // ===== 1) View switcher (Grid <-> Compact) on /courses.html =====
  const switcher = document.querySelector('[data-view-switcher]');
  if (switcher) {
    const gridEl    = document.querySelector('[data-view="grid"]');
    const compactEl = document.querySelector('[data-view="compact"]');
    const buttons   = switcher.querySelectorAll('button[data-view-target]');

    const setView = (name) => {
      buttons.forEach(b => b.classList.toggle('active', b.dataset.viewTarget === name));
      if (gridEl)    gridEl.style.display    = name === 'grid'    ? '' : 'none';
      if (compactEl) compactEl.style.display = name === 'compact' ? '' : 'none';
      try { localStorage.setItem('coursesView', name); } catch {}
    };

    // Restore last view
    let initial = 'grid';
    try { initial = localStorage.getItem('coursesView') || 'grid'; } catch {}
    setView(initial);

    buttons.forEach(b => b.addEventListener('click', () => setView(b.dataset.viewTarget)));
  }

  // ===== 2) Compact row expand/collapse =====
  document.querySelectorAll('.compact-row .head').forEach(head => {
    head.addEventListener('click', () => {
      const row = head.closest('.compact-row');
      row.classList.toggle('expanded');
    });
  });
})();
