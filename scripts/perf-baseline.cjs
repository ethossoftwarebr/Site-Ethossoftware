// Perf baseline reader — reads committed baseline JSONs and prints metrics + LCP element.
// Renamed from scripts/extract-baseline.cjs; output path moved from dist/ to lighthouse-baselines/.
// Env vars (all optional — defaults preserve Spec 6 backward-compat):
//   LH_BASELINE_DIR    — dir for baseline files (default: "lighthouse-baselines")
//   LH_BASELINE_PREFIX — prefix for baseline files (default: "baseline")
//   LH_ROUTES          — comma-separated route names (default: "home,servicos,portfolio,404")
const fs = require('fs');
const path = require('path');

const BASELINE_DIR = process.env.LH_BASELINE_DIR ?? 'lighthouse-baselines';
const BASELINE_PREFIX = process.env.LH_BASELINE_PREFIX ?? 'baseline';
const ROUTES = (process.env.LH_ROUTES ?? 'home,servicos,portfolio,404').split(',').map(r => r.trim()).filter(Boolean);
const out = {};

console.log(`[perf-baseline] baselineDir=${BASELINE_DIR} baselinePrefix=${BASELINE_PREFIX} routes=${ROUTES.join(',')}`);

for (const r of ROUTES) {
  const file = path.join(BASELINE_DIR, `${BASELINE_PREFIX}-${r}.json`);
  if (!fs.existsSync(file)) {
    console.error(`MISSING: ${file}`);
    process.exit(1);
  }
  const j = JSON.parse(fs.readFileSync(file, 'utf8'));
  const a = j.audits || {};
  const lcpEl = a['largest-contentful-paint-element']?.details?.items?.[0]?.node;
  const renderBlocking = a['render-blocking-resources']?.details?.items || [];
  const unusedCss = a['unused-css-rules']?.details?.items || [];
  const unusedJs = a['unused-javascript']?.details?.items || [];

  out[r] = {
    score: Math.round((j.categories?.performance?.score || 0) * 100),
    LCP_ms: Math.round(a['largest-contentful-paint']?.numericValue || 0),
    TBT_ms: Math.round(a['total-blocking-time']?.numericValue || 0),
    FCP_ms: Math.round(a['first-contentful-paint']?.numericValue || 0),
    SI_ms: Math.round(a['speed-index']?.numericValue || 0),
    CLS: (a['cumulative-layout-shift']?.numericValue ?? 0).toFixed(3),
    TTI_ms: Math.round(a['interactive']?.numericValue || 0),
    LCP_element: lcpEl ? {
      selector: lcpEl.selector,
      snippet: lcpEl.snippet?.slice(0, 200),
      nodeLabel: lcpEl.nodeLabel?.slice(0, 80),
    } : null,
    renderBlocking_count: renderBlocking.length,
    renderBlocking_top: renderBlocking.slice(0, 3).map(x => ({ url: x.url?.slice(-80), wastedMs: x.wastedMs })),
    unusedCss_kb: Math.round(unusedCss.reduce((s, x) => s + (x.wastedBytes || 0), 0) / 1024),
    unusedJs_kb: Math.round(unusedJs.reduce((s, x) => s + (x.wastedBytes || 0), 0) / 1024),
  };
}

console.log(JSON.stringify(out, null, 2));

// Identify worst offender across routes
const routeCount = Object.keys(out).length;
const avg = (k) => Object.values(out).reduce((s, x) => s + x[k], 0) / routeCount;
const offenders = {
  LCP: avg('LCP_ms'),
  TBT: avg('TBT_ms'),
  FCP: avg('FCP_ms'),
  SpeedIndex: avg('SI_ms'),
};
console.log(`\n=== AVG ACROSS ${routeCount} ROUTES ===`);
console.log(JSON.stringify(offenders, null, 2));

// Targets per spec: LCP<2500, TBT<300, FCP<1800
const gaps = {
  LCP_gap: Math.max(0, offenders.LCP - 2500),
  TBT_gap: Math.max(0, offenders.TBT - 300),
  FCP_gap: Math.max(0, offenders.FCP - 1800),
};
console.log('\n=== GAPS VS TARGETS ===');
console.log(JSON.stringify(gaps, null, 2));
const worst = Object.entries(gaps).sort((a, b) => b[1] - a[1])[0];
console.log(`\nWORST OFFENDER: ${worst[0]} (gap: ${Math.round(worst[1])}ms)`);
