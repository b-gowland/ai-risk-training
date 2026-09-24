// Events must go through the site script (window.plausible) so they land in the
// same Plausible property as pageviews. A separate tracker package once sent
// them to a different property keyed on the app hostname.
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import * as analytics from '../utils/analytics.js';

describe('analytics', () => {
  beforeEach(() => { window.plausible = vi.fn(); });
  afterEach(() => { delete window.plausible; });

  it('sends events through window.plausible with name and props', () => {
    analytics.trackScenarioStarted('f1-automation-bias', 'Title');
    expect(window.plausible).toHaveBeenCalledWith('Scenario Started', {
      props: { scenario_id: 'f1-automation-bias', scenario_title: 'Title' },
    });
  });

  it('uses the event names the goal-setup comment tells the dashboard to register', () => {
    analytics.trackScenarioStarted('s', 't');
    analytics.trackDecisionMade('s', 'n', 'good');
    analytics.trackRecallAnswered('s', 'i', 'good');
    analytics.trackDebriefViewed('s', 'o');
    analytics.trackScenarioCompleted('s', 'o', 'good', 'home', 100, 1);
    analytics.trackCommitmentSelected('s', 'c1');
    analytics.trackCardShared('s', 'good', 'copy');
    analytics.trackReplayChosen('s');
    analytics.trackCardsPrinted('all');
    const fired = window.plausible.mock.calls.map(c => c[0]);
    const src = readFileSync(resolve(process.cwd(), 'src/utils/analytics.js'), 'utf8');
    const goalBlock = src.slice(src.indexOf('GOAL SETUP'), src.indexOf('An event with no matching goal'));
    for (const name of fired) expect(goalBlock).toContain(`'${name}'`);
    expect(new Set(fired).size).toBe(9);
  });

  it('never throws when the Plausible script has not loaded', () => {
    delete window.plausible;
    expect(() => analytics.trackDecisionMade('s', 'n', 'good')).not.toThrow();
  });

  it('never throws when the Plausible script itself throws', () => {
    window.plausible = () => { throw new Error('boom'); };
    expect(() => analytics.trackReplayChosen('s')).not.toThrow();
  });

  it('exports no tracker without a caller (dead events cannot be registered as goals)', () => {
    expect(Object.keys(analytics).sort()).toEqual([
      'trackCardShared', 'trackCardsPrinted', 'trackCommitmentSelected',
      'trackDebriefViewed', 'trackDecisionMade', 'trackRecallAnswered',
      'trackReplayChosen', 'trackScenarioCompleted', 'trackScenarioStarted',
    ]);
  });
});
