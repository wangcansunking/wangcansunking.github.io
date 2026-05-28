import img0 from "../../../assets/images/projects/ai-daily/ai-daily-0.png";
import img1 from "../../../assets/images/projects/ai-daily/ai-daily-1.png";
import img2 from "../../../assets/images/projects/ai-daily/ai-daily-2.png";

import type { ProjectContent } from "../../types";

export default {
  title: "AI Daily",
  theme: "dark",
  tags: ["agent", "content-pipeline", "automation"],
  videoBorder: false,
  live: "https://wangcansunking.github.io/ai-daily/",
  source: "https://github.com/wangcansunking/ai-daily",
  description:
    "AI 与技术日报流水线 — 每日 1000+ 中文字 + 配图自动生成.<br/><br/>多 agent 流水线: 信息抓取 / 主题排序 / 写作 / 配图 / 发布. 没有人在循环里, 完全 cron 驱动.",
  components: [
    { type: "media", props: { type: "image", src: img0, alt: "Pipeline overview", caption: "Pipeline 总览" } },
    { type: "media", props: { type: "image", src: img1, alt: "Daily article", caption: "每日生成的文章页" } },
    { type: "media", props: { type: "image", src: img2, alt: "Image generation", caption: "AI 配图样例" } },
  ],
} as const satisfies ProjectContent;
