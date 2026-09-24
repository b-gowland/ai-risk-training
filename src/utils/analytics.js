// src/utils/analytics.js
// Plausible custom events. All calls are fire-and-forget — never block the UI.
//
// Events go through the site script loaded in index.html (window.plausible),
// so pageviews and events land in the same Plausible property. Do not
// reintroduce a separate tracker package: plausible-tracker defaulted its
// domain to location.hostname (app.airiskpractice.org), which sent events to
// a different property from the pageviews.
//
// PLAUSIBLE GOAL SETUP (one-time, in the Plausible dashboard):
// Site settings → Goals → Add goal → Custom event, for each of:
//   'Scenario Started', 'Decision Made', 'Recall Answered', 'Debrief Viewed',
//   'Scenario Completed', 'Action Selected', 'Card Shared', 'Replay Chosen',
//   'Cards Printed'
// An event with no matching goal is not shown in the dashboard.
//
// Props are anonymous and aggregate: scenario, node, choice quality, outcome
// and action ids. Never free text, never anything that identifies a person.

// LMS/SCORM packages must not transmit anything off-host: build-scorm.mjs
// sets VITE_LMS_BUILD=1 and strips the Plausible script, so every call here
// is a no-op. Web deploys are unaffected (flag unset).
const LMS_BUILD = import.meta.env?.VITE_LMS_BUILD === '1';

const trackEvent = (name, options) => {
  if (LMS_BUILD) return;
  if (typeof window === 'undefined' || typeof window.plausible !== 'function') return;
  window.plausible(name, options);
};

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

// Recall items are part of the same decision-quality record as scenario choices.
export const trackRecallAnswered = (scenarioId, itemId, choiceQuality) =>
  safe(() => trackEvent('Recall Answered', {
    props: { scenario_id: scenarioId, item_id: itemId, choice_quality: choiceQuality },
  }));

// Fired when a player opens the debrief from the outcome screen.
export const trackDebriefViewed = (scenarioId, outcomeId) =>
  safe(() => trackEvent('Debrief Viewed', {
    props: { scenario_id: scenarioId, outcome_id: outcomeId },
  }));

export const trackScenarioCompleted = (scenarioId, outcomeId, outcomeTone, door, score, playNumber) =>
  safe(() => trackEvent('Scenario Completed', {
    props: {
      scenario_id:  scenarioId,
      outcome_id:   outcomeId,
      outcome_tone: outcomeTone,
      door:         door ?? '',
      score:        String(score ?? ''),
      play_number:  String(playNumber ?? 1),
    },
  }));

export const trackCardShared = (scenarioId, outcomeTone, shareMethod) =>
  safe(() => trackEvent('Card Shared', {
    props: { scenario_id: scenarioId, outcome_tone: outcomeTone, share_method: shareMethod },
  }));

export const trackReplayChosen = (scenarioId) =>
  safe(() => trackEvent('Replay Chosen', {
    props: { scenario_id: scenarioId },
  }));

// The Act beat (§4.7). The action id is a content-defined key ('c1'…'c4' or
// 'skip'), never text. A selection is an implementation intention and nothing
// more — it is never evidence that anything was done, and no report may
// describe it as such. An explicit skip is a recorded signal, not an absence.
export const trackCommitmentSelected = (scenarioId, actId) =>
  safe(() => trackEvent('Action Selected', {
    props: { scenario_id: scenarioId, action: actId },
  }));

// Discussion cards — fired when someone opens the print dialog from the cards
// page. scope is a scenario id or 'all'. The print itself cannot be observed;
// this is intent, and it is the demand signal for the printed format.
export const trackCardsPrinted = (scope) =>
  safe(() => trackEvent('Cards Printed', { props: { scope } }));
