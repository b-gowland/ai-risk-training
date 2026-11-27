// Privacy claims — the Privacy page and the app's "nothing scored" line,
// held to what the code actually does.
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
// The Privacy page says what is sent: ids, quality ratings, outcome ids and
// categories, score, door, play number, share method, action id, print
// scope. It says choice labels and free text are never sent, and the app
// says "nothing scored". Play a scenario for real and hold the code to it.
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ScenarioPlayer from '../player/ScenarioPlayer.jsx';
import { byId } from '../scenarios/index.js';

describe('privacy claims match what the code sends', () => {
  beforeEach(() => { window.plausible = vi.fn(); });
  afterEach(() => { cleanup(); delete window.plausible; });

  const ALLOWED = new Set(['scenario_id', 'scenario_title', 'node_id', 'choice_quality', 'item_id',
    'outcome_id', 'outcome_tone', 'door', 'score', 'play_number', 'share_method', 'action', 'scope']);

  it('a full playthrough sends only listed properties, no choice text, and shows no score', () => {
    const sc = byId('home-voice-clone');
    const { container } = render(
      <MemoryRouter initialEntries={[`/scenario/${sc.id}`]}>
        <Routes><Route path="/scenario/:id" element={<ScenarioPlayer />} /></Routes>
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('button', { name: sc.begin }));
    // Take the first option at every decision until the debrief.
    for (let i = 0; i < 10; i++) {
      // Skip the pause-and-flag step where a node has one.
      const skip = screen.queryByRole('button', { name: 'Skip this' });
      if (skip) fireEvent.click(skip);
      const opts = container.querySelectorAll('main ul button');
      if (!opts.length) break;
      fireEvent.click(opts[0]);
      fireEvent.click(screen.getByRole('button', { name: 'Keep going' }));
    }
    fireEvent.click(screen.getByRole('button', { name: 'Go on' }));
    fireEvent.click(screen.getByRole('button', { name: sc.recall.options[0].label }));

    const labels = Object.values(sc.nodes).flatMap((n) => n.decision.choices.map((c) => c.label));
    const calls = window.plausible.mock.calls;
    expect(calls.length).toBeGreaterThan(3);
    for (const [, opts] of calls) {
      for (const [k, v] of Object.entries(opts?.props || {})) {
        expect(ALLOWED.has(k), `property '${k}' is not listed on the Privacy page`).toBe(true);
        expect(labels).not.toContain(v);
        expect(String(v).split(/\s+/).length, `${k} looks like free text`).toBeLessThanOrEqual(5);
      }
    }
    // "Nothing scored": the outcome score routes the ending and is reported,
    // but the player never sees a number for it.
    const scores = Object.values(sc.outcomes).map((o) => String(o.score));
    const text = container.textContent;
    for (const s of scores) expect(text).not.toMatch(new RegExp(`\\b${s}\\b(?!\\s*(?:dollars|minutes|seconds))`));
    expect(text).not.toMatch(/\bscore\b/i);
  });
});

describe('the Privacy page names every outside party the site contacts', () => {
  afterEach(() => cleanup());

  it('Plausible is the only outside host the site may contact, and the page says so', async () => {
    // The page says Plausible is the only third party and the fonts come from
    // the site itself (Google Fonts removed 26 Nov). The CSP decides what a
    // browser may contact, so hold the page to it.
    const { CSP } = await import('../../scripts/lib/csp.mjs');
    const hosts = new Set([...CSP.matchAll(/https:\/\/([^\s;]+)/g)].map((m) => m[1]));
    expect([...hosts]).toEqual(['plausible.io']);

    const { Privacy } = await import('../pages/Privacy.jsx');
    const { container } = render(<MemoryRouter><Privacy /></MemoryRouter>);
    const text = container.textContent.replace(/\s+/g, ' ');
    expect(text).toContain('Plausible Analytics is the only third party');
    expect(text).toMatch(/serves its own fonts/);
    expect(text).toMatch(/this app, the reference library and the Governance Baseline/);
    expect(container.querySelector('a[href="https://baseline.airiskpractice.org/disclaimer"]')).toBeTruthy();
  });
});
