import React from 'react';
import { getSceneComponent } from './SceneRegistry.js';
import styles from './Panel.module.css';

export function Panel({ panel, persona, onNext, isLast, panelIndex, totalPanels }) {
  // Call as a function rather than using as a JSX component to satisfy
  // react-hooks/static-components — components created during render reset state each render.
  // Since these scene SVGs are stateless, calling as a function is equivalent and correct.
  const sceneElement = getSceneComponent(panel)();
  const narration = panel.narration?.[persona] || null;

  return (
    <div className={styles.panel}>
      {/* Progress pips */}
      <div className={styles.pips}>
        {Array.from({ length: totalPanels }).map((_, i) => (
          <div key={i} className={`${styles.pip} ${i === panelIndex ? styles.pipActive : i < panelIndex ? styles.pipDone : ''}`}/>
        ))}
      </div>

      {/* Illustrated scene */}
      <div className={styles.scene}>
        {sceneElement}
        {/* Caption bar */}
        <div className={styles.captionBar}>
          <p className={styles.caption}>{panel.caption}</p>
          {panel.sub_caption && <p className={styles.subCaption}>{panel.sub_caption}</p>}
        </div>
      </div>

      {/* Persona narration */}
      {narration && (
        <div className={styles.narration}>
          <div className={styles.narrationPill}>Your perspective</div>
          <p className={styles.narrationText}>{narration}</p>
        </div>
      )}

      {/* Navigation */}
      <div className={styles.nav}>
        <button className={styles.nextBtn} onClick={onNext}>
          {isLast ? 'Make a decision →' : 'Continue →'}
        </button>
      </div>
    </div>
  );
}
