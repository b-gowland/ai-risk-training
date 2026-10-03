// SCORM wiring. The adapter has its own call-order test (npm run test:scorm),
// but that test cannot see whether the player ever calls it. The four-beat
// rebuild (7c0b064, 1 Aug 2026) dropped the calls, and every LMS package built
// after it launched, played, and reported nothing. This test plays a scenario
// to its debrief and checks the player reports it.

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

vi.mock('../utils/scorm.js', () => ({
  scormInit: vi.fn(() => false),
  scormComplete: vi.fn(),
  scormTerminate: vi.fn(),
}));

import { scormInit, scormComplete } from '../utils/scorm.js';
import ScenarioPlayer from '../player/ScenarioPlayer.jsx';
import { byId } from '../scenarios/index.js';

const byName = (name) => screen.getByRole('button', { name });
const keepGoing = () => {
  const b = screen.queryAllByRole('button').find((x) => x.textContent.trim() === 'Keep going');
  if (b) fireEvent.click(b);
};

describe('SCORM reporting from the player', () => {
  it('initialises on mount and reports completion when the debrief opens', () => {
    render(
      <MemoryRouter initialEntries={['/scenario/home-voice-clone']}>
        <Routes><Route path="/scenario/:id" element={<ScenarioPlayer />} /></Routes>
      </MemoryRouter>
    );
    expect(scormInit).toHaveBeenCalled();
    expect(scormComplete).not.toHaveBeenCalled();

    fireEvent.click(byName('Answer it'));
    fireEvent.click(byName(`Say you'll call her straight back, and hang up`)); keepGoing();
    fireEvent.click(byName('Wait it out')); keepGoing();
    fireEvent.click(byName('All of it, plainly')); keepGoing();
    fireEvent.click(byName('Tell the family group chat what happened, in plain terms')); keepGoing();

    expect(scormComplete).toHaveBeenCalledTimes(1);
    const report = scormComplete.mock.calls[0][0];
    const outcome = byId('home-voice-clone').outcomes[report.outcomeId];
    expect(outcome, `reported outcome ${report.outcomeId} exists`).toBeTruthy();
    expect(report).toEqual({
      scenarioId: 'home-voice-clone',
      outcomeId: report.outcomeId,
      tone: outcome.tone,
      door: 'home',
      score: outcome.score,
    });
  });
});
