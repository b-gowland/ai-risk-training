#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════════
// QA Audit Script — ai-risk-training
// Run before pushing any scenario: node scripts/qa-audit.js <scenario-id>
//
// COVERAGE:
//   Layer 1 — Data integrity    (branch refs, outcome existence)
//   Layer 2 — Path completeness (all personas reach valid outcomes)
//   Layer 3 — Content quality   (dangling refs, tone, length)
//   Layer 4 — Transition safety (state machine edge cases the browser
//                                can hit but Node simulation misses)
//
// KNOWN LIMITATION:
//   This script cannot test React render-cycle timing issues (useEffect
//   firing between renders, async state transitions, component crashes
//   on null props mid-transition). See BROWSER CHECKLIST below for the
//   manual steps that must be completed before every push.
//
// BROWSER CHECKLIST (must be done manually — cannot be automated here):
//   For every persona × every outcome quality (good/partial/poor):
//   □ Navigate to the scenario
//   □ Select the persona
//   □ Make choices leading to a GOOD outcome — confirm outcome screen loads
//   □ Make choices leading to a POOR outcome — confirm outcome screen loads
//   □ On the feedback screen, click Continue immediately (don't wait)
//   □ On the feedback screen, wait 5 seconds then click Continue
//   □ Use browser back button mid-scenario — confirm graceful error or restart
//   □ Reload the page mid-scenario — confirm graceful error or restart
//   □ Open DevTools console — confirm zero uncaught errors on any path
//   Minimum: test at least one good path and one poor path per persona.
//   The error boundary will catch crashes but console errors must be zero.
// ═══════════════════════════════════════════════════════════════════

import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const scenarioId = process.argv[2] || 'f2-shadow-ai';

let scenario, STATES, createInitialState, reducer, resolveNext, getCurrentNode, getOutcome;

try {
  const s = await import(`../src/scenarios/${scenarioId}.js`);
  scenario = s.scenario;
  const e = await import('../src/engine/narrativeEngine.js');
  ({ STATES, createInitialState, reducer, resolveNext, getCurrentNode, getOutcome } = e);
} catch (err) {
  console.error(`Could not load scenario "${scenarioId}":`, err.message);
  process.exit(1);
}

const PASS = '✓';
const FAIL = '✗';
const WARN = '⚠';
let totalP1 = 0;
let totalWarn = 0;

function p1(msg)   { console.log(`  ${FAIL} ${msg}`); totalP1++; }
function warn(msg) { console.log(`  ${WARN} ${msg}`); totalWarn++; }
function pass(msg) { console.log(`  ${PASS} ${msg}`); }


// ═══════════════════════════════════════════════════════════════════
// LAYER 1 — Data integrity
// ═══════════════════════════════════════════════════════════════════
console.log('\n══ Layer 1: Data integrity ══');

for (const [personaKey, tree] of Object.entries(scenario.trees)) {
  const nodeIds    = Object.keys(tree.nodes);
  const outcomeIds = Object.keys(tree.outcomes);

  for (const [nodeId, node] of Object.entries(tree.nodes)) {
    // Every branch target must exist
    for (const [choiceId, target] of Object.entries(node.branches)) {
      const isOutcome = target.startsWith('outcome_');
      if (isOutcome && !outcomeIds.includes(target)) {
        p1(`[${personaKey}] ${nodeId}/${choiceId} → "${target}" — OUTCOME NOT FOUND`);
      } else if (!isOutcome && !nodeIds.includes(target)) {
        p1(`[${personaKey}] ${nodeId}/${choiceId} → "${target}" — NODE NOT FOUND`);
      }
    }
    // Every choice must have a branch
    if (node.decision) {
      for (const choice of node.decision.choices) {
        if (!node.branches[choice.id] && !node.branches.auto) {
          p1(`[${personaKey}] ${nodeId} choice "${choice.id}" — NO BRANCH`);
        }
      }
    }
    // Auto-advance nodes must have an auto branch
    if (!node.decision && !node.branches.auto) {
      p1(`[${personaKey}] ${nodeId} — no decision and no auto branch (dead end)`);
    }
    // Scene key must be a non-empty string
    if (!node.scene || typeof node.scene !== 'string') {
      p1(`[${personaKey}] ${nodeId} — missing or invalid scene key`);
    }
    // Caption must exist
    if (!node.caption) {
      p1(`[${personaKey}] ${nodeId} — missing caption`);
    }
  }

  // Outcome required fields
  for (const [outcomeId, outcome] of Object.entries(tree.outcomes)) {
    if (!outcome.heading)  p1(`[${personaKey}] ${outcomeId} — missing heading`);
    if (!outcome.result)   p1(`[${personaKey}] ${outcomeId} — missing result`);
    if (!outcome.learning) p1(`[${personaKey}] ${outcomeId} — missing learning`);
    if (!['good','warn','bad'].includes(outcome.tone)) {
      p1(`[${personaKey}] ${outcomeId} — invalid tone: "${outcome.tone}"`);
    }
  }
}

