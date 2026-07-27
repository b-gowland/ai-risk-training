#!/usr/bin/env node
/**
 * route-audit.mjs — cross-surface integrity gate.
 *
 * Why this exists: on 27 July 2026 a sweep of the live app found six defects
 * that had shipped silently. None broke the build. All six were greppable in
 * seconds by someone who thought to grep. This script is that someone.
 *
 * It absorbs Steps 2, 3 and 4 of CONTENT_QA_CHECKLIST, which were manual
 * greps in a runbook, and adds a guard for each defect class found in that
 * sweep so the same shape cannot ship twice.
 *
 * Deliberately offline and deterministic — no network, so CI cannot flake and
 * a contributor can run it on a plane. It checks internal consistency, not
 * whether a remote URL is up.
 *
 * Usage:  node scripts/route-audit.mjs [--verbose]
 * Exit:   0 clean (warnings allowed), 1 if any ERROR fired.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const VERBOSE = process.argv.includes('--verbose');

const errors = [];
const warnings = [];
const notes = [];

const err = (check, msg) => errors.push({ check, msg });
const warn = (check, msg) => warnings.push({ check, msg });
const note = (msg) => notes.push(msg);

const read = (p) => readFileSync(join(ROOT, p), 'utf8');

function walk(dir, out = []) {
  for (const name of readdirSync(join(ROOT, dir))) {
    const rel = join(dir, name);
    if (statSync(join(ROOT, rel)).isDirectory()) walk(rel, out);
    else out.push(rel);
  }
  return out;
}

const srcFiles = walk('src');
const codeFiles = srcFiles.filter((f) => /\.(jsx?|mjs)$/.test(f));

/* ─────────────────────────────────────────────────────────────
   1. Route registry — every internal link must resolve
   ───────────────────────────────────────────────────────────── */

const main = read('src/main.jsx');
const declared = [...main.matchAll(/<Route\s+path="([^"]+)"/g)].map((m) => m[1]);

if (!declared.includes('*')) {
  err(
    'routes',
    'No catch-all <Route path="*"> in main.jsx. An unmatched hash renders a blank page with no way out.'
  );
}

const routeMatches = (to) => {
  const path = to.split('?')[0].split('#')[0].replace(/\/+$/, '') || '/';
  return declared.some((d) => {
    if (d === '*') return false; // catch-all is the fallback, not a match
    const dp = d.replace(/\/+$/, '') || '/';
    const dSeg = dp.split('/');
    const pSeg = path.split('/');
    if (dSeg.length !== pSeg.length) return false;
    return dSeg.every((seg, i) => seg.startsWith(':') || seg === pSeg[i]);
  });
};

