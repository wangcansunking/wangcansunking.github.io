/* ============================================================
   sync-products.mjs — 把多个 product source repo 渲染成 portfolio 子站
   每个 product 在 args 里传 source 路径 + 类型，输出到 <root>/<id>/
   ============================================================ */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// ---------- Per-product config ----------
// type = blog-by-date-dir: src/<YYYY-MM-DD>/<slug>/README.md  + images
// type = blog-flat: src/public/<YYYY>/<MM>/<DD>/<slug>.md  (frontmatter)
// type = readme-only: src/README.md → index.html
const PRODUCTS = {
  'ai-daily': {
    type: 'blog-by-date-dir',
    src: 'sources/ai-daily',
    title: 'AI Daily',
    tagline: '每日 AI 与技术内容，agent pipeline 自动生成',
    repoUrl: 'https://github.com/wangcansunking/ai-daily',
    eyebrow: '/ai-daily',
  },
  'daily-report': {
    type: 'blog-flat',
    src: 'sources/daily-report/public',
    title: 'Daily Report',
    tagline: 'AI 日报自动生成系统 · 每日深度内容',
    repoUrl: 'https://github.com/wangcansunking/daily-report',
    eyebrow: '/daily-report',
    // 跳过 -kimi / -wechat 多版本，只用主 .md
    excludeSuffix: ['-kimi', '-wechat', '.meta'],
  },
  'can-claude-plugins': {
    type: 'readme-only',
    src: 'sources/can-claude-plugins',
    title: 'Claude Code Plugins',
    tagline: '个人维护的 Claude Code 插件合集',
    repoUrl: 'https://github.com/wangcansunking/can-claude-plugins',
    eyebrow: '/can-claude-plugins',
    readmeFile: 'README.zh.md',  // 优先用中文
    fallbackReadme: 'README.md',
  },
};

// ---------- Marked config ----------
marked.use({
  gfm: true,
  breaks: false,
  renderer: {
    // Open external links in new tab (img links stay inline)
    link({ href, title, tokens }) {
      const text = this.parser.parseInline(tokens);
      const isExternal = /^https?:\/\//.test(href);
      const tt = title ? ` title="${escapeAttr(title)}"` : '';
      const target = isExternal ? ' target="_blank" rel="noopener"' : '';
      return `<a href="${escapeAttr(href)}"${tt}${target}>${text}</a>`;
    },
  },
});

// ---------- Helpers ----------
function escapeAttr(s = '') {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}
function escapeHtml(s = '') {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function parseFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]+?)\r?\n---\r?\n([\s\S]*)$/);
  if (!m) return { fm: {}, body: raw };
  const fm = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);
    if (!kv) continue;
    let v = kv[2].trim();
    if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
    fm[kv[1]] = v;
  }
  return { fm, body: m[2] };
}

