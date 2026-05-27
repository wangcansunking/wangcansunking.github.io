import streakon0 from "../../../assets/images/projects/streakon/streakon-0.webp";
import streakon1 from "../../../assets/images/projects/streakon/streakon-1.webp";
import streakon2 from "../../../assets/images/projects/streakon/streakon-2.webp";
import streakon3 from "../../../assets/images/projects/streakon/streakon-3.webp";

import type { ProjectContent } from "../../types";

export default {
  title: "Agent Learning",
  theme: "light",
  tags: ["typescript", "claude-code", "tutorial", "deepseek"],
  videoBorder: false,
  live: "https://wangcansunking.github.io/agent-learning/",
  source: "https://github.com/wangcansunking/agent-learning-cn",
  description:
    "7 门课程 71 节实战 — 从 API 调用到生产级架构,从零到一剖析 Claude Code 内核.<br/><br/>默认 endpoint 为 DeepSeek (国内可直接跑), 配 Kimi/Anthropic 适配层. 内含 toolRunner / skill / shell adapter 等 reusable agent runtime.",
  components: [
    { type: "media", props: { type: "image", src: streakon0, alt: "Course list", caption: "7 个课程的内容地图" } },
    { type: "media", props: { type: "image", src: streakon1, alt: "Lesson detail", caption: "每节课结构: 学习目标 + 实战代码" } },
    { type: "media", props: { type: "image", src: streakon2, alt: "Code playground", caption: "可直接 copy-paste 的 TypeScript snippets" } },
    { type: "media", props: { type: "image", src: streakon3, alt: "Deploy", caption: "课程站点自动同步部署" } },
  ],
} as const satisfies ProjectContent;
