export const STATES = {
  PERSONA_SELECT: 'persona_select',
  PREMISE:        'premise',
  NODE:           'node',
  FEEDBACK:       'feedback',
  OUTCOME:        'outcome',
};

export function createInitialState(scenario) {
  return {
    scenarioId:      scenario.id,
    state:           STATES.PERSONA_SELECT,
    persona:         null,
    currentNodeId:   'start',
    history:         [],
    selectedChoice:  null,
    feedbackText:    null,
    feedbackLoading: false,
    outcomeId:       null,
    nextNodeId:      null,   // ← always initialised, never undefined
  };
}

export function reducer(state, action) {
  switch (action.type) {

    case 'SELECT_PERSONA':
      return {
        ...state,
        persona:         action.payload,
        state:           STATES.PREMISE,
        currentNodeId:   'start',
        history:         [],
        selectedChoice:  null,
        feedbackText:    null,
        feedbackLoading: false,
        outcomeId:       null,
        nextNodeId:      null,
      };

    case 'START_SCENARIO':
      return { ...state, state: STATES.NODE, currentNodeId: 'start' };

    case 'SELECT_CHOICE': {
      const { choice, nextNodeId } = action.payload;
      if (!nextNodeId) {
        console.error('SELECT_CHOICE received undefined nextNodeId — ignoring');
        return state;
      }
      const isOutcome = nextNodeId.startsWith('outcome_');
      return {
        ...state,
        selectedChoice:  choice,
        history:         [...state.history, { nodeId: state.currentNodeId, choiceId: choice.id }],
        state:           STATES.FEEDBACK,
        feedbackLoading: true,
        feedbackText:    null,
        outcomeId:       isOutcome ? nextNodeId : null,
        nextNodeId,
      };
    }

    case 'AUTO_ADVANCE': {
      const { nextNodeId } = action.payload;
      if (!nextNodeId) return state;
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
      // Guard: if nextNodeId is null/undefined, stay on current state
      if (!nextNodeId) {
        console.error('CONTINUE_FROM_FEEDBACK: nextNodeId is null — cannot advance');
        return state;
      }
      const isOutcome = nextNodeId.startsWith('outcome_');
      if (isOutcome) {
        return { ...state, state: STATES.OUTCOME, outcomeId: nextNodeId };
      }
      return {
        ...state,
        state:           STATES.NODE,
        currentNodeId:   nextNodeId,
        nextNodeId:      null,
        selectedChoice:  null,
        feedbackText:    null,
        feedbackLoading: false,
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

export function resolveNext(node, choiceId) {
  if (node.branches.auto) return node.branches.auto;
  return node.branches[choiceId] || null;
}

export function getCurrentNode(scenario, persona, nodeId) {
  if (!persona || !nodeId) return null;
  return scenario.trees[persona]?.nodes[nodeId] || null;
}

export function getOutcome(scenario, persona, outcomeId) {
  if (!persona || !outcomeId) return null;
  return scenario.trees[persona]?.outcomes[outcomeId] || null;
}

export function buildFeedbackPrompt(scenario, persona, node, choice) {
  const personaData  = scenario.personas[persona];
  const qualityLabel = choice.quality === 'good' ? 'correct'
                     : choice.quality === 'partial' ? 'partially correct' : 'incorrect';
  return `You are a sharp AI risk training facilitator. Role: "${personaData.role}". Scenario: Shadow AI (F2). Choice: "${choice.label}" — ${qualityLabel}. Note: ${choice.note}. Write 2 direct sentences of feedback, max 50 words, no bullet points.`;
}

export const PERSONA_ORDER = ['business_user', 'executive', 'pm', 'analyst'];
