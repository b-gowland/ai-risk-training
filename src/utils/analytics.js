// src/utils/analytics.js
// Plausible event wrappers for practitioner and everyday tracks.
// All calls are fire-and-forget — never block the UI.
//
// PLAUSIBLE GOAL SETUP (one-time, in Plausible dashboard):
// Goals → Add goal → Custom event for each of:
//   Practitioner track: 'Scenario Started', 'Decision Made', 'Scenario Completed', 'Card Shared', 'Replay Chosen'
//   Fork (everyday) track: 'Fork Started', 'Fork Decision', 'Fork Completed', 'Fork Card Shared', 'Fork Replayed'
//
// Fork events include: scenario (which of 3), node (which decision point), choice_quality, outcome, score.
// This gives: completion rate, path distribution, avg score, drop-off node — all per scenario.

import Plausible from 'plausible-tracker';

const { trackEvent } = Plausible({ trackLocalhost: false });

const safe = (fn) => {
  try { fn(); } catch { /* never throw — analytics must not break the app */ }
};

// ── Practitioner track ───────────────────────────────────────────

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

// ── Fork (everyday) track ────────────────────────────────────────
// Distinct event names so Fork metrics are filterable separately in Plausible.
// scenario values: 'p1-deepfake', 'p2-hallucination', 'p3-employment'
// node values: 'start', 'n2_transferred', 'n2_called_back', etc.
// choice_quality values: 'good', 'partial', 'poor'
// outcome_tone values: 'good', 'warn', 'bad'

// Friendly scenario key for Plausible readability
function forkScenarioKey(scenarioId) {
  const map = {
    'everyday-p1-deepfake-voice':       'p1-deepfake',
    'everyday-p2-hallucination':        'p2-hallucination',
    'everyday-p3-employment-screening': 'p3-employment',
  };
  return map[scenarioId] || scenarioId;
}

export const trackForkStarted = (scenarioId) =>
  safe(() => trackEvent('Fork Started', {
    props: { scenario: forkScenarioKey(scenarioId) },
  }));

export const trackForkDecision = (scenarioId, nodeId, choiceQuality) =>
  safe(() => trackEvent('Fork Decision', {
    props: {
      scenario:       forkScenarioKey(scenarioId),
      node:           nodeId,
      choice_quality: choiceQuality,
    },
  }));

export const trackForkCompleted = (scenarioId, outcomeId, outcomeTone, score, durationSeconds) =>
  safe(() => trackEvent('Fork Completed', {
    props: {
      scenario:         forkScenarioKey(scenarioId),
      outcome:          outcomeId,
      outcome_tone:     outcomeTone,
      score:            String(score ?? ''),
      duration_seconds: String(durationSeconds ?? ''),
    },
  }));

export const trackForkCardShared = (scenarioId, outcomeTone) =>
  safe(() => trackEvent('Fork Card Shared', {
    props: {
      scenario:     forkScenarioKey(scenarioId),
      outcome_tone: outcomeTone,
    },
  }));

export const trackForkReplayed = (scenarioId) =>
  safe(() => trackEvent('Fork Replayed', {
    props: { scenario: forkScenarioKey(scenarioId) },
  }));
