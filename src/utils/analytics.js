// src/utils/analytics.js
// Plausible event wrappers for practitioner and everyday tracks.
// All calls are fire-and-forget — never block the UI.

import Plausible from 'plausible-tracker';

const { trackEvent } = Plausible({ trackLocalhost: false });

const safe = (fn) => {
  try { fn(); } catch { /* never throw — analytics must not break the app */ }
};

export const trackScenarioStarted = (scenarioId, scenarioTitle) =>
  safe(() => trackEvent('Scenario Started', {
    props: { scenario_id: scenarioId, scenario_title: scenarioTitle },
  }));

export const trackDecisionMade = (scenarioId, nodeId, choiceQuality) =>
  safe(() => trackEvent('Decision Made', {
    props: { scenario_id: scenarioId, node_id: nodeId, choice_quality: choiceQuality },
  }));

export const trackScenarioCompleted = (scenarioId, outcomeId, outcomeTone, persona) =>
  safe(() => trackEvent('Scenario Completed', {
    props: { scenario_id: scenarioId, outcome_id: outcomeId, outcome_tone: outcomeTone, persona },
  }));

export const trackCardShared = (scenarioId, outcomeTone, shareMethod) =>
  safe(() => trackEvent('Card Shared', {
    props: { scenario_id: scenarioId, outcome_tone: outcomeTone, share_method: shareMethod },
  }));

export const trackReplayChosen = (scenarioId) =>
  safe(() => trackEvent('Replay Chosen', {
    props: { scenario_id: scenarioId },
  }));
