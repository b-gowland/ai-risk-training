import React from 'react';
import styles from './PersonaSelect.module.css';

const ICONS = {
  exec:    '◈',
  pm:      '◎',
  analyst: '◉',
};

export function PersonaSelect({ scenario, onSelect }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.riskBadge}>{scenario.risk_ref} — {scenario.domain}</div>
        <h1 className={styles.title}>{scenario.title}</h1>
        <p className={styles.subtitle}>{scenario.subtitle}</p>
      </div>

      <div className={styles.prompt}>Choose your role to begin</div>

      <div className={styles.cards}>
        {Object.entries(scenario.personas).map(([key, persona]) => (
          <button key={key} className={styles.card} onClick={() => onSelect(key)}>
            <div className={styles.icon}>{ICONS[persona.icon] || '◆'}</div>
            <div className={styles.cardLabel}>{persona.label}</div>
            <div className={styles.cardRole}>{persona.role}</div>
            <div className={styles.cardFraming}>{persona.framing}</div>
            <div className={styles.cardCta}>Play this role →</div>
          </button>
        ))}
      </div>

      <div className={styles.meta}>
        <span>{scenario.difficulty}</span>
        <span>·</span>
        <span>~{scenario.estimated_minutes} min</span>
        <span>·</span>
        <a href={scenario.kb_url} target="_blank" rel="noopener noreferrer" className={styles.kbLink}>
          Read the full risk entry ↗
        </a>
      </div>
    </div>
  );
}
