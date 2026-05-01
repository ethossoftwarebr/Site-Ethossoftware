import type { Plugin } from "vite";
import fs from "fs";
import path from "path";

/**
 * Vite plugin that updates `og:image` and `twitter:image` meta tags so they
 * point to absolute URLs (required by Open Graph + Twitter cards).
 *
 * Base URL precedence:
 *   1. `process.env.SITE_URL` (override for staging / preview deploys)
 *   2. Hardcoded production URL `https://ethossoftware.com.br`
 *
 * Image format detection: looks for `client/public/opengraph.{png,jpg,jpeg}`
 * and uses whichever exists first.
 */
const PRODUCTION_BASE_URL = "https://ethossoftware.com.br";

export function metaImagesPlugin(): Plugin {
  return {
    name: "vite-plugin-meta-images",
    transformIndexHtml(html) {
      const baseUrl = process.env.SITE_URL || PRODUCTION_BASE_URL;

      const publicDir = path.resolve(process.cwd(), "client", "public");
      const candidates = [
        { file: "opengraph.png", ext: "png" },
        { file: "opengraph.jpg", ext: "jpg" },
        { file: "opengraph.jpeg", ext: "jpeg" },
      ];

      const found = candidates.find((c) =>
        fs.existsSync(path.join(publicDir, c.file)),
      );

      if (!found) {
        log("[meta-images] OpenGraph image not found in client/public/, skipping meta tag updates");
        return html;
      }

      const imageUrl = `${baseUrl}/opengraph.${found.ext}`;

      log("[meta-images] updating meta image tags to:", imageUrl);

      html = html.replace(
        /<meta\s+(?:property="og:image"\s+content="[^"]*"|content="[^"]*"\s+property="og:image")\s*\/>/g,
        `<meta property="og:image" content="${imageUrl}" />`,
      );

      html = html.replace(
        /<meta\s+(?:name="twitter:image"\s+content="[^"]*"|content="[^"]*"\s+name="twitter:image")\s*\/>/g,
        `<meta name="twitter:image" content="${imageUrl}" />`,
      );

      return html;
    },
  };
}

function log(...args: unknown[]): void {
  if (process.env.NODE_ENV === "production") {
    console.log(...args);
  }
}
