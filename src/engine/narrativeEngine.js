// Narrative engine v2 — handles genuine branching trees, not linear panels

export const STATES = {
  PERSONA_SELECT: 'persona_select',
  PREMISE:        'premise',
  NODE:           'node',
  FEEDBACK:       'feedback',
  OUTCOME:        'outcome',
};

export function createInitialState(scenario) {
  return {
    scenarioId:    scenario.id,
    state:         STATES.PERSONA_SELECT,
    persona:       null,
    currentNodeId: 'start',
    history:       [],        // [{ nodeId, choiceId }]
    selectedChoice: null,
    feedbackText:  null,
    feedbackLoading: false,
    outcomeId:     null,
  };
}

export function reducer(state, action) {
  switch (action.type) {

    case 'SELECT_PERSONA':
      return {
        ...state,
        persona:       action.payload,
        state:         STATES.PREMISE,
        currentNodeId: 'start',
        history:       [],
        selectedChoice: null,
        feedbackText:  null,
        outcomeId:     null,
      };

    case 'START_SCENARIO':
      return { ...state, state: STATES.NODE, currentNodeId: 'start' };

    case 'SELECT_CHOICE': {
      const { choice, nextNodeId } = action.payload;
      const isOutcome = nextNodeId.startsWith('outcome_');
      return {
        ...state,
        selectedChoice:  choice,
        history:         [...state.history, { nodeId: state.currentNodeId, choiceId: choice.id }],
        state:           STATES.FEEDBACK,
        feedbackLoading: true,
        outcomeId:       isOutcome ? nextNodeId : null,
        nextNodeId,
      };
    }

    case 'AUTO_ADVANCE': {
      const { nextNodeId } = action.payload;
      const isOutcome = nextNodeId.startsWith('outcome_');
      if (isOutcome) {
        return { ...state, state: STATES.OUTCOME, outcomeId: nextNodeId };
      }
      return { ...state, state: STATES.NODE, currentNodeId: nextNodeId };
    }

    case 'FEEDBACK_LOADED':
      return { ...state, feedbackText: action.payload, feedbackLoading: false };

    case 'CONTINUE_FROM_FEEDBACK': {
      const { nextNodeId } = state;
      const isOutcome = nextNodeId.startsWith('outcome_');
      if (isOutcome) {
        return { ...state, state: STATES.OUTCOME, outcomeId: nextNodeId };
      }
      return {
        ...state,
        state:          STATES.NODE,
        currentNodeId:  nextNodeId,
        selectedChoice: null,
        feedbackText:   null,
      };
    }

    case 'RESTART':
      return createInitialState(action.payload);

    case 'CHANGE_PERSONA':
      return { ...createInitialState(action.payload), state: STATES.PERSONA_SELECT };

    default:
      return state;
  }
}

// Given a node and a choice id, resolve the next node id
export function resolveNext(node, choiceId) {
  if (node.branches.auto) return node.branches.auto;
  return node.branches[choiceId] || 'outcome_bad';
}

// Get the current node object from scenario tree
export function getCurrentNode(scenario, persona, nodeId) {
  return scenario.trees[persona]?.nodes[nodeId] || null;
}

// Get outcome object
export function getOutcome(scenario, persona, outcomeId) {
  return scenario.trees[persona]?.outcomes[outcomeId] || null;
}

// Build feedback prompt for Claude API
export function buildFeedbackPrompt(scenario, persona, node, choice) {
  const personaData  = scenario.personas[persona];
  const qualityLabel = choice.quality === 'good' ? 'correct' : choice.quality === 'partial' ? 'partially correct' : 'incorrect';

  return `You are a sharp, slightly sardonic AI risk training facilitator. A learner playing "${personaData.role}" just made a decision in a scenario about Shadow AI (F2 risk).

Scenario: ${scenario.title} — ${scenario.subtitle}
Their role: ${personaData.character}, ${personaData.role}
Decision context: ${node.caption}
Their choice: "${choice.label}"
Assessment: ${qualityLabel}
Author's note on this choice: ${choice.note}

Write 2–3 punchy sentences of feedback. Rules:
- No bullet points. Flowing prose only.
- Be direct about whether this was smart or not.
- Reference the specific role (${personaData.character}, ${personaData.role}).
- One concrete takeaway at the end.
- Tone: intelligent, dry wit allowed, treat the learner as a capable adult who made a ${qualityLabel} call.
- If it was a bad call, you can note the irony — but don't lecture.
- Max 65 words.`;
}

// Persona display order (business user first)
export const PERSONA_ORDER = ['business_user', 'executive', 'pm', 'analyst'];
