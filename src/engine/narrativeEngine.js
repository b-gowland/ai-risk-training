export const STATES = {
  PERSONA_SELECT: 'persona_select',
  RECALL:         'recall',    // Unit Loop beat — spaced retrieval (optional, scenario.unit.recall)
  BRIEF:          'brief',     // Unit Loop beat — teach layer (optional, scenario.unit.brief)
  PREMISE:        'premise',
  NODE:           'node',
  FEEDBACK:       'feedback',
  OUTCOME:        'outcome',
  DEBRIEF:        'debrief',   // Unit Loop beat — consequence review (optional, scenario.unit.debrief)
};

// Internal helper — clamps a numeric value to schema min/max when declared.
// If min/max absent, returns value unchanged. Never called for null stateVars.
function clampToSchema(value, schemaDef) {
  if (!schemaDef) return value;
  let v = value;
  if (schemaDef.min !== undefined && v < schemaDef.min) v = schemaDef.min;
  if (schemaDef.max !== undefined && v > schemaDef.max) v = schemaDef.max;
  return v;
}

export function createInitialState(scenario) {
  // Build stateVars from state_schema initial values when present.
  const schema = scenario.state_schema || null;
  const stateVars = schema
    ? Object.fromEntries(Object.entries(schema).map(([k, def]) => [k, def.initial]))
    : null;
  // Unit Loop flags — derived once here because SELECT_PERSONA cannot see the
  // scenario object (same constraint that shaped stateSchema stashing, May 31).
  // All false when scenario.unit is absent → behaviour identical to before.
  const unit = scenario.unit || null;
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
    stateVars,               // null when scenario has no state_schema
    stateSchema:     schema, // null when scenario has no state_schema
    unitFlags: {
      hasRecall:  !!(unit && unit.recall),
      hasBrief:   !!(unit && unit.brief),
      hasDebrief: !!(unit && unit.debrief),
    },
    // Recall answers are part of the decision-quality record (Unit Loop:
    // "the decisions are the assessment"). Kept as a compact array so a
    // future SCORM suspend_data breadcrumb stays well inside the 64k limit.
    recallAnswers:   [],
  };
}

// Pure export — applies state_changes deltas for a given choiceId.
// Returns stateVars unchanged when stateVars or stateSchema is null,
// or when the node carries no state_changes for this choice.
// Values are clamped to schema min/max when declared.
export function applyStateChanges(stateVars, stateSchema, stateChanges, choiceId) {
  if (!stateVars || !stateSchema || !stateChanges) return stateVars;
  const deltas = stateChanges[choiceId];
  if (!deltas) return stateVars;
  const next = { ...stateVars };
  for (const [key, delta] of Object.entries(deltas)) {
    if (key in next) {
      next[key] = clampToSchema(next[key] + delta, stateSchema[key]);
    }
  }
  return next;
}

export function reducer(state, action) {
  switch (action.type) {

    case 'SELECT_PERSONA': {
      // Unit Loop routing: RECALL → BRIEF → PREMISE, skipping absent beats.
      // unitFlags are always initialised by createInitialState; the guard is
      // defensive only. All existing scenarios (no unit) land on PREMISE.
      const { hasRecall, hasBrief } = state.unitFlags || {};
      return {
        ...state,
        persona:         action.payload,
        state:           hasRecall ? STATES.RECALL
                       : hasBrief  ? STATES.BRIEF
                       : STATES.PREMISE,
        currentNodeId:   'start',
        history:         [],
        recallAnswers:   [],
        selectedChoice:  null,
        feedbackText:    null,
        feedbackLoading: false,
        outcomeId:       null,
        nextNodeId:      null,
      };
    }

    case 'ANSWER_RECALL': {
      // Records one recall item answer. Idempotent per item — a double-tap
      // cannot record twice. Answers persist through the scenario run so the
      // outcome/debrief layer (and future evidence export) can read them.
      const { itemId, choiceId, quality } = action.payload || {};
      if (!itemId || !choiceId) return state;
      if (state.recallAnswers.some(a => a.itemId === itemId)) return state;
      return {
        ...state,
        recallAnswers: [...state.recallAnswers, { itemId, choiceId, quality }],
      };
    }

    case 'CONTINUE_FROM_RECALL':
      return {
        ...state,
        state: (state.unitFlags || {}).hasBrief ? STATES.BRIEF : STATES.PREMISE,
      };

    case 'CONTINUE_FROM_BRIEF':
      return { ...state, state: STATES.PREMISE };

    case 'SHOW_DEBRIEF':
      // Only meaningful from a reached outcome on a scenario with a debrief.
      if (state.state !== STATES.OUTCOME || !state.outcomeId) return state;
      if (!(state.unitFlags || {}).hasDebrief) return state;
      return { ...state, state: STATES.DEBRIEF };

    case 'START_SCENARIO':
      return { ...state, state: STATES.NODE, currentNodeId: 'start' };

    case 'SELECT_CHOICE': {
      const { choice, nextNodeId, node } = action.payload;
      if (!nextNodeId) {
        console.error('SELECT_CHOICE received undefined nextNodeId — ignoring');
        return state;
      }
      const isOutcome = nextNodeId.startsWith('outcome_');
      // Apply state_changes for this choice when the scenario tracks state.
      const updatedStateVars = applyStateChanges(
        state.stateVars,
        state.stateSchema,
        node?.state_changes,
        choice.id,
      );
      return {
        ...state,
        selectedChoice:  choice,
        history:         [...state.history, { nodeId: state.currentNodeId, choiceId: choice.id }],
        state:           STATES.FEEDBACK,
        feedbackLoading: true,
        feedbackText:    null,
        outcomeId:       isOutcome ? nextNodeId : null,
        nextNodeId,
        stateVars:       updatedStateVars,
      };
    }

    case 'AUTO_ADVANCE': {
      const { nextNodeId, node } = action.payload;
      if (!nextNodeId) return state;
      // Apply state_changes for 'auto' key on bridge nodes when the scenario tracks state.
      const updatedStateVars = applyStateChanges(
        state.stateVars,
        state.stateSchema,
        node?.state_changes,
        'auto',
      );
      const isOutcome = nextNodeId.startsWith('outcome_');
      if (isOutcome) {
        return { ...state, state: STATES.OUTCOME, outcomeId: nextNodeId, stateVars: updatedStateVars };
      }
      return { ...state, state: STATES.NODE, currentNodeId: nextNodeId, stateVars: updatedStateVars };
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
  const scenarioRef  = `${scenario.risk_ref} — ${scenario.title}`;
  return `You are a sharp AI risk training facilitator. Role: "${personaData.role}". Scenario: ${scenarioRef}. Choice: "${choice.label}" — ${qualityLabel}. Note: ${choice.note}. Write 2 direct sentences of feedback, max 50 words, no bullet points.`;
}

export const PERSONA_ORDER = ['business_user', 'executive', 'pm', 'analyst'];
