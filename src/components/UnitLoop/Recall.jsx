// Recall beat — spaced retrieval that opens a unit (Unit Loop, beat 1 of 4).
//
// Renders scenario.unit.recall: an intro line (typically referencing the
// previous unit's decisions) and a short sequence of retrieval items. Items
// are presented one at a time; each answer gets immediate feedback from the
// authored `note`, mirroring the decision feedback rhythm of the main
// scenario. Answers are recorded in the engine reducer (`recallAnswers`) so
// they form part of the same decision-quality record as scenario choices.
//
// Schema (see README.md in this folder):
//   recall: {
//     intro?: string,
//     items: [{ id, prompt, choices: [{ id, label, quality, note }] }],
//   }
import { useState } from 'react';
import styles from './UnitLoop.module.css';

const NOTE_CLASS = {
  good:    styles.recallNoteGood,
  partial: styles.recallNotePartial,
  poor:    styles.recallNotePoor,
};
const NOTE_LABEL = {
  good:    'Recalled correctly',
  partial: 'Partly there',
  poor:    'Worth revisiting',
};

export function Recall({ recall, answers, onAnswer, onContinue }) {
  // When true, the just-answered item's note is showing and the answered
  // choice stays highlighted. Cleared on "Next" — the reducer's answers
  // array then naturally advances the derived index to the next item.
  const [reviewing, setReviewing] = useState(false);

  const items = recall.items || [];
  const answeredCount = answers.length;
  const index = reviewing ? answeredCount - 1 : answeredCount;
  const item = items[index];

  // Safety: nothing to show (empty items, or state desync) — offer continue.
  if (!item) {
    return (
      <div className={styles.beatWrap}>
        <Eyebrow label="Recall" meta={`${answeredCount} / ${items.length}`} />
        <div className={styles.beatNav}>
          <button className={styles.primaryBtn} onClick={onContinue}>Continue →</button>
        </div>
      </div>
    );
  }

  const answer = reviewing ? answers[answers.length - 1] : null;
  const answeredChoice = answer
    ? item.choices.find(c => c.id === answer.choiceId)
    : null;
  const isLast = index === items.length - 1;

  return (
    <div className={styles.beatWrap}>
      <Eyebrow label="Recall" meta={`${Math.min(index + 1, items.length)} / ${items.length}`} />
      {recall.intro && index === 0 && !reviewing && (
        <div className={styles.beatIntro}>{recall.intro}</div>
      )}
      <div className={styles.recallPrompt}>{item.prompt}</div>
      <div className={styles.recallChoices}>
        {item.choices.map(choice => (
          <button
            key={choice.id}
            className={
              answeredChoice && answeredChoice.id === choice.id
                ? `${styles.recallChoiceBtn} ${styles.recallChoiceSelected}`
                : styles.recallChoiceBtn
            }
            disabled={reviewing}
            onClick={() => {
              if (reviewing) return;
              onAnswer(item, choice);
              setReviewing(true);
            }}
          >
            <span>{choice.label}</span>
            <span>→</span>
          </button>
        ))}
      </div>
      {reviewing && answeredChoice && (
        <div className={`${styles.recallNote} ${NOTE_CLASS[answeredChoice.quality] || styles.recallNotePoor}`}>
          <span className={styles.recallNoteLabel}>
            {NOTE_LABEL[answeredChoice.quality] || NOTE_LABEL.poor}
          </span>
          {answeredChoice.note}
        </div>
      )}
      {reviewing && (
        <div className={styles.beatNav}>
          <button
            className={styles.primaryBtn}
            onClick={() => {
              if (isLast) onContinue();
              else setReviewing(false);
            }}
          >
            {isLast ? 'Continue →' : 'Next →'}
          </button>
        </div>
      )}
    </div>
  );
}

function Eyebrow({ label, meta }) {
  return (
    <div className={styles.eyebrow}>
      <span className={styles.eyebrowRule} />
      <span>{label}</span>
      {meta && <span className={styles.eyebrowMeta}>{meta}</span>}
    </div>
  );
}
