// Content quality — properties of the whole corpus that no single screen
// test can see, each from an outside review of a sister project.
//
// A player should not be able to do well by pattern. Before this test the
// best option came first in 93% of two-option questions, was never third
// of three, and was the longest option 71% of the time.

import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { scenarios } from '../scenarios/index.js';
import {
  estimateMinutes, headlineMinutes, wordCount, rangeDigits,
  WORDS_PER_MINUTE, SECONDS_PER_DECISION,
} from '../scenarios/timing.js';

// Every question the player answers: decision nodes and the recall item.
const questions = scenarios.flatMap((s) => [
  ...Object.entries(s.nodes).map(([id, n]) => ({ where: `${s.id}/${id}`, options: n.decision.choices })),
  ...(s.recall ? [{ where: `${s.id}/recall`, options: s.recall.options }] : []),
]).filter((q) => q.options.some((o) => o.quality === 'good'));

describe('the best option cannot be found by pattern', () => {
  it('sits in every position, and no position holds it much more than chance', () => {
    const byCount = {};
    for (const q of questions) {
      const n = q.options.length;
      const at = q.options.findIndex((o) => o.quality === 'good');
      (byCount[n] ??= Array(n).fill(0))[at]++;
    }
    for (const [n, counts] of Object.entries(byCount)) {
      const total = counts.reduce((a, b) => a + b, 0);
      if (total < 10) continue; // too few questions of this size to spread
      // Two options cannot do better than half each; three or more, 40%.
      const cap = Number(n) === 2 ? 0.6 : 0.4;
      counts.forEach((c, i) => {
        expect(c, `${n}-option questions: position ${i + 1} is never the best`).toBeGreaterThan(0);
        expect(c / total, `${n}-option questions: best is at position ${i + 1} in ${c} of ${total}`).toBeLessThanOrEqual(cap);
      });
    }
  });

  it('is not usually the longest option', () => {
    const longest = questions.filter((q) => {
      const len = q.options.map((o) => o.label.length);
      const best = len[q.options.findIndex((o) => o.quality === 'good')];
      return best === Math.max(...len) && len.filter((l) => l === best).length === 1;
    });
    const share = longest.length / questions.length;
    expect(share, `best option is strictly longest in ${longest.length} of ${questions.length}: `
      + longest.slice(0, 5).map((q) => q.where).join(', ')).toBeLessThanOrEqual(0.4);
  });
});

describe('times shown to players are worked out from the content', () => {
  it('adds reading time at 238 words a minute to 30 seconds a decision', () => {
    const fixture = {
      id: 'fixture', door: 'home', title: 'T', coldOpen: ['one two three'],
      nodes: {
        start: {
          prose: ['a b c d'],
          decision: { prompt: 'p', choices: [{ id: 'a', label: 'x', quality: 'good', consequence: 'c c' }] },
          branches: { a: 'outcome_x' },
        },
      },
      outcomes: { outcome_x: { heading: 'h', reaction: 'r', description: ['d'], judgement: 'j' } },
    };
    // setup 4 (title + cold open) + node 8 (prose 4, prompt, label, consequence 2) + outcome 4
    const words = 4 + 8 + 4;
    const expected = words / WORDS_PER_MINUTE + SECONDS_PER_DECISION / 60;
    expect(estimateMinutes(fixture).median).toBeCloseTo(expected, 6);
    expect(wordCount({ id: 'x', quality: 'good', label: 'two words' })).toBe(2);
  });

  it.each(scenarios.map((s) => [s.id, s]))('%s: headline sits inside its own range of routes', (_id, s) => {
    const { min, max } = estimateMinutes(s);
    expect(headlineMinutes(s)).toBeGreaterThanOrEqual(Math.floor(min));
    expect(headlineMinutes(s)).toBeLessThanOrEqual(Math.ceil(max));
  });

  it('the site-wide range is the smallest and largest scenario headline', () => {
    const ms = scenarios.map(headlineMinutes);
    expect(rangeDigits(scenarios)).toBe(`${Math.min(...ms)} to ${Math.max(...ms)} minutes`);
  });

  it('no page or script types a time in by hand', () => {
    // A hand-typed time is how "about five minutes" outlived the content it
    // described. Facilitated card sessions (twenty-five minutes, a group
    // talking) are a different measure and are allowed.
    const files = [
      ...readdirSync('src/pages').filter((f) => f.endsWith('.jsx')).map((f) => join('src/pages', f)),
      'src/components/Homepage/Homepage.jsx', 'src/player/Setup.jsx', 'scripts/build-static-pages.mjs',
    ];
    for (const f of files) {
      const text = readFileSync(f, 'utf8').replace(/twenty-five minutes/g, '');
      expect(text, f).not.toMatch(/\b(?:\d+|one|two|three|four|five|six|seven|eight|nine|ten)(?: to \w+)? min(?:ute)?s?\b/i);
      expect(text, f).not.toMatch(/PT\d+M/);
    }
  });
});

describe('invented names stay invented', () => {
  const strings = (v) => (typeof v === 'string' ? [v]
    : Array.isArray(v) ? v.flatMap(strings)
      : v && typeof v === 'object' ? Object.values(v).flatMap(strings) : []);

  it('every web address or email domain in a scenario is a reserved .example name', () => {
    for (const s of scenarios) {
      const hosts = strings(s).flatMap((t) => t.match(/\b[a-z0-9-]+(?:\.[a-z0-9-]+)*\.(?:com|net|org|ai|io|co|au|example)\b/gi) || []);
      for (const h of hosts) {
        if (/airiskpractice\.org$/.test(h)) continue;
        expect(h, `${s.id}: ${h} could be a real domain`).toMatch(/\.example$/);
      }
    }
  });

  it('does not use names found to belong to real organisations in the same field', () => {
    // Checked October 2026: DraftWise is an AI legal-drafting company,
    // RadAssist is radiology software, Brightline Interactive is an AI-data
    // company, Northwind Group is a finance firm, NetGuard is a firewall app.
    const taken = /\b(?:DraftWise|RadAssist|Brightline|Northwind|NetGuard)\b/i;
    for (const s of scenarios) {
      for (const t of strings(s)) expect(t, s.id).not.toMatch(taken);
    }
  });
});
