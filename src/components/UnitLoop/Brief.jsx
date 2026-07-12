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
//     sections: [{ heading, body }],
//     kb_url?: string,   // source link into the knowledge base
//   }
import styles from './UnitLoop.module.css';

export function Brief({ brief, onContinue }) {
  return (
    <div className={styles.beatWrap}>
      <div className={styles.eyebrow}>
        <span className={styles.eyebrowRule} />
        <span>Brief</span>
      </div>
      {brief.heading && <h2 className={styles.beatHeading}>{brief.heading}</h2>}
      {brief.intro && <div className={styles.beatIntro}>{brief.intro}</div>}
      {(brief.sections || []).map((section, i) => (
        <div key={i} className={styles.briefSection}>
          <div className={styles.briefSectionHeading}>{section.heading}</div>
          <div className={styles.briefSectionBody}>{section.body}</div>
        </div>
      ))}
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
