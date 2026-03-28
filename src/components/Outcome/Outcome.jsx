import React from 'react';
import styles from './Outcome.module.css';

export function Outcome({ outcome, scenario, persona, onRestart }) {
  const controls = scenario.controls_summary || [];

  return (
    <div className={styles.wrapper}>
      {/* Outcome narrative */}
      <div className={styles.outcomeCard}>
        <div className={styles.outcomeHeading}>{outcome.heading}</div>
        <p className={styles.outcomeResult}>{outcome.result}</p>
        <div className={styles.learningBlock}>
          <span className={styles.learningLabel}>Key learning</span>
          <p className={styles.learningText}>{outcome.learning}</p>
        </div>
      </div>

      {/* Controls demonstrated */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Controls this scenario demonstrates</h3>
        <div className={styles.controlsGrid}>
          {controls.map((ctrl) => (
            <div key={ctrl.id} className={`${styles.controlCard} ${outcome.controls_demonstrated?.includes(ctrl.label) ? styles.controlActive : styles.controlMuted}`}>
              <div className={styles.controlLabel}>{ctrl.label}</div>
              <div className={styles.controlMeta}>
                <span className={styles.tag}>{ctrl.owner}</span>
                <span className={styles.tag}>{ctrl.effort} effort</span>
                {ctrl.go_live && <span className={`${styles.tag} ${styles.tagGoLive}`}>Go-live</span>}
              </div>
            </div>
          ))}
        </div>
        {outcome.controls_demonstrated?.length === 0 && (
          <p className={styles.noControls}>None of the key controls were applied in this outcome.</p>
        )}
      </div>

      {/* Knowledge base CTA */}
      <div className={styles.kbCta}>
        <div className={styles.kbCtaInner}>
          <div>
            <div className={styles.kbCtaLabel}>Go deeper</div>
            <p className={styles.kbCtaText}>
              Read the full {scenario.risk_ref} reference — controls detail, framework mappings, and technical implementation.
            </p>
          </div>
          <a href={scenario.kb_url} target="_blank" rel="noopener noreferrer" className={styles.kbBtn}>
            Open knowledge base ↗
          </a>
        </div>
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <button className={styles.restartBtn} onClick={() => onRestart('persona')}>
          ↩ Change persona
        </button>
        <button className={styles.restartBtn} onClick={() => onRestart('start')}>
          ↺ Restart scenario
        </button>
        <a href="/" className={styles.homeBtn}>
          All scenarios →
        </a>
      </div>
    </div>
  );
}
