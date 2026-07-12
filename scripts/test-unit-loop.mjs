/* global process */
// Node test for the Unit Loop engine extension (narrativeEngine.js).
// Run: node scripts/test-unit-loop.mjs   (or: npm run test:unit-loop)
//
// Proves, through the real reducer:
//   1. Backward compat — a real corpus scenario (no unit) routes
//      SELECT_PERSONA → PREMISE with unitFlags all false.
//   2. Full-loop fixture — RECALL → BRIEF → PREMISE → NODE → OUTCOME →
//      DEBRIEF, with recall answers recorded once per item and preserved.
//   3. Partial-beat fixtures — recall-only and brief-only routing.
//   4. Reset behaviour — RESTART/CHANGE_PERSONA clear recallAnswers and
//      recompute flags via createInitialState.
//   5. Guards — SHOW_DEBRIEF is a no-op without a debrief or outside OUTCOME;
//      duplicate/malformed ANSWER_RECALL payloads are ignored.

import {
  STATES, createInitialState, reducer, resolveNext, getCurrentNode,
} from '../src/engine/narrativeEngine.js';
import { scenario as realScenario } from '../src/scenarios/f2-shadow-ai.js';

let failures = 0;
const assert = (cond, msg) => {
  if (!cond) { failures++; console.error('FAIL:', msg); }
};

// ── Inline fixtures (engine-behaviour only — never registered in the app,
//    never run through the content audit) ────────────────────────────────
const miniTree = {
  nodes: {
    start: {
      scene: 'desk-review',
      caption: `A fixture node that advances the story.`,
      decision: {
        prompt: `Fixture decision?`,
        choices: [
          { id: 'a', label: `Do the careful thing.`, quality: 'good', note: `This is the fixture's good path note text.` },
          { id: 'b', label: `Do the rushed thing.`, quality: 'poor', note: `This is the fixture's poor path note text.` },
        ],
      },
      branches: { a: 'outcome_ok', b: 'outcome_ok' },
    },
  },
  outcomes: {
    outcome_ok: {
      heading: `Fixture ending.`, tone: 'good',
      result: `Fixture result.`, learning: `Fixture learning.`, score: 100,
    },
  },
};

const fullUnitScenario = {
  id: 'unit-loop-test-fixture',
  personas: { business_user: { label: 'Fixture', role: 'Fixture', character: 'Fixture' } },
  trees: { business_user: miniTree },
  unit: {
    recall: {
      intro: `Last unit you made a call under pressure.`,
      items: [
        {
          id: 'r1', prompt: `Fixture recall one?`,
          choices: [
            { id: 'a', label: `Right recall.`, quality: 'good', note: `Fixture note.` },
            { id: 'b', label: `Wrong recall.`, quality: 'poor', note: `Fixture note.` },
          ],
        },
        {
          id: 'r2', prompt: `Fixture recall two?`,
          choices: [
            { id: 'a', label: `Right recall.`, quality: 'good', note: `Fixture note.` },
            { id: 'b', label: `Wrong recall.`, quality: 'partial', note: `Fixture note.` },
          ],
        },
      ],
    },
    brief: {
      heading: `Fixture brief.`,
      sections: [{ heading: `One`, body: `Fixture section body.` }],
    },
    debrief: {
      reflection_prompt: `Fixture reflection?`,
      transfer_prompt: `Fixture transfer.`,
      expert_reasoning: { business_user: { outcome_ok: `Fixture expert reasoning.` } },
    },
  },
};

const recallOnlyScenario = {
  ...fullUnitScenario, id: 'recall-only-fixture',
  unit: { recall: fullUnitScenario.unit.recall },
};
const briefOnlyScenario = {
  ...fullUnitScenario, id: 'brief-only-fixture',
  unit: { brief: fullUnitScenario.unit.brief },
};

// ── 1. Backward compat on a real corpus scenario ────────────────────────
{
  let st = createInitialState(realScenario);
  assert(st.unitFlags.hasRecall === false && st.unitFlags.hasBrief === false && st.unitFlags.hasDebrief === false,
    'real scenario: unitFlags all false');
  assert(Array.isArray(st.recallAnswers) && st.recallAnswers.length === 0,
    'real scenario: recallAnswers initialised empty');
  for (const [key, val] of Object.entries(st)) {
    assert(val !== undefined, `real scenario: initial state field "${key}" must not be undefined`);
  }
  st = reducer(st, { type: 'SELECT_PERSONA', payload: 'business_user' });
  assert(st.state === STATES.PREMISE, 'real scenario: SELECT_PERSONA → PREMISE');
  // SHOW_DEBRIEF must be a no-op on a scenario with no debrief, even at OUTCOME.
  const atOutcome = { ...st, state: STATES.OUTCOME, outcomeId: 'outcome_x' };
  assert(reducer(atOutcome, { type: 'SHOW_DEBRIEF' }).state === STATES.OUTCOME,
    'real scenario: SHOW_DEBRIEF is a no-op without a debrief');
}

