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

// Retired scenario ids, and the reference entry that covers each one. Old
// links to /#/scenario/<id> are still out there (the knowledge base carried
// them until August 2026), so a retired id gets a soft landing that points to
// its entry rather than a not-found page.
export const RETIRED = {
  'a2-model-drift': 'https://library.airiskpractice.org/docs/domain-a-technical/a2-model-drift',
  'a3-robustness': 'https://library.airiskpractice.org/docs/domain-a-technical/a3-robustness',
  'a4-explainability': 'https://library.airiskpractice.org/docs/domain-a-technical/a4-explainability',
  'b1-accountability': 'https://library.airiskpractice.org/docs/domain-b-governance/b1-accountability',
  'b2-compliance': 'https://library.airiskpractice.org/docs/domain-b-governance/b2-regulatory-compliance',
  'b3-lifecycle': 'https://library.airiskpractice.org/docs/domain-b-governance/b3-lifecycle-governance',
  'b4-supply-chain': 'https://library.airiskpractice.org/docs/domain-b-governance/b4-supply-chain',
  'b5-agentic-logging': 'https://library.airiskpractice.org/docs/domain-b-governance/b5-agentic-logging',
  'c1-data-poisoning': 'https://library.airiskpractice.org/docs/domain-c-security/c1-data-poisoning',
  'c2-prompt-injection': 'https://library.airiskpractice.org/docs/domain-c-security/c2-prompt-injection',
  'c3-model-theft': 'https://library.airiskpractice.org/docs/domain-c-security/c3-model-theft',
  'c4-deepfakes': 'https://library.airiskpractice.org/docs/domain-c-security/c4-deepfakes',
  'c5-ai-cyber-attacks': 'https://library.airiskpractice.org/docs/domain-c-security/c5-ai-cyber-attacks',
  'c6-mcp-attack': 'https://library.airiskpractice.org/docs/domain-c-security/c6-mcp-attack-surface',
  'c7-multi-agent-trust': 'https://library.airiskpractice.org/docs/domain-c-security/c7-multi-agent-trust',
  'c8-computer-use-hijacking': 'https://library.airiskpractice.org/docs/domain-c-security/c8-computer-use-hijacking',
  'd1-data-quality': 'https://library.airiskpractice.org/docs/domain-d-data/d1-training-data-quality',
  'e2-harmful-content': 'https://library.airiskpractice.org/docs/domain-e-fairness/e2-harmful-content',
  'e3-misinformation': 'https://library.airiskpractice.org/docs/domain-e-fairness/e3-misinformation',
  'f3-scope-creep': 'https://library.airiskpractice.org/docs/domain-f-deployment/f3-scope-creep',
  'f4-irreversibility': 'https://library.airiskpractice.org/docs/domain-f-deployment/f4-irreversibility-scope-creep',
  'g1-concentration-risk': 'https://library.airiskpractice.org/docs/domain-g-systemic/g1-concentration-risk',
  'g2-environmental-impact': 'https://library.airiskpractice.org/docs/domain-g-systemic/g2-environmental-impact',
  'g3-workforce-displacement': 'https://library.airiskpractice.org/docs/domain-g-systemic/g3-workforce-displacement',
  'g4-ai-safety': 'https://library.airiskpractice.org/docs/domain-g-systemic/g4-ai-safety',
  'g5-excessive-agency': 'https://library.airiskpractice.org/docs/domain-g-systemic/g5-excessive-agency',
};

// The three pre-rebuild At Home scenarios were rebuilt as the home-* set.
// Their old links go straight to the replacement.
export const REPLACED = {
  'everyday-p1-deepfake-voice': 'home-voice-clone',
  'everyday-p2-hallucination': 'home-ai-answer',
  'everyday-p3-employment-screening': 'home-algorithm-said-no',
};
