#!/usr/bin/env node
// readability-report.mjs — plain-language and machine-writing report for
// every registered scenario. Informational; the gating checks live in
// scenario-audit.mjs.
//
//   npm run readability            table + findings
//   npm run readability -- --json  machine-readable, for before/after diffs

import { scenarios } from '../src/scenarios/index.js';
import { analyse, GRADE_TARGET } from './lib/readability.mjs';

const results = scenarios.map(analyse);

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(results, null, 2));
  process.exit(0);
}

const pad = (s, n) => String(s).padEnd(n);
console.log(`${pad('scenario', 24)}${pad('door', 6)}${pad('grade', 7)}${pad('target', 8)}${pad('avg sent', 10)}${pad('>25w', 6)}${pad('patterns', 10)}jargon`);
for (const r of results) {
  const p = r.patterns.reduce((n, x) => n + x.count, 0) + r.staccato;
  const flag = r.grade > GRADE_TARGET[r.door] ? ' !' : '';
  console.log(`${pad(r.id, 24)}${pad(r.door, 6)}${pad(r.grade + flag, 7)}${pad('≤' + GRADE_TARGET[r.door], 8)}${pad(r.avgSentence, 10)}${pad(r.longSentences, 6)}${pad(p, 10)}${r.jargon.join(', ')}`);
}

for (const r of results) {
  if (!r.patterns.length && !r.longSentences && !r.jargon.length && !r.staccato) continue;
  console.log(`\n── ${r.id}`);
  for (const p of r.patterns) console.log(`  pattern  ${p.name} ×${p.count}: ${p.examples.map((e) => `"${e}"`).join(', ')}`);
  if (r.staccato) console.log(`  pattern  staccato fragments ×${r.staccato}`);
  for (const s of r.longest.slice(0, 2)) console.log(`  longest  (${s.split(/\s+/).length}w) ${s.slice(0, 160)}${s.length > 160 ? '…' : ''}`);
}
