import thumbnailStreakon from "../../../assets/thumbnails/streakon.webp";
import thumbnailParticles from "../../../assets/thumbnails/particles.webp";
import thumbnailPokedex from "../../../assets/thumbnails/pokedex.webp";
import thumbnailSharkie from "../../../assets/thumbnails/sharkie.webp";

import type { ProjectPreview } from "../../types";

export default [
  {
    title: "Agent Learning",
    slug: "agent-learning",
    thumbnail: thumbnailStreakon,
    description: "7 门 71 节实战教程, 从 API 到生产级架构",
  },
  {
    title: "AI Daily",
    slug: "ai-daily",
    thumbnail: thumbnailParticles,
    description: "AI 与技术日报自动化流水线",
  },
  {
    title: "Daily Report",
    slug: "daily-report",
    thumbnail: thumbnailPokedex,
    description: "多 Agent 深度报告生成器",
  },
  {
    title: "Claude Plugins",
    slug: "claude-plugins",
    thumbnail: thumbnailSharkie,
    description: "Claude Code 的 Slash + Skills 工具包",
  },
] as const satisfies ProjectPreview[];
