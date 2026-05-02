// Throwaway diagnostic — reads baseline JSONs and prints metrics + LCP element.
const fs = require('fs');
const path = require('path');

const ROUTES = ['home', 'servicos', 'portfolio'];
const out = {};

for (const r of ROUTES) {
  const file = path.join('dist', `lighthouse-baseline-${r}.json`);
  if (!fs.existsSync(file)) {
    console.error(`MISSING: ${file}`);
    process.exit(1);
  }
  const j = JSON.parse(fs.readFileSync(file, 'utf8'));
  const a = j.audits;
  const lcpEl = a['largest-contentful-paint-element']?.details?.items?.[0]?.node;
  const renderBlocking = a['render-blocking-resources']?.details?.items || [];
  const unusedCss = a['unused-css-rules']?.details?.items || [];
  const unusedJs = a['unused-javascript']?.details?.items || [];

  out[r] = {
    score: Math.round((j.categories.performance.score || 0) * 100),
    LCP_ms: Math.round(a['largest-contentful-paint'].numericValue),
    TBT_ms: Math.round(a['total-blocking-time'].numericValue),
    FCP_ms: Math.round(a['first-contentful-paint'].numericValue),
    SI_ms: Math.round(a['speed-index'].numericValue),
    CLS: a['cumulative-layout-shift'].numericValue.toFixed(3),
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
const avg = (k) => Object.values(out).reduce((s, x) => s + x[k], 0) / 3;
const offenders = {
  LCP: avg('LCP_ms'),
  TBT: avg('TBT_ms'),
  FCP: avg('FCP_ms'),
  SpeedIndex: avg('SI_ms'),
};
console.log('\n=== AVG ACROSS 3 ROUTES ===');
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
