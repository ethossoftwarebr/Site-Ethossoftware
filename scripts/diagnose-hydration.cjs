// Throwaway QA diag — opens /servicos in puppeteer, captures all console + page errors, dumps.
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox'],
  });
  const page = await browser.newPage();

  // Mobile-ish viewport to mirror Lighthouse mobile (Moto G4 default)
  await page.setViewport({ width: 412, height: 823, deviceScaleFactor: 1.75, isMobile: true });

  const messages = [];
  page.on('console', (msg) => {
    messages.push({
      type: msg.type(),
      text: msg.text(),
    });
  });
  page.on('pageerror', (err) => {
    messages.push({ type: 'pageerror', text: err.message + '\n' + err.stack });
  });
  page.on('requestfailed', (req) => {
    messages.push({ type: 'reqfailed', text: req.url() + ' ' + req.failure()?.errorText });
  });

  const ROUTES = ['/', '/servicos', '/portfolio'];
  const result = {};

  for (const route of ROUTES) {
    messages.length = 0;
    await page.goto(`http://localhost:5000${route}`, { waitUntil: 'networkidle2', timeout: 30000 });
    // Wait an extra 2s for any post-load console output
    await new Promise(r => setTimeout(r, 2000));
    result[route] = [...messages];
  }

  await browser.close();

  // Filter for hydration-related signals
  for (const route of ROUTES) {
    console.log(`\n=== ${route} ===`);
    const msgs = result[route];
    const hydrationRelated = msgs.filter((m) =>
      /hydrat|mismatch|did not match|expected server HTML|ReactDOMClient|render-blocking|Warning|Error/i.test(m.text)
    );
    if (hydrationRelated.length === 0) {
      console.log('  (no hydration-related console messages)');
    } else {
      hydrationRelated.forEach((m) => {
        console.log(`  [${m.type}] ${m.text.slice(0, 500)}`);
      });
    }
    // Also count error/warn types
    const errorCount = msgs.filter((m) => m.type === 'error' || m.type === 'pageerror').length;
    const warnCount = msgs.filter((m) => m.type === 'warning' || m.type === 'warn').length;
    console.log(`  Total: ${msgs.length} messages | errors: ${errorCount} | warnings: ${warnCount}`);
  }
})();