pass('Data integrity check complete');


// ═══════════════════════════════════════════════════════════════════
// LAYER 2 — Path completeness
// ═══════════════════════════════════════════════════════════════════
console.log('\n══ Layer 2: Path completeness ══');

function simulatePath(personaKey, strategy, maxSteps = 30) {
  let state = createInitialState(scenario);
  state = reducer(state, { type: 'SELECT_PERSONA', payload: personaKey });
  state = reducer(state, { type: 'START_SCENARIO' });

  let steps = 0;
  const visited = new Set();

  while (state.state !== STATES.OUTCOME && steps < maxSteps) {
    steps++;

    // Detect infinite loops
    const key = `${state.state}:${state.currentNodeId}`;
    if (visited.has(key)) return { ok: false, reason: `Infinite loop at "${key}"` };
    visited.add(key);

    if (state.state === STATES.NODE) {
      const node = getCurrentNode(scenario, state.persona, state.currentNodeId);
      if (!node) return { ok: false, reason: `Node not found: "${state.currentNodeId}"` };

      if (!node.decision) {
        const nextId = node.branches.auto;
        if (!nextId) return { ok: false, reason: `No auto branch on "${state.currentNodeId}"` };
        // TRANSITION SAFETY: check that auto-advance target is a valid node
        const nextNode = getCurrentNode(scenario, personaKey, nextId);
        const isOutcome = nextId.startsWith('outcome_');
        if (!nextNode && !isOutcome) {
          return { ok: false, reason: `Auto-advance target "${nextId}" is neither a valid node nor an outcome` };
        }
        state = reducer(state, { type: 'AUTO_ADVANCE', payload: { nextNodeId: nextId } });
      } else {
        const choices = node.decision.choices;
        const choice  = strategy === 'first' ? choices[0]
                      : strategy === 'last'  ? choices[choices.length - 1]
                      : choices[Math.floor(Math.random() * choices.length)];
        const nextId  = resolveNext(node, choice.id);

        // TRANSITION SAFETY: verify the next target is valid before dispatching
        const isOutcome = nextId.startsWith('outcome_');
        if (!isOutcome) {
          const nextNode = getCurrentNode(scenario, personaKey, nextId);
          if (!nextNode) {
            return { ok: false, reason: `Choice "${choice.id}" → "${nextId}" is not a valid node or outcome` };
          }
        } else {
          const outcome = getOutcome(scenario, personaKey, nextId);
          if (!outcome) {
            return { ok: false, reason: `Choice "${choice.id}" → "${nextId}" outcome does not exist` };
          }
        }

        state = reducer(state, { type: 'SELECT_CHOICE', payload: { choice, nextNodeId: nextId } });
        state = reducer(state, { type: 'FEEDBACK_LOADED', payload: 'test' });
        state = reducer(state, { type: 'CONTINUE_FROM_FEEDBACK' });
      }
    } else if (state.state === STATES.FEEDBACK) {
      state = reducer(state, { type: 'FEEDBACK_LOADED', payload: 'test' });
      state = reducer(state, { type: 'CONTINUE_FROM_FEEDBACK' });
    }
  }

  if (steps >= maxSteps) return { ok: false, reason: `Exceeded ${maxSteps} steps — possible loop` };

  const outcome = state.outcomeId ? getOutcome(scenario, personaKey, state.outcomeId) : null;
  if (state.state === STATES.OUTCOME && outcome) {
    return { ok: true, outcome: `"${outcome.heading}" [${outcome.tone}]` };
  }
  return { ok: false, reason: `Ended in state "${state.state}" with no outcome` };
}

// Test first-choice and last-choice paths for every persona
for (const personaKey of Object.keys(scenario.personas)) {
  if (!scenario.trees[personaKey]) continue;
  for (const strategy of ['first', 'last']) {
    const result = simulatePath(personaKey, strategy);
    const label  = `[${personaKey}] ${strategy}-choice path`;
    if (result.ok) pass(`${label} → ${result.outcome}`);
    else p1(`${label} → FAILED: ${result.reason}`);
  }
}


// ═══════════════════════════════════════════════════════════════════
// LAYER 3 — Content quality
// ═══════════════════════════════════════════════════════════════════
console.log('\n══ Layer 3: Content quality ══');

