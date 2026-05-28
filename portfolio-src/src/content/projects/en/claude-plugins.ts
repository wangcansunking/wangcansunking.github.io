import img0 from "../../../assets/images/projects/claude-plugins/claude-plugins-0.png";
import img1 from "../../../assets/images/projects/claude-plugins/claude-plugins-1.png";
import img2 from "../../../assets/images/projects/claude-plugins/claude-plugins-2.png";
import img3 from "../../../assets/images/projects/claude-plugins/claude-plugins-3.png";
import img4 from "../../../assets/images/projects/claude-plugins/claude-plugins-4.png";

import type { ProjectContent } from "../../types";

export default {
  title: "Can Claude Plugins",
  theme: "dark",
  tags: ["claude-code", "slash-commands", "skills", "mcp"],
  videoBorder: false,
  source: "https://github.com/wangcansunking/can-claude-plugins",
  description:
    "Claude Code 的 Slash commands + Skills 工具包 — codeblend-commit, ux-test, fastpush 等 daily workflow 利器.<br/><br/>每个 plugin 都是一个可复用的 micro-agent, 解决一个具体 dev pain point.",
  components: [
    { type: "media", props: { type: "image", src: img0, alt: "Slash command list", caption: "Slash commands 列表" } },
    { type: "media", props: { type: "image", src: img1, alt: "Skill execution", caption: "Skill 执行流程" } },
    { type: "media", props: { type: "image", src: img2, alt: "Codeblend commit", caption: "codeblend-commit 示例" } },
    { type: "media", props: { type: "image", src: img3, alt: "Plugin architecture", caption: "插件架构" } },
    { type: "media", props: { type: "image", src: img4, alt: "Installation", caption: "一键安装" } },
  ],
} as const satisfies ProjectContent;
