import express from "express";
import puppeteer from "puppeteer";
import { mkdir, writeFile } from "fs/promises";
import { createServer, type Server } from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Order matters: non-root routes first. The static server falls back to
// dist/public/index.html when the route-specific file does not yet exist.
// If `/` runs first, it overwrites that fallback with the prerendered Home
// HTML (which contains side-effect <script> tags injected at runtime, e.g.
// the Instagram behold widget). Subsequent routes would inherit those tags
// in their <head> via the SPA fallback, causing third-party errors and TBT
// regressions on Lighthouse runs.
const ROUTES = ["/servicos", "/portfolio", "/"] as const;
const PORT = 4173;
const HOST = "127.0.0.1";
const NAV_TIMEOUT_MS = 30_000;
const MAIN_WAIT_MS = 10_000;
const FALLBACK_DELAY_MS = 2_000;

function routeToFile(route: string, distDir: string): string {
  if (route === "/") return path.join(distDir, "index.html");
  // route is like "/servicos" → dist/public/servicos/index.html
  const slug = route.replace(/^\//, "");
  return path.join(distDir, slug, "index.html");
}

function startStaticServer(distDir: string): Promise<Server> {
  const app = express();
  app.use(express.static(distDir));
  // SPA fallback so deep links resolve to index.html during prerender
  app.use((_req, res) => {
    res.sendFile(path.resolve(distDir, "index.html"));
  });
  const server = createServer(app);
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(PORT, HOST, () => resolve(server));
  });
}

function closeServer(server: Server): Promise<void> {
  return new Promise((resolve, reject) => {
    server.close((err) => (err ? reject(err) : resolve()));
  });
}

export async function prerender(): Promise<void> {
  const distDir = path.resolve(__dirname, "..", "dist", "public");
  console.log(`[prerender] serving ${distDir} on http://${HOST}:${PORT}`);
  const server = await startStaticServer(distDir);

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    for (const route of ROUTES) {
      const url = `http://${HOST}:${PORT}${route}`;
      console.log(`[prerender] ${route} → ${url}`);
      const page = await browser.newPage();
      try {
        await page.goto(url, {
          waitUntil: "networkidle0",
          timeout: NAV_TIMEOUT_MS,
        });
        try {
          await page.waitForFunction(
            "document.querySelector('main') !== null",
            { timeout: MAIN_WAIT_MS },
          );
        } catch {
          console.warn(
            `[prerender] ${route}: <main> not found within ${MAIN_WAIT_MS}ms — falling back to ${FALLBACK_DELAY_MS}ms wait`,
          );
          await new Promise((r) => setTimeout(r, FALLBACK_DELAY_MS));
        }
        const html = await page.evaluate(
          () => "<!doctype html>\n" + document.documentElement.outerHTML,
        );
        const outFile = routeToFile(route, distDir);
        await mkdir(path.dirname(outFile), { recursive: true });
        await writeFile(outFile, html, "utf8");
        console.log(`[prerender]   wrote ${outFile} (${html.length} bytes)`);
      } finally {
        await page.close();
      }
    }
  } finally {
    await browser.close();
    await closeServer(server);
  }
}

// Allow direct invocation: `tsx scripts/prerender.ts`
const invokedDirectly =
  import.meta.url === `file://${process.argv[1].replace(/\\/g, "/")}` ||
  process.argv[1]?.endsWith("prerender.ts");

if (invokedDirectly) {
  prerender().catch((err) => {
    console.error("[prerender] FAILED:", err);
    process.exit(1);
  });
}
