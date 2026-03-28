import React, { useState } from 'react';
import styles from './ChoicePoint.module.css';

const QUALITY_CONFIG = {
  good:    { label: null },
  partial: { label: null },
  poor:    { label: null },
};

export function ChoicePoint({ choicePoint, persona, onSelect }) {
  const [hovered, setHovered] = useState(null);

  return (
    <div className={styles.wrapper}>
      <div className={styles.contextBox}>
        <div className={styles.contextLabel}>Three weeks later…</div>
        <p className={styles.contextText}>{choicePoint.context}</p>
      </div>

      <h2 className={styles.prompt}>{choicePoint.prompt}</h2>

      <div className={styles.choices}>
        {choicePoint.choices.map((choice) => (
          <button
            key={choice.id}
            className={`${styles.choice} ${hovered === choice.id ? styles.choiceHovered : ''}`}
            onMouseEnter={() => setHovered(choice.id)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onSelect(choice)}
          >
            <div className={styles.choiceLabel}>{choice.label}</div>
            <div className={styles.choiceDesc}>{choice.description}</div>
            {hovered === choice.id && choice.persona_note?.[persona] && (
              <div className={styles.personaHint}>
                <span className={styles.hintIcon}>◎</span>
                {choice.persona_note[persona]}
              </div>
            )}
          </button>
        ))}
      </div>

      <p className={styles.hint}>Hover a choice to see your persona's perspective before deciding.</p>
    </div>
  );
}
