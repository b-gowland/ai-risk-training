#!/usr/bin/env node
/* global process */
// ═══════════════════════════════════════════════════════════════════
// QA Audit Script — ai-risk-training
// Run before pushing any scenario: node scripts/qa-audit.js <scenario-id>
//
// COVERAGE:
//   Layer 1 — Data integrity    (branch refs, outcome existence)
//   Layer 2 — Path completeness (all personas reach valid outcomes)
//   Layer 2e — Unit Loop        (optional unit field: recall/brief/debrief
//                                structure + flow, backward-compat routing)
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
const runAll = process.argv.includes('--all');
const scenarioId = process.argv.find(a => !a.startsWith('--') && !a.includes('qa-audit') && !a.includes('node')) || 'f2-shadow-ai';

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
// LAYER 0 — Static analysis
// Catches React rule violations that cause browser-only bugs.
// Reads source files directly — no module loading required.
// ═══════════════════════════════════════════════════════════════════
console.log('\n══ Layer 0: Static analysis ══');

import { readFileSync } from 'fs';

const appSrc = readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8');

// Check 1: No hooks before conditional returns in any component
// Find all function components and check their hook/return ordering
const fnPattern = /function\s+(\w+)\s*\([^)]*\)\s*\{/g;
let match;
let hookOrderIssues = 0;

while ((match = fnPattern.exec(appSrc)) !== null) {
  const fnName = match[1];
  const fnStart = match.index + match[0].length;
  // Find the body — scan for matching brace
  let depth = 1;
  let i = fnStart;
  while (i < appSrc.length && depth > 0) {
    if (appSrc[i] === '{') depth++;
    else if (appSrc[i] === '}') depth--;
    i++;
  }
  const fnBody = appSrc.slice(fnStart, i - 1);

  // Find first hook and first return positions
  const hookMatch  = fnBody.match(/\b(useReducer|useEffect|useState|useRef|useMemo|useCallback)\b/);
  const returnMatch = fnBody.match(/\breturn\b/);

  if (hookMatch && returnMatch) {
    const hookPos   = fnBody.indexOf(hookMatch[0]);
    const returnPos = fnBody.indexOf('return');
    if (returnPos < hookPos) {
      p1(`Component "${fnName}" has a return statement before ${hookMatch[1]} — React hooks ordering violation`);
      hookOrderIssues++;
    }
  }
}

if (hookOrderIssues === 0) pass('No hooks-before-return violations found');

// Check 2: scenario variable used inside useEffect must be in scope
// (Simple check: ensure ScenarioPlayer pattern is used, not App with inline hooks)
const appFnMatch = appSrc.match(/export default function App\(\)[\s\S]*?^}/m);
if (appFnMatch) {
  const appBody = appFnMatch[0];
  const hasHooks = /\b(useReducer|useEffect|useState)\b/.test(appBody);
  if (hasHooks) {
    p1('export default App() contains hooks — use ScenarioPlayer pattern (see ARCHITECTURE.md)');
  } else {
    pass('App() is a pure router with no hooks');
  }
}

// Check 3: All scene keys in scenario files exist in App.jsx scenes object
const scenesMatch = appSrc.match(/const scenes = \{([\s\S]*?)\};/);
const definedScenes = new Set();
if (scenesMatch) {
  const sceneEntries = scenesMatch[1].matchAll(/'([\w-]+)'\s*:/g);
  for (const entry of sceneEntries) definedScenes.add(entry[1]);
}

const scenarioSrc = readFileSync(
  new URL(`../src/scenarios/${scenarioId}.js`, import.meta.url), 'utf8'
);
const usedScenes = new Set();
const sceneMatches = scenarioSrc.matchAll(/scene:\s*'([\w-]+)'/g);
for (const m of sceneMatches) usedScenes.add(m[1]);

for (const key of usedScenes) {
  if (!definedScenes.has(key)) {
    p1(`Scene key "${key}" used in scenario but not defined in App.jsx scenes object`);
  }
}
if ([...usedScenes].every(k => definedScenes.has(k))) {
  pass(`All ${usedScenes.size} scene keys are defined in App.jsx`);
}

// Check 4: No component uses props as free variables (must be declared)
// Checks scenario, outcome, node, choice — the most commonly passed props
// This catches the OutcomeScreen scenario bug (F2-RT-002b) and similar
const fnRegex2 = /function (\w+)\(\{([^}]*)\}[^)]*\)/g;
let fnMatch2;
let freeVarIssues = 0;
const TRACKED_PROPS = ['scenario', 'outcome', 'node', 'choice', 'persona'];

