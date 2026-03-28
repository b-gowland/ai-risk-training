#!/usr/bin/env node
// QA audit script — run against any scenario file before pushing
// Usage: node scripts/qa-audit.js <scenario-id>
// Example: node scripts/qa-audit.js f2-shadow-ai

import { createRequire } from 'module';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const scenarioId = process.argv[2] || 'f2-shadow-ai';

let scenario, STATES, createInitialState, reducer, resolveNext, getCurrentNode, getOutcome;

try {
  const scenarioModule = await import(`../src/scenarios/${scenarioId}.js`);
  scenario = scenarioModule.scenario;
  const engineModule = await import('../src/engine/narrativeEngine.js');
  ({ STATES, createInitialState, reducer, resolveNext, getCurrentNode, getOutcome } = engineModule);
} catch (e) {
  console.error(`Could not load scenario "${scenarioId}":`, e.message);
  process.exit(1);
}

let totalIssues = 0;
const PASS = '✓';
const FAIL = '✗';
const WARN = '⚠';

function log(symbol, msg) { console.log(`  ${symbol} ${msg}`); }

// ── 1. Branch reference audit ─────────────────────────────────────
console.log('\n═══ 1. Branch reference audit ═══');
let branchErrors = 0;

for (const [personaKey, tree] of Object.entries(scenario.trees)) {
  const nodeIds = Object.keys(tree.nodes);
  const outcomeIds = Object.keys(tree.outcomes);

  for (const [nodeId, node] of Object.entries(tree.nodes)) {
    for (const [choiceId, target] of Object.entries(node.branches)) {
      const isOutcome = target.startsWith('outcome_');
      if (isOutcome && !outcomeIds.includes(target)) {
        log(FAIL, `[${personaKey}] ${nodeId} → "${target}" — OUTCOME NOT FOUND`);
        branchErrors++; totalIssues++;
      } else if (!isOutcome && !nodeIds.includes(target)) {
        log(FAIL, `[${personaKey}] ${nodeId} → "${target}" — NODE NOT FOUND`);
        branchErrors++; totalIssues++;
      }
    }
    if (node.decision) {
      for (const choice of node.decision.choices) {
        if (!node.branches[choice.id] && !node.branches.auto) {
          log(FAIL, `[${personaKey}] ${nodeId} choice "${choice.id}" — NO BRANCH`);
          branchErrors++; totalIssues++;
        }
      }
    }
  }
}
log(branchErrors === 0 ? PASS : FAIL, `Branch references: ${branchErrors === 0 ? 'all valid' : `${branchErrors} broken`}`);

// ── 2. Path simulation ────────────────────────────────────────────
console.log('\n═══ 2. Path simulation ═══');
let pathErrors = 0;

function simulatePath(personaKey, strategy) {
  let state = createInitialState(scenario);
  state = reducer(state, { type: 'SELECT_PERSONA', payload: personaKey });
  state = reducer(state, { type: 'START_SCENARIO' });
  let steps = 0;

  while (state.state !== STATES.OUTCOME && steps < 25) {
    steps++;
    if (state.state === STATES.NODE) {
      const node = getCurrentNode(scenario, state.persona, state.currentNodeId);
      if (!node) return { ok: false, reason: `Node not found: "${state.currentNodeId}"` };
      if (!node.decision) {
        const nextId = node.branches.auto;
        if (!nextId) return { ok: false, reason: `No auto branch on "${state.currentNodeId}"` };
        state = reducer(state, { type: 'AUTO_ADVANCE', payload: { nextNodeId: nextId } });
      } else {
        const choices = node.decision.choices;
        const choice = strategy === 'first' ? choices[0] : choices[choices.length - 1];
        const nextId = resolveNext(node, choice.id);
        state = reducer(state, { type: 'SELECT_CHOICE', payload: { choice, nextNodeId: nextId } });
        state = reducer(state, { type: 'FEEDBACK_LOADED', payload: 'test' });
        state = reducer(state, { type: 'CONTINUE_FROM_FEEDBACK' });
      }
    } else if (state.state === STATES.FEEDBACK) {
      state = reducer(state, { type: 'FEEDBACK_LOADED', payload: 'test' });
      state = reducer(state, { type: 'CONTINUE_FROM_FEEDBACK' });
    }
  }

  const outcome = state.outcomeId ? getOutcome(scenario, personaKey, state.outcomeId) : null;
  if (state.state === STATES.OUTCOME && outcome) {
    return { ok: true, outcome: `"${outcome.heading}" (${outcome.tone})` };
  }
  return { ok: false, reason: `Ended in state "${state.state}" after ${steps} steps` };
}

