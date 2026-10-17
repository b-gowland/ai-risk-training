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
