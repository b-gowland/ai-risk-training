// Debrief beat — consequence review that closes a unit (Unit Loop, beat 4 of 4).
//
// Reached from the outcome screen. Shows (when authored): modelled expert
// reasoning for the specific outcome the learner reached, up to three key
// takeaways, a "take one with you" action picker, an open reflection
// prompt, and one transfer prompt. No verdict-dumping — the learner has
// already seen the consequence; this beat models how an experienced
// practitioner reads it, then closes on one concrete action.
//
// Privacy stance: the reflection prompt is displayed, not captured. The
// action picker records only a content-defined id ('c1'… or 'skip') — via
// dispatch into the decision record and an anonymous analytics event.
// No free text is ever captured on this screen.
//
// Schema (see README.md in this folder):
//   debrief: {
//     reflection_prompt?: string,
//     transfer_prompt?:   string,
//     takeaways?:         [string],           // <=3, one sentence each
//     commit?: {
//       prompt:  string,
//       options: [{ id, label, detail? }],    // 2-4 concrete actions
//     },                                      // a skip option is always
//                                             // rendered — never author one
//     expert_reasoning?:  { [personaKey]: { [outcomeId]: string } },
//   }
import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './UnitLoop.module.css';
import { trackCommitmentSelected } from '../../utils/analytics.js';

const TONE_CLASS = {
  good: styles.debriefToneGood,
  warn: styles.debriefToneWarn,
  bad:  styles.debriefToneBad,
};
const TONE_LABEL = { good: 'Good', warn: 'Warn', bad: 'Bad' };

export function Debrief({ debrief, persona, outcome, outcomeId, onRestart, scenarioId, onCommit }) {
  const expert = debrief.expert_reasoning?.[persona]?.[outcomeId] || null;
  const [picked, setPicked] = useState(null);

  const handlePick = (id) => {
    setPicked(id);
    if (onCommit) onCommit(id);
    trackCommitmentSelected(scenarioId, id);
  };

  return (
    <div className={styles.beatWrap}>
      <div className={styles.eyebrow}>
        <span className={styles.eyebrowRule} />
        <span>Debrief</span>
      </div>
      {outcome && (
        <div className={styles.debriefOutcomeChip}>
          <span className={`${styles.debriefTone} ${TONE_CLASS[outcome.tone] || ''}`}>
            {TONE_LABEL[outcome.tone] || outcome.tone}
          </span>
          <span>{outcome.heading}</span>
        </div>
      )}
      {expert && (
        <div className={styles.debriefBlock}>
          <div className={styles.debriefBlockLabel}>
            How an experienced practitioner reads this
          </div>
          <div className={styles.debriefBlockBody}>{expert}</div>
        </div>
      )}
      {Array.isArray(debrief.takeaways) && debrief.takeaways.length > 0 && (
        <div className={styles.debriefBlock}>
          <div className={styles.debriefBlockLabel}>Three things worth keeping</div>
          <ul className={styles.takeawaysList}>
            {debrief.takeaways.map((t, i) => (
              <li key={i} className={styles.takeawayItem}>{t}</li>
            ))}
          </ul>
        </div>
      )}
      {debrief.commit && Array.isArray(debrief.commit.options) && debrief.commit.options.length > 0 && (
        <div className={styles.commitBlock}>
          <div className={styles.debriefBlockLabel}>Take one with you</div>
          <div className={styles.commitPrompt}>{debrief.commit.prompt}</div>
          <div className={styles.commitOptions}>
            {debrief.commit.options.map((opt) => (
              <button
                key={opt.id}
                className={`${styles.commitOption} ${picked === opt.id ? styles.commitOptionPicked : ''}`}
                onClick={() => handlePick(opt.id)}
                aria-pressed={picked === opt.id}
              >
                <span className={styles.commitOptionLabel}>{opt.label}</span>
                {opt.detail && <span className={styles.commitOptionDetail}>{opt.detail}</span>}
              </button>
            ))}
            <button
              key="skip"
              className={`${styles.commitOption} ${styles.commitOptionSkip} ${picked === 'skip' ? styles.commitOptionPicked : ''}`}
              onClick={() => handlePick('skip')}
              aria-pressed={picked === 'skip'}
            >
              <span className={styles.commitOptionLabel}>None of these fits my role</span>
            </button>
          </div>
          <div className={styles.commitConfirm} aria-live="polite">
            {picked && picked !== 'skip' && 'Noted. The best version of this is the one you actually do this week.'}
            {picked === 'skip' && 'Fair enough — worth deciding what would fit, while this is fresh.'}
          </div>
        </div>
      )}
      {debrief.reflection_prompt && (
        <div className={styles.debriefBlock}>
          <div className={styles.debriefBlockLabel}>Reflect</div>
          <div className={styles.debriefBlockBody}>{debrief.reflection_prompt}</div>
        </div>
      )}
      {debrief.transfer_prompt && (
        <div className={styles.debriefBlock}>
          <div className={styles.debriefBlockLabel}>Take it back to your team</div>
          <div className={styles.debriefBlockBody}>{debrief.transfer_prompt}</div>
        </div>
      )}
      <div className={styles.beatNav}>
        <button className={styles.secondaryBtn} onClick={() => onRestart('persona')}>
          Try another role
        </button>
        <button className={styles.secondaryBtn} onClick={() => onRestart('start')}>
          Play again
        </button>
        <Link to="/" className={styles.accentLink}>All scenarios →</Link>
      </div>
    </div>
  );
}
