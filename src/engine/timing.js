// timing.js — how long a scenario takes, worked out from what it says.
//
// Every time shown to a player (homepage, About, cards, static pages,
// structured data, llms.txt) comes from here, so a content change moves
// the number with it. Hand-written labels drifted: At Home said "about five
// minutes" for scenarios that take six or seven to read and decide.
//
// Reading speed: 238 words a minute, the average silent reading rate for
// adults reading non-fiction in English (Brysbaert 2019, "How many words do
// we read per minute?", Journal of Memory and Language 109).
// Decisions: 30 seconds each, for weighing the options before choosing.
// Recall and the "one thing this week" pick count as decisions.
//
// A scenario's headline is the median over every route through it, rounded
// to the nearest minute: half of plays are quicker, half slower.

import { resolveParas } from './narrativeEngine.js';

export const WORDS_PER_MINUTE = 238;
export const SECONDS_PER_DECISION = 30;

const SKIP = new Set(['id', 'type', 'quality', 'tone', 'score', 'when', 'unless', 'heading_level']);
export function wordCount(v) {
  if (v == null) return 0;
  if (typeof v === 'string') return v.split(/\s+/).filter(Boolean).length;
  if (Array.isArray(v)) return v.reduce((n, x) => n + wordCount(x), 0);
  if (typeof v === 'object') {
    return Object.entries(v).reduce((n, [k, x]) => n + (SKIP.has(k) ? 0 : wordCount(x)), 0);
  }
  return 0;
}

const cache = new WeakMap();

/** Minutes for every route through a scenario: { min, median, max, routes }. */
export function estimateMinutes(scenario) {
  if (cache.has(scenario)) return cache.get(scenario);
  const setup = wordCount([scenario.title, scenario.coldOpen, scenario.standing, scenario.authority, scenario.ending]);
  // Close: the frame, the recall question and its options, one note, the
  // tell, and the action list. The note is the longest, to stay on the
  // safe side of the estimate.
  const recall = scenario.recall;
  const close = wordCount([scenario.debrief?.frame, scenario.debrief?.keyLine, recall?.prompt, recall?.context,
    (recall?.options || []).map((o) => o.label), scenario.tell, (scenario.act || []).map((a) => a.label)])
    + Math.max(0, ...(recall?.options || []).map((o) => wordCount(o.note)));
  const closeDecisions = (recall ? 1 : 0) + (scenario.act?.length ? 1 : 0);

  const minutes = [];
  const walk = (id, words, decisions, path) => {
    if (id.startsWith('outcome_')) {
      const o = scenario.outcomes[id];
      const w = setup + words + close + wordCount([o.heading, o.reaction, resolveParas(o.description, path), o.judgement]);
      minutes.push(w / WORDS_PER_MINUTE + ((decisions + closeDecisions) * SECONDS_PER_DECISION) / 60);
      return;
    }
    const n = scenario.nodes[id];
    const base = wordCount([resolveParas(n.prose, path), n.artefact, n.decision.prompt, n.decision.choices.map((c) => c.label)]);
    for (const c of n.decision.choices) {
      walk(n.branches?.[c.id] || n.next, words + base + wordCount(c.consequence), decisions + 1,
        [...path, { nodeId: id, choiceId: c.id }]);
    }
  };
  walk(scenario.entry || 'start', 0, 0, []);
  minutes.sort((a, b) => a - b);
  const mid = minutes.length / 2;
  const median = minutes.length % 2 ? minutes[Math.floor(mid)] : (minutes[mid - 1] + minutes[mid]) / 2;
  const result = { min: minutes[0], median, max: minutes.at(-1), routes: minutes.length };
  cache.set(scenario, result);
  return result;
}

/** The headline: median minutes, rounded. */
export const headlineMinutes = (scenario) => Math.max(1, Math.round(estimateMinutes(scenario).median));

const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen'];
const spell = (n) => WORDS[n] ?? String(n);

/** Smallest and largest headline across a set of scenarios. */
export function minuteRange(list) {
  const ms = list.map(headlineMinutes);
  return { lo: Math.min(...ms), hi: Math.max(...ms) };
}

/** "about seven minutes" / "six to seven minutes" for a set of scenarios. */
export function rangeWords(list) {
  const { lo, hi } = minuteRange(list);
  return lo === hi ? `about ${spell(lo)} minutes` : `${spell(lo)} to ${spell(hi)} minutes`;
}

/** "6 to 10 minutes" for a set of scenarios, in digits. */
export function rangeDigits(list) {
  const { lo, hi } = minuteRange(list);
  return lo === hi ? `${lo} minutes` : `${lo} to ${hi} minutes`;
}

/** Labels for one scenario. */
export const minutesWords = (scenario) => `about ${spell(headlineMinutes(scenario))} minutes`;
export const minutesShort = (scenario) => `${headlineMinutes(scenario)} min`;
export const isoDuration = (scenario) => `PT${headlineMinutes(scenario)}M`;
