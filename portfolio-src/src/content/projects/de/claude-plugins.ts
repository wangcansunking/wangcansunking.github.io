import sharkie0 from "../../../assets/images/projects/sharkie/sharkie-0.webp";
import sharkie1 from "../../../assets/images/projects/sharkie/sharkie-1.webp";
import sharkie2 from "../../../assets/images/projects/sharkie/sharkie-2.webp";
import sharkie3 from "../../../assets/images/projects/sharkie/sharkie-3.webp";
import sharkie4 from "../../../assets/images/projects/sharkie/sharkie-4.webp";

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
    { type: "media", props: { type: "image", src: sharkie0, alt: "Slash command list", caption: "Slash commands 列表" } },
    { type: "media", props: { type: "image", src: sharkie1, alt: "Skill execution", caption: "Skill 执行流程" } },
    { type: "media", props: { type: "image", src: sharkie2, alt: "Codeblend commit", caption: "codeblend-commit 示例" } },
    { type: "media", props: { type: "image", src: sharkie3, alt: "Plugin architecture", caption: "插件架构" } },
    { type: "media", props: { type: "image", src: sharkie4, alt: "Installation", caption: "一键安装" } },
  ],
} as const satisfies ProjectContent;