while ((fnMatch2 = fnRegex2.exec(appSrc)) !== null) {
  const fnName2 = fnMatch2[1];
  const propsStr = fnMatch2[2];

  const bodyStart = fnMatch2.index + fnMatch2[0].length;
  let depth2 = 0, j2 = bodyStart;
  while (j2 < appSrc.length) {
    if (appSrc[j2] === '{') depth2++;
    else if (appSrc[j2] === '}') { if (--depth2 <= 0) break; }
    j2++;
  }
  const body2 = appSrc.slice(bodyStart, j2);

  for (const propName of TRACKED_PROPS) {
    const inProps = new RegExp(`\\b${propName}\\b`).test(propsStr);
    if (inProps) continue;
    // Check if used as free variable in body (prop.something)
    const usedAsFree = new RegExp(`\\b${propName}[.]`).test(body2);
    // Check it's not a locally defined variable (const/let/var or map/forEach/filter callback param)
    const isLocalVar = new RegExp(`\\b(const|let|var)\\s+${propName}\\b`).test(body2);
    const isCallbackParam = new RegExp(`[.](?:map|forEach|filter|find|reduce|some|every)\\s*\\(\\s*${propName}\\s*[=,)>]`).test(body2);  
    if (usedAsFree && !isLocalVar && !isCallbackParam) {
      p1(`Component "${fnName2}" uses "${propName}." as free variable — must be declared in props`);
      freeVarIssues++;
    }
  }
}
if (freeVarIssues === 0) pass('No free-variable prop references found in components');

pass('Static analysis complete');


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

