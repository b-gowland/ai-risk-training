// Scenario registry. These nine are the whole live set.
//
// The pre-rebuild scenarios were deleted in October 2026 (they are in git
// history if ever needed). RETIRED below is what old links to them resolve to.

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

// Retired scenario ids. Old links to /#/scenario/<id> are still out there,
// so a retired id gets a soft landing instead of a not-found page. Until
// November 2026 each pointed at a reference library entry; the library was
// retired on 28 Nov 2026 and its pages now redirect.
export const RETIRED = new Set([
  'a2-model-drift',
  'a3-robustness',
  'a4-explainability',
  'b1-accountability',
  'b2-compliance',
  'b3-lifecycle',
  'b4-supply-chain',
  'b5-agentic-logging',
  'c1-data-poisoning',
  'c2-prompt-injection',
  'c3-model-theft',
  'c4-deepfakes',
  'c5-ai-cyber-attacks',
  'c6-mcp-attack',
  'c7-multi-agent-trust',
  'c8-computer-use-hijacking',
  'd1-data-quality',
  'e2-harmful-content',
  'e3-misinformation',
  'f3-scope-creep',
  'f4-irreversibility',
  'g1-concentration-risk',
  'g2-environmental-impact',
  'g3-workforce-displacement',
  'g4-ai-safety',
  'g5-excessive-agency',
]);

// The three pre-rebuild At Home scenarios were rebuilt as the home-* set.
// Their old links go straight to the replacement.
export const REPLACED = {
  'everyday-p1-deepfake-voice': 'home-voice-clone',
  'everyday-p2-hallucination': 'home-ai-answer',
  'everyday-p3-employment-screening': 'home-algorithm-said-no',
};
