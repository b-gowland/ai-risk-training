// Navigation between scenarios.
//
// Found 2 Aug 2026 from user feedback, not from a gate: tapping a "Try another"
// card on the Close screen changed the URL but not the player's state, because
// React reuses a component across a route change and the useReducer lazy
// initialiser only runs on mount. The player stayed in whatever phase it was
// in, so from the Close screen you arrived at the NEXT scenario's Close screen
// — frame analysis, recall and tell — without playing it. Every gate was green.
//
// These tests exercise real in-app navigation. A rerender with a fresh router
// remounts everything and cannot catch this class, which is why the first
// attempt at reproducing it passed against the broken build.

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter, Routes, Route, Link } from 'react-router-dom';
import App from '../App.jsx';
import ScenarioPlayer from '../player/ScenarioPlayer.jsx';
import { scenarios } from '../scenarios/index.js';

const Machine = () => (
  <Routes><Route path="/scenario/:id" element={<ScenarioPlayer />} /></Routes>
);

const byName = (name) => screen.getByRole('button', { name });
const keepGoing = () => {
  const b = screen.queryAllByRole('button').find((x) => x.textContent.trim() === 'Keep going');
  if (b) fireEvent.click(b);
};
const setupControls = scenarios.map((s) => s.begin).filter(Boolean);
const onASetupScreen = () =>
  screen.queryAllByRole('button').some((b) => setupControls.includes(b.textContent.trim()));

describe('navigating from one scenario to another', () => {
  it('mid-play: a route change lands on the new scenario Setup', () => {
    render(
      <MemoryRouter initialEntries={['/scenario/home-voice-clone']}>
        <Link to="/scenario/f2-shadow-ai">go</Link>
        <Machine />
      </MemoryRouter>
    );
    expect(document.activeElement).toBe(screen.getByRole('article', { name: scenarios[0].title }));

    fireEvent.click(byName('Answer it'));
    expect(screen.queryByRole('button', { name: /Send the money/ })).toBeTruthy();
    expect(document.activeElement).toBe(screen.getByRole('article', { name: 'Decision 1' }));

    fireEvent.click(screen.getByText('go'));
    expect(screen.queryByRole('button', { name: 'Open the file' })).toBeTruthy();
    const nextScenario = scenarios.find((scenario) => scenario.id === 'f2-shadow-ai');
    expect(document.activeElement).toBe(screen.getByRole('article', { name: nextScenario.title }));
  });

  it('from the Close screen: "Try another" starts the next scenario at Setup, unspoiled', () => {
    render(<MemoryRouter initialEntries={['/scenario/home-voice-clone']}><Machine /></MemoryRouter>);
    fireEvent.click(byName('Answer it'));
    fireEvent.click(byName(`Say you'll call her straight back, and hang up`)); keepGoing();
    fireEvent.click(byName('Wait it out')); keepGoing();
    fireEvent.click(byName('All of it, plainly')); keepGoing();
    fireEvent.click(byName('Tell the family group chat what happened, in plain terms')); keepGoing();
    const toClose = screen.queryAllByRole('button').find((b) => !/Keep going/.test(b.textContent));
    fireEvent.click(toClose);

    const card = screen.queryAllByRole('link').find((a) => /At home|At work/.test(a.textContent));
    expect(card, 'Close screen should offer another scenario').toBeTruthy();

    fireEvent.click(card);

    expect(onASetupScreen(), 'should arrive at the new scenario Setup').toBe(true);
    // The new scenario's ending must not be on screen.
    expect(document.body.textContent).not.toContain('approved for this kind of information');
  });
});

describe('navigating between top-level pages', () => {
  it('moves focus to the new route main content', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<App />}>
            <Route path="/" element={<main id="main-content" tabIndex={-1}>Home route</main>} />
            <Route path="/about" element={<main id="main-content" tabIndex={-1}>About route</main>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(document.activeElement).toBe(screen.getByText('Home route'));
    fireEvent.click(screen.getByRole('link', { name: 'About' }));
    expect(document.activeElement).toBe(screen.getByText('About route'));
  });
});