function extractFirstHeading(body) {
  const m = body.match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : null;
}
function extractFirstParagraph(body, limit = 200) {
  // skip frontmatter + heading + image, find first prose paragraph
  const lines = body.split(/\r?\n/);
  for (const line of lines) {
    const t = line.trim();
    if (!t) continue;
    if (t.startsWith('#')) continue;
    if (t.startsWith('![')) continue;
    if (t.startsWith('>')) continue;
    if (t.startsWith('```')) continue;
    if (t.startsWith('-') || t.startsWith('*')) continue;
    if (t.length > 20) {
      const s = t.replace(/[*_`\[\]()]/g, '');
      return s.length > limit ? s.slice(0, limit) + '…' : s;
    }
  }
  return '';
}

// ---------- HTML layout ----------
const SITE = 'wangcansunking — products & playground';
const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap">`;

function shellHtml({ title, description = '', bodyClass = '', body, pathDepth }) {
  // pathDepth = how many levels deep relative to /<product>/
  // so styles.css is at '/assets/styles.css' (absolute, OK from any depth)
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)} — ${SITE}</title>
  ${description ? `<meta name="description" content="${escapeAttr(description)}">` : ''}
  <meta name="theme-color" content="#010102">
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><rect width='24' height='24' rx='6' fill='%235e6ad2'/><text x='12' y='17' text-anchor='middle' font-family='monospace' font-size='13' font-weight='700' fill='white'>w</text></svg>">
  ${FONTS}
  <link rel="stylesheet" href="/assets/styles.css">
  <link rel="stylesheet" href="/assets/product-styles.css">
</head>
<body class="${bodyClass}">
  <div class="aurora" aria-hidden="true"></div>
  <header class="topbar">
    <a class="brand" href="/">
      <span class="mark">w</span>
      <span>wangcansunking</span>
    </a>
    <nav>
      <a href="/#products">Products</a>
      <a href="/#about">About</a>
      <a class="cta" href="https://github.com/wangcansunking" target="_blank" rel="noopener">GitHub →</a>
    </nav>
  </header>
  ${body}
  <footer class="footer">
    <div class="container">
      <div class="row">
        <span class="made">crafted with Claude Code · hosted on GitHub Pages</span>
        <div class="links">
          <a href="https://github.com/wangcansunking" target="_blank" rel="noopener">GitHub</a>
          <a href="/">主页</a>
        </div>
      </div>
    </div>
  </footer>
  <script src="/assets/main.js" defer></script>
</body>
</html>`;
}

function listPageHtml({ config, items }) {
  // group by date (yyyy-mm-dd)
  const groups = new Map();
  for (const it of items) {
    if (!groups.has(it.date)) groups.set(it.date, []);
    groups.get(it.date).push(it);
  }
  const sortedDates = [...groups.keys()].sort().reverse();

  const groupsHtml = sortedDates.map((date) => {
    const its = groups.get(date);
    return `
    <section class="group">
      <header class="group-head">
        <span class="date">${escapeHtml(date)}</span>
        <span class="count">${its.length} posts</span>
      </header>
      <ul>
        ${its.map((i) => `
          <li>
            <a class="item" href="/${escapeAttr(i.href)}">
              <div class="item-title">${escapeHtml(i.title)}</div>
              ${i.desc ? `<div class="item-desc">${escapeHtml(i.desc)}</div>` : ''}
            </a>
          </li>
        `).join('')}
      </ul>
    </section>`;
  }).join('');

  const empty = items.length === 0
    ? `<div class="empty"><div class="icon">📭</div>暂无内容。<br><a href="${escapeAttr(config.repoUrl)}" target="_blank" rel="noopener">→ 查看 GitHub repo</a></div>`
    : '';

  const body = `
  <main class="container product-page">
    <nav class="crumb">
      <a href="/">主页</a>
      <span class="sep">/</span>
      <span class="current">${escapeHtml(config.title)}</span>
    </nav>
    <header class="product-hero">
      <span class="eyebrow">${escapeHtml(config.eyebrow)}</span>
      <h1>${escapeHtml(config.title)}</h1>
      <p class="lead">${escapeHtml(config.tagline)}</p>
      <div class="meta">
        <span>${items.length} 篇</span>
        <a href="${escapeAttr(config.repoUrl)}" target="_blank" rel="noopener">GitHub repo →</a>
      </div>
    </header>
    ${empty || `<div class="archive">${groupsHtml}</div>`}
  </main>`;

  return shellHtml({
    title: config.title,
    description: config.tagline,
    bodyClass: '',
    body,
    pathDepth: 1,
  });
}

function articlePageHtml({ config, productId, title, date, body, slug }) {
  const articleBody = `
  <main class="container product-page">
    <nav class="crumb">
      <a href="/">主页</a>
      <span class="sep">/</span>
      <a href="/${productId}/">${escapeHtml(config.title)}</a>
      <span class="sep">/</span>
      <span class="current">${escapeHtml(date || slug)}</span>
    </nav>
    <article class="article">
      ${date ? `<div class="post-meta"><span>${escapeHtml(date)}</span><span class="tag-pill">${escapeHtml(config.title)}</span></div>` : ''}
      ${body}
    </article>
  </main>`;
  return shellHtml({
    title,
    description: '',
    body: articleBody,
    pathDepth: 3,
  });
}

function readmePageHtml({ config, productId, htmlBody }) {
  const body = `
  <main class="container product-page">
    <nav class="crumb">
      <a href="/">主页</a>
      <span class="sep">/</span>
      <span class="current">${escapeHtml(config.title)}</span>
    </nav>
    <header class="product-hero">
      <span class="eyebrow">${escapeHtml(config.eyebrow)}</span>
      <h1>${escapeHtml(config.title)}</h1>
      <p class="lead">${escapeHtml(config.tagline)}</p>
      <div class="meta">
        <a href="${escapeAttr(config.repoUrl)}" target="_blank" rel="noopener">GitHub repo →</a>
      </div>
    </header>
    <article class="article">${htmlBody}</article>
  </main>`;
  return shellHtml({ title: config.title, description: config.tagline, body, pathDepth: 1 });
}

// ---------- Renderers per type ----------
async function renderBlogByDateDir(productId, config) {
  const outDir = path.join(ROOT, productId);
  await fs.rm(outDir, { recursive: true, force: true });
  await fs.mkdir(outDir, { recursive: true });

  const srcRoot = path.join(ROOT, config.src);
  let dateDirs;
  try {
    dateDirs = (await fs.readdir(srcRoot, { withFileTypes: true }))
      .filter((d) => d.isDirectory() && /^\d{4}-\d{2}-\d{2}$/.test(d.name))
      .map((d) => d.name);
  } catch {
    dateDirs = [];
  }

  const items = [];
  for (const date of dateDirs) {
    const dayDir = path.join(srcRoot, date);
    const topics = (await fs.readdir(dayDir, { withFileTypes: true })).filter((d) => d.isDirectory());
    for (const t of topics) {
      const mdPath = path.join(dayDir, t.name, 'README.md');
      let raw;
      try { raw = await fs.readFile(mdPath, 'utf-8'); } catch { continue; }
      const { body } = parseFrontmatter(raw);
      const title = extractFirstHeading(body) ?? t.name;
      const desc = extractFirstParagraph(body);

      const outPath = path.join(outDir, date, t.name, 'index.html');
      await fs.mkdir(path.dirname(outPath), { recursive: true });
      const html = marked.parse(body);
      await fs.writeFile(
        outPath,
        articlePageHtml({ config, productId, title, date, body: html, slug: t.name }),
        'utf-8'
      );

      items.push({ date, title, desc, href: `${productId}/${date}/${t.name}/` });
    }
  }
  await fs.writeFile(path.join(outDir, 'index.html'), listPageHtml({ config, items }), 'utf-8');
  console.log(`✓ ${productId}: ${items.length} posts`);
}

async function renderBlogFlat(productId, config) {
  const outDir = path.join(ROOT, productId);
  await fs.rm(outDir, { recursive: true, force: true });
  await fs.mkdir(outDir, { recursive: true });

  const srcRoot = path.join(ROOT, config.src);
  // Walk public/YYYY/MM/DD/*.md
  const items = [];
  async function walk(dir) {
    let entries = [];
    try { entries = await fs.readdir(dir, { withFileTypes: true }); } catch { return; }
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) { await walk(full); continue; }
      if (!e.name.endsWith('.md')) continue;
      // skip extra-version files
      const baseNoExt = e.name.replace(/\.md$/, '');
      if (config.excludeSuffix?.some((s) => baseNoExt.endsWith(s))) continue;
      // path under srcRoot
      const rel = path.relative(srcRoot, full);
      const m = rel.match(/^(\d{4})[/\\](\d{2})[/\\](\d{2})[/\\]([^/\\]+)\.md$/);
      if (!m) continue;
      const [, yyyy, mm, dd, slug] = m;
      const date = `${yyyy}-${mm}-${dd}`;

      const raw = await fs.readFile(full, 'utf-8');
      const { fm, body } = parseFrontmatter(raw);
      const title = fm.title ?? extractFirstHeading(body) ?? slug;
      const desc = fm.description ?? extractFirstParagraph(body);

      const outPath = path.join(outDir, date, slug, 'index.html');
      await fs.mkdir(path.dirname(outPath), { recursive: true });
      const html = marked.parse(body);
      await fs.writeFile(
        outPath,
        articlePageHtml({ config, productId, title, date, body: html, slug }),
        'utf-8'
      );

      items.push({ date, title, desc, href: `${productId}/${date}/${slug}/` });
    }
  }
  await walk(srcRoot);
  await fs.writeFile(path.join(outDir, 'index.html'), listPageHtml({ config, items }), 'utf-8');
  console.log(`✓ ${productId}: ${items.length} posts`);
}

async function renderReadmeOnly(productId, config) {
  const outDir = path.join(ROOT, productId);
  await fs.rm(outDir, { recursive: true, force: true });
  await fs.mkdir(outDir, { recursive: true });

  const srcRoot = path.join(ROOT, config.src);
  let raw = null;
  for (const name of [config.readmeFile, config.fallbackReadme].filter(Boolean)) {
    try { raw = await fs.readFile(path.join(srcRoot, name), 'utf-8'); break; } catch {}
  }
  if (!raw) {
    console.warn(`  ${productId}: no README found`);
    raw = '# (empty)\n\nNo README found.';
  }
  const { body } = parseFrontmatter(raw);
  // Strip top-level H1 (we render hero separately)
  const bodyWithoutTopH1 = body.replace(/^#\s+.+\n/, '');
  const html = marked.parse(bodyWithoutTopH1);
  await fs.writeFile(
    path.join(outDir, 'index.html'),
    readmePageHtml({ config, productId, htmlBody: html }),
    'utf-8'
  );
  console.log(`✓ ${productId}: README rendered`);
}

// ---------- Main ----------
const onlyFilter = process.argv[2];

for (const [id, cfg] of Object.entries(PRODUCTS)) {
  if (onlyFilter && id !== onlyFilter) continue;
  console.log(`-- ${id} (${cfg.type})`);
  if (cfg.type === 'blog-by-date-dir') await renderBlogByDateDir(id, cfg);
  else if (cfg.type === 'blog-flat')   await renderBlogFlat(id, cfg);
  else if (cfg.type === 'readme-only') await renderReadmeOnly(id, cfg);
  else console.warn(`  unknown type: ${cfg.type}`);
}
console.log('done.');
