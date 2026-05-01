// EverydayPlayer.jsx
// Everyday bundle scenario player.
// Uses shared narrativeEngine. Single 'player' persona — skips persona select.
// Swipe-left/right choice mechanic. No score bar. Lean outcome screen.

import { useReducer, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  STATES, createInitialState, reducer,
  resolveNext, getCurrentNode, getOutcome,
} from '../engine/narrativeEngine.js';
import { getEverydayScene } from './EverydayScenes.jsx';
import { ShareCard } from './ShareCard.jsx';
import styles from './EverydayBundle.module.css';
import {
  trackScenarioStarted, trackDecisionMade,
  trackScenarioCompleted, trackReplayChosen,
} from '../utils/analytics.js';

const QUALITY_LABEL = { good: 'Good call', partial: 'Partially right', poor: 'Missed this one' };
const QUALITY_CLASS  = { good: styles.qualityGood, partial: styles.qualityPartial, poor: styles.qualityPoor };
const TONE_CLASS     = { good: styles.toneGood, warn: styles.toneWarn, bad: styles.toneBad };

function getLocalFeedback(choice) {
  return choice.note;
}

// ── Scene ────────────────────────────────────────────────────────
function EverydayScene({ node }) {
  return (
    <div className={styles.sceneWrap}>
      {getEverydayScene(node.scene || 'phone-call')}
    </div>
  );
}

// ── Swipe node ───────────────────────────────────────────────────
function SwipeNode({ node, onSelect }) {
  const [swipeDir, setSwipeDir] = useState(null); // null | 'left' | 'right'
  const touchStartX = useRef(null);
  const choices = node.decision.choices; // always exactly 2

  function handleTouchStart(e) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchMove(e) {
    if (touchStartX.current === null) return;
    const dx = e.touches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 20) {
      setSwipeDir(dx < 0 ? 'left' : 'right');
    }
  }

  function handleTouchEnd() {
    if (swipeDir === 'left')  commitChoice(0);
    else if (swipeDir === 'right') commitChoice(1);
    else setSwipeDir(null);
    touchStartX.current = null;
  }

  function commitChoice(idx) {
    const choice = choices[idx];
    const nextId  = resolveNext(node, choice.id);
    setSwipeDir(null);
    onSelect(choice, nextId);
  }

  const cardClass = [
    styles.nodeCard,
    swipeDir === 'left'  ? styles.swipingLeft  : '',
    swipeDir === 'right' ? styles.swipingRight : '',
  ].filter(Boolean).join(' ');

  return (
    <div
      className={cardClass}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <p className={styles.nodePrompt}>{node.decision.prompt}</p>
      <div className={styles.swipeChoices}>
        <button className={`${styles.swipeBtn} ${styles.swipeBtnLeft}`} onClick={() => commitChoice(0)}>
          <span className={styles.swipeDir}>← Swipe left</span>
          {choices[0].label}
        </button>
        <button className={`${styles.swipeBtn} ${styles.swipeBtnRight}`} onClick={() => commitChoice(1)}>
          <span className={styles.swipeDir}>Swipe right →</span>
          {choices[1].label}
        </button>
      </div>
    </div>
  );
}

// ── Feedback ─────────────────────────────────────────────────────
function EverydayFeedback({ choice, feedbackText, loading, onContinue }) {
  return (
    <div className={styles.feedbackWrap}>
      <span className={`${styles.feedbackQuality} ${QUALITY_CLASS[choice.quality] || styles.qualityPoor}`}>
        {QUALITY_LABEL[choice.quality] || 'Missed this one'}
      </span>
      <p className={styles.feedbackChoice}>"{choice.label}"</p>
      {loading
        ? <p className={styles.feedbackNote} style={{ opacity: 0.5 }}>…</p>
        : <p className={styles.feedbackNote}>{feedbackText}</p>
      }
      {!loading && (
        <button className={styles.continueBtn} onClick={onContinue}>Continue →</button>
      )}
    </div>
  );
}

// ── Outcome ──────────────────────────────────────────────────────
function EverydayOutcome({ outcome, scenario, onReplay, onBack }) {
  const toneClass = TONE_CLASS[outcome.tone] || styles.toneWarn;

  return (
    <div className={styles.outcomeWrap}>
      <div className={`${styles.outcomeCard} ${toneClass}`}>
        <div className={styles.outcomeLabel}>
          {outcome.outcome_label || outcome.heading}
        </div>
        <p className={styles.outcomeResult}>{outcome.result}</p>
        <div className={styles.learningBox}>
          <div className={styles.learningLabel}>Key learning</div>
          <p className={styles.learningText}>{outcome.learning}</p>
        </div>
      </div>

      <ShareCard scenario={scenario} outcome={outcome} />

      <div className={styles.outcomeActions}>
        <button className={styles.replayBtn} onClick={onReplay}>
          ↩ Try a different choice
        </button>
        <a href={scenario.kb_url} target="_blank" rel="noopener noreferrer" className={styles.allScenariosLink}>
          Learn more about {scenario.risk_ref} ↗
        </a>
        <button className={styles.replayBtn} onClick={onBack} style={{ fontSize: 13 }}>
          ← All scenarios
        </button>
      </div>
    </div>
  );
}

