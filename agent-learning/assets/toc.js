/* ============================================================
   toc.js — TOC scrollspy
   策略：找最后一个 top <= viewport top + 28% 的 heading 作为 active
   ============================================================ */
(() => {
  const tocLinks = document.querySelectorAll('.lesson-toc nav a[href^="#"]');
  if (!tocLinks.length) return;

  const main = document.querySelector('.lesson-main');
  if (!main) return;

  const headings = Array.from(main.querySelectorAll('h2[id], h3[id]'));
  if (!headings.length) return;

  const linkByHash = new Map();
  tocLinks.forEach(a => linkByHash.set(decodeURIComponent(a.getAttribute('href').slice(1)), a));

  let active = null;
  function setActive(id) {
    if (active === id) return;
    if (active) linkByHash.get(active)?.classList.remove('active');
    active = id;
    if (id) {
      const link = linkByHash.get(id);
      if (link) {
        link.classList.add('active');
        // ensure visible in TOC scroll area
        const tocEl = link.closest('.lesson-toc');
        if (tocEl) {
          const linkRect = link.getBoundingClientRect();
          const tocRect  = tocEl.getBoundingClientRect();
          if (linkRect.top < tocRect.top + 20 || linkRect.bottom > tocRect.bottom - 20) {
            link.scrollIntoView({ block: 'nearest' });
          }
        }
      }
    }
  }

  function pickActive() {
    const triggerY = window.innerHeight * 0.28;
    let chosen = null;
    for (const h of headings) {
      const top = h.getBoundingClientRect().top;
      if (top <= triggerY) chosen = h;
      else break;
    }
    setActive(chosen ? chosen.id : headings[0].id);
  }

  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      pickActive();
      ticking = false;
    });
  }

  pickActive();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  // Smooth scroll on click (account for sticky offset)
  tocLinks.forEach(a => {
    a.addEventListener('click', (e) => {
      const id = decodeURIComponent(a.getAttribute('href').slice(1));
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 16;
      window.scrollTo({ top, behavior: 'smooth' });
      history.pushState(null, '', `#${id}`);
    });
  });
})();
