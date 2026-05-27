# wangcansunking.github.io

我的个人 product portfolio，部署在 [wangcansunking.github.io](https://wangcansunking.github.io)。

> **Attribution**: design language and architecture adapted from
> [davidhckh/portfolio-2025](https://github.com/davidhckh/portfolio-2025)
> ([david-hckh.com](https://david-hckh.com)) — per the author's request,
> attribution is preserved in source-code comments, README, and the
> footer of the live site. Original portfolio design © David Heckhoff.

## 技术栈

- **纯静态 HTML/CSS/JS** — 不用任何前端框架，0 构建步骤
- **设计** — Linear-inspired 深色 + lavender accent，参考 [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md)
- **托管** — GitHub Pages from `master` branch
- **同步** — GitHub Actions 每天自动从 `agent-learning-cn` 拉取最新教程到 `/agent-learning/`

## 仓库结构

```
.
├── index.html              主 portfolio 页（hero + 4 product 卡 + about）
├── products.json           product 元数据（编辑这里加新 product）
├── 404.html
├── assets/
│   ├── styles.css          Linear-style design tokens
│   └── main.js             scroll + reveal + product 渲染
├── agent-learning/         自动同步：来自 wangcansunking/agent-learning-cn
└── .github/workflows/
    └── sync-agent-learning.yml
```

## Products

| Product | 类型 | URL |
|---------|------|-----|
| Agent 开发学习 | 教程网站（自动同步） | `/agent-learning/` |
| AI Daily | Auto-content pipeline | github.com/wangcansunking/ai-daily |
| Daily Report | AI 日报生成系统 | github.com/wangcansunking/daily-report |
| Claude Code Plugins | Slash 命令 + Skills | github.com/wangcansunking/can-claude-plugins |

## 加新 product

直接编辑 `products.json` 并 commit，无需改任何代码。字段：

```json
{
  "id": "your-product",
  "title": "标题",
  "icon": "YP",                  // 2-3 字母缩写
  "status": "live|public|private|soon",
  "description": "一句话描述。",
  "tags": ["TS", "AI"],
  "href": "/path-or-url",        // 内部路径或外部 URL
  "external": true,              // 外部链接
  "cta": "查看详情",              // 卡片下方 CTA 文案
  "repo": "https://github.com/...",
  "repoLabel": "name"
}
```

## 同步 /agent-learning（GitHub Actions）

`agent-learning-cn` 是 private repo，workflow 用 PAT 拉取它的 `website-static/public/`。

**配置一次性 setup**：

1. 在 [github.com/settings/personal-access-tokens/new](https://github.com/settings/personal-access-tokens/new) 创建 fine-grained PAT
   - Repository access: `wangcansunking/agent-learning-cn`
   - Permissions: **Contents** → Read-only
2. 复制 token
3. 在本仓库 Settings → Secrets and variables → Actions → New repository secret
   - Name: `AGENT_LEARNING_PAT`
   - Value: 粘贴 token
4. 去 Actions 标签页手动运行一次 `Sync agent-learning content`

之后每天 00:30 UTC 自动同步。也可以手动 Run workflow。

## 本地预览

```bash
# 任何静态服务器都行
python -m http.server 4321
# 或
npx serve
```

访问 http://localhost:4321/

> 注意：本地预览 `/agent-learning/` 子路径需要先手动跑一次 GH Actions sync，或者 clone agent-learning-cn 并 cp 到 ./agent-learning/

## License

MIT
