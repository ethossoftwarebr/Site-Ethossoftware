// Throwaway QA helper — compares baseline (captured 2026-05-01T05:30Z, since destroyed by `rm -rf dist`) vs final.
const fs = require('fs');

const ROUTES = ['home', 'servicos', 'portfolio'];

const BASELINE = {
  home:      { score: 47, LCP: 11684, TBT: 429, FCP: 7801, SI: 7801 },
  servicos:  { score: 40, LCP: 12545, TBT: 628, FCP: 9416, SI: 9416 },
  portfolio: { score: 58, LCP:  8649, TBT:  68, FCP: 7157, SI: 7157 },
};

function metrics(path) {
  const j = JSON.parse(fs.readFileSync(path, 'utf8'));
  const a = j.audits;
  return {
    score: Math.round((j.categories.performance.score || 0) * 100),
    LCP: Math.round(a['largest-contentful-paint'].numericValue),
    TBT: Math.round(a['total-blocking-time'].numericValue),
    FCP: Math.round(a['first-contentful-paint'].numericValue),
    SI: Math.round(a['speed-index'].numericValue),
    CLS: a['cumulative-layout-shift'].numericValue,
    TTI: Math.round(a['interactive']?.numericValue || 0),
    LCP_element: a['largest-contentful-paint-element']?.details?.items?.[0]?.node?.nodeLabel?.slice(0, 60) || null,
  };
}

const rows = ROUTES.map(r => {
  const b = BASELINE[r];
  const f = metrics(`dist/lighthouse-final-${r}.json`);
  return { route: r, baseline: b, final: f, deltas: {
    score: f.score - b.score,
    LCP: f.LCP - b.LCP,
    TBT: f.TBT - b.TBT,
    FCP: f.FCP - b.FCP,
    SI: f.SI - b.SI,
  } };
});

console.log('=== ROUTE-BY-ROUTE ===\n');
for (const row of rows) {
  console.log(`[${row.route}]`);
  console.log(`  score:  ${row.baseline.score} → ${row.final.score}  (${row.deltas.score >= 0 ? '+' : ''}${row.deltas.score})`);
  console.log(`  LCP:    ${row.baseline.LCP} → ${row.final.LCP}ms  (${row.deltas.LCP >= 0 ? '+' : ''}${row.deltas.LCP})`);
  console.log(`  TBT:    ${row.baseline.TBT} → ${row.final.TBT}ms  (${row.deltas.TBT >= 0 ? '+' : ''}${row.deltas.TBT})`);
  console.log(`  FCP:    ${row.baseline.FCP} → ${row.final.FCP}ms  (${row.deltas.FCP >= 0 ? '+' : ''}${row.deltas.FCP})`);
  console.log(`  SI:     ${row.baseline.SI} → ${row.final.SI}ms  (${row.deltas.SI >= 0 ? '+' : ''}${row.deltas.SI})`);
  console.log(`  LCP element: ${row.final.LCP_element || '(null)'}`);
  console.log('');
}

const finalScores = rows.map(r => r.final.score);
const finalLCPs = rows.map(r => r.final.LCP);
const ac8 = finalScores.every(s => s >= 90);
const ac9 = finalLCPs.every(l => l < 2500);

console.log('=== ACCEPTANCE CRITERIA ===');
console.log(`AC-8 (all 3 scores >= 90): scores=[${finalScores.join(', ')}] → ${ac8 ? 'PASS' : 'FAIL'}`);
console.log(`AC-9 (all 3 LCPs < 2500ms): LCPs=[${finalLCPs.join(', ')}] → ${ac9 ? 'PASS' : 'FAIL'}`);

console.log('\n=== AVG DELTAS ===');
const avg = (k) => Math.round(rows.reduce((s, r) => s + r.deltas[k], 0) / rows.length);
console.log(`  score: ${avg('score') >= 0 ? '+' : ''}${avg('score')}`);
console.log(`  LCP:   ${avg('LCP') >= 0 ? '+' : ''}${avg('LCP')}ms`);
console.log(`  TBT:   ${avg('TBT') >= 0 ? '+' : ''}${avg('TBT')}ms`);
console.log(`  FCP:   ${avg('FCP') >= 0 ? '+' : ''}${avg('FCP')}ms`);
