// Compare current dist/lighthouse-final-{route}.json against committed lighthouse-baselines/baseline-{route}.json.
// Used by Lighthouse CI workflow + local `pnpm perf:check`.
const fs = require('fs');
const path = require('path');

const ROUTES = ['home', 'servicos', 'portfolio'];

function metrics(p) {
  const j = JSON.parse(fs.readFileSync(p, 'utf8'));
  const a = j.audits || {};
  return {
    score: Math.round((j.categories?.performance?.score || 0) * 100),
    LCP: Math.round(a['largest-contentful-paint']?.numericValue || 0),
    TBT: Math.round(a['total-blocking-time']?.numericValue || 0),
    FCP: Math.round(a['first-contentful-paint']?.numericValue || 0),
    SI: Math.round(a['speed-index']?.numericValue || 0),
    CLS: a['cumulative-layout-shift']?.numericValue ?? 0,
    TTI: Math.round(a['interactive']?.numericValue || 0),
    LCP_element: a['largest-contentful-paint-element']?.details?.items?.[0]?.node?.nodeLabel?.slice(0, 60) || null,
  };
}

const rows = ROUTES.map(r => {
  const baselinePath = path.join('lighthouse-baselines', `baseline-${r}.json`);
  const finalPath = path.join('dist', `lighthouse-final-${r}.json`);
  if (!fs.existsSync(baselinePath)) {
    console.error(`MISSING baseline: ${baselinePath}`);
    process.exit(1);
  }
  if (!fs.existsSync(finalPath)) {
    console.error(`MISSING final: ${finalPath}`);
    process.exit(1);
  }
  const b = metrics(baselinePath);
  const f = metrics(finalPath);
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
const avgScore = finalScores.reduce((s, x) => s + x, 0) / finalScores.length;

// Regression gate: bloqueia se score médio cai > 3 pontos vs baseline
const avgBaselineScore = rows.reduce((s, r) => s + r.baseline.score, 0) / rows.length;
const scoreRegression = avgBaselineScore - avgScore;

console.log('=== ACCEPTANCE CRITERIA ===');
console.log(`AC-7 (avg score >= 60): scores=[${finalScores.join(', ')}] avg=${avgScore.toFixed(1)} → ${avgScore >= 60 ? 'PASS' : 'FAIL'}`);
console.log(`AC-9 (no regression > 3 pts vs baseline): regression=${scoreRegression.toFixed(1)} → ${scoreRegression <= 3 ? 'PASS' : 'FAIL'}`);

console.log('\n=== AVG DELTAS ===');
const avg = (k) => Math.round(rows.reduce((s, r) => s + r.deltas[k], 0) / rows.length);
console.log(`  score: ${avg('score') >= 0 ? '+' : ''}${avg('score')}`);
console.log(`  LCP:   ${avg('LCP') >= 0 ? '+' : ''}${avg('LCP')}ms`);
console.log(`  TBT:   ${avg('TBT') >= 0 ? '+' : ''}${avg('TBT')}ms`);
console.log(`  FCP:   ${avg('FCP') >= 0 ? '+' : ''}${avg('FCP')}ms`);

// Exit non-zero if regression > 3 points (CI gate)
process.exit(scoreRegression > 3 ? 1 : 0);
