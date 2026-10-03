// readability.mjs — plain-language and machine-writing checks for scenario
// text. Used by scenario-audit.mjs (as warnings) and by readability-report.mjs
// (a before/after report). No dependencies.
//
// Only the narrator's voice is checked. Artefacts are in-world documents
// (an email subject, a log line, the fictional AI's own output) and are meant
// to sound like their source.

// Reading-grade targets (Flesch-Kincaid). At Home is for anyone; At Work
// assumes an office reader, not a specialist.
export const GRADE_TARGET = { home: 7, work: 9 };
export const LONG_SENTENCE = 25; // words

// Terms an average reader would stop on. At Home flags all of them; At Work
// only the specialist ones (WORK_OK are fine in an office).
export const JARGON = [
  'copyleft', 'lgpl', 'ci/cd', 'composition analysis', 'provenance',
  'remediation', 'remediate', 'remediated', 'disaggregated', 'aggregate',
  'sensitivity', 'attestation', 'throughput', 'scoping', 'stakeholder',
  'governance', 'mechanism', 'proxies', 'proxy', 'demographic',
  'beneficial-ownership', 'calibrate', 'calibrated', 'cohort', 'mitigate',
  'leverage', 'utilise', 'facilitate', 'holistic', 'framework', 'anchoring',
  'exfiltrat', 'indemnity', 'escalation channel', 'conduct issue',
];
export const WORK_OK = new Set(['governance', 'stakeholder', 'aggregate', 'framework', 'escalation channel']);

// Patterns that read as machine-written. Each is [name, regex]. They are
// warnings: a human writer uses any of them occasionally, so the audit
// reports them with the matching text and the author decides.
export const AI_PATTERNS = [
  ['contrast framing', /\b(?:is|was|are|were|it's|that's)(?:n't| not) [^.!?;—]{1,50}(?:—|;|\.) (?:it|that|this)(?:'s| is| was)\b/gi],
  ['"not X but Y"', /\bnot (?:just |only )?(?:a |an |the )?[a-z]+(?: [a-z]+)? — (?:it|but)\b/gi],
  ['"isn\'t about X, it\'s about Y"', /\bis(?:n't| not) (?:really )?about\b/gi],
  ['filler intensifier', /\b(?:genuinely|honestly|truly|actually|incredibly|deeply|quietly|simply|precisely|literally)\b/gi],
  ['signposting', /\b(?:here's the thing|the point is|that's the point|worth sitting with|the shape of|make no mistake|at the end of the day|which is why|that's why|the real (?:problem|lesson|question|risk)|it's worth (?:noting|saying))\b/gi],
  ['stock vocabulary', /\b(?:delve|tapestry|crucial|pivotal|navigate|landscape|underscore|seamless|robust|nuanced|multifaceted|testament)\b/gi],
  ['aphorism opener', /(?:^|[.!?]\s+)(?:That's (?:what|the|exactly|how|why)|That is (?:what|the|exactly)|Which is (?:what|the|exactly|why))\b/g],
  ['personified abstraction', /\b(?:the (?:tool|gate|anchor|script|pattern|process|system)) (?:doesn't|does not|never|won't) (?:care|respond to|know|forgive)\b/gi],
];

const SKIP_KEYS = new Set([
  'artefact', 'id', 'quality', 'tone', 'score', 'scene', 'doorScene', 'door',
  'entry', 'branches', 'next', 'kb_url', 'regulatory_tags', 'mit_subdomain',
  'risk_ref', 'determinacy', 'effort', 'owner', 'go_live',
]);

/** Narrator strings of a scenario, with the field each came from. */
export function narratorText(scenario) {
  const out = [];
  const walk = (v, key, path) => {
    if (SKIP_KEYS.has(key)) return;
    if (typeof v === 'string') { out.push({ field: path, text: v }); return; }
    if (Array.isArray(v)) { v.forEach((x) => walk(x, key, path)); return; }
    if (v && typeof v === 'object') {
      for (const [k, x] of Object.entries(v)) walk(x, k, path ? `${path}.${k}` : k);
    }
  };
  walk(scenario, '', '');
  return out;
}

const syllables = (word) => {
  const w = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!w) return 0;
  if (w.length <= 3) return 1;
  const groups = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').replace(/^y/, '').match(/[aeiouy]{1,2}/g);
  return Math.max(1, groups ? groups.length : 1);
};

export function sentences(text) {
  return text
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])["”']?\s+(?=["“']?[A-Z0-9])/)
    .map((s) => s.trim())
    .filter((s) => /[a-z]/i.test(s));
}

const wordsOf = (s) => s.split(/\s+/).filter((w) => /[a-z0-9]/i.test(w));

/** Readability and pattern findings for one scenario. */
export function analyse(scenario) {
  const items = narratorText(scenario);
  const all = items.map((i) => i.text).join('\n');
  const sents = items.flatMap((i) => sentences(i.text));
  const words = sents.flatMap(wordsOf);
  const syl = words.reduce((n, w) => n + syllables(w), 0);
  const grade = 0.39 * (words.length / Math.max(1, sents.length)) + 11.8 * (syl / Math.max(1, words.length)) - 15.59;
  const long = sents.filter((s) => wordsOf(s).length > LONG_SENTENCE);
  const complexWords = words.filter((w) => syllables(w) >= 4).length;

  const lower = all.toLowerCase();
  const jargon = JARGON.filter((t) => lower.includes(t))
    .filter((t) => scenario.door === 'home' || !WORK_OK.has(t));

  const patterns = [];
  for (const [name, re] of AI_PATTERNS) {
    const hits = all.match(re) || [];
    if (hits.length) patterns.push({ name, count: hits.length, examples: hits.slice(0, 3).map((h) => h.trim()) });
  }
  const dashes = (all.match(/ — /g) || []).length;
  const semicolons = (all.match(/;/g) || []).length;
  // Staccato: two or more consecutive one- or two-word sentences outside
  // quotes ("Instant. Specific."). A rhythm tic when it recurs.
  let staccato = 0;
  for (const i of items) {
    const ss = sentences(i.text);
    for (let k = 1; k < ss.length; k++) {
      if (wordsOf(ss[k]).length <= 2 && wordsOf(ss[k - 1]).length <= 2 && !/["“]/.test(ss[k] + ss[k - 1])) staccato++;
    }
  }

  return {
    id: scenario.id,
    door: scenario.door,
    words: words.length,
    sentences: sents.length,
    avgSentence: +(words.length / Math.max(1, sents.length)).toFixed(1),
    longSentences: long.length,
    longest: [...sents].sort((a, b) => wordsOf(b).length - wordsOf(a).length).slice(0, 3),
    grade: +grade.toFixed(1),
    complexWordPct: +(100 * complexWords / Math.max(1, words.length)).toFixed(1),
    jargon,
    patterns,
    dashes,
    semicolons,
    staccato,
  };
}
