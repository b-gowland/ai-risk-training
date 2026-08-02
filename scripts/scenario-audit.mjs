#!/usr/bin/env node
/**
 * scenario-audit.mjs — validation for the four-beat scenario schema.
 *
 * Replaces qa-audit.js for migrated scenarios. qa-audit.js still exists and
 * still validates the persona-era schema; it is deleted when the last
 * scenario is migrated, and not before.
 *
 * What this checks that a build cannot: that every branch lands somewhere,
 * that every outcome is reachable, that the close is authored, that no
 * artefact is outside the closed vocabulary, and that the scene named at
 * Setup is actually a file on disk.
 *
 * Usage:  node scripts/scenario-audit.mjs [scenario-id]     (default: all registered)
 * Exit:   0 clean, 1 on any P1.
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = process.cwd();
const only = process.argv[2] || null;

let p1 = 0, warned = 0;
const FAIL = '\u2716', WARN = '\u26a0', PASS = '\u2713';
const fail = (id, m) => { console.log(`  ${FAIL} [${id}] ${m}`); p1++; };
const warn = (id, m) => { console.log(`  ${WARN} [${id}] ${m}`); warned++; };
const pass = (m) => console.log(`  ${PASS} ${m}`);

const ARTEFACT_TYPES = new Set([
  'message_thread', 'email', 'assistant_output', 'document', 'system_output', 'transcript',
]);

// The fields each renderer in src/components/Artefact/Artefact.jsx actually
// reads. A valid `type` with the wrong field names renders an EMPTY frame and
// every other gate stays green — that is exactly how three scenarios shipped
// with a blank artefact on the opening decision screen. §5.3: the artefact
// carries everything the decision turns on, so an artefact that renders
// nothing is a P1, not a cosmetic issue.
const ARTEFACT_FIELDS = {
  message_thread:   ['contact', 'messages'],
  email:            ['subject', 'fromName', 'fromAddress', 'to', 'body'],
  assistant_output: ['response'],
  document:         ['filename', 'lines'],
  system_output:    ['system', 'headline'],
  transcript:       ['source', 'lines'],
};

// Fields no renderer reads. Present in a scenario file, they are authored
// content the player never sees.
const ARTEFACT_KNOWN = {
  message_thread:   ['type', 'caption', 'contact', 'contactNote', 'messages', 'mark'],
  email:            ['type', 'caption', 'subject', 'fromName', 'fromAddress', 'to', 'date', 'body', 'signature', 'attachment'],
  assistant_output: ['type', 'caption', 'tool', 'prompt', 'response', 'citations'],
  document:         ['type', 'caption', 'filename', 'meta', 'lines'],
  system_output:    ['type', 'caption', 'system', 'status', 'headline', 'fields', 'rationale', 'trail'],
  transcript:       ['type', 'caption', 'source', 'duration', 'lines', 'note'],
};
const QUALITIES = new Set(['good', 'partial', 'poor']);
const TONES = new Set(['good', 'warn', 'bad']);
const DOORS = new Set(['home', 'work']);

const REQUIRED = [
  'id', 'door', 'title', 'shelfLine', 'coldOpen', 'authority',
  'ending', 'determinacy', 'nodes', 'outcomes', 'debrief', 'recall', 'act',
  'tell', 'controls_summary',
];

// Load the registered scenarios WITHOUT importing index.js. index.js uses
// import.meta.glob, which is a Vite transform and does not resolve under
// plain Node — importing it here would couple this audit to the bundler.
const registrySrc = readFileSync(join(ROOT, 'src/scenarios/index.js'), 'utf8');
const registryIds = [...registrySrc.matchAll(/from\s+'\.\/([a-z0-9-]+)\.js'/g)].map((m) => m[1]);
const FEATURED = [...(registrySrc.match(/FEATURED_PAIR = \[([\s\S]*?)\]/)?.[1] || '')
  .matchAll(/[`'"]([a-z0-9-]+)[`'"]/g)].map((m) => m[1]);

const scenarios = [];
for (const fileId of registryIds) {
  const mod = await import(pathToFileURL(join(ROOT, 'src/scenarios', `${fileId}.js`)).href);
  scenarios.push(mod.scenario);
}

const targets = only ? scenarios.filter((s) => s.id === only) : scenarios;

if (!targets.length) {
  console.log(`No registered scenario matching "${only}". Registered: ${scenarios.map((s) => s.id).join(', ')}`);
  process.exit(1);
}

const sceneFiles = new Set(
  existsSync(join(ROOT, 'public/scenes'))
    ? readdirSync(join(ROOT, 'public/scenes')).map((f) => f.replace(/\.webp$/, ''))
    : []
);

for (const sc of targets) {
  console.log(`\n\u2550\u2550 ${sc.id} \u2550\u2550`);

  /* ── Required fields ─────────────────────────────────────────── */
  for (const f of REQUIRED) {
    if (sc[f] === undefined || sc[f] === null) fail('fields', `missing required field: ${f}`);
  }
  if (sc.door && !DOORS.has(sc.door)) fail('fields', `door must be 'home' or 'work', got '${sc.door}'`);
  // §4.2 — At Work we invent the standing so it must be stated. At Home the
  // player brings their own and stating it reads as coursework.
  if (sc.door === 'work' && !sc.standing) fail('fields', `At Work scenarios must state a standing`);
  if (sc.door === 'home' && sc.standing) warn('fields', `At Home standing is stated; §4.2 says the player brings their own`);
  if (sc.determinacy && !['clean', 'open'].includes(sc.determinacy)) {
    fail('fields', `determinacy must be 'clean' or 'open', got '${sc.determinacy}'`);
  }
  if (Array.isArray(sc.coldOpen) && (sc.coldOpen.length < 3 || sc.coldOpen.length > 4)) {
    warn('setup', `coldOpen is ${sc.coldOpen.length} lines; §3 says three or four`);
  }

  /* ── Scene assets actually exist ─────────────────────────────── */
  // The doorway image is the panel, so a missing one is a broken homepage,
  // not a degraded Setup screen.
  if (FEATURED.includes(sc.id)) {
    if (!sc.doorScene) fail('door', `featured on the doorway but has no doorScene`);
    else if (!sceneFiles.has(sc.doorScene)) fail('door', `doorScene '${sc.doorScene}' has no public/scenes/${sc.doorScene}.webp`);
    if (!sc.hook) fail('door', `featured on the doorway but has no hook`);
    else if (sc.hook.length > 105) warn('door', `hook is ${sc.hook.length} chars — long for display size`);
  }
  if (sc.scene && !sceneFiles.has(sc.scene)) {
    fail('scene', `scene '${sc.scene}' has no public/scenes/${sc.scene}.webp`);
  } else if (!sc.scene) {
    warn('scene', `no scene at Setup — orientation and tone are carried by text alone`);
  }

  /* ── Graph integrity ─────────────────────────────────────────── */
  const nodes = sc.nodes || {};
  const outcomes = sc.outcomes || {};
  const entry = sc.entry || 'start';
  if (!nodes[entry]) fail('graph', `entry node '${entry}' does not exist`);

  const reachedNodes = new Set();
  const reachedOutcomes = new Set();
  const walk = (id, trail) => {
    if (!id) return;
    if (id.startsWith('outcome_')) {
      if (!outcomes[id]) fail('graph', `branch targets '${id}' but no such outcome`);
      else reachedOutcomes.add(id);
      return;
    }
    if (trail.has(id)) { fail('graph', `cycle through '${id}'`); return; }
    const n = nodes[id];
    if (!n) { fail('graph', `branch targets node '${id}' which does not exist`); return; }
    reachedNodes.add(id);

    if (!Array.isArray(n.prose) || !n.prose.length) fail('node', `${id}: prose must be a non-empty array`);

    if (n.artefact) {
      const a = n.artefact;
      if (!ARTEFACT_TYPES.has(a.type)) {
        fail('artefact', `${id}: type '${a.type}' is outside the closed vocabulary (§5.2)`);
      } else {
        for (const f of ARTEFACT_FIELDS[a.type]) {
          if (a[f] === undefined || a[f] === null
              || (Array.isArray(a[f]) && !a[f].length)) {
            fail('artefact', `${id}: ${a.type} is missing '${f}' — the renderer reads it, so the artefact renders empty (§5.3)`);
          }
        }
        for (const k of Object.keys(a)) {
          if (!ARTEFACT_KNOWN[a.type].includes(k)) {
            fail('artefact', `${id}: ${a.type} has field '${k}', which no renderer reads — the player never sees it`);
          }
        }
      }
    }

    if (n.decision) {
      const ch = n.decision.choices || [];
      if (!n.decision.prompt) fail('node', `${id}: decision has no prompt`);
      if (ch.length < 2 || ch.length > 4) fail('node', `${id}: ${ch.length} choices; must be 2-4`);
      const ids = new Set();
      for (const c of ch) {
        if (ids.has(c.id)) fail('node', `${id}: duplicate choice id '${c.id}'`);
        ids.add(c.id);
        if (!QUALITIES.has(c.quality)) fail('node', `${id}/${c.id}: quality '${c.quality}' invalid`);
        if (!c.consequence) fail('node', `${id}/${c.id}: no consequence`);
        // §4.4 — the consequence is narrated, never graded.
        if (/^(good call|nice work|correct|well done|right call|wrong|incorrect|that was)/i.test(c.consequence.trim())) {
          fail('voice', `${id}/${c.id}: consequence opens with a verdict. §4.4 forbids evaluative chrome.`);
        }
        if (!n.branches || !n.branches[c.id]) fail('graph', `${id}: choice '${c.id}' has no branch`);
      }
      for (const key of Object.keys(n.branches || {})) {
        if (!ids.has(key)) fail('graph', `${id}: branch key '${key}' is not a choice id`);
      }
    } else if (!n.next) {
      fail('graph', `${id}: no decision and no 'next' — dead end`);
    }

    const targetsOut = n.branches ? Object.values(n.branches) : [n.next];
    for (const t of targetsOut) walk(t, new Set([...trail, id]));
  };
  walk(entry, new Set());

  for (const id of Object.keys(nodes)) {
    if (!reachedNodes.has(id)) fail('graph', `node '${id}' is unreachable from ${entry}`);
  }
  for (const id of Object.keys(outcomes)) {
    if (!reachedOutcomes.has(id)) fail('graph', `outcome '${id}' is unreachable`);
  }

  /* ── Outcomes ────────────────────────────────────────────────── */
  const tones = new Set();
  for (const [id, o] of Object.entries(outcomes)) {
    for (const f of ['heading', 'tone', 'score', 'reaction', 'description', 'judgement']) {
      if (o[f] === undefined) fail('outcome', `${id}: missing ${f}`);
    }
    if (!TONES.has(o.tone)) fail('outcome', `${id}: tone '${o.tone}' invalid`);
    tones.add(o.tone);
    if (!Array.isArray(o.description)) fail('outcome', `${id}: description must be an array`);
    if (o.reaction && o.reaction.length < 40) warn('outcome', `${id}: reaction is very short`);
  }
  // §4.9 — modelled expert reasoning becomes affordable at four outcomes.
  if (Object.keys(outcomes).length < 4) {
    warn('outcome', `${Object.keys(outcomes).length} outcomes; §4.9 assumes four`);
  }
  for (const t of ['good', 'warn', 'bad']) {
    if (!tones.has(t)) warn('outcome', `no '${t}' outcome reachable`);
  }

  /* ── Depth ───────────────────────────────────────────────────────
     §4.1 states a band for the PLAYED experience — At Home four to
     five decisions, At Work six to eight. So the band applies to every
     path a player can take, not to the longest one in the tree.

     Measuring the longest path only is how a scenario ships where the
     good endings are the shortest: play well, get two decisions and
     out. That inverts the reward, gives the careful player the least
     practice, and is invisible to a longest-path check. */
  /* Each path records its decision count and the outcome it ends on. The floor
     exists to stop GOOD play being shorter than bad play — rewarding the
     careful player with less practice. So the exemption is by outcome quality,
     not tone alone: a path ending on a decisive low-scoring choice (a bad exit,
     or a warn-scoring disengagement like "not my place") may fall below the
     floor, because forcing it through the full arc would be padding a story the
     player chose to end. The floor still binds every path ending on a good- or
     great-scoring outcome, which are the ones a careful player walks and where
     the practice has to live. A decisive exit may be short but not instant. */
  const EXIT_MAX_SCORE = 35;
  const paths = [];
  const depth = (id, d, trail) => {
    if (!id || trail.has(id)) { paths.push({ d, score: null }); return; }
    if (id.startsWith('outcome_')) { paths.push({ d, score: outcomes[id]?.score ?? null }); return; }
    const n = nodes[id];
    if (!n) return;
    const nd = n.decision ? d + 1 : d;
    const outs = n.branches ? Object.values(n.branches) : [n.next];
    if (!outs.length) { paths.push({ d: nd, score: null }); return; }
    for (const t of outs) depth(t, nd, new Set([...trail, id]));
  };
  depth(entry, 0, new Set());

  const lengths = paths.map((p) => p.d);
  const [lo, hi] = sc.door === 'home' ? [4, 5] : [6, 8];
  const min = Math.min(...lengths), max = Math.max(...lengths);

  // Floor binds high-scoring endings; decisive low-scoring exits may be short.
  const isExit = (p) => p.score !== null && p.score <= EXIT_MAX_SCORE;
  const shortBound = paths.filter((p) => p.d < lo && !isExit(p));
  const shortExit = paths.filter((p) => p.d < lo && isExit(p));
  const trivialExit = shortExit.filter((p) => p.d < 2);
  const long = lengths.filter((l) => l > hi).length;

  if (shortBound.length) {
    const m = Math.min(...shortBound.map((p) => p.d));
    fail('depth', `${shortBound.length} path(s) to a good outcome under ${lo} decisions (shortest ${m}). §4.1 band is ${lo}-${hi} for every path that does not end on a decisive low-scoring exit.`);
  }
  if (trivialExit.length) {
    fail('depth', `${trivialExit.length} exit path(s) end in under 2 decisions — a decisive exit may be short but not instant.`);
  }
  if (long) {
    warn('depth', `${long} of ${lengths.length} paths exceed ${hi} decisions (longest ${max})`);
  }
  if (shortExit.length && !trivialExit.length) {
    pass(`depth: ${shortExit.length} decisive low-scoring exit(s) at depth ${Math.min(...shortExit.map((p) => p.d))}, allowed; every other path ${lo}-${hi}`);
  }
  if (!shortBound.length && !long && !shortExit.length) pass(`depth: every path ${min}-${max} decisions, inside the ${lo}-${hi} band`);

  // A good ending that is reachable faster than a bad one rewards the
  // careful player with less practice.
  const endDepth = {};
  const tag = (id, d, trail) => {
    if (!id) return;
    if (id.startsWith('outcome_')) { endDepth[id] = Math.min(endDepth[id] ?? 99, d); return; }
    if (trail.has(id)) return;
    const n = nodes[id]; if (!n) return;
    const nd = n.decision ? d + 1 : d;
    for (const t of (n.branches ? Object.values(n.branches) : [n.next])) tag(t, nd, new Set([...trail, id]));
  };
  tag(entry, 0, new Set());
  const goodMin = Math.min(...Object.entries(endDepth).filter(([id]) => outcomes[id]?.tone === 'good').map(([, d]) => d), 99);
  const badMax = Math.max(...Object.entries(endDepth).filter(([id]) => outcomes[id]?.tone === 'bad').map(([, d]) => d), 0);
  if (goodMin < 99 && badMax > 0 && goodMin < badMax - 1) {
    warn('depth', `good outcomes reachable in ${goodMin} decisions but bad ones take up to ${badMax} — playing well ends the scenario early`);
  }

  /* ── The close ───────────────────────────────────────────────── */
  if (sc.recall) {
    if (!sc.recall.prompt) fail('recall', `no prompt`);
    const opts = sc.recall.options || [];
    if (opts.length < 2) fail('recall', `needs at least 2 options`);
    for (const o of opts) {
      if (!QUALITIES.has(o.quality)) fail('recall', `${o.id}: quality '${o.quality}' invalid`);
      if (!o.note) fail('recall', `${o.id}: no note`);
    }
    if (!opts.some((o) => o.quality === 'good')) fail('recall', `no 'good' option`);
  }
  if (Array.isArray(sc.act)) {
    if (sc.act.length < 2 || sc.act.length > 4) fail('act', `${sc.act.length} options; §4.7 says two to four`);
    if (sc.act.some((a) => a.id === 'none')) fail('act', `'none' is appended by the player, not authored`);
  }
  if (sc.tell) {
    // §4.8 — a tell states a behaviour, never a guarantee.
    if (/\b(safe|protected|secure|never happen|guarantee|immune|can't be)\b/i.test(sc.tell)) {
      fail('tell', `implies protection. A tell states a behaviour, never a guarantee (§4.8).`);
    }
    if (sc.tell.length > 200) warn('tell', `${sc.tell.length} chars — long for something someone repeats`);
  }
  if (Array.isArray(sc.controls_summary) && sc.controls_summary.length < 2) {
    fail('controls', `minimum 2 controls`);
  }

  /* ── String literal rule (CONTENT_STYLE_GUIDE) ───────────────── */
  const srcPath = join(ROOT, 'src/scenarios', `${sc.id}.js`);
  if (existsSync(srcPath)) {
    const raw = readFileSync(srcPath, 'utf8');
    const singleQuoted = raw.match(/:\s*'[^']*'/g) || [];
    if (singleQuoted.length) {
      warn('style', `${singleQuoted.length} single-quoted string value(s); the style guide requires backticks`);
    }
  }
}

console.log(`\n${p1 === 0 ? 'PASS' : 'FAIL'} — ${p1} P1, ${warned} warning(s)\n`);
process.exit(p1 === 0 ? 0 : 1);
