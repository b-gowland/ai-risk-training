import { scenario as f2 } from './f2-shadow-ai.js';
import { scenario as c4 } from './c4-deepfakes.js';
import { scenario as a1 } from './a1-hallucination.js';
import { scenario as e1 } from './e1-bias.js';
import { scenario as b2 } from './b2-compliance.js';
import { scenario as d2 } from './d2-privacy.js';
import { scenario as b1 } from './b1-accountability.js';
import { scenario as b3 } from './b3-lifecycle.js';
import { scenario as b4 } from './b4-supply-chain.js';

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
  stub('a2-model-drift',     'A2', 'The Slow Decay',            'A — Technical',              'Intermediate'),
  stub('a3-robustness',      'A3', 'Edge of the Map',           'A — Technical',              'Intermediate'),
  stub('a4-explainability',  'A4', 'The Black Box Decision',    'A — Technical',              'Advanced'),
  b1,
  b2,
  b3,
  b4,
  stub('c1-data-poisoning',  'C1', 'Poisoned at the Source',    'C — Security & Adversarial', 'Advanced'),
  stub('c2-prompt-injection','C2', 'The Hidden Instruction',    'C — Security & Adversarial', 'Advanced'),
  stub('c3-model-theft',     'C3', 'The Extraction',            'C — Security & Adversarial', 'Advanced'),
  c4,
  stub('c5-cyber',           'C5', 'Precision Strike',          'C — Security & Adversarial', 'Intermediate'),
  stub('d1-data-quality',    'D1', 'Garbage In',                'D — Data',                   'Intermediate'),
  d2,
  stub('d3-ip',              'D3', "Who Owns This?",            'D — Data',                   'Intermediate'),
  e1,
  stub('e2-harmful-content', 'E2', 'The Guardrail Gap',         'E — Fairness & Social',      'Advanced'),
  stub('e3-misinfo',         'E3', 'The Fabricated Story',      'E — Fairness & Social',      'Foundational'),
  f2,
  stub('f1-automation-bias', 'F1', 'Trust the Machine',         'F — HCI & Deployment',       'Foundational'),
  stub('f3-scope-creep',     'F3', 'Just One More Thing',       'F — HCI & Deployment',       'Intermediate'),
  stub('g1-concentration',   'G1', 'Single Point',              'G — Systemic & Macro',       'Advanced'),
  stub('g2-environment',     'G2', 'The Hidden Cost',           'G — Systemic & Macro',       'Intermediate'),
  stub('g3-workforce',       'G3', 'The Transition',            'G — Systemic & Macro',       'Intermediate'),
  stub('g4-safety',          'G4', 'Out of Scope',              'G — Systemic & Macro',       'Advanced'),
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
