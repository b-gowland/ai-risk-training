// Debrief beat — consequence review that closes a unit (Unit Loop, beat 4 of 4).
//
// Reached from the outcome screen. Shows (when authored): modelled expert
// reasoning for the specific outcome the learner reached, an open reflection
// prompt, and one transfer prompt. No verdict-dumping — the learner has
// already seen the consequence; this beat models how an experienced
// practitioner reads it. The reflection prompt is displayed, not captured:
// nothing typed here is stored or transmitted, consistent with the
// project's privacy stance.
//
// Schema (see README.md in this folder):
//   debrief: {
//     reflection_prompt?: string,
//     transfer_prompt?:   string,
//     expert_reasoning?:  { [personaKey]: { [outcomeId]: string } },
//   }
import { Link } from 'react-router-dom';
import styles from './UnitLoop.module.css';

const TONE_CLASS = {
  good: styles.debriefToneGood,
  warn: styles.debriefToneWarn,
  bad:  styles.debriefToneBad,
};
const TONE_LABEL = { good: 'Good', warn: 'Warn', bad: 'Bad' };

export function Debrief({ debrief, persona, outcome, outcomeId, onRestart }) {
  const expert = debrief.expert_reasoning?.[persona]?.[outcomeId] || null;

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
