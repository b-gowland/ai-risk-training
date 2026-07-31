// Scenario registry.
//
// MIGRATION STATE (July 2026): the four-beat rebuild changed the scenario
// schema. Only migrated scenarios are registered here. The 33 unmigrated
// files remain on disk — they hold the decision trees and consequence text,
// which is the expensive half of a scenario and is reused as-is. They are
// registered again as each one is brought to the new schema.
//
// A file on disk but not in this list renders nowhere. That is deliberate:
// there is no compatibility path and no half-migrated scenario in front of
// a stranger.

import { scenario as f2ShadowAi } from './f2-shadow-ai.js';
import { scenario as a1Hallucination } from './a1-hallucination.js';
import { scenario as d2Privacy } from './d2-privacy.js';
import { scenario as e1Bias } from './e1-bias.js';
import { scenario as f1AutomationBias } from './f1-automation-bias.js';
import { scenario as d3Ip } from './d3-ip.js';
import { scenario as homeVoiceClone } from './home-voice-clone.js';
import { scenario as homeAiAnswer } from './home-ai-answer.js';
import { scenario as homeAlgorithmSaidNo } from './home-algorithm-said-no.js';

export const scenarios = [
  homeVoiceClone,
  homeAiAnswer,
  homeAlgorithmSaidNo,
  f2ShadowAi,
  a1Hallucination,
  d2Privacy,
  e1Bias,
  f1AutomationBias,
  d3Ip,
];

// The homepage pair is FIXED, not rotating (§3): someone sent this link
// should see what the sender saw, and a stable pair is the only way to read
// entry conversion honestly. One per door, At Home first.
export const FEATURED_PAIR = [
  `home-voice-clone`,
  `f2-shadow-ai`,
];

export const byId = (id) => scenarios.find((s) => s.id === id) || null;

// Every scenario file on disk, registered or not. Used to tell a stale deep
// link apart from a typo: 32 knowledge-base entries link to
// /#/scenario/<id>, and most of those ids are not registered here. A player
// arriving on one of those gets a soft landing rather than a not-found page.
// Vite resolves this at build time; the modules are never loaded.
export const KNOWN_IDS = Object.keys(import.meta.glob('./*.js'))
  .map((p) => p.slice(2, -3))
  .filter((id) => id !== 'index');
