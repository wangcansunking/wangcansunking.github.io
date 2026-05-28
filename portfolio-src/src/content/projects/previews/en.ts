import thumbnailAgentLearning from "../../../assets/thumbnails/agent-learning.png";
import thumbnailAiDaily from "../../../assets/thumbnails/ai-daily.png";
import thumbnailDailyReport from "../../../assets/thumbnails/daily-report.png";
import thumbnailClaudePlugins from "../../../assets/thumbnails/claude-plugins.png";

import type { ProjectPreview } from "../../types";

export default [
  {
    title: "Agent Learning",
    slug: "agent-learning",
    thumbnail: thumbnailAgentLearning,
    description: "7 门 71 节实战教程, 从 API 到生产级架构",
  },
  {
    title: "AI Daily",
    slug: "ai-daily",
    thumbnail: thumbnailAiDaily,
    description: "AI 与技术日报自动化流水线",
  },
  {
    title: "Daily Report",
    slug: "daily-report",
    thumbnail: thumbnailDailyReport,
    description: "多 Agent 深度报告生成器",
  },
  {
    title: "Claude Plugins",
    slug: "claude-plugins",
    thumbnail: thumbnailClaudePlugins,
    description: "Claude Code 的 Slash + Skills 工具包",
  },
] as const satisfies ProjectPreview[];
