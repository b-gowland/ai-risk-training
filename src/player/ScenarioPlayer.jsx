// ScenarioPlayer — hosts the four-beat machine and nothing else.
// All hooks live here so App() stays a pure router (an old defect class:
// hooks in App made ordering bugs that only showed in the browser).

import { useReducer, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { scenarios, KNOWN_IDS } from '../scenarios/index.js';
import {
  STATES, reducer, createInitialState,
  getNode, getOutcome, getRevealedChoice, getNext,
} from '../engine/narrativeEngine.js';
import {
  trackScenarioStarted, trackDecisionMade, trackDebriefViewed,
  trackScenarioCompleted, trackRecallAnswered, trackCommitmentSelected,
  trackReplayChosen, trackCardShared,
} from '../utils/analytics.js';
import { depthBand } from './depth.js';
import Setup from './Setup.jsx';
import Decision from './Decision.jsx';
import Debrief from './Debrief.jsx';
import Close from './Close.jsx';
import s from './Player.module.css';

export default function ScenarioPlayer() {
  const { id } = useParams();
  const scenario = scenarios.find((sc) => sc.id === id) || null;

  const [state, dispatch] = useReducer(reducer, scenario, createInitialState);

  const node = scenario ? getNode(scenario, state.nodeId) : null;
  const outcome = scenario ? getOutcome(scenario, state.outcomeId) : null;
  const revealedChoice = scenario ? getRevealedChoice(scenario, state) : null;

  const band = useMemo(() => (scenario ? depthBand(scenario) : { min: 1, max: 1 }), [scenario]);

  const decisionIndex = useMemo(
    () => state.path.filter((p) => p.nodeId !== state.nodeId).length + 1,
    [state.path, state.nodeId]
  );

  useEffect(() => { window.scrollTo(0, 0); }, [state.phase, state.nodeId]);

  useEffect(() => {
    if (state.phase === STATES.DEBRIEF && scenario && outcome) {
      trackDebriefViewed(scenario.id, state.outcomeId);
      trackScenarioCompleted(
        scenario.id, state.outcomeId, outcome.tone, scenario.door,
        outcome.score, 1
      );
    }
  }, [state.phase, state.outcomeId, scenario, outcome]);

  if (!scenario) {
    // A link from the knowledge base to a scenario that is not currently
    // playable is a real and common case, not an error. Say so plainly and
    // send the reader to the reference entry, which has the full risk detail.
    const known = KNOWN_IDS.includes(id);
    return (
      <div className={s.missing}>
        <h1 className={s.title}>
          {known ? 'This one isn\u2019t playable right now' : 'That situation isn\u2019t here'}
        </h1>
        <p>
          {known
            ? 'The app is being rebuilt and this scenario has not come across yet. Some will not \u2014 the reference entry behind it stays either way, and it carries the full detail.'
            : 'The link may be old or mistyped. Everything that is playable is one tap away.'}
        </p>
        <p className={s.missingLinks}>
          <Link to="/">See what you can play</Link>
          <a href="https://library.airiskpractice.org" target="_blank" rel="noreferrer">
            Reference library
          </a>
        </p>
      </div>
    );
  }

  const begin = () => {
    trackScenarioStarted(scenario.id, scenario.title);
    dispatch({ type: 'BEGIN' });
  };

  const commit = (choice) => {
    trackDecisionMade(scenario.id, state.nodeId, choice.quality);
    dispatch({ type: 'COMMIT', payload: { nodeId: state.nodeId, choice } });
  };

  const advance = () => {
    const next = getNext(scenario, state);
    dispatch({ type: 'ADVANCE', payload: { next } });
  };

  const answerRecall = (choiceId) => {
    const opt = scenario.recall.options.find((o) => o.id === choiceId);
    trackRecallAnswered(scenario.id, scenario.recall.id || 'recall', opt ? opt.quality : 'skipped');
    dispatch({ type: 'ANSWER_RECALL', payload: { choiceId } });
  };

  const chooseAct = (actId) => {
    trackCommitmentSelected(scenario.id, actId);
    dispatch({ type: 'CHOOSE_ACT', payload: { actId } });
  };

  const replay = () => {
    trackReplayChosen(scenario.id);
    dispatch({ type: 'REPLAY', payload: { scenario } });
  };

  return (
    <main className={s.stage}>
      {state.phase === STATES.SETUP && (
        <Setup scenario={scenario} onBegin={begin} />
      )}

      {state.phase === STATES.DECISION && node && (
        <Decision
          node={node}
          index={decisionIndex}
          minDepth={band.min}
          revealedChoice={revealedChoice}
          onCommit={commit}
          onAdvance={advance}
        />
      )}

      {state.phase === STATES.DEBRIEF && outcome && (
        <Debrief outcome={outcome} onClose={() => dispatch({ type: 'TO_CLOSE' })} />
      )}

      {state.phase === STATES.CLOSE && (
        <Close
          scenario={scenario}
          recallAnswer={state.recallAnswer}
          actChoice={state.actChoice}
          onRecall={answerRecall}
          onAct={chooseAct}
          onReplay={replay}
          onShared={() => trackCardShared(scenario.id, outcome?.tone, 'tell')}
        />
      )}
    </main>
  );
}
