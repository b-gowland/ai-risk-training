// Brief beat — the teach layer of a unit (Unit Loop, beat 2 of 4).
//
// Renders scenario.unit.brief: a heading, an optional framing intro, and a
// small number of sections presented as segmented cards on one screen.
// Sections are deliberately lean — every element here should be needed by a
// decision the learner is about to face (action-mapping / coherence
// principle). The qa-audit warns when a brief grows past five sections.
//
// Schema (see README.md in this folder):
//   brief: {
//     heading: string,
//     intro?: string,
//     sections: [{
//       heading, body,
//       check?: {                       // optional applied micro-check —
//         id, prompt,                   // makes the section worked, not read
//         choices: [{ id, label, quality, note }],
//       },
//     }],
//     kb_url?: string,   // source link into the knowledge base
//   }
//
// Checks are formative only: answering reveals the note, nothing is scored,
// and Continue is never gated (respect the learner; the audit trail is the
// Decide beat). First answer per check fires an anonymous analytics event
// so we can see whether the mechanic is actually worked.
import { useState } from 'react';
import styles from './UnitLoop.module.css';
import { trackBriefCheckAnswered } from '../../utils/analytics.js';

export function Brief({ brief, onContinue, scenarioId }) {
  // { [checkId]: choiceId } — component-local; checks are not part of the
  // decision record by design (Recall is the retrieval layer that is).
  const [answers, setAnswers] = useState({});

  const handleAnswer = (check, choice) => {
    if (!answers[check.id]) trackBriefCheckAnswered(scenarioId, check.id, choice.quality);
    setAnswers((prev) => ({ ...prev, [check.id]: choice.id }));
  };

  return (
    <div className={styles.beatWrap}>
      <div className={styles.eyebrow}>
        <span className={styles.eyebrowRule} />
        <span>Brief</span>
      </div>
      {brief.heading && <h2 className={styles.beatHeading}>{brief.heading}</h2>}
      {brief.intro && <div className={styles.beatIntro}>{brief.intro}</div>}
      {(brief.sections || []).map((section, i) => {
        const check = section.check;
        const answeredId = check ? answers[check.id] : null;
        const answered = check && answeredId
          ? check.choices.find((c) => c.id === answeredId)
          : null;
        return (
          <div key={i} className={styles.briefSection}>
            <div className={styles.briefSectionHeading}>{section.heading}</div>
            <div className={styles.briefSectionBody}>{section.body}</div>
            {check && (
              <div className={styles.briefCheck}>
                <div className={styles.briefCheckPrompt}>{check.prompt}</div>
                <div className={styles.briefCheckChoices}>
                  {check.choices.map((choice) => (
                    <button
                      key={choice.id}
                      className={`${styles.briefCheckChoice} ${answeredId === choice.id ? styles.briefCheckChoicePicked : ''}`}
                      onClick={() => handleAnswer(check, choice)}
                      aria-pressed={answeredId === choice.id}
                    >
                      {choice.label}
                    </button>
                  ))}
                </div>
                {answered && (
                  <div
                    className={`${styles.briefCheckNote} ${answered.quality === 'good' ? styles.briefCheckNoteGood : styles.briefCheckNoteOther}`}
                    aria-live="polite"
                  >
                    {answered.note}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
      {brief.kb_url && (
        <p className={styles.briefSource}>
          <a href={brief.kb_url} target="_blank" rel="noopener noreferrer">
            Source: Knowledge base ↗
          </a>
        </p>
      )}
      <div className={styles.beatNav}>
        <button className={styles.primaryBtn} onClick={onContinue}>Continue →</button>
      </div>
    </div>
  );
}