// ── Player ───────────────────────────────────────────────────────
export function EverydayPlayer({ scenario, onBack }) {
  const [state, dispatch] = useReducer(reducer, scenario, createInitialState);

  // Auto-select the single 'player' persona on mount — skip persona screen
  useEffect(() => {
    if (state.state === STATES.PERSONA_SELECT) {
      dispatch({ type: 'SELECT_PERSONA', payload: 'player' });
      trackScenarioStarted(scenario.id, scenario.title);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-advance nodes with no decision
  useEffect(() => {
    if (state.state !== STATES.NODE) return;
    const node = getCurrentNode(scenario, state.persona, state.currentNodeId);
    if (!node || node.decision) return;
    const nextId = node.branches?.auto;
    if (!nextId) return;
    dispatch({ type: 'AUTO_ADVANCE', payload: { nextNodeId: nextId } });
  }, [state.state, state.currentNodeId, state.persona, scenario]);

  // Generate feedback
  useEffect(() => {
    if (!state.feedbackLoading || !state.selectedChoice) return;
    const lastEntry = state.history[state.history.length - 1];
    if (!lastEntry) return;
    const node = getCurrentNode(scenario, state.persona, lastEntry.nodeId);
    if (!node?.decision) return;
    const choice = node.decision.choices.find(c => c.id === state.selectedChoice.id);
    if (!choice) return;
    const text = getLocalFeedback(choice);
    const t = setTimeout(() => dispatch({ type: 'FEEDBACK_LOADED', payload: text }), 400);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.feedbackLoading]);

  // Track outcome reached
  useEffect(() => {
    if (state.state !== STATES.OUTCOME || !state.outcomeId) return;
    const outcome = getOutcome(scenario, state.persona, state.outcomeId);
    if (!outcome) return;
    trackScenarioCompleted(scenario.id, state.outcomeId, outcome.tone, 'player');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.state, state.outcomeId]);

  // Track decision made
  function handleChoice(choice, nextId) {
    const node = getCurrentNode(scenario, state.persona, state.currentNodeId);
    if (node) trackDecisionMade(scenario.id, state.currentNodeId, choice.quality);
    dispatch({ type: 'SELECT_CHOICE', payload: { choice, nextNodeId: nextId } });
  }

  const currentNode    = getCurrentNode(scenario, state.persona, state.currentNodeId);
  const currentOutcome = getOutcome(scenario, state.persona, state.outcomeId);

  // Still on persona select (auto-advancing) — show nothing
  if (state.state === STATES.PERSONA_SELECT) return null;

  return (
    <div className={styles.playerWrap}>
      <div className={styles.playerMain}>

        {/* Premise */}
        {state.state === STATES.PREMISE && (
          <div className={styles.premiseWrap}>
            <div className={styles.premiseScenarioLabel}>{scenario.subtitle}</div>
            <h1 className={styles.premiseTitle}>{scenario.title}</h1>
            <div className={styles.premiseCard}>
              <p>{scenario.personas.player.premise}</p>
            </div>
            <button className={styles.startBtn} onClick={() => dispatch({ type: 'START_SCENARIO' })}>
              Start →
            </button>
          </div>
        )}

        {/* Node */}
        {state.state === STATES.NODE && currentNode && (
          <>
            <EverydayScene node={currentNode} />
            {currentNode.caption && (
              <p className={styles.sceneCaption}>{currentNode.caption}</p>
            )}
            {currentNode.sub_caption && (
              <p className={styles.sceneCaptionSub}>{currentNode.sub_caption}</p>
            )}
            {currentNode.decision && (
              <SwipeNode node={currentNode} onSelect={handleChoice} />
            )}
          </>
        )}

        {/* Feedback */}
        {state.state === STATES.FEEDBACK && state.selectedChoice && (
          <>
            {currentNode && <EverydayScene node={currentNode} />}
            <EverydayFeedback
              choice={state.selectedChoice}
              feedbackText={state.feedbackText}
              loading={state.feedbackLoading}
              onContinue={() => dispatch({ type: 'CONTINUE_FROM_FEEDBACK' })}
            />
          </>
        )}

        {/* Outcome */}
        {state.state === STATES.OUTCOME && currentOutcome && (
          <EverydayOutcome
            outcome={currentOutcome}
            scenario={scenario}
            onReplay={() => {
              trackReplayChosen(scenario.id);
              dispatch({ type: 'RESTART', payload: scenario });
            }}
            onBack={onBack}
          />
        )}

      </div>
    </div>
  );
}
