import { scenario as f2 } from './f2-shadow-ai.js';
import { scenario as c1 } from './c1-data-poisoning.js';
import { scenario as c2 } from './c2-prompt-injection.js';
import { scenario as c3 } from './c3-model-theft.js';
import { scenario as c4 } from './c4-deepfakes.js';
import { scenario as a1 } from './a1-hallucination.js';
import { scenario as e1 } from './e1-bias.js';
import { scenario as b2 } from './b2-compliance.js';
import { scenario as d2 } from './d2-privacy.js';
import { scenario as b1 } from './b1-accountability.js';
import { scenario as b3 } from './b3-lifecycle.js';
import { scenario as b4 } from './b4-supply-chain.js';
import { scenario as d1 } from './d1-data-quality.js';
import { scenario as d3 } from './d3-ip.js';
import { scenario as c5 } from './c5-ai-cyber-attacks.js';
import { scenario as f1 } from './f1-automation-bias.js';
import { scenario as f3 } from './f3-scope-creep.js';
import { scenario as g4 } from './g4-ai-safety.js';
import { scenario as g3 } from './g3-workforce-displacement.js';
import { scenario as a2 } from './a2-model-drift.js';
import { scenario as g1 } from './g1-concentration-risk.js';
import { scenario as g2 } from './g2-environmental-impact.js';
import { scenario as a3 } from './a3-robustness.js';
import { scenario as a4 } from './a4-explainability.js';
import { scenario as e2 } from './e2-harmful-content.js';
import { scenario as e3 } from './e3-misinformation.js';

const stub = (id, riskRef, title, domain, difficulty, hasBusinessUser = false) => ({
  id, risk_ref: riskRef, title, domain, difficulty,
  stub: true,
  has_business_user: hasBusinessUser,
  kb_url: 'https://b-gowland.github.io/ai-risk-kb/docs/how-to-use',
  estimated_minutes: null,
});

// Business User available for F2, C4, A1, E1 only
export const scenarios = [
  a1,
  a2,
  a3,
  a4,
  b1,
  b2,
  b3,
  b4,
  c1,
  c2,
  c3,
  c4,
  c5,
  d1,
  d2,
  d3,
  e1,
  e2,
  e3,
  f2,
  f1,
  f3,
  g1,
  g2,
  g3,
  g4,
];

export const getScenario = (id) => scenarios.find(s => s.id === id);
export const getLive     = ()   => scenarios.filter(s => !s.stub);

export const DOMAINS = [
  { key: 'A', label: 'Technical' },
  { key: 'B', label: 'Governance' },
  { key: 'C', label: 'Security & Adversarial' },
  { key: 'D', label: 'Data' },
  { key: 'E', label: 'Fairness & Social' },
  { key: 'F', label: 'HCI & Deployment' },
  { key: 'G', label: 'Systemic & Macro' },
];

export const DIFFICULTY_ORDER = { Foundational: 0, Intermediate: 1, Advanced: 2 };
