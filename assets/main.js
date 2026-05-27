/* ============================================================
   main.js
   Architecture adapted from davidhckh/portfolio-2025
   (https://github.com/davidhckh/portfolio-2025) - attribution preserved.
   ============================================================ */
(() => {
  if (window.__portfolio_main_loaded) return;
  window.__portfolio_main_loaded = true;

  const root = document.documentElement;

  // ---------- 1) Lenis smooth scroll ----------
  let lenis;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
      wheelMultiplier: 1,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Update GSAP ScrollTrigger
    if (window.gsap && window.ScrollTrigger) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }
  }

  // ---------- 2) Anchor link smooth-scroll via Lenis ----------
  document.querySelectorAll('[data-scroll-link]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(target, { offset: -64, duration: 1.4 });
      } else {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ---------- 3) Preloader → reveal text ----------
  const preloader = document.getElementById('preloader');
  const progressEl = document.getElementById('preloader-progress');

  function hidePreloader() {
    if (!preloader) return;
    preloader.classList.add('is-hidden');
    root.classList.add('is-ready');
    // Trigger fade-up reveals after preloader hides
    document.querySelectorAll('.fade-up').forEach((el, i) => {
      const inViewport = el.getBoundingClientRect().top < window.innerHeight;
      if (inViewport) {
        setTimeout(() => el.classList.add('in-view'), 200 + i * 80);
      }
    });
  }

  // Animate progress 0 → 100
  let prog = 0;
  const progressTimer = setInterval(() => {
    prog = Math.min(100, prog + Math.random() * 12 + 4);
    if (progressEl) progressEl.textContent = String(Math.floor(prog)).padStart(2, '0');
    if (prog >= 100) {
      clearInterval(progressTimer);
      setTimeout(hidePreloader, 200);
    }
  }, 90);

  // ---------- 4) Reveal on scroll ----------
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in-view');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0 });
    document.querySelectorAll('.fade-up').forEach((el) => io.observe(el));
    // Safety net
    setTimeout(() => {
      document.querySelectorAll('.fade-up:not(.in-view)').forEach((el) => el.classList.add('in-view'));
    }, 4000);
  } else {
    document.querySelectorAll('.fade-up').forEach((el) => el.classList.add('in-view'));
  }

  // ---------- 5) Render products ----------
  (async () => {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    let products = [];
    try {
      const res = await fetch('/products.json', { cache: 'no-store' });
      products = (await res.json()).products;
    } catch (e) {
      grid.innerHTML = '<p style="color: var(--color-text-300);">Failed to load products.json</p>';
      return;
    }

    const statusLabel = {
      live: 'Live',
      public: 'Public',
      private: 'Private',
      soon: 'Coming Soon',
    };

    // Render as case-study rows (davidhckh "preview card" style)
    grid.replaceChildren();
    grid.innerHTML = products.map((p, i) => `
      <a class="project-card fade-up"
         href="${p.disabled ? '#' : p.href}"
         ${p.disabled ? 'data-disabled="true"' : ''}
         ${p.external ? 'target="_blank" rel="noopener"' : ''}
         data-card-index="${i}">
        <div class="project-card-inner">
          <div class="project-num">${String(i + 1).padStart(2, '0')}</div>
          <div class="project-title">
            <span class="project-status-dot ${p.status}"></span>${escapeHtml(p.title)}
          </div>
          <div class="project-meta">
            <div style="color: var(--color-text-400); margin-bottom: 4px; max-width: 32ch;">${escapeHtml(p.description.length > 80 ? p.description.slice(0, 80) + '…' : p.description)}</div>
            <div class="project-meta-row">
              <span class="project-tag">${escapeHtml(statusLabel[p.status] ?? '')}</span>
              ${(p.tags || []).slice(0, 2).map((t) => `<span class="project-tag">${escapeHtml(t)}</span>`).join('')}
            </div>
          </div>
          <div class="project-arrow">
            <svg fill="none" stroke="currentColor" stroke-width="2.4" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M13 5l7 7-7 7"/></svg>
          </div>
        </div>
      </a>
    `).join('');

    // Re-observe new fade-up nodes
    if ('IntersectionObserver' in window) {
      const io2 = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { e.target.classList.add('in-view'); io2.unobserve(e.target); }
        });
      }, { rootMargin: '0px 0px -10% 0px', threshold: 0 });
      grid.querySelectorAll('.fade-up').forEach((el) => io2.observe(el));
      setTimeout(() => grid.querySelectorAll('.fade-up:not(.in-view)').forEach((el) => el.classList.add('in-view')), 4000);
    }
  })();

  // ---------- 6) Hero canvas — soft parallax circle pattern ----------
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    function resize() {
      canvas.width = innerWidth * DPR;
      canvas.height = innerHeight * DPR;
      canvas.style.width = innerWidth + 'px';
      canvas.style.height = innerHeight + 'px';
    }
    resize();
    window.addEventListener('resize', resize);

    // Animated dot grid that gently floats
    const cols = 18, rows = 10;
    const dots = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        dots.push({
          xRel: x / (cols - 1),
          yRel: y / (rows - 1),
          phase: Math.random() * Math.PI * 2,
        });
      }
    }
    let t0 = performance.now();
    function frame(now) {
      const t = (now - t0) / 1000;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width, h = canvas.height;
      for (const d of dots) {
        const x = d.xRel * w + Math.sin(t * 0.6 + d.phase) * 8 * DPR;
        const y = d.yRel * h + Math.cos(t * 0.5 + d.phase) * 8 * DPR;
        const a = 0.35 + Math.sin(t + d.phase) * 0.2;
        ctx.fillStyle = `rgba(45, 42, 36, ${a * 0.18})`;
        ctx.beginPath();
        ctx.arc(x, y, 1.6 * DPR, 0, Math.PI * 2);
        ctx.fill();
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  // ---------- helpers ----------
  function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
})();
