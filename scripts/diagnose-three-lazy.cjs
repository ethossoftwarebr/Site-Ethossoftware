// AC-3: Confirms that three-*.js chunk does NOT download before scroll/touch/3s timeout.
// Opens / on mobile viewport in puppeteer, monitors network, asserts:
//   - 0 three-*.js requests in first 2s post-load (no interaction)
//   - >= 1 three-*.js request after triggering scroll
const puppeteer = require('puppeteer');

(async () => {
  // AuroraBackground is mounted on /servicos, NOT /. Default to /servicos
  // so this script actually exercises the lazy-on-interaction logic.
  const url = process.env.URL || 'http://localhost:5000/servicos';
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      // Headless Chrome needs explicit WebGL enabling — without these, AuroraBackground
      // bails out via the !isWebGLSupported() branch and never registers scroll listeners.
      '--enable-webgl',
      '--use-gl=swiftshader',
      '--ignore-gpu-blocklist',
      '--enable-unsafe-swiftshader',
    ],
  });
  const page = await browser.newPage();
  await page.setViewport({
    width: 375,
    height: 667,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  // Force hardwareConcurrency >= 4 (mobile emulation may report 2, triggering isLowEnd
  // branch in AuroraBackground that skips three.js entirely).
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => 8 });
  });

  const threeRequests = [];
  const allAssetRequests = [];
  let t0 = Date.now();
  page.on('request', (req) => {
    const u = req.url();
    if (u.includes('/assets/')) {
      allAssetRequests.push({ url: u.split('/').pop(), atMs: Date.now() - t0 });
    }
    if (u.match(/\/assets\/three-.*\.js/)) {
      threeRequests.push({ url: u, atMs: Date.now() - t0 });
    }
  });

  // Capture console errors (e.g. WebGL init failure)
  const consoleMessages = [];
  page.on('console', (m) => consoleMessages.push({ type: m.type(), text: m.text().slice(0, 200) }));

  t0 = Date.now();
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
  const loadedAtMs = Date.now() - t0;

  // Wait 2s post-load WITHOUT any interaction. three.js MUST NOT be loaded yet.
  await new Promise((r) => setTimeout(r, 2000));
  const beforeInteraction = threeRequests.length;

  // Probe page state (is fallback active? scroll listener attached?)
  const pageState = await page.evaluate(() => {
    return {
      hardwareConcurrency: navigator.hardwareConcurrency,
      prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      docHeight: document.documentElement.scrollHeight,
      hasMountDiv: !!document.querySelector('[aria-hidden="true"]'),
    };
  });

  // Trigger a scroll event in multiple ways to ensure listener fires.
  await page.evaluate(() => {
    window.scrollBy(0, 100);
    window.dispatchEvent(new Event('scroll'));
  });
  // Wait 1.5s for chunk to fetch (729KB takes time on throttled net but no throttle here)
  await new Promise((r) => setTimeout(r, 1500));
  const afterScroll = threeRequests.length;

  // If still no three.js, wait for the 3s timeout fallback path
  if (afterScroll === 0) {
    await new Promise((r) => setTimeout(r, 2500)); // total ~6s post-load — covers 3s timeout
  }
  const afterTimeout = threeRequests.length;

  await browser.close();

  const result = {
    url,
    pageLoadedAtMs: loadedAtMs,
    beforeInteractionMs: 2000,
    threeRequests_beforeInteraction: beforeInteraction,
    threeRequests_afterScroll: afterScroll,
    threeRequests_afterTimeout: afterTimeout,
    threeRequests_log: threeRequests,
    pageState,
    allAssetRequests_count: allAssetRequests.length,
    consoleErrors: consoleMessages.filter((m) => m.type === 'error' || m.type === 'warning').slice(0, 10),
    // PASS criteria: NO three.js before interaction (the core lazy claim) AND
    // three.js loads after scroll OR after the 3s timeout fallback.
    pass: beforeInteraction === 0 && (afterScroll > 0 || afterTimeout > 0),
  };
  console.log(JSON.stringify(result, null, 2));
  process.exit(result.pass ? 0 : 1);
})().catch((e) => {
  console.error('FATAL:', e.message);
  process.exit(2);
});