const DANGLING = [
  { re: /it mostly does\b/i,          label: 'DANGLING: "it mostly does" — unclear referent' },
  { re: /you are now (?:a|the)\b/i,   label: 'FOURTH-WALL: "you are now a/the..." — unexplained to player' },
  { re: /\bas above\b/i,              label: 'DANGLING: "as above"' },
  { re: /\bsee above\b/i,             label: 'DANGLING: "see above"' },
  { re: /\bsame as before\b/i,        label: 'DANGLING: "same as before"' },
  { re: /\bTBD\b|\bplaceholder\b/i,   label: 'INCOMPLETE: placeholder text found' },
];

const NOTE_MIN_WORDS  = 8;
const NOTE_MAX_WORDS  = 50;
const RESULT_MIN      = 25;
const LEARNING_MIN    = 15;

for (const [personaKey, tree] of Object.entries(scenario.trees)) {
  for (const [nodeId, node] of Object.entries(tree.nodes)) {
    // Caption quality
    if (node.caption && node.caption.split(' ').length < 5) {
      warn(`[${personaKey}] ${nodeId} — caption very short: "${node.caption}"`);
    }

    if (!node.decision) continue;

    // Decision prompt must be a question
    if (node.decision.prompt && !node.decision.prompt.includes('?')) {
      warn(`[${personaKey}] ${nodeId} — decision prompt is not a question: "${node.decision.prompt}"`);
    }

    // Must have at least 2 choices, ideally 3-4
    if (node.decision.choices.length < 2) {
      p1(`[${personaKey}] ${nodeId} — only ${node.decision.choices.length} choice(s)`);
    }

    for (const choice of node.decision.choices) {
      const note  = choice.note  || '';
      const label = choice.label || '';
      const ref   = `[${personaKey}] ${nodeId}/${choice.id}`;

      // Dangling reference patterns
      for (const { re, label: dl } of DANGLING) {
        if (re.test(note) || re.test(label)) p1(`${ref} — ${dl}`);
      }

      // Length checks
      const words = note.split(/\s+/).filter(Boolean).length;
      if (words < NOTE_MIN_WORDS) p1(`${ref} — note too short (${words}w min ${NOTE_MIN_WORDS}): "${note}"`);
      if (words > NOTE_MAX_WORDS) warn(`${ref} — note long (${words}w, consider trimming)`);

      // Quality field must be valid
      if (!['good','partial','poor'].includes(choice.quality)) {
        p1(`${ref} — invalid quality: "${choice.quality}"`);
      }

      // Choice label must not be empty
      if (!label.trim()) p1(`${ref} — empty choice label`);
    }

    // Each node should have at least one good and one poor choice
    const qualities = node.decision.choices.map(c => c.quality);
    if (!qualities.includes('good')) {
      warn(`[${personaKey}] ${nodeId} — no 'good' choice available`);
    }
    if (!qualities.includes('poor') && !qualities.includes('partial')) {
      warn(`[${personaKey}] ${nodeId} — no 'poor' or 'partial' choice (no learning opportunity)`);
    }
  }

  // Outcome content checks
  for (const [outcomeId, outcome] of Object.entries(tree.outcomes)) {
    const ref = `[${personaKey}] ${outcomeId}`;
    const resultWords   = outcome.result?.split(/\s+/).filter(Boolean).length || 0;
    const learningWords = outcome.learning?.split(/\s+/).filter(Boolean).length || 0;

    if (resultWords < RESULT_MIN)   warn(`${ref} — result short (${resultWords}w, min ${RESULT_MIN})`);
    if (learningWords < LEARNING_MIN) warn(`${ref} — learning short (${learningWords}w, min ${LEARNING_MIN})`);

    for (const { re, label: dl } of DANGLING) {
      if (re.test(outcome.result || '') || re.test(outcome.learning || '')) {
        p1(`${ref} — ${dl} in outcome text`);
      }
    }
  }
}

pass('Content quality check complete');


// ═══════════════════════════════════════════════════════════════════
// LAYER 4 — Transition safety
// What the browser can crash on that Node simulation misses.
// These are state machine edge cases that manifest as React errors.
// ═══════════════════════════════════════════════════════════════════
console.log('\n══ Layer 4: Transition safety ══');
console.log('  (Tests state machine edge cases — not a substitute for browser testing)');

