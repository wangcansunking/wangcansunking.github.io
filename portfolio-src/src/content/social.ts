export const social = [
  { url: "mailto:canwa@microsoft.com", name: "mail" },
  { url: "https://github.com/wangcansunking", name: "github" },
] as const satisfies { url: string; name: "mail" | "github" | "instagram" | "linkedin" | "x" }[];
