// Scenario registry. These nine are the whole live set.
//
// The other files in this folder are pre-rebuild scenarios on the retired
// schema. There is no plan to migrate them, and a file that is not imported
// here renders nowhere. RETIRED below is what old links to them resolve to.

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
const LIBRARY = 'https://library.airiskpractice.org/docs/';
export const RETIRED = Object.fromEntries(Object.entries({
  'a2-model-drift': 'domain-a-technical/a2-model-drift',
  'a3-robustness': 'domain-a-technical/a3-robustness',
  'a4-explainability': 'domain-a-technical/a4-explainability',
  'b1-accountability': 'domain-b-governance/b1-accountability',
  'b2-compliance': 'domain-b-governance/b2-regulatory-compliance',
  'b3-lifecycle': 'domain-b-governance/b3-lifecycle-governance',
  'b4-supply-chain': 'domain-b-governance/b4-supply-chain',
  'b5-agentic-logging': 'domain-b-governance/b5-agentic-logging',
  'c1-data-poisoning': 'domain-c-security/c1-data-poisoning',
  'c2-prompt-injection': 'domain-c-security/c2-prompt-injection',
  'c3-model-theft': 'domain-c-security/c3-model-theft',
  'c4-deepfakes': 'domain-c-security/c4-deepfakes',
  'c5-ai-cyber-attacks': 'domain-c-security/c5-ai-cyber-attacks',
  'c6-mcp-attack': 'domain-c-security/c6-mcp-attack-surface',
  'c7-multi-agent-trust': 'domain-c-security/c7-multi-agent-trust',
  'c8-computer-use-hijacking': 'domain-c-security/c8-computer-use-hijacking',
  'd1-data-quality': 'domain-d-data/d1-training-data-quality',
  'e2-harmful-content': 'domain-e-fairness/e2-harmful-content',
  'e3-misinformation': 'domain-e-fairness/e3-misinformation',
  'f3-scope-creep': 'domain-f-deployment/f3-scope-creep',
  'f4-irreversibility': 'domain-f-deployment/f4-irreversibility-scope-creep',
  'g1-concentration-risk': 'domain-g-systemic/g1-concentration-risk',
  'g2-environmental-impact': 'domain-g-systemic/g2-environmental-impact',
  'g3-workforce-displacement': 'domain-g-systemic/g3-workforce-displacement',
  'g4-ai-safety': 'domain-g-systemic/g4-ai-safety',
  'g5-excessive-agency': 'domain-g-systemic/g5-excessive-agency',
}).map(([id, path]) => [id, LIBRARY + path]));

// The three pre-rebuild At Home scenarios were rebuilt as the home-* set.
// Their old links go straight to the replacement.
export const REPLACED = {
  'everyday-p1-deepfake-voice': 'home-voice-clone',
  'everyday-p2-hallucination': 'home-ai-answer',
  'everyday-p3-employment-screening': 'home-algorithm-said-no',
};
