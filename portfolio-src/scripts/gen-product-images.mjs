/* Generate product preview images for the portfolio via Azure OpenAI gpt-image-1.

   Usage:
     cd portfolio-src
     node scripts/gen-product-images.mjs --test                # 1 test image only
     node scripts/gen-product-images.mjs --product agent-learning
     node scripts/gen-product-images.mjs                       # all 4 products

   Reads AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_API_KEY, AZURE_OPENAI_IMAGE_MODEL,
   AZURE_OPENAI_API_VERSION from .env (loaded manually — no dotenv dep).
*/
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

async function loadEnv() {
  try {
    const raw = await readFile(resolve(ROOT, ".env"), "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
    }
  } catch {}
}

// ---------- Style: davidhckh-flavored — warm beige, 3D Apple-Memoji vibe ----------
const STYLE_SUFFIX =
  ", isometric 3D illustration, soft Apple-Memoji style, warm beige " +
  "background #f5efe6, soft cream lighting, friendly cartoon, " +
  "vibrant accent colors orange #ff8400 and cyan #0086bb, " +
  "subtle drop shadows, clean composition, no text, no logos, " +
  "smooth rounded geometry, minimalist, 4k product render";

// ---------- Per-product prompts (4 images each + 1 thumbnail) ----------
const PRODUCTS = {
  "agent-learning": {
    label: "Agent Learning — 7-course AI agent tutorial",
    thumbnail:
      "Floating stack of 3D book-shaped tutorial cards with code symbols, " +
      "a friendly robot avatar holding a tiny laptop, graduation-cap accent" +
      STYLE_SUFFIX,
    images: [
      "Isometric 3D scene of 7 stacked tutorial book cards labeled with " +
        "code icons, floating in beige space with subtle grid floor, soft " +
        "shadows" + STYLE_SUFFIX,
      "3D floating code editor window with TypeScript code, friendly robot " +
        "character looking at it, beige background with cyan accents" +
        STYLE_SUFFIX,
      "Cartoon 3D terminal with monospace code and animated cursor, " +
        "DeepSeek/Kimi/Claude logos as cute round mascots, beige background" +
        STYLE_SUFFIX,
      "Isometric 3D rocket launching from a beige platform with " +
        "lesson-card trail behind, orange flame, soft cream sky" +
        STYLE_SUFFIX,
    ],
  },
  "ai-daily": {
    label: "AI Daily — automated content pipeline",
    thumbnail:
      "3D rolled newspaper with AI sparkle, mini agent robots passing data " +
      "in a tube, warm beige" + STYLE_SUFFIX,
    images: [
      "Isometric 3D pipeline diagram: 4 small robot agents connected by " +
        "translucent tubes carrying glowing data orbs, beige background" +
        STYLE_SUFFIX,
      "3D phone showing a stylized article page with charts and image " +
        "previews, soft shadow on beige desk" + STYLE_SUFFIX,
      "3D AI paintbrush with sparkles generating colorful image " +
        "thumbnails floating above it, warm beige background" + STYLE_SUFFIX,
    ],
  },
  "daily-report": {
    label: "Daily Report — multi-agent deep report",
    thumbnail:
      "3D stacked report documents with sparkle, four mini robot heads in " +
      "a circle around them, beige background" + STYLE_SUFFIX,
    images: [
      "3D long-form report document floating with markdown-like chapter " +
        "blocks and chart icons, warm beige, soft cream lighting" +
        STYLE_SUFFIX,
      "Isometric 3D multi-agent flow diagram: 4 distinct robot characters " +
        "(researcher, writer, editor, image-gen) connected by curved arrows" +
        STYLE_SUFFIX,
      "3D smartphone showing a WeChat-style article preview with green " +
        "accents, beige desk background" + STYLE_SUFFIX,
      "3D cloud icon with image thumbnails being distributed via radiating " +
        "lines to a globe, beige background, soft glow" + STYLE_SUFFIX,
    ],
  },
  "claude-plugins": {
    label: "Can Claude Plugins — slash commands + skills toolkit",
    thumbnail:
      "3D terminal window with bright blinking slash command, gear cog and " +
      "lightning bolt accent, beige background" + STYLE_SUFFIX,
    images: [
      "Isometric 3D terminal showing a list of slash commands as floating " +
        "cards (/commit /test /push), bright orange forward-slash glyphs" +
        STYLE_SUFFIX,
      "3D robot agent character pressing a button labeled with a gear, " +
        "lightning sparks, beige background" + STYLE_SUFFIX,
      "3D git branch tree visualization with commits as colored cubes, a " +
        "tiny robot drawing the next commit, warm beige" + STYLE_SUFFIX,
      "3D modular plugin blocks connecting like Lego, each block has a " +
        "tiny icon (terminal, gear, skill), beige background" + STYLE_SUFFIX,
      "3D cloud download icon with a green checkmark, mini boxes labeled " +
        "with plugin names floating around, beige background" + STYLE_SUFFIX,
    ],
  },
};