// Check: kb_url field format
// Must use the correct KB URL pattern: /docs/<domain>/<entry-id>
// Wrong patterns that have caused 404s: missing /docs/, wrong domain slug, wrong entry slug
if (scenario.kb_url) {
  const url = scenario.kb_url;
  const isValid = url.startsWith('https://library.airiskpractice.org/docs/') ||
                  url.startsWith('https://library.airiskpractice.org/');
  if (!isValid) {
    p1(`kb_url does not match expected KB URL pattern: "${url}"`);
  } else if (!url.includes('/docs/')) {
    warn(`kb_url points to KB root, not a specific entry: "${url}" — consider linking to the specific entry`);
  } else {
    // Check domain slug matches scenario domain
    const domainLetter = scenario.risk_ref?.[0]?.toLowerCase();
    const domainMap = {
      a: 'domain-a-technical',
      b: 'domain-b-governance', 
      c: 'domain-c-security',
      d: 'domain-d-data',
      e: 'domain-e-fairness',
      f: 'domain-f-deployment',
      g: 'domain-g-systemic',
    };
    const expectedDomain = domainMap[domainLetter];
    if (expectedDomain && !url.includes(expectedDomain)) {
      p1(`kb_url domain slug may be wrong for ${scenario.risk_ref}. Expected "${expectedDomain}" in URL: "${url}"`);
    } else {
      pass(`kb_url format valid: "${url}"`);
    }
  }
} else {
  p1('kb_url is missing from scenario');
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
// LAYER 2b — Engine contract checks
// Verifies the state machine handles null/undefined gracefully.
// These are the conditions that caused RT-003 and RT-004.
// ═══════════════════════════════════════════════════════════════════
console.log('\n══ Layer 2b: Engine contract checks ══');

// Check 1: createInitialState has no undefined fields
const initState = createInitialState(scenario);
for (const [key, val] of Object.entries(initState)) {
  if (val === undefined) {
    p1(`createInitialState: field "${key}" is undefined — must be null or a value`);
  }
}
pass('All initial state fields are defined (not undefined)');

// Check 2: CONTINUE_FROM_FEEDBACK with null nextNodeId does not crash
try {
  const badState = { ...initState, state: STATES.FEEDBACK, nextNodeId: null };
  const result = reducer(badState, { type: 'CONTINUE_FROM_FEEDBACK' });
  if (result.state !== STATES.OUTCOME && result.state !== STATES.NODE) {
    pass('CONTINUE_FROM_FEEDBACK handles null nextNodeId safely');
  } else {
    warn('CONTINUE_FROM_FEEDBACK advanced state despite null nextNodeId');
  }
} catch(e) {
  p1(`CONTINUE_FROM_FEEDBACK crashes with null nextNodeId: ${e.message}`);
}

// Check 3: resolveNext returns null (not undefined) for missing branches
const fakeNode = { branches: {} };
const resolved = resolveNext(fakeNode, 'nonexistent');
if (resolved === null) pass('resolveNext returns null for missing branch');
else if (resolved === undefined) p1('resolveNext returns undefined — must return null');
else pass(`resolveNext returns fallback: "${resolved}"`);

// Check 4: getCurrentNode with null args returns null not crash
try {
  const r1 = getCurrentNode(scenario, null, 'start');
  const r2 = getCurrentNode(scenario, 'business_user', null);
  if (r1 === null && r2 === null) pass('getCurrentNode handles null args safely');
  else p1('getCurrentNode did not return null for null args');
} catch(e) {
  p1(`getCurrentNode crashes with null args: ${e.message}`);
}

// ═══════════════════════════════════════════════════════════════════
// LAYER 2c — State schema validation
// Catches authoring errors in state_schema / state_changes at build time.
// The runtime ignores unknown keys (crash-safe); this layer is loud.
// Skipped silently when scenario has no state_schema (all existing scenarios).
// ═══════════════════════════════════════════════════════════════════
console.log('\n══ Layer 2c: State schema validation ══');

if (!scenario.state_schema) {
  pass('No state_schema — skipping (all existing scenarios expected)');
  // Simulation assertion: stateVars must remain null on every path.
  for (const personaKey of Object.keys(scenario.personas)) {
    if (!scenario.trees[personaKey]) continue;
    for (const strategy of ['first', 'last']) {
      let st = createInitialState(scenario);
      st = reducer(st, { type: 'SELECT_PERSONA', payload: personaKey });
      st = reducer(st, { type: 'START_SCENARIO' });
      let steps = 0;
      while (st.state !== STATES.OUTCOME && steps < 30) {
        steps++;
        if (st.state === STATES.NODE) {
          const node = getCurrentNode(scenario, st.persona, st.currentNodeId);
          if (!node) break;
          if (!node.decision) {
            const nextId = node.branches.auto;
            if (!nextId) break;
            st = reducer(st, { type: 'AUTO_ADVANCE', payload: { nextNodeId: nextId, node } });
          } else {
            const choices = node.decision.choices;
            const choice  = strategy === 'first' ? choices[0] : choices[choices.length - 1];
            const nextId  = resolveNext(node, choice.id);
            st = reducer(st, { type: 'SELECT_CHOICE', payload: { choice, nextNodeId: nextId, node } });
            st = reducer(st, { type: 'FEEDBACK_LOADED', payload: 'test' });
            st = reducer(st, { type: 'CONTINUE_FROM_FEEDBACK' });
          }
        } else if (st.state === STATES.FEEDBACK) {
          st = reducer(st, { type: 'FEEDBACK_LOADED', payload: 'test' });
          st = reducer(st, { type: 'CONTINUE_FROM_FEEDBACK' });
        }
      }
      if (st.stateVars !== null) {
        p1(`[${personaKey}] ${strategy}-path: stateVars became non-null on a scenario with no state_schema`);
      }
    }
  }
  pass('Backward compat: stateVars stays null on all paths (no state_schema)');
} else {
  // Scenario has state_schema — validate it and all state_changes references.
  const schema = scenario.state_schema;
  const schemaKeys = new Set(Object.keys(schema));

  // Check 1: schema field types
  for (const [varName, def] of Object.entries(schema)) {
    if (typeof def.initial !== 'number') {
      p1(`state_schema["${varName}"].initial must be a number, got ${typeof def.initial}`);
    }
    if (def.min !== undefined && typeof def.min !== 'number') {
      p1(`state_schema["${varName}"].min must be a number, got ${typeof def.min}`);
    }
    if (def.max !== undefined && typeof def.max !== 'number') {
      p1(`state_schema["${varName}"].max must be a number, got ${typeof def.max}`);
    }
    if (def.min !== undefined && def.max !== undefined && def.min > def.max) {
      p1(`state_schema["${varName}"]: min (${def.min}) > max (${def.max})`);
    }
    if (def.initial !== undefined && def.min !== undefined && def.initial < def.min) {
      p1(`state_schema["${varName}"]: initial (${def.initial}) < min (${def.min})`);
    }
    if (def.initial !== undefined && def.max !== undefined && def.initial > def.max) {
      p1(`state_schema["${varName}"]: initial (${def.initial}) > max (${def.max})`);
    }
    if (!['bar', 'number', 'hidden'].includes(def.display)) {
      p1(`state_schema["${varName}"].display must be 'bar'|'number'|'hidden', got "${def.display}"`);
    }
  }
  pass('state_schema field types valid');

  // Check 2: state_changes on every node references valid choice ids and schema keys
  let stateChangesIssues = 0;
  for (const personaKey of Object.keys(scenario.trees)) {
    const nodes = scenario.trees[personaKey]?.nodes || {};
    for (const [nodeId, node] of Object.entries(nodes)) {
      if (!node.state_changes) continue;
      const validChoiceIds = new Set(
        node.decision?.choices.map(c => c.id) || []
      );
      // 'auto' is valid for bridge nodes
      if (node.branches?.auto) validChoiceIds.add('auto');
      for (const [choiceKey, deltas] of Object.entries(node.state_changes)) {
        if (!validChoiceIds.has(choiceKey)) {
          p1(`[${personaKey}] node "${nodeId}" state_changes key "${choiceKey}" is not a valid choice id`);
          stateChangesIssues++;
        }
        for (const varName of Object.keys(deltas)) {
          if (!schemaKeys.has(varName)) {
            p1(`[${personaKey}] node "${nodeId}" state_changes["${choiceKey}"]["${varName}"] — "${varName}" not in state_schema`);
            stateChangesIssues++;
          }
          if (typeof deltas[varName] !== 'number') {
            p1(`[${personaKey}] node "${nodeId}" state_changes["${choiceKey}"]["${varName}"] must be a number delta`);
            stateChangesIssues++;
          }
        }
      }
    }
  }
  if (stateChangesIssues === 0) pass('state_changes keys and variable names are valid');

  // Check 3: simulation — no NaN/undefined, clamping holds on all paths
  for (const personaKey of Object.keys(scenario.personas)) {
    if (!scenario.trees[personaKey]) continue;
    for (const strategy of ['first', 'last']) {
      let st = createInitialState(scenario);
      st = reducer(st, { type: 'SELECT_PERSONA', payload: personaKey });
      st = reducer(st, { type: 'START_SCENARIO' });
      let steps = 0;
      let simOk = true;
      while (st.state !== STATES.OUTCOME && steps < 30) {
        steps++;
        if (st.stateVars) {
          for (const [varName, val] of Object.entries(st.stateVars)) {
            if (typeof val !== 'number' || isNaN(val)) {
              p1(`[${personaKey}] ${strategy}-path step ${steps}: stateVars["${varName}"] = ${val} — not a valid number`);
              simOk = false;
            }
            const def = schema[varName];
            if (def?.min !== undefined && val < def.min) {
              p1(`[${personaKey}] ${strategy}-path step ${steps}: stateVars["${varName}"] = ${val} below min (${def.min}) — clamping failed`);
              simOk = false;
            }
            if (def?.max !== undefined && val > def.max) {
              p1(`[${personaKey}] ${strategy}-path step ${steps}: stateVars["${varName}"] = ${val} above max (${def.max}) — clamping failed`);
              simOk = false;
            }
          }
        }
        if (st.state === STATES.NODE) {
          const node = getCurrentNode(scenario, st.persona, st.currentNodeId);
          if (!node) break;
          if (!node.decision) {
            const nextId = node.branches.auto;
            if (!nextId) break;
            st = reducer(st, { type: 'AUTO_ADVANCE', payload: { nextNodeId: nextId, node } });
          } else {
            const choices = node.decision.choices;
            const choice  = strategy === 'first' ? choices[0] : choices[choices.length - 1];
            const nextId  = resolveNext(node, choice.id);
            st = reducer(st, { type: 'SELECT_CHOICE', payload: { choice, nextNodeId: nextId, node } });
            st = reducer(st, { type: 'FEEDBACK_LOADED', payload: 'test' });
            st = reducer(st, { type: 'CONTINUE_FROM_FEEDBACK' });
          }
        } else if (st.state === STATES.FEEDBACK) {
          st = reducer(st, { type: 'FEEDBACK_LOADED', payload: 'test' });
          st = reducer(st, { type: 'CONTINUE_FROM_FEEDBACK' });
        }
      }
      if (simOk) pass(`[${personaKey}] ${strategy}-path: stateVars valid and clamped throughout`);
    }
  }
}



// ═══════════════════════════════════════════════════════════════════
// LAYER 2e — Unit Loop validation
// Validates the optional `unit` field (Recall/Brief/Debrief beats) when
// present, and proves backward-compatible routing when absent.
// Skipped-with-pass for all scenarios without a unit (all existing).
// ═══════════════════════════════════════════════════════════════════
console.log('\n══ Layer 2e: Unit Loop validation ══');

const RECALL_NOTE_MIN_WORDS = 8;
const RECALL_ITEMS_SOFT_MAX = 5;   // ~2–3 minute beat budget
const BRIEF_SECTIONS_SOFT_MAX = 5; // coherence principle — lean teach layer

if (!scenario.unit) {
  pass('No unit — skipping (all existing scenarios expected)');
  // Backward-compat proof: SELECT_PERSONA must land on PREMISE, with unit
  // flags all false and recallAnswers empty. Runs on every scenario in CI.
  let bcState = createInitialState(scenario);
  const flags = bcState.unitFlags || {};
  if (flags.hasRecall || flags.hasBrief || flags.hasDebrief) {
    p1('unitFlags not all false on a scenario with no unit');
  }
  if (!Array.isArray(bcState.recallAnswers) || bcState.recallAnswers.length !== 0) {
    p1('recallAnswers not initialised to an empty array');
  }
  bcState = reducer(bcState, { type: 'SELECT_PERSONA', payload: Object.keys(scenario.personas)[0] });
  if (bcState.state !== STATES.PREMISE) {
    p1(`SELECT_PERSONA routed to "${bcState.state}" instead of PREMISE on a scenario with no unit`);
  } else {
    pass('Backward compat: SELECT_PERSONA routes to PREMISE (no unit)');
  }
} else {
  const unit = scenario.unit;
  let unitIssues = 0;

  if (!unit.recall && !unit.brief && !unit.debrief) {
    p1('unit is present but has none of recall/brief/debrief');
    unitIssues++;
  }

  // ── recall ──
  if (unit.recall) {
    const items = unit.recall.items;
    if (!Array.isArray(items) || items.length === 0) {
      p1('unit.recall.items must be a non-empty array');
      unitIssues++;
    } else {
      if (items.length > RECALL_ITEMS_SOFT_MAX) {
        warn(`unit.recall has ${items.length} items — beat budget is ~2–3 min (soft max ${RECALL_ITEMS_SOFT_MAX})`);
      }
      const seenItemIds = new Set();
      for (const item of items) {
        const ref = `unit.recall item "${item.id || '?'}"`;
        if (!item.id || typeof item.id !== 'string') { p1(`${ref} — missing string id`); unitIssues++; }
        else if (seenItemIds.has(item.id)) { p1(`${ref} — duplicate item id`); unitIssues++; }
        else seenItemIds.add(item.id);
        if (!item.prompt || typeof item.prompt !== 'string') { p1(`${ref} — missing prompt`); unitIssues++; }
        else if (!item.prompt.includes('?')) warn(`${ref} — prompt is not a question`);
        const choices = item.choices;
        if (!Array.isArray(choices) || choices.length < 2) {
          p1(`${ref} — needs at least 2 choices`); unitIssues++;
          continue;
        }
        if (choices.length > 4) warn(`${ref} — ${choices.length} choices (max 4 recommended)`);
        const seenChoiceIds = new Set();
        let hasGood = false;
        for (const choice of choices) {
          const cref = `${ref} choice "${choice.id || '?'}"`;
          if (!choice.id) { p1(`${cref} — missing id`); unitIssues++; }
          else if (seenChoiceIds.has(choice.id)) { p1(`${cref} — duplicate choice id`); unitIssues++; }
          else seenChoiceIds.add(choice.id);
          if (!choice.label || !String(choice.label).trim()) { p1(`${cref} — empty label`); unitIssues++; }
          if (!['good', 'partial', 'poor'].includes(choice.quality)) {
            p1(`${cref} — invalid quality: "${choice.quality}"`); unitIssues++;
          }
          if (choice.quality === 'good') hasGood = true;
          const noteWords = (choice.note || '').split(/\s+/).filter(Boolean).length;
          if (noteWords < RECALL_NOTE_MIN_WORDS) {
            p1(`${cref} — note too short (${noteWords}w, min ${RECALL_NOTE_MIN_WORDS})`); unitIssues++;
          }
        }
        if (!hasGood) warn(`${ref} — no 'good' choice available`);
      }
    }
  }

  // ── brief ──
  if (unit.brief) {
    const sections = unit.brief.sections;
    if (!Array.isArray(sections) || sections.length === 0) {
      p1('unit.brief.sections must be a non-empty array');
      unitIssues++;
    } else {
      if (sections.length > BRIEF_SECTIONS_SOFT_MAX) {
        warn(`unit.brief has ${sections.length} sections — lean teach layer (soft max ${BRIEF_SECTIONS_SOFT_MAX})`);
      }
      sections.forEach((s, i) => {
        if (!s.heading || !String(s.heading).trim()) { p1(`unit.brief.sections[${i}] — missing heading`); unitIssues++; }
        if (!s.body || !String(s.body).trim()) { p1(`unit.brief.sections[${i}] — missing body`); unitIssues++; }
      });
    }
    if (unit.brief.kb_url && !String(unit.brief.kb_url).startsWith('https://library.airiskpractice.org/')) {
      warn(`unit.brief.kb_url does not point at the knowledge base: "${unit.brief.kb_url}"`);
    }
  }

  // ── debrief ──
  if (unit.debrief) {
    const d = unit.debrief;
    if (!d.reflection_prompt && !d.transfer_prompt && !d.expert_reasoning) {
      p1('unit.debrief has none of reflection_prompt/transfer_prompt/expert_reasoning');
      unitIssues++;
    }
    for (const field of ['reflection_prompt', 'transfer_prompt']) {
      if (d[field] !== undefined && (typeof d[field] !== 'string' || !d[field].trim())) {
        p1(`unit.debrief.${field} must be a non-empty string when present`); unitIssues++;
      }
    }
    if (d.expert_reasoning) {
      for (const [personaKey, byOutcome] of Object.entries(d.expert_reasoning)) {
        if (!scenario.trees[personaKey]) {
          p1(`unit.debrief.expert_reasoning["${personaKey}"] — persona has no tree in this scenario`);
          unitIssues++;
          continue;
        }
        const treeOutcomes = scenario.trees[personaKey].outcomes;
        for (const [outcomeId, text] of Object.entries(byOutcome)) {
          if (!treeOutcomes[outcomeId]) {
            p1(`unit.debrief.expert_reasoning["${personaKey}"]["${outcomeId}"] — outcome does not exist in that tree`);
            unitIssues++;
          }
          if (typeof text !== 'string' || !text.trim()) {
            p1(`unit.debrief.expert_reasoning["${personaKey}"]["${outcomeId}"] — must be a non-empty string`);
            unitIssues++;
          }
        }
        // Coverage advisory — the debrief renders without an expert block,
        // but authored coverage is the point of the beat.
        const missing = Object.keys(treeOutcomes).filter(id => !byOutcome[id]);
        if (missing.length > 0) {
          warn(`unit.debrief.expert_reasoning["${personaKey}"] — no reasoning for: ${missing.join(', ')}`);
        }
      }
    }
  }

  if (unitIssues === 0) pass('unit structure valid');

  // ── Flow simulation through the real reducer ──
  const firstPersona = Object.keys(scenario.personas).find(p => scenario.trees[p]);
  if (firstPersona) {
    let st = createInitialState(scenario);
    st = reducer(st, { type: 'SELECT_PERSONA', payload: firstPersona });
    const expectedEntry = unit.recall ? STATES.RECALL : unit.brief ? STATES.BRIEF : STATES.PREMISE;
    if (st.state !== expectedEntry) {
      p1(`SELECT_PERSONA routed to "${st.state}" — expected "${expectedEntry}"`);
    } else {
      pass(`SELECT_PERSONA routes to ${expectedEntry.toUpperCase()}`);
    }
    if (unit.recall && Array.isArray(unit.recall.items)) {
      for (const item of unit.recall.items) {
        const choice = item.choices?.[0];
        if (!choice) continue;
        st = reducer(st, { type: 'ANSWER_RECALL', payload: { itemId: item.id, choiceId: choice.id, quality: choice.quality } });
        // Idempotence: a duplicate answer must not record twice.
        st = reducer(st, { type: 'ANSWER_RECALL', payload: { itemId: item.id, choiceId: choice.id, quality: choice.quality } });
      }
      if (st.recallAnswers.length !== unit.recall.items.length) {
        p1(`recallAnswers recorded ${st.recallAnswers.length} answers for ${unit.recall.items.length} items (duplicate guard or recording broken)`);
      } else {
        pass('Recall answers recorded once per item (duplicate-answer guard holds)');
      }
      st = reducer(st, { type: 'CONTINUE_FROM_RECALL' });
      const afterRecall = unit.brief ? STATES.BRIEF : STATES.PREMISE;
      if (st.state !== afterRecall) {
        p1(`CONTINUE_FROM_RECALL routed to "${st.state}" — expected "${afterRecall}"`);
      }
    }
    if (unit.brief && st.state === STATES.BRIEF) {
      st = reducer(st, { type: 'CONTINUE_FROM_BRIEF' });
      if (st.state !== STATES.PREMISE) {
        p1(`CONTINUE_FROM_BRIEF routed to "${st.state}" — expected PREMISE`);
      }
    }
    if (st.state === STATES.PREMISE) {
      pass('Unit beats reach PREMISE; Decide flow unchanged from here');
    }
    if (unit.debrief) {
      // Walk a first-choice path to an outcome, then prove SHOW_DEBRIEF works
      // and preserves the recall record.
      const answersBefore = st.recallAnswers.length;
      st = reducer(st, { type: 'START_SCENARIO' });
      let steps = 0;
      while (st.state !== STATES.OUTCOME && steps < 30) {
        steps++;
        if (st.state === STATES.NODE) {
          const node = getCurrentNode(scenario, st.persona, st.currentNodeId);
          if (!node) break;
          if (!node.decision) {
            st = reducer(st, { type: 'AUTO_ADVANCE', payload: { nextNodeId: node.branches.auto, node } });
          } else {
            const choice = node.decision.choices[0];
            st = reducer(st, { type: 'SELECT_CHOICE', payload: { choice, nextNodeId: resolveNext(node, choice.id), node } });
            st = reducer(st, { type: 'FEEDBACK_LOADED', payload: 'test' });
            st = reducer(st, { type: 'CONTINUE_FROM_FEEDBACK' });
          }
        } else if (st.state === STATES.FEEDBACK) {
          st = reducer(st, { type: 'FEEDBACK_LOADED', payload: 'test' });
          st = reducer(st, { type: 'CONTINUE_FROM_FEEDBACK' });
        }
      }
      if (st.state === STATES.OUTCOME) {
        st = reducer(st, { type: 'SHOW_DEBRIEF' });
        if (st.state !== STATES.DEBRIEF) {
          p1(`SHOW_DEBRIEF from OUTCOME routed to "${st.state}" — expected DEBRIEF`);
        } else if (st.recallAnswers.length !== answersBefore) {
          p1('recallAnswers changed during the Decide walk — record must persist to the debrief');
        } else {
          pass('SHOW_DEBRIEF reaches DEBRIEF with the recall record intact');
        }
      } else {
        warn('Could not reach an outcome on the first-choice path to test SHOW_DEBRIEF');
      }
    }
  }
}


// ═══════════════════════════════════════════════════════════════════
// LAYER 2d — Minimum decision depth
// Every reachable outcome must require at least 3 decisions to reach.
// Uses BFS to find the shortest path to each outcome for each persona.
// Run for the current scenario, or all 32 with --all flag.
// P1 (fail): any outcome reachable in < 3 decisions.
// WARN:      any outcome reachable in exactly 3 decisions (borderline).
// ═══════════════════════════════════════════════════════════════════
console.log('\n══ Layer 2d: Minimum decision depth ══');

// BFS: returns the minimum number of decisions needed to reach each outcome
function minDecisionsToOutcomes(tree) {
  // State: { nodeId, decisionCount }
  const queue = [{ nodeId: 'start', decisionCount: 0 }];
  const visited = new Map(); // nodeId → min decisions seen
  const outcomeDepths = {}; // outcomeId → min decisions

  while (queue.length > 0) {
    const { nodeId, decisionCount } = queue.shift();

    // Skip if we've already visited this node with fewer or equal decisions
    if (visited.has(nodeId) && visited.get(nodeId) <= decisionCount) continue;
    visited.set(nodeId, decisionCount);

    const node = tree.nodes[nodeId];
    if (!node) continue;

    const branches = node.branches || {};

    if (node.decision) {
      // Decision node: each choice costs 1 decision
      for (const target of Object.values(branches)) {
        if (target.startsWith('outcome_')) {
          const prev = outcomeDepths[target];
          if (prev === undefined || decisionCount + 1 < prev) {
            outcomeDepths[target] = decisionCount + 1;
          }
        } else {
          queue.push({ nodeId: target, decisionCount: decisionCount + 1 });
        }
      }
    } else {
      // Auto-advance node: free (no decision cost)
      const target = branches.auto;
      if (!target) continue;
      if (target.startsWith('outcome_')) {
        const prev = outcomeDepths[target];
        if (prev === undefined || decisionCount < prev) {
          outcomeDepths[target] = decisionCount;
        }
      } else {
        queue.push({ nodeId: target, decisionCount });
      }
    }
  }

  return outcomeDepths;
}

function auditDepthForScenario(s, label) {
  let depthP1 = 0;
  let depthWarn = 0;
  for (const [personaKey, tree] of Object.entries(s.trees)) {
    const depths = minDecisionsToOutcomes(tree);
    for (const [outcomeId, minDecisions] of Object.entries(depths)) {
      const ref = `${label}[${personaKey}] ${outcomeId}`;
      if (minDecisions < 3) {
        p1(`${ref} — reachable in ${minDecisions} decision(s) — minimum is 3`);
        depthP1++;
      } else if (minDecisions === 3) {
        warn(`${ref} — reachable in exactly 3 decisions (borderline — consider extending)`);
        depthWarn++;
      } else {
        pass(`${ref} — min depth ${minDecisions} decisions ✓`);
      }
    }
  }
  return { depthP1, depthWarn };
}

if (runAll) {
  console.log('  Running depth audit across ALL scenarios...\n');
  const { scenarios: allScenarios } = await import('../src/scenarios/index.js');
  let totalDepthP1 = 0;
  let totalDepthWarn = 0;
  const thinScenarios = [];

  for (const s of allScenarios) {
    if (s.stub) continue;
    const { depthP1, depthWarn } = auditDepthForScenario(s, `${s.id} `);
    if (depthP1 > 0) thinScenarios.push({ id: s.id, title: s.title, depthP1 });
    totalDepthP1 += depthP1;
    totalDepthWarn += depthWarn;
  }

  console.log('\n  ── Depth audit summary ──');
  if (thinScenarios.length === 0) {
    pass('All scenarios meet minimum depth of 3 decisions per outcome path');
  } else {
    console.log(`  ${FAIL} ${thinScenarios.length} scenario(s) have thin paths (< 3 decisions):`);
    for (const { id, title, depthP1: n } of thinScenarios) {
      console.log(`     • ${id} — ${title} (${n} thin path(s))`);
    }
  }
  console.log(`  Total thin paths (P1): ${totalDepthP1}`);
  console.log(`  Total borderline paths (warn): ${totalDepthWarn}`);
} else {
  // Single scenario mode
  auditDepthForScenario(scenario, '');
  pass('Depth check complete for this scenario. Run with --all to audit all 32.');
}


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

// Check: useEffect dependency arrays
// Feedback effect must NOT depend on both state.state and state.feedbackLoading
// (double-fire risk — RT-004)
const appSrc2 = readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8');
const effectDeps = [...appSrc2.matchAll(/\}, \[([^\]]+)\]\);/g)].map(m => m[1]);
for (const dep of effectDeps) {
  if (dep.includes('state.state') && dep.includes('state.feedbackLoading')) {
    p1('useEffect depends on both state.state AND state.feedbackLoading — double-fire risk (RT-004)');
  }
}
pass('useEffect dependency arrays checked for double-fire risk');

