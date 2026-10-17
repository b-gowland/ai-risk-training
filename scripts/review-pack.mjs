#!/usr/bin/env node
// review-pack.mjs — assemble what an outside reviewer needs.
//
//   npm run review-pack                 text and reports
//   npm run review-pack -- --shots      plus screenshots (needs Playwright
//                                       and a built site: npm run build first)
//
// Writes review-pack/ (git-ignored): the prompt and criteria
// (docs/REVIEW_PROMPT.md), the full text of every scenario, every branch
// join, and the automated reports, stamped with the commit they came from.
// Zip the folder and send it with the prompt. See docs/REVIEW_PROMPT.md.

import { execSync } from 'node:child_process';
import { mkdirSync, writeFileSync, copyFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { scenarios } from '../src/scenarios/index.js';
import { estimateMinutes, headlineMinutes } from '../src/engine/timing.js';

const ROOT = process.cwd();
const OUT = join(ROOT, 'review-pack');
rmSync(OUT, { recursive: true, force: true });
for (const d of ['content', 'reports', 'screenshots']) mkdirSync(join(OUT, d), { recursive: true });

const run = (cmd) => {
  try { return execSync(cmd, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }); }
  catch (e) { return `${e.stdout || ''}${e.stderr || ''}\n(exit ${e.status})`; }
};
const sha = run('git rev-parse HEAD').trim();
const date = new Date().toISOString().slice(0, 10);

copyFileSync(join(ROOT, 'docs', 'REVIEW_PROMPT.md'), join(OUT, 'REVIEW_PROMPT.md'));

// ── Scenario text, as a reader would meet it, with the quality ratings ──
const para = (p) => (typeof p === 'string' ? p
  : `[only if ${p.when ? `chosen: ${[p.when].flat().join(' or ')}` : `not chosen: ${[p.unless].flat().join(' or ')}`}] ${p.text}`);
const artefact = (a) => (a ? `\n> Artefact (${a.type}):\n> ${JSON.stringify(a, null, 1).split('\n').join('\n> ')}\n` : '');
for (const s of scenarios) {
  const lines = [`# ${s.title} (${s.id})`, '', `Door: ${s.door}. Shown time: about ${headlineMinutes(s)} minutes.`, '',
    '## Setup', ...s.coldOpen, '', `You are: ${s.standing || '-'}`, `You can: ${s.authority}`, `How it ends: ${s.ending}`, ''];
  for (const [id, n] of Object.entries(s.nodes)) {
    lines.push(`## Node ${id}`, ...n.prose.map(para), artefact(n.artefact), `**${n.decision.prompt}**`, '');
    n.decision.choices.forEach((c, i) => lines.push(
      `${i + 1}. [${c.quality}] ${c.label}  → ${n.branches?.[c.id] || n.next}`, `   ${c.consequence}`));
    lines.push('');
  }
  for (const [id, o] of Object.entries(s.outcomes)) {
    lines.push(`## Ending ${id} [${o.tone}]: ${o.heading}`, o.reaction, '', ...o.description.map(para), '', o.judgement, '');
  }
  lines.push('## Close', ...(s.debrief?.frame || []), '');
  if (s.recall) {
    lines.push(`**Recall: ${s.recall.prompt}**`);
    s.recall.options.forEach((o, i) => lines.push(`${i + 1}. [${o.quality}] ${o.label}`, `   ${o.note}`));
    lines.push('');
  }
  lines.push(`Tell: ${s.tell}`, '', `Reference entry: ${s.kb_url || '-'}`);
  for (const src of s.sources || []) lines.push(`Source: ${src.who}, "${src.title}", ${src.date}, ${src.url}: "${src.quote}"`);
  writeFileSync(join(OUT, 'content', `${s.id}.md`), lines.join('\n') + '\n');
}

// ── Reports ─────────────────────────────────────────────────────────────
writeFileSync(join(OUT, 'reports', 'joins.txt'), run('node scripts/branch-joins.mjs'));
writeFileSync(join(OUT, 'reports', 'audit.txt'), run('node scripts/scenario-audit.mjs'));
writeFileSync(join(OUT, 'reports', 'readability.txt'), run('node scripts/readability-report.mjs'));
writeFileSync(join(OUT, 'reports', 'content-quality.txt'),
  run('npx vitest run src/__tests__/content-quality.test.js src/__tests__/privacy-claims.test.jsx src/__tests__/a11y-text.test.jsx --reporter=verbose'));
writeFileSync(join(OUT, 'reports', 'timing.txt'), [
  'Minutes per route: words / 238 per minute + 30 s per decision (src/engine/timing.js).',
  '', 'scenario                  routes  fastest  median  slowest  shown',
  ...scenarios.map((s) => {
    const e = estimateMinutes(s);
    return `${s.id.padEnd(26)}${String(e.routes).padStart(6)}  ${e.min.toFixed(1).padStart(7)}  ${e.median.toFixed(1).padStart(6)}  ${e.max.toFixed(1).padStart(7)}  ${headlineMinutes(s)} min`;
  }),
].join('\n') + '\n');

// ── Screenshots (optional) ──────────────────────────────────────────────
let shots = 'not taken (run with --shots after npm run build)';
if (process.argv.includes('--shots')) {
  const { preview } = await import('vite');
  const mod = process.env.PLAYWRIGHT_MODULE;
  const { chromium } = await import(mod ? (await import('node:url')).pathToFileURL(mod).href : 'playwright');
  const server = await preview({ preview: { port: 4180, strictPort: true }, logLevel: 'error' });
  const base = server.resolvedUrls.local[0];
  const browser = await chromium.launch();
  let n = 0;
  for (const [w, h] of [[390, 844], [960, 600], [1280, 900]]) {
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    for (const s of scenarios) {
      await page.goto(`${base}#/scenario/${s.id}`);
      await page.waitForTimeout(300);
      await page.screenshot({ path: join(OUT, 'screenshots', `${s.id}-setup-${w}x${h}.png`) }); n++;
      await page.getByRole('button', { name: s.begin || 'Start' }).click();
      await page.waitForTimeout(300);
      await page.screenshot({ path: join(OUT, 'screenshots', `${s.id}-decision-${w}x${h}.png`), fullPage: true }); n++;
    }
    await page.close();
  }
  await browser.close();
  await new Promise((r) => server.httpServer.close(r));
  shots = `${n} screenshots of each setup and first decision at 390×844, 960×600 and 1280×900`;
}

writeFileSync(join(OUT, 'README.md'), `# Review pack

Built ${date} from commit ${sha}
(https://github.com/b-gowland/ai-risk-training/tree/${sha}).

- REVIEW_PROMPT.md: what to check and how to report it. Start here.
- content/: the full text of all ${scenarios.length} scenarios, with quality ratings and branch targets.
- reports/joins.txt: every screen with every way into it, and every ending
  with the choices made on every route into it.
- reports/audit.txt, readability.txt, content-quality.txt, timing.txt: our
  own automated checks. Part of the review is whether they are right.
- screenshots/: ${shots}.
`);

console.log(`review-pack/ written from ${sha.slice(0, 7)}: ${scenarios.length} scenarios, 5 reports, ${shots}.`);
