import React, { useEffect, useRef } from 'react';
import styles from './FeedbackModal.module.css';

const QUALITY_CONFIG = {
  good:    { icon: '◈', label: 'Strong response', color: 'good' },
  partial: { icon: '◎', label: 'Partially correct', color: 'partial' },
  poor:    { icon: '◉', label: 'Missed the mark', color: 'poor' },
};

export function FeedbackModal({ choice, persona, scenario, feedbackText, loading, onContinue }) {
  const config = QUALITY_CONFIG[choice.quality] || QUALITY_CONFIG.poor;
  const ref = useRef(null);

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <div className={styles.wrapper} ref={ref}>
      {/* Quality indicator */}
      <div className={`${styles.qualityBar} ${styles[config.color]}`}>
        <span className={styles.qualityIcon}>{config.icon}</span>
        <span className={styles.qualityLabel}>{config.label}</span>
        <span className={styles.choiceEcho}>"{choice.label}"</span>
      </div>

      {/* AI Feedback */}
      <div className={styles.feedbackBox}>
        <div className={styles.feedbackHeader}>
          <span className={styles.feedbackLabel}>Analysis</span>
        </div>
        {loading ? (
          <div className={styles.loading}>
            <div className={styles.loadingDots}>
              <span/><span/><span/>
            </div>
            <span className={styles.loadingText}>Analysing your decision…</span>
          </div>
        ) : (
          <p className={styles.feedbackText}>{feedbackText}</p>
        )}
      </div>

      {/* Score visual */}
      <div className={styles.scoreRow}>
        <span className={styles.scoreLabel}>Decision score</span>
        <div className={styles.scoreBar}>
          <div
            className={`${styles.scoreFill} ${styles[config.color]}`}
            style={{ width: `${choice.quality === 'good' ? 100 : choice.quality === 'partial' ? 55 : 10}%` }}
          />
        </div>
        <span className={styles.scoreValue}>
          {choice.quality === 'good' ? '100' : choice.quality === 'partial' ? '55' : '10'}/100
        </span>
      </div>

      {!loading && (
        <div className={styles.nav}>
          <button className={styles.continueBtn} onClick={onContinue}>
            See the outcome →
          </button>
        </div>
      )}
    </div>
  );
}