pass('Transition safety check complete');
console.log(`\n  ${WARN} REMINDER: Layer 4 only checks state machine logic.`);
console.log(`     React render-cycle timing bugs require manual browser testing.`);
console.log(`     See BROWSER CHECKLIST at the top of this file.`);


// ═══════════════════════════════════════════════════════════════════
// PERSONA COMPLETENESS
// ═══════════════════════════════════════════════════════════════════
console.log('\n══ Persona completeness ══');

const EXPECTED = ['business_user', 'executive', 'pm', 'analyst'];

// Declared-persona consistency — applies to every scenario shape.
// Any persona declared without a tree (or tree without a persona) is P1.
for (const p of Object.keys(scenario.personas)) {
  if (!scenario.trees[p]) p1(`${p}: persona declared but has no tree`);
}
for (const p of Object.keys(scenario.trees)) {
  if (!scenario.personas[p]) p1(`${p}: tree present but persona not declared`);
}

// Corpus-shape completeness. Multi-persona scenarios (the 32-scenario open
// corpus) must carry the full standard persona set. A scenario that declares
// exactly one persona is the role-track unit shape (role differentiation
// happens at the unit level — see UnitLoop README) and is exempt from the
// full-set requirement; its declared persona is still fully validated above
// and throughout Layers 1–3.
const declaredCount = Object.keys(scenario.personas).length;
const singlePersona = declaredCount === 1;
if (singlePersona) {
  pass(`single-persona scenario (role-track unit shape) — full persona set not required`);
}
for (const p of EXPECTED) {
  const hasPersona = !!scenario.personas[p];
  const hasTree    = !!scenario.trees[p];
  const buRequired = scenario.has_business_user || p !== 'business_user';

  if (!hasPersona && p === 'business_user' && !scenario.has_business_user) {
    pass(`business_user: not required for this scenario`);
  } else if (singlePersona && !hasPersona) {
    continue; // role-track shape — absence of the standard set is expected
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
