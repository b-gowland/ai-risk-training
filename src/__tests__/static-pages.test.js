// Static pages — build-output test.
//
// scripts/build-static-pages.mjs is a third renderer of the scenario
// registry, same risk class as the app and the discussion cards: valid
// data, wrong fields, a blank or spoiling page, every other gate green.
// This test runs `vite build` for real and inspects dist/, because the
// script's output is what a non-JS crawler actually sees — nothing about
// it is exercised by the component tests in this suite.
//
// DECIDED 20 Sep (Ben): static scenario pages show the tell only. The
// negative assertions here (no consequence/reaction/debrief/recall text)
// are the enforcement of that decision, not a style preference — loosen
// them only if that decision changes.

import { execSync } from 'node:child_process';
import { existsSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it, expect, beforeAll } from 'vitest';
import { scenarios } from '../scenarios/index.js';

const DIST = join(process.cwd(), 'dist');
const read = (p) => readFileSync(join(DIST, p), 'utf8');

// Body content is written through the same HTML-entity escaping the app
// itself relies on (a literal " in source becomes &quot; in markup), so a
// raw-string match against unescaped scenario text is the wrong tool — it's
// what caused a false failure on home-algorithm-said-no's cold open, which
// contains a literal quote. Parse to text, the way a reader (or a search
// snippet) actually sees it, for every check that touches authored prose.
const textOf = (html) => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent.replace(/\s+/g, ' ').trim();
};
const norm = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();

beforeAll(() => {
  rmSync(DIST, { recursive: true, force: true });
  // The real build, not a mock — this is the point of the test.
  execSync('npm run build', { stdio: 'pipe' });
}, 60_000);

describe('static pages (dist/, post-build)', () => {
  it('writes an index page for every scenario plus the /scenarios/ and /cards/ hubs', () => {
    expect(existsSync(join(DIST, 'scenarios', 'index.html'))).toBe(true);
    expect(existsSync(join(DIST, 'cards', 'index.html'))).toBe(true);
    for (const s of scenarios) {
      expect(existsSync(join(DIST, 'scenarios', s.id, 'index.html')), s.id).toBe(true);
    }
  });

  it.each(scenarios.map((s) => [s.id, s]))('%s: page carries its title, cold open and tell', (_id, s) => {
    const html = read(`scenarios/${s.id}/index.html`);
    const text = textOf(html);
    expect(text).toContain(norm(s.title));
    expect(text).toContain(norm(s.coldOpen[0]));
    expect(text).toContain(norm(s.tell));
    expect(html).toContain(`/#/scenario/${s.id}`); // a real href, not prose — raw match is correct here
  });

  it.each(scenarios.map((s) => [s.id, s]))('%s: page never shows a consequence, reaction, debrief frame or recall note', (_id, s) => {
    const text = textOf(read(`scenarios/${s.id}/index.html`));
    const start = s.nodes[s.entry || 'start'];
    for (const choice of start.decision.choices) {
      expect(text, 'leaked a consequence').not.toContain(norm(choice.consequence));
    }
    for (const outcome of Object.values(s.outcomes)) {
      expect(text, 'leaked an outcome reaction').not.toContain(norm(outcome.reaction));
    }
    expect(text, 'leaked the debrief frame').not.toContain(norm(s.debrief.frame[0]));
    for (const opt of s.recall.options) {
      expect(text, 'leaked a recall note').not.toContain(norm(opt.note));
    }
  });

  it('scenarios index lists all nine with working relative links', () => {
    const html = read('scenarios/index.html');
    const text = textOf(html);
    for (const s of scenarios) {
      expect(html).toContain(`/scenarios/${s.id}/`);
      expect(text).toContain(norm(s.shelfLine));
    }
  });

  it('sitemap.xml lists the root, both hubs, and all nine scenario pages — nothing else', () => {
    const xml = read('sitemap.xml');
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    expect(locs).toContain('https://app.airiskpractice.org/');
    expect(locs).toContain('https://app.airiskpractice.org/scenarios/');
    expect(locs).toContain('https://app.airiskpractice.org/cards/');
    for (const s of scenarios) {
      expect(locs).toContain(`https://app.airiskpractice.org/scenarios/${s.id}/`);
    }
    expect(locs.length).toBe(3 + scenarios.length);
  });

  it('the SPA entry point has real content in #root, not an empty div', () => {
    const html = read('index.html');
    expect(html).not.toContain('<div id="root"></div>');
    expect(html).toContain('id="root"');
    const text = textOf(html);
    for (const s of scenarios) expect(text).toContain(norm(s.shelfLine));
  });

  it('index.html enables Plausible hash-based routing', () => {
    expect(read('index.html')).toContain('hashBasedRouting: true');
  });

  it('index.html and every scenario page declare a canonical URL', () => {
    expect(read('index.html')).toContain('rel="canonical" href="https://app.airiskpractice.org/"');
    for (const s of scenarios) {
      expect(read(`scenarios/${s.id}/index.html`)).toContain(
        `rel="canonical" href="https://app.airiskpractice.org/scenarios/${s.id}/"`
      );
    }
  });

  it('carries no personal name anywhere in the built output', () => {
    for (const s of scenarios) {
      expect(textOf(read(`scenarios/${s.id}/index.html`))).not.toMatch(/Gowland/);
    }
    expect(textOf(read('index.html'))).not.toMatch(/Gowland/);
    expect(textOf(read('cards/index.html'))).not.toMatch(/Gowland/);
  });
});
