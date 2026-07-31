// Engine — the four-beat state machine.
// Pure reducer tests. These are the cheapest checks in the project and they
// cover the transitions that a build cannot catch.

import { describe, it, expect } from 'vitest';
import { STATES, reducer, createInitialState, getNext, getRevealedChoice } from '../engine/narrativeEngine.js';
import { scenario as f2 } from '../scenarios/f2-shadow-ai.js';

const start = () => reducer(createInitialState(f2), { type: 'BEGIN' });
const choiceOf = (state, id) => f2.nodes[state.nodeId].decision.choices.find((c) => c.id === id);

describe('createInitialState', () => {
  it('opens on Setup, not on a decision', () => {
    expect(createInitialState(f2).phase).toBe(STATES.SETUP);
  });
  it('has no persona key — the identity gate is gone', () => {
    expect(createInitialState(f2)).not.toHaveProperty('persona');
  });
});

describe('COMMIT', () => {
  it('reveals in place without changing node', () => {
    const s = start();
    const next = reducer(s, { type: 'COMMIT', payload: { nodeId: s.nodeId, choice: choiceOf(s, 'a') } });
    expect(next.nodeId).toBe(s.nodeId);
    expect(next.revealed).toBe('a');
    expect(next.phase).toBe(STATES.DECISION);
  });

  it('is irreversible — a second commit on the same node is ignored', () => {
    const s = start();
    const once = reducer(s, { type: 'COMMIT', payload: { nodeId: s.nodeId, choice: choiceOf(s, 'a') } });
    const twice = reducer(once, { type: 'COMMIT', payload: { nodeId: once.nodeId, choice: choiceOf(once, 'd') } });
    expect(twice.revealed).toBe('a');
    expect(twice.path).toHaveLength(1);
  });

  it('records the choice on the path', () => {
    const s = start();
    const next = reducer(s, { type: 'COMMIT', payload: { nodeId: s.nodeId, choice: choiceOf(s, 'c') } });
    expect(next.path[0]).toMatchObject({ nodeId: 'start', choiceId: 'c', quality: 'good' });
  });
});

describe('ADVANCE', () => {
  it('does nothing before a commit — you cannot skip past a consequence', () => {
    const s = start();
    expect(reducer(s, { type: 'ADVANCE', payload: { next: 'n2_output' } })).toBe(s);
  });

  it('moves to the branch target and clears the reveal', () => {
    let s = start();
    s = reducer(s, { type: 'COMMIT', payload: { nodeId: s.nodeId, choice: choiceOf(s, 'a') } });
    s = reducer(s, { type: 'ADVANCE', payload: { next: getNext(f2, s) } });
    expect(s.nodeId).toBe('n2_output');
    expect(s.revealed).toBeNull();
  });

  it('routes an outcome_ target to Debrief, not to a node', () => {
    // Walk the first choice at every node until an outcome is reached.
    // Hardcoding a route here breaks every time a tree is re-authored,
    // which is the wrong thing for this assertion to be sensitive to.
    let s = start();
    for (let i = 0; i < 20 && s.phase !== STATES.DEBRIEF; i++) {
      s = reducer(s, { type: 'COMMIT', payload: { nodeId: s.nodeId, choice: choiceOf(s, 'a') } });
      s = reducer(s, { type: 'ADVANCE', payload: { next: getNext(f2, s) } });
    }
    expect(s.phase).toBe(STATES.DEBRIEF);
    expect(f2.outcomes[s.outcomeId]).toBeTruthy();
  });
});

describe('close', () => {
  it('records a recall skip as a value, not as an absence', () => {
    const s = reducer(start(), { type: 'ANSWER_RECALL', payload: { choiceId: 'skipped' } });
    expect(s.recallAnswer).toBe('skipped');
  });
  it('REPLAY clears the path and re-enters at the first decision', () => {
    let s = start();
    s = reducer(s, { type: 'COMMIT', payload: { nodeId: s.nodeId, choice: choiceOf(s, 'a') } });
    s = reducer(s, { type: 'REPLAY', payload: { scenario: f2 } });
    expect(s.path).toHaveLength(0);
    expect(s.phase).toBe(STATES.DECISION);
    expect(s.nodeId).toBe('start');
  });
});

describe('selectors', () => {
  it('getRevealedChoice returns null with nothing revealed', () => {
    expect(getRevealedChoice(f2, start())).toBeNull();
  });
});

// Every path through every registered scenario terminates in an outcome.
// The audit checks this statically; this walks it through the real reducer.
describe('exhaustive walk', () => {
  it('every branch of f2 terminates in a Debrief', () => {
    const seen = new Set();
    const walk = (state, depth) => {
      expect(depth).toBeLessThan(40);
      if (state.phase === STATES.DEBRIEF) { seen.add(state.outcomeId); return; }
      const node = f2.nodes[state.nodeId];
      for (const c of node.decision.choices) {
        let s = reducer(state, { type: 'COMMIT', payload: { nodeId: state.nodeId, choice: c } });
        s = reducer(s, { type: 'ADVANCE', payload: { next: getNext(f2, s) } });
        walk(s, depth + 1);
      }
    };
    walk(start(), 0);
    expect([...seen].sort()).toEqual(Object.keys(f2.outcomes).sort());
  });
});