for (const personaKey of Object.keys(scenario.personas)) {
  for (const strategy of ['first', 'last']) {
    const result = simulatePath(personaKey, strategy);
    const label = `[${personaKey}] ${strategy}-choice`;
    if (result.ok) {
      log(PASS, `${label} → ${result.outcome}`);
    } else {
      log(FAIL, `${label} → ${result.reason}`);
      pathErrors++; totalIssues++;
    }
  }
}

// ── 3. Content quality flags ──────────────────────────────────────
console.log('\n═══ 3. Content quality flags ═══');

const DANGLING_PATTERNS = [
  { pattern: /it mostly does/i,       label: 'DANGLING: "it mostly does"' },
  { pattern: /you are now a/i,        label: 'FOURTH-WALL: "you are now a..."' },
  { pattern: /you are now the/i,      label: 'FOURTH-WALL: "you are now the..."' },
  { pattern: /as above/i,             label: 'DANGLING: "as above"' },
  { pattern: /same as before/i,       label: 'DANGLING: "same as before"' },
  { pattern: /see above/i,            label: 'DANGLING: "see above"' },
];

const LENGTH_MIN_NOTE = 8;
const LENGTH_MAX_NOTE = 45;
let contentIssues = 0;

for (const [personaKey, tree] of Object.entries(scenario.trees)) {
  for (const [nodeId, node] of Object.entries(tree.nodes)) {
    if (!node.decision) continue;
    for (const choice of node.decision.choices) {
      const note = choice.note || '';
      const words = note.split(/\s+/).length;
      const ref = `[${personaKey}] ${nodeId}/${choice.id}`;

      for (const { pattern, label } of DANGLING_PATTERNS) {
        if (pattern.test(note)) {
          log(FAIL, `${ref} — ${label}`);
          contentIssues++; totalIssues++;
        }
      }
      if (words < LENGTH_MIN_NOTE) {
        log(WARN, `${ref} — note too short (${words} words): "${note}"`);
        contentIssues++;
      }
      if (words > LENGTH_MAX_NOTE) {
        log(WARN, `${ref} — note long (${words} words) — consider trimming`);
      }
    }
  }

  // Outcome checks
  for (const [outcomeId, outcome] of Object.entries(tree.outcomes)) {
    const resultWords = outcome.result.split(/\s+/).length;
    const learningWords = outcome.learning.split(/\s+/).length;
    const ref = `[${personaKey}] ${outcomeId}`;
    if (resultWords < 25) {
      log(WARN, `${ref} — result text short (${resultWords}w)`);
    }
    if (learningWords < 15) {
      log(WARN, `${ref} — learning text short (${learningWords}w)`);
    }
  }
}

log(contentIssues === 0 ? PASS : WARN, `Content flags: ${contentIssues} issue(s)`);

// ── 4. Persona completeness ───────────────────────────────────────
console.log('\n═══ 4. Persona completeness ═══');
const expectedPersonas = ['business_user', 'executive', 'pm', 'analyst'];
for (const p of expectedPersonas) {
  const hasPersona = !!scenario.personas[p];
  const hasTree = !!scenario.trees[p];
  if (!hasPersona || !hasTree) {
    log(scenario.has_business_user || p !== 'business_user' ? FAIL : WARN,
      `${p}: persona=${hasPersona ? 'yes' : 'NO'}, tree=${hasTree ? 'yes' : 'NO'}`);
    if (hasPersona && !hasTree) totalIssues++;
  } else {
    const nodeCount = Object.keys(scenario.trees[p].nodes).length;
    const outcomeCount = Object.keys(scenario.trees[p].outcomes).length;
    log(PASS, `${p}: ${nodeCount} nodes, ${outcomeCount} outcomes`);
  }
}

// ── Summary ───────────────────────────────────────────────────────
console.log('\n═══ Summary ═══');
console.log(`  Scenario: ${scenario.id} — ${scenario.title}`);
console.log(`  Total issues (P1): ${totalIssues}`);
console.log(`  ${totalIssues === 0 ? '✓ READY TO SHIP' : '✗ FIX BEFORE PUSHING'}`);
console.log('');

process.exit(totalIssues > 0 ? 1 : 0);