// ── 2. Full loop through the real reducer ───────────────────────────────
{
  let st = createInitialState(fullUnitScenario);
  assert(st.unitFlags.hasRecall && st.unitFlags.hasBrief && st.unitFlags.hasDebrief,
    'fixture: all unit flags true');
  st = reducer(st, { type: 'SELECT_PERSONA', payload: 'business_user' });
  assert(st.state === STATES.RECALL, 'fixture: SELECT_PERSONA → RECALL');

  // Answer both items; duplicates and malformed payloads must be ignored.
  st = reducer(st, { type: 'ANSWER_RECALL', payload: { itemId: 'r1', choiceId: 'a', quality: 'good' } });
  st = reducer(st, { type: 'ANSWER_RECALL', payload: { itemId: 'r1', choiceId: 'b', quality: 'poor' } }); // dup item
  st = reducer(st, { type: 'ANSWER_RECALL', payload: { choiceId: 'a', quality: 'good' } });               // no itemId
  st = reducer(st, { type: 'ANSWER_RECALL' });                                                            // no payload
  st = reducer(st, { type: 'ANSWER_RECALL', payload: { itemId: 'r2', choiceId: 'b', quality: 'partial' } });
  assert(st.recallAnswers.length === 2, 'fixture: exactly 2 recall answers recorded');
  assert(st.recallAnswers[0].choiceId === 'a', 'fixture: duplicate answer did not overwrite the first');

  st = reducer(st, { type: 'CONTINUE_FROM_RECALL' });
  assert(st.state === STATES.BRIEF, 'fixture: CONTINUE_FROM_RECALL → BRIEF');
  st = reducer(st, { type: 'CONTINUE_FROM_BRIEF' });
  assert(st.state === STATES.PREMISE, 'fixture: CONTINUE_FROM_BRIEF → PREMISE');

  // SHOW_DEBRIEF must be a no-op before an outcome is reached.
  assert(reducer(st, { type: 'SHOW_DEBRIEF' }).state === STATES.PREMISE,
    'fixture: SHOW_DEBRIEF is a no-op outside OUTCOME');

  // Decide beat — unchanged engine flow.
  st = reducer(st, { type: 'START_SCENARIO' });
  assert(st.state === STATES.NODE, 'fixture: START_SCENARIO → NODE');
  const node = getCurrentNode(fullUnitScenario, st.persona, st.currentNodeId);
  const choice = node.decision.choices[0];
  st = reducer(st, { type: 'SELECT_CHOICE', payload: { choice, nextNodeId: resolveNext(node, choice.id), node } });
  st = reducer(st, { type: 'FEEDBACK_LOADED', payload: 'test' });
  st = reducer(st, { type: 'CONTINUE_FROM_FEEDBACK' });
  assert(st.state === STATES.OUTCOME && st.outcomeId === 'outcome_ok', 'fixture: Decide beat reaches OUTCOME');
  assert(st.recallAnswers.length === 2, 'fixture: recall record persists through the Decide beat');

  st = reducer(st, { type: 'SHOW_DEBRIEF' });
  assert(st.state === STATES.DEBRIEF, 'fixture: SHOW_DEBRIEF → DEBRIEF from OUTCOME');
  assert(st.outcomeId === 'outcome_ok', 'fixture: outcomeId preserved into DEBRIEF');

  // 4. Resets.
  const restarted = reducer(st, { type: 'RESTART', payload: fullUnitScenario });
  assert(restarted.recallAnswers.length === 0, 'fixture: RESTART clears recallAnswers');
  assert(restarted.unitFlags.hasRecall, 'fixture: RESTART recomputes unitFlags');
  const changed = reducer(st, { type: 'CHANGE_PERSONA', payload: fullUnitScenario });
  assert(changed.state === STATES.PERSONA_SELECT && changed.recallAnswers.length === 0,
    'fixture: CHANGE_PERSONA resets to PERSONA_SELECT with cleared answers');
  const rerun = reducer(restarted, { type: 'SELECT_PERSONA', payload: 'business_user' });
  assert(rerun.state === STATES.RECALL && rerun.recallAnswers.length === 0,
    'fixture: replay re-enters RECALL with a fresh answer record');
}

// ── 3. Partial-beat routing ──────────────────────────────────────────────
{
  let st = createInitialState(recallOnlyScenario);
  st = reducer(st, { type: 'SELECT_PERSONA', payload: 'business_user' });
  assert(st.state === STATES.RECALL, 'recall-only: SELECT_PERSONA → RECALL');
  st = reducer(st, { type: 'CONTINUE_FROM_RECALL' });
  assert(st.state === STATES.PREMISE, 'recall-only: CONTINUE_FROM_RECALL skips BRIEF → PREMISE');
}
{
  let st = createInitialState(briefOnlyScenario);
  st = reducer(st, { type: 'SELECT_PERSONA', payload: 'business_user' });
  assert(st.state === STATES.BRIEF, 'brief-only: SELECT_PERSONA → BRIEF');
  st = reducer(st, { type: 'CONTINUE_FROM_BRIEF' });
  assert(st.state === STATES.PREMISE, 'brief-only: CONTINUE_FROM_BRIEF → PREMISE');
}

console.log(failures === 0 ? 'PASS — Unit Loop engine flows correct' : `${failures} failure(s)`);
process.exit(failures === 0 ? 0 : 1);
