import pokedex0 from "../../../assets/images/projects/pokedex/pokedex-0.webp";
import pokedex1 from "../../../assets/images/projects/pokedex/pokedex-1.webp";
import pokedex2 from "../../../assets/images/projects/pokedex/pokedex-2.webp";
import pokedex3 from "../../../assets/images/projects/pokedex/pokedex-3.webp";

import type { ProjectContent } from "../../types";

export default {
  title: "Daily Report",
  theme: "light",
  tags: ["agent", "kimi", "multi-agent", "pipeline"],
  videoBorder: false,
  live: "https://wangcansunking.github.io/daily-report/",
  source: "https://github.com/wangcansunking/daily-report",
  description:
    "AI 日报深度版 — 多 Agent 流水线生成的长文 + 微信多版本输出, 配套图片资源 CDN.<br/><br/>Researcher / Writer / Editor / Image-gen 四 agent 协作, Kimi 作为主 endpoint.",
  components: [
    { type: "media", props: { type: "image", src: pokedex0, alt: "Report sample", caption: "深度报告样例" } },
    { type: "media", props: { type: "image", src: pokedex1, alt: "Agent flow", caption: "多 agent 流水线" } },
    { type: "media", props: { type: "image", src: pokedex2, alt: "Wechat format", caption: "微信版本排版" } },
    { type: "media", props: { type: "image", src: pokedex3, alt: "CDN", caption: "图片 CDN 自动分发" } },
  ],
} as const satisfies ProjectContent;
