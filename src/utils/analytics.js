// src/utils/analytics.js
// Plausible event wrappers for practitioner and everyday tracks.
// All calls are fire-and-forget — never block the UI.
//
// PLAUSIBLE GOAL SETUP (one-time, in Plausible dashboard):
// Goals → Add goal → Custom event for each of:
//   Practitioner track: 'Scenario Started', 'Decision Made', 'Scenario Completed', 'Card Shared', 'Replay Chosen', 'KB Link Clicked', 'Recall Answered', 'Debrief Viewed'
//   Fork (everyday) track: 'Fork Started', 'Fork Decision', 'Fork Completed', 'Fork Card Shared', 'Fork Replayed'
//
// Fork events include: scenario (which of 3), node (which decision point), choice_quality, outcome, score.
// This gives: completion rate, path distribution, avg score, drop-off node — all per scenario.

import Plausible from 'plausible-tracker';

// LMS/SCORM packages must not transmit anything off-host: build-scorm.mjs
// sets VITE_LMS_BUILD=1, which turns every tracker call into a no-op.
// Web deploys are unaffected (flag unset).
const LMS_BUILD = import.meta.env?.VITE_LMS_BUILD === '1';
const trackEvent = LMS_BUILD
  ? () => {}
  : Plausible({ trackLocalhost: false }).trackEvent;

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

// Unit Loop — recall items are part of the same decision-quality record as
// scenario choices ("the decisions are the assessment"). Anonymous, Layer-1.
export const trackRecallAnswered = (scenarioId, itemId, choiceQuality) =>
  safe(() => trackEvent('Recall Answered', {
    props: { scenario_id: scenarioId, item_id: itemId, choice_quality: choiceQuality },
  }));

// Unit Loop — fired when a learner opens the debrief from the outcome screen.
export const trackDebriefViewed = (scenarioId, outcomeId) =>
  safe(() => trackEvent('Debrief Viewed', {
    props: { scenario_id: scenarioId, outcome_id: outcomeId },
  }));

export const trackScenarioCompleted = (scenarioId, outcomeId, outcomeTone, persona, score, playNumber) =>
  safe(() => trackEvent('Scenario Completed', {
    props: {
      scenario_id:  scenarioId,
      outcome_id:   outcomeId,
      outcome_tone: outcomeTone,
      persona,
      score:        String(score ?? ''),
      play_number:  String(playNumber ?? 1),
    },
  }));

export const trackCertificateGenerated = (scenarioId, scoreBand) =>
  safe(() => trackEvent('Certificate Generated', {
    props: { scenario_id: scenarioId, score_band: scoreBand },
  }));

export const trackCardShared = (scenarioId, outcomeTone, shareMethod) =>
  safe(() => trackEvent('Card Shared', {
    props: { scenario_id: scenarioId, outcome_tone: outcomeTone, share_method: shareMethod },
  }));

export const trackReplayChosen = (scenarioId) =>
  safe(() => trackEvent('Replay Chosen', {
    props: { scenario_id: scenarioId },
  }));

export const trackKbLinkClicked = (scenarioId, riskRef) =>
  safe(() => trackEvent('KB Link Clicked', {
    props: { scenario_id: scenarioId, risk_ref: riskRef },
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
