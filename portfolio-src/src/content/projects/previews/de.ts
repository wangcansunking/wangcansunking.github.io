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
    description: "7 门 71 节实战教程",
  },
  {
    title: "AI Daily",
    slug: "ai-daily",
    thumbnail: thumbnailAiDaily,
    description: "AI 日报流水线",
  },
  {
    title: "Daily Report",
    slug: "daily-report",
    thumbnail: thumbnailDailyReport,
    description: "多 Agent 报告生成器",
  },
  {
    title: "Claude Plugins",
    slug: "claude-plugins",
    thumbnail: thumbnailClaudePlugins,
    description: "Claude Code 工具包",
  },
] as const satisfies ProjectPreview[];
