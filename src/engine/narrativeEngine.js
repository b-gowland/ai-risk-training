// ─────────────────────────────────────────────────────────────────────────
// narrativeEngine.js — the four-beat state machine.
//
//   SETUP → DECISION → DEBRIEF → CLOSE
//
// Per FREE_PRODUCT.md §4. What changed from the persona-era engine:
//   - No PERSONA_SELECT. The scenario names one standing; the player is
//     not asked who they are before they are shown anything (§4.1).
//   - No FEEDBACK state. Consequence is returned in place, at the node,
//     as narrative (§4.4). The screen does not change to deliver a verdict.
//   - No BRIEF. Teach-before-decide is a commercial beat, not a free one.
//   - OUTCOME folded into DEBRIEF. The reached ending is the debrief's
//     first movement, not a separate screen (§4.5).
//   - RECALL moved to CLOSE, after the reasoning, where retrieval has
//     something to retrieve.
//
// `score` is still computed. It routes outcomes and nothing else — it is
// never rendered (§4.6).
// ─────────────────────────────────────────────────────────────────────────

export const STATES = {
  SETUP:    'setup',
  DECISION: 'decision',
  DEBRIEF:  'debrief',
  CLOSE:    'close',
};

export function createInitialState(scenario) {
  return {
    phase: STATES.SETUP,
    nodeId: scenario?.entry || 'start',
    // Each entry: { nodeId, choiceId, quality, label }
    path: [],
    // Set once a choice is committed on the current node and cleared on
    // advance. Its presence is what makes the consequence visible in place.
    revealed: null,
    outcomeId: null,
    recallAnswer: null,
    actChoice: null,
    startedAt: null,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case 'BEGIN':
      return {
        ...state,
        phase: STATES.DECISION,
        startedAt: Date.now(),
      };

    // Commit a choice. This does NOT advance — it reveals what followed.
    // Committing is irreversible by design (§4.4): there is no back button
    // between the choice and its consequence.
    case 'COMMIT': {
      const { nodeId, choice } = action.payload;
      if (state.revealed) return state;
      return {
        ...state,
        revealed: choice.id,
        path: [
          ...state.path,
          { nodeId, choiceId: choice.id, quality: choice.quality, label: choice.label },
        ],
      };
    }

    // Move on from a revealed consequence to whatever it led to.
    case 'ADVANCE': {
      const { next } = action.payload;
      if (!state.revealed) return state;
      if (typeof next === 'string' && next.startsWith('outcome_')) {
        return { ...state, phase: STATES.DEBRIEF, outcomeId: next, revealed: null };
      }
      return { ...state, nodeId: next, revealed: null };
    }

    case 'TO_CLOSE':
      return { ...state, phase: STATES.CLOSE };

    case 'ANSWER_RECALL':
      return { ...state, recallAnswer: action.payload.choiceId };

    case 'CHOOSE_ACT':
      return { ...state, actChoice: action.payload.actId };

    case 'REPLAY':
      return { ...createInitialState(action.payload.scenario), phase: STATES.DECISION, startedAt: Date.now() };

    default:
      return state;
  }
}

// ── Selectors ────────────────────────────────────────────────────────────

export const getNode = (scenario, nodeId) => scenario?.nodes?.[nodeId] || null;

export const getOutcome = (scenario, outcomeId) => scenario?.outcomes?.[outcomeId] || null;

export function getRevealedChoice(scenario, state) {
  if (!state.revealed) return null;
  const node = getNode(scenario, state.nodeId);
  return node?.decision?.choices?.find((c) => c.id === state.revealed) || null;
}

// Where a committed choice leads. Branch map first; a node may also declare
// a single `next` for the case where every choice converges.
export function getNext(scenario, state) {
  const node = getNode(scenario, state.nodeId);
  if (!node) return null;
  if (node.branches && state.revealed && node.branches[state.revealed]) {
    return node.branches[state.revealed];
  }
  return node.next || null;
}

// Decisions committed so far. This is the number the close reports back —
// the honest one, not a score.
export const decisionCount = (state) => state.path.length;

export function pathScore(scenario, state) {
  const outcome = getOutcome(scenario, state.outcomeId);
  return typeof outcome?.score === 'number' ? outcome.score : null;
}
