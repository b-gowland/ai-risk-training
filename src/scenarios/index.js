import { scenario as f2 } from './f2-shadow-ai.js';

const stub = (id, riskRef, title, domain, difficulty, hasBusinessUser = false) => ({
  id, risk_ref: riskRef, title, domain, difficulty,
  stub: true,
  has_business_user: hasBusinessUser,
  kb_url: 'https://b-gowland.github.io/ai-risk-kb/',
  estimated_minutes: null,
});

// Business User available for F2, C4, A1, E1 only
export const scenarios = [
  stub('a1-hallucination',   'A1', 'Confident and Wrong',      'A — Technical',              'Foundational', true),
  stub('a2-model-drift',     'A2', 'The Slow Decay',            'A — Technical',              'Intermediate'),
  stub('a3-robustness',      'A3', 'Edge of the Map',           'A — Technical',              'Intermediate'),
  stub('a4-explainability',  'A4', 'The Black Box Decision',    'A — Technical',              'Advanced'),
  stub('b1-accountability',  'B1', "Nobody's Problem",          'B — Governance',             'Intermediate'),
  stub('b2-compliance',      'B2', 'The Deadline Creep',        'B — Governance',             'Advanced'),
  stub('b3-lifecycle',       'B3', 'Still Running',             'B — Governance',             'Intermediate'),
  stub('b4-supply-chain',    'B4', 'Inside the Vendor',         'B — Governance',             'Advanced'),
  stub('c1-data-poisoning',  'C1', 'Poisoned at the Source',    'C — Security & Adversarial', 'Advanced'),
  stub('c2-prompt-injection','C2', 'The Hidden Instruction',    'C — Security & Adversarial', 'Advanced'),
  stub('c3-model-theft',     'C3', 'The Extraction',            'C — Security & Adversarial', 'Advanced'),
  stub('c4-deepfakes',       'C4', 'The Fabricated Call',       'C — Security & Adversarial', 'Foundational', true),
  stub('c5-cyber',           'C5', 'Precision Strike',          'C — Security & Adversarial', 'Intermediate'),
  stub('d1-data-quality',    'D1', 'Garbage In',                'D — Data',                   'Intermediate'),
  stub('d2-privacy',         'D2', 'The Accidental Disclosure', 'D — Data',                   'Foundational'),
  stub('d3-ip',              'D3', "Who Owns This?",            'D — Data',                   'Intermediate'),
  stub('e1-bias',            'E1', 'The Score',                 'E — Fairness & Social',      'Intermediate', true),
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