// ---------- API call ----------
async function genImage(prompt, size = "1024x1024") {
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
  const apiKey = process.env.AZURE_OPENAI_API_KEY;
  const model = process.env.AZURE_OPENAI_IMAGE_MODEL || "gpt-image-1";
  const apiVer = process.env.AZURE_OPENAI_API_VERSION || "2025-04-01-preview";
  if (!endpoint || !apiKey) throw new Error("missing AZURE_OPENAI_* env");

  // v1 endpoint (/openai/v1/...) doesn't take ?api-version. Pre-v1
  // (/openai/deployments/...) does.
  const isV1 = /\/openai\/v1\//.test(endpoint);
  const url = isV1
    ? endpoint
    : endpoint.includes("?") ? endpoint : `${endpoint}?api-version=${apiVer}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "api-key": apiKey },
    body: JSON.stringify({
      model,
      prompt,
      size,
      n: 1,
      output_format: "png",
      quality: "high",
    }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Azure API ${res.status}: ${t}`);
  }
  const json = await res.json();
  const item = json.data?.[0];
  if (!item) throw new Error("no image in response: " + JSON.stringify(json));
  if (item.b64_json) return Buffer.from(item.b64_json, "base64");
  if (item.url) {
    const r = await fetch(item.url);
    return Buffer.from(await r.arrayBuffer());
  }
  throw new Error("no b64_json or url in response item");
}

async function saveImage(buf, outPath) {
  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, buf);
  console.log("  wrote", outPath.replace(ROOT + "/", "").replace(ROOT + "\\", ""));
}

async function genProduct(slug, opts = {}) {
  const def = PRODUCTS[slug];
  if (!def) throw new Error("unknown product: " + slug);
  console.log(`\n=== ${slug} — ${def.label} ===`);

  // Thumbnail
  if (!opts.skipThumbnail) {
    const thumbPath = resolve(ROOT, `src/assets/thumbnails/${slug}.png`);
    if (!opts.skipExisting || !existsSync(thumbPath)) {
      console.log(" - thumbnail");
      const buf = await genImage(def.thumbnail, "1024x1024");
      await saveImage(buf, thumbPath);
    }
  }

  // Images
  for (let i = 0; i < def.images.length; i++) {
    const outPath = resolve(ROOT, `src/assets/images/projects/${slug}/${slug}-${i}.png`);
    if (opts.skipExisting && existsSync(outPath)) {
      console.log(`   - image ${i} (skipped, exists)`);
      continue;
    }
    console.log(`   - image ${i}/${def.images.length - 1}`);
    const buf = await genImage(def.images[i], "1536x1024");
    await saveImage(buf, outPath);
  }
}

// ---------- CLI ----------
async function main() {
  await loadEnv();

  const args = process.argv.slice(2);
  const flag = (k) => args.includes(k);
  const opt = (k) => {
    const i = args.indexOf(k);
    return i >= 0 ? args[i + 1] : undefined;
  };

  if (flag("--test")) {
    console.log("Test: generating ONE image (agent-learning thumbnail)");
    const buf = await genImage(PRODUCTS["agent-learning"].thumbnail, "1024x1024");
    await saveImage(buf, resolve(ROOT, "src/assets/thumbnails/agent-learning.png"));
    console.log("\nDone. Review src/assets/thumbnails/agent-learning.png");
    return;
  }

  const skipExisting = flag("--skip-existing");
  const productArg = opt("--product");
  const products = productArg ? [productArg] : Object.keys(PRODUCTS);
  for (const slug of products) await genProduct(slug, { skipExisting });

  console.log("\nDone. Next:");
  console.log("  - Convert PNG → WebP for smaller bundle:");
  console.log("    node scripts/convert-webp.mjs (TODO)");
  console.log("  - Update content/projects/en/*.ts to point at new files");
  console.log("  - npm run build + deploy");
}

main().catch((e) => {
  console.error("ERROR:", e.message || e);
  process.exit(1);
});