for (const f of codeFiles) {
  const body = read(f);

  // <Link to="/..."> — template literals with ${} are dynamic, skip them
  for (const m of body.matchAll(/<Link\s+[^>]*?to=(?:"([^"]+)"|\{`([^`$]+)`\})/g)) {
    const to = m[1] ?? m[2];
    if (!to.startsWith('/')) continue;
    if (!routeMatches(to)) {
      err('routes', `${f}: <Link to="${to}"> matches no declared route.`);
    }
  }

  // Absolute-path anchors. This is the footer-Privacy-404 class: href="/privacy"
  // on a HashRouter app served from Pages resolves to a server path that does
  // not exist, so it is a hard 404 rather than a client-side route.
  for (const m of body.matchAll(/href="(\/[^"#][^"]*)"/g)) {
    err(
      'routes',
      `${f}: href="${m[1]}" is a server-absolute path in a HashRouter app — it will 404. Use <Link to="…"> or href="#${m[1]}".`
    );
  }
}

/* ─────────────────────────────────────────────────────────────
   2. Scenario registry — files and imports must agree
   ───────────────────────────────────────────────────────────── */

const indexSrc = read('src/scenarios/index.js');
const scenarioFiles = readdirSync(join(ROOT, 'src/scenarios'))
  .filter((f) => f.endsWith('.js') && f !== 'index.js')
  .map((f) => f.replace(/\.js$/, ''));

const imported = [...indexSrc.matchAll(/from\s+'\.\/([a-z0-9-]+)\.js'/g)].map((m) => m[1]);

// At Home scenarios are imported directly by EverydayApp rather than through
// the At Work registry, so registration means "imported somewhere in src",
// not "imported by index.js".
const allImports = new Set(imported);
for (const f of codeFiles) {
  for (const m of read(f).matchAll(/from\s+'[^']*scenarios\/([a-z0-9-]+)\.js'/g)) {
    allImports.add(m[1]);
  }
}

for (const f of scenarioFiles) {
  if (!allImports.has(f)) {
    err('scenarios', `src/scenarios/${f}.js exists but is imported nowhere — unreachable.`);
  }
}
for (const i of imported) {
  if (!scenarioFiles.includes(i)) {
    err('scenarios', `index.js imports ./${i}.js but no such file exists.`);
  }
}

const atWork = scenarioFiles.filter((f) => !f.startsWith('everyday-'));
const atHome = scenarioFiles.filter((f) => f.startsWith('everyday-'));
note(`scenarios: ${atWork.length} At Work, ${atHome.length} At Home, ${scenarioFiles.length} total`);

/* ─────────────────────────────────────────────────────────────
   3. kb_url shape (CONTENT_QA_CHECKLIST step 4)
   ───────────────────────────────────────────────────────────── */

const KB_HOST = 'https://library.airiskpractice.org/';

for (const f of atWork) {
  const body = read(`src/scenarios/${f}.js`);
  const m = body.match(/kb_url:\s*['"`]([^'"`]+)['"`]/);
  if (!m) {
    warn('kb_url', `${f}.js has no kb_url — the "go deeper" link will be absent.`);
    continue;
  }
  const url = m[1];
  if (!url.startsWith(KB_HOST)) {
    err('kb_url', `${f}.js kb_url does not point at ${KB_HOST} — got ${url}`);
  } else if (!url.includes('/docs/domain-')) {
    err('kb_url', `${f}.js kb_url is not a /docs/domain-… path — got ${url}`);
  }
}

/* ─────────────────────────────────────────────────────────────
   4. Stale hosts (the June sweep; keep it closed)
   ───────────────────────────────────────────────────────────── */

const STALE = ['b-gowland.github.io'];
for (const f of [...srcFiles, 'index.html', 'README.md']) {
  let body;
  try { body = read(f); } catch { continue; }
  for (const host of STALE) {
    if (body.includes(host)) err('hosts', `${f} still references ${host}.`);
  }
}

/* ─────────────────────────────────────────────────────────────
   5. Share-card and meta host agreement
   ───────────────────────────────────────────────────────────── */

const html = read('index.html');
const share = read('src/everyday/ShareCard.jsx');

const hostOf = (u) => { try { return new URL(u).host; } catch { return null; } };
const ogUrl = html.match(/property="og:url"\s+content="([^"]+)"/)?.[1];
const forkUrl = share.match(/FORK_URL\s*=\s*'([^']+)'/)?.[1];

if (ogUrl && forkUrl && hostOf(ogUrl) !== hostOf(forkUrl)) {
  err(
    'meta',
    `og:url host (${hostOf(ogUrl)}) differs from ShareCard FORK_URL host (${hostOf(forkUrl)}). Shared links and the card must agree.`
  );
}

// og:image on a different host to og:url is a live risk: some scrapers do not
// follow redirects when fetching the preview image, and a missing preview
// costs most of a post's reach.
for (const tag of ['og:image', 'twitter:image']) {
  const val = html.match(new RegExp(`(?:property|name)="${tag}"\\s+content="([^"]+)"`))?.[1];
  if (val && ogUrl && hostOf(val) !== hostOf(ogUrl)) {
    warn('meta', `${tag} host (${hostOf(val)}) differs from og:url host (${hostOf(ogUrl)}).`);
  }
}

/* ─────────────────────────────────────────────────────────────
   6. Hardcoded counts (CONTENT_QA_CHECKLIST step 2)
   ───────────────────────────────────────────────────────────── */

const COUNT_TARGETS = ['README.md', 'index.html'];
for (const f of COUNT_TARGETS) {
  let body;
  try { body = read(f); } catch { continue; }
  for (const m of body.matchAll(/(\d{1,3})\s+(?:interactive\s+)?(?:practitioner\s+|everyday\s+|At Work\s+|At Home\s+)?scenarios?\b/gi)) {
    const n = Number(m[1]);
    if (![atWork.length, atHome.length, scenarioFiles.length].includes(n)) {
      err(
        'counts',
        `${f}: "${m[0].trim()}" does not match any actual count (At Work ${atWork.length}, At Home ${atHome.length}, total ${scenarioFiles.length}).`
      );
    }
  }
}

/* ─────────────────────────────────────────────────────────────
   7. Date-decay copy
   ───────────────────────────────────────────────────────────── */

// The Article 4 class: copy that is true until a date and wrong the day after.
// "Enforcement: August 2, 2026" reads fine on 1 Aug and reads stale on 3 Aug,
// and nothing in the build knows the difference.
const DECAY = /\b(?:enforcement|deadline|launches?|starts?|begins?|from)\s*:?\s*(?:on\s+)?(?:\d{1,2}\s+)?(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{1,2},?\s+20\d{2}/gi;

for (const f of [...codeFiles, 'index.html']) {
  let body;
  try { body = read(f); } catch { continue; }
  for (const m of body.matchAll(DECAY)) {
    const phrase = m[0].replace(/\s+/g, ' ').trim();
    const dm = phrase.match(/(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+(\d{1,2}),?\s+(20\d{2})/i);
    const when = dm ? new Date(`${dm[0].replace(',', '')}`) : null;
    if (when && !Number.isNaN(+when) && when < new Date()) {
      err('date-decay', `${f}: "${phrase}" describes a future event that has already passed.`);
    } else {
      warn('date-decay', `${f}: "${phrase}" will read as stale the day after it passes. Prefer copy true on both sides of the date.`);
    }
  }
}

/* ─────────────────────────────────────────────────────────────
   Report
   ───────────────────────────────────────────────────────────── */

const line = '─'.repeat(64);
console.log(`\n${line}\nroute-audit — cross-surface integrity\n${line}`);
for (const n of notes) console.log(`  ·  ${n}`);
console.log(`  ·  routes declared: ${declared.join(', ')}`);

if (warnings.length) {
  console.log(`\n  ${warnings.length} warning(s):`);
  for (const w of warnings) console.log(`   ⚠  [${w.check}] ${w.msg}`);
}

if (errors.length) {
  console.log(`\n  ${errors.length} error(s):`);
  for (const e of errors) console.log(`   ✖  [${e.check}] ${e.msg}`);
  console.log(`\n${line}\nFAIL — ${errors.length} error(s)\n${line}\n`);
  process.exit(1);
}

console.log(`\n${line}\nPASS — 0 errors, ${warnings.length} warning(s)\n${line}\n`);
if (VERBOSE) console.log('files scanned:', codeFiles.length);
