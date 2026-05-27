# wangcansunking.github.io

我的个人 product portfolio，部署在 [wangcansunking.github.io](https://wangcansunking.github.io)。

> **Attribution**: this portfolio is **forked from**
> [davidhckh/portfolio-2025](https://github.com/davidhckh/portfolio-2025)
> ([david-hckh.com](https://david-hckh.com)) under their license
> (personal/educational use with attribution preserved — non-commercial).
> Original portfolio © David Heckhoff. We use his avatar.glb, room.glb,
> matcap textures, scene shaders, Vue components, and overall scroll
> narrative architecture. Customizations: names, projects, copy, social
> links. See `portfolio-src/license.md` for the original license terms.

## 技术栈

- **Vue 3 + Vite + TypeScript** — Vue source lives in `portfolio-src/`
- **Three.js + GSAP + Lenis** — 3D character, scroll-driven animations, smooth scroll
- **托管** — GitHub Pages from `master` branch root
- **同步** — GitHub Actions 每天自动从子产品 repo 拉取最新内容到 `/agent-learning/`、`/ai-daily/` 等子路径

## 仓库结构

```
.
├── index.html, assets/, chunks/, fonts/, meta/, de/, legal.html, privacy.html, robots.txt
│   ↑ Vite build output, GH Pages serves this
├── portfolio-src/          ← Vue source (build script lives here)
│   ├── src/                Vue components, three scene, content/projects, i18n
│   ├── public/             static assets copied verbatim
│   └── package.json
├── agent-learning/         自动同步：来自 wangcansunking/agent-learning-cn
├── ai-daily/               自动同步：来自 wangcansunking/ai-daily
├── daily-report/           自动同步：来自 wangcansunking/daily-report
├── can-claude-plugins/     自动同步：来自 wangcansunking/can-claude-plugins
└── .github/workflows/      sync workflows
```

## 修改 + 重新部署

```bash
cd portfolio-src
# 改 src/content/projects/{en,de}/* 加项目
# 改 src/i18n/messages/namespaces/common/*.json 改文案
# 改 src/features/home/components/Hero.vue 改 hero 文字

npm install                    # 一次性
npm run build                  # 输出到 portfolio-src/dist/

# 部署：把 dist/* 拷贝到 repo 根，保留子目录
rm -rf ../assets ../chunks ../fonts ../meta ../de
rm -f ../legal.html ../privacy.html ../robots.txt ../index.html
cp -r dist/* ..

cd ..
git add -A
git commit -m "deploy"
git push
```

## Products

| Product | 类型 | URL |
|---------|------|-----|
| Agent Learning | 教程网站（自动同步） | `/agent-learning/` |
| AI Daily | Auto-content pipeline | `/ai-daily/` |
| Daily Report | AI 日报生成系统 | `/daily-report/` |
| Claude Plugins | Slash 命令 + Skills | `/can-claude-plugins/` |

## License

源码 fork 自 [davidhckh/portfolio-2025](https://github.com/davidhckh/portfolio-2025) — 受其原 license 条款约束（个人/教育用途、保留 attribution、非商业）。我们的修改在同等条款下提供。
