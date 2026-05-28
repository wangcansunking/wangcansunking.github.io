import img0 from "../../../assets/images/projects/daily-report/daily-report-0.png";
import img1 from "../../../assets/images/projects/daily-report/daily-report-1.png";
import img2 from "../../../assets/images/projects/daily-report/daily-report-2.png";
import img3 from "../../../assets/images/projects/daily-report/daily-report-3.png";

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
    { type: "media", props: { type: "image", src: img0, alt: "Report sample", caption: "深度报告样例" } },
    { type: "media", props: { type: "image", src: img1, alt: "Agent flow", caption: "多 agent 流水线" } },
    { type: "media", props: { type: "image", src: img2, alt: "Wechat format", caption: "微信版本排版" } },
    { type: "media", props: { type: "image", src: img3, alt: "CDN", caption: "图片 CDN 自动分发" } },
  ],
} as const satisfies ProjectContent;