for (const [personaKey, tree] of Object.entries(scenario.trees)) {
  for (const [nodeId, node] of Object.entries(tree.nodes)) {

    // CRITICAL: Every branch target reachable from a CHOICE must be renderable.
    // In the browser, after SELECT_CHOICE → FEEDBACK_LOADED → CONTINUE_FROM_FEEDBACK,
    // the app immediately tries to render the next node or outcome.
    // If the target is an outcome that doesn't exist, the component crashes.
    if (node.decision) {
      for (const choice of node.decision.choices) {
        const target = node.branches[choice.id];
        if (!target) continue;

        const isOutcome = target.startsWith('outcome_');
        if (isOutcome) {
          const outcome = tree.outcomes[target];
          if (!outcome) {
            p1(`[${personaKey}] ${nodeId}/${choice.id} → "${target}" — outcome exists in branch but not in outcomes map (browser crash)`);
          } else {
            // Outcome must have all fields the OutcomeScreen component needs
            if (!outcome.heading || !outcome.result || !outcome.learning || !outcome.tone) {
              p1(`[${personaKey}] ${target} — outcome missing required fields for OutcomeScreen render`);
            }
          }
        } else {
          // Next node must be renderable: needs scene + caption (or auto branch)
          const nextNode = tree.nodes[target];
          if (nextNode) {
            if (!nextNode.scene) {
              p1(`[${personaKey}] ${target} — reachable node missing scene key (browser crash on render)`);
            }
            if (!nextNode.caption) {
              p1(`[${personaKey}] ${target} — reachable node missing caption (browser crash on render)`);
            }
          }
        }
      }
    }

    // CRITICAL: Auto-advance nodes — the browser fires the useEffect after render.
    // If auto branch target is null/undefined, the dispatch crashes.
    if (!node.decision) {
      const autoTarget = node.branches.auto;
      if (!autoTarget) {
        p1(`[${personaKey}] ${nodeId} — auto-advance node with no auto branch target (useEffect crash)`);
      } else {
        const isOutcome = autoTarget.startsWith('outcome_');
        if (!isOutcome && !tree.nodes[autoTarget]) {
          p1(`[${personaKey}] ${nodeId} — auto-advance target "${autoTarget}" does not exist (useEffect crash)`);
        }
        if (isOutcome && !tree.outcomes[autoTarget]) {
          p1(`[${personaKey}] ${nodeId} — auto-advance outcome "${autoTarget}" does not exist (useEffect crash)`);
        }
      }
    }
  }
}

pass('Transition safety check complete');
console.log(`\n  ${WARN} REMINDER: Layer 4 only checks state machine logic.`);
console.log(`     React render-cycle timing bugs require manual browser testing.`);
console.log(`     See BROWSER CHECKLIST at the top of this file.`);


// ═══════════════════════════════════════════════════════════════════
// PERSONA COMPLETENESS
// ═══════════════════════════════════════════════════════════════════
console.log('\n══ Persona completeness ══');

const EXPECTED = ['business_user', 'executive', 'pm', 'analyst'];
for (const p of EXPECTED) {
  const hasPersona = !!scenario.personas[p];
  const hasTree    = !!scenario.trees[p];
  const buRequired = scenario.has_business_user || p !== 'business_user';

  if (!hasPersona && p === 'business_user' && !scenario.has_business_user) {
    pass(`business_user: not required for this scenario`);
  } else if (!hasPersona || !hasTree) {
    const fn = buRequired ? p1 : warn;
    fn(`${p}: persona=${hasPersona ? 'yes' : 'NO'}, tree=${hasTree ? 'yes' : 'NO'}`);
  } else {
    const nodeCount    = Object.keys(scenario.trees[p].nodes).length;
    const outcomeCount = Object.keys(scenario.trees[p].outcomes).length;
    const decisionNodes = Object.values(scenario.trees[p].nodes).filter(n => n.decision).length;
    pass(`${p}: ${nodeCount} nodes (${decisionNodes} decisions), ${outcomeCount} outcomes`);
  }
}


// ═══════════════════════════════════════════════════════════════════
// SUMMARY
// ═══════════════════════════════════════════════════════════════════
console.log('\n══ Summary ══');
console.log(`  Scenario:     ${scenario.id} — ${scenario.title}`);
console.log(`  P1 issues:    ${totalP1}  (must fix before pushing)`);
console.log(`  Warnings:     ${totalWarn}  (review before pushing)`);
console.log(`  Script status: ${totalP1 === 0 ? `${PASS} AUTOMATED CHECKS PASS` : `${FAIL} FIX P1 ISSUES BEFORE PUSHING`}`);

if (totalP1 === 0) {
  console.log(`\n  ${WARN} Automated checks passed — complete the BROWSER CHECKLIST before publishing.`);
  console.log(`     Minimum browser tests required:`);
  console.log(`     □ One good-path playthrough per persona (reaches outcome screen)`);
  console.log(`     □ One poor-path playthrough per persona (reaches outcome screen)`);
  console.log(`     □ DevTools console shows zero uncaught errors on every path`);
  console.log(`     □ Continue button works immediately after feedback appears`);
  console.log(`     □ Continue button works after waiting 5+ seconds on feedback screen`);
}

console.log('');
process.exit(totalP1 > 0 ? 1 : 0);
