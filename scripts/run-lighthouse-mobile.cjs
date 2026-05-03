// Lighthouse v13 programmatic — runs mobile preset on configured routes, writes median run to {LH_OUT_DIR}/{LH_OUT_PREFIX}-{route}.json.
// Lighthouse v13 is ESM-only — must be dynamically imported from CJS.
// Env vars (all optional — defaults preserve Spec 6 backward-compat):
//   LH_PORT       — server port (default: 5000)
//   LH_ROUTES     — comma-separated route names (default: "home,servicos,portfolio")
//   LH_OUT_DIR    — output directory (default: "dist")
//   LH_OUT_PREFIX — output file prefix (default: "lighthouse-final")
const fs = require('fs');
const path = require('path');

async function main() {
  const lighthouseModule = await import('lighthouse');
  const lighthouse = lighthouseModule.default;
  const chromeLauncher = await import('chrome-launcher');

  const PORT = process.env.LH_PORT ?? '5000';
  const ROUTE_NAMES = (process.env.LH_ROUTES ?? 'home,servicos,portfolio').split(',').map(r => r.trim()).filter(Boolean);
  const OUT_DIR = process.env.LH_OUT_DIR ?? 'dist';
  const OUT_PREFIX = process.env.LH_OUT_PREFIX ?? 'lighthouse-final';

  // Build route map: route name → URL path (home → /, 404 → /404.html, others → /{name})
  const buildUrl = (name) => {
    if (name === 'home') return `http://localhost:${PORT}/`;
    if (name === '404') return `http://localhost:${PORT}/404.html`;
    return `http://localhost:${PORT}/${name}`;
  };
  const ROUTES = Object.fromEntries(ROUTE_NAMES.map(name => [name, buildUrl(name)]));

  const NUM_RUNS = 3;

  console.log(`[run-lighthouse-mobile] port=${PORT} routes=${ROUTE_NAMES.join(',')} outDir=${OUT_DIR} outPrefix=${OUT_PREFIX}`);

  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  for (const [name, url] of Object.entries(ROUTES)) {
    console.log(`\n=== Running Lighthouse mobile for ${name} (${url}) — ${NUM_RUNS} runs ===`);
    const runs = [];
    for (let i = 0; i < NUM_RUNS; i++) {
      const chrome = await chromeLauncher.launch({
        chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
      });
      try {
        const result = await lighthouse(
          url,
          {
            port: chrome.port,
            output: 'json',
            logLevel: 'error',
            onlyCategories: ['performance'],
            formFactor: 'mobile',
            screenEmulation: {
              mobile: true,
              width: 375,
              height: 667,
              deviceScaleFactor: 2,
              disabled: false,
            },
            throttling: {
              rttMs: 150,
              throughputKbps: 1638.4,
              requestLatencyMs: 562.5,
              downloadThroughputKbps: 1474.56,
              uploadThroughputKbps: 675,
              cpuSlowdownMultiplier: 4,
            },
          }
        );
        if (result && result.lhr) {
          runs.push(result.lhr);
          const s = Math.round((result.lhr.categories.performance.score || 0) * 100);
          const lcp = Math.round(result.lhr.audits['largest-contentful-paint']?.numericValue || 0);
          console.log(`  run ${i + 1}/${NUM_RUNS}: score=${s}, LCP=${lcp}ms`);
        } else {
          console.log(`  run ${i + 1}/${NUM_RUNS}: empty result`);
        }
      } finally {
        // chrome-launcher's destroyTmp() races with Chrome on Windows and throws EPERM
        // when temp dir lock files are still held. Swallow — process exits cleanly anyway
        // and TEMP gets gc'd by Windows.
        try { await chrome.kill(); } catch (e) { /* ignore EPERM/lock errors on Windows */ }
      }
    }
    if (runs.length === 0) {
      console.error(`  [${name}] No successful runs — skipping`);
      continue;
    }
    runs.sort((a, b) => a.categories.performance.score - b.categories.performance.score);
    const median = runs[Math.floor(runs.length / 2)];
    fs.writeFileSync(path.join(OUT_DIR, `${OUT_PREFIX}-${name}.json`), JSON.stringify(median, null, 2));
    const score = Math.round((median.categories.performance.score || 0) * 100);
    const lcp = Math.round(median.audits['largest-contentful-paint']?.numericValue || 0);
    const tbt = Math.round(median.audits['total-blocking-time']?.numericValue || 0);
    const fcp = Math.round(median.audits['first-contentful-paint']?.numericValue || 0);
    console.log(`[${name}] MEDIAN — score=${score}, LCP=${lcp}ms, TBT=${tbt}ms, FCP=${fcp}ms`);
  }
}

main().catch((e) => {
  console.error('FATAL:', e);
  process.exit(1);
});
