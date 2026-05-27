export type TagVariant =
  | "three"
  | "websockets"
  | "react"
  | "redis"
  | "gray"
  | "html"
  | "css"
  | "javascript"
  | "node"
  | "next"
  | "kubernetes"
  | "postgresql"
  | "ogl"
  | "glsl"
  | "typescript"
  | "claude-code"
  | "tutorial"
  | "deepseek"
  | "agent"
  | "content-pipeline"
  | "automation"
  | "kimi"
  | "multi-agent"
  | "pipeline"
  | "slash-commands"
  | "skills"
  | "mcp";

export const tagLabels = {
  three: "Three.js",
  websockets: "WebSockets",
  react: "React",
  redis: "Redis",
  gray: "Gray",
  html: "HTML",
  css: "CSS",
  javascript: "JavaScript",
  node: "Node.js",
  next: "Next.js",
  kubernetes: "Kubernetes",
  postgresql: "PostgreSQL",
  ogl: "OGL.js",
  glsl: "GLSL",
  typescript: "TypeScript",
  "claude-code": "Claude Code",
  tutorial: "Tutorial",
  deepseek: "DeepSeek",
  agent: "AI Agent",
  "content-pipeline": "Content Pipeline",
  automation: "Automation",
  kimi: "Kimi",
  "multi-agent": "Multi-Agent",
  pipeline: "Pipeline",
  "slash-commands": "Slash Commands",
  skills: "Skills",
  mcp: "MCP",
} as const satisfies Record<TagVariant, string>;
