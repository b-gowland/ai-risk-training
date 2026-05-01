// EverydayApp.jsx
// Root component for the everyday bundle at /#/everyday/
// Handles landing (scenario selection) and in-scenario routing internally.
// No practitioner vocabulary used in any user-facing string.

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { scenario as p1 } from '../scenarios/everyday-p1-deepfake-voice.js';
import { scenario as p2 } from '../scenarios/everyday-p2-hallucination.js';
import { scenario as p3 } from '../scenarios/everyday-p3-employment-screening.js';
import { EverydayPlayer } from './EverydayPlayer.jsx';
import styles from './EverydayBundle.module.css';

const EVERYDAY_SCENARIOS = [p1, p2, p3];

const DOMAIN_TAGS = {
  'everyday-p1-deepfake-voice':        'Scams',
  'everyday-p2-hallucination':         'AI mistakes',
  'everyday-p3-employment-screening':  'Your rights',
};

function ScenarioTile({ scenario, onPlay }) {
  return (
    <button
      className={styles.scenarioTile}
      onClick={() => onPlay(scenario)}
      aria-label={`Play scenario: ${scenario.title}`}
    >
      <div className={styles.tileTop}>
        <span className={styles.tileDomainTag}>
          {DOMAIN_TAGS[scenario.id] || 'Everyday'}
        </span>
        <span className={styles.tileTime}>~{scenario.estimated_minutes} min</span>
      </div>
      <div className={styles.tileTitle}>{scenario.title}</div>
      <div className={styles.tileSubtitle}>{scenario.subtitle}</div>
      <div className={styles.tileCta}>Play</div>
    </button>
  );
}

function Landing({ onPlay }) {
  return (
    <div className={styles.page}>
      <div className={styles.landingHero}>
        <p className={styles.landingEyebrow}>Free · No login · Takes 4 minutes</p>
        <h1 className={styles.landingTitle}>
          How would YOU handle it?
        </h1>
        <p className={styles.landingSub}>
          Pick a scenario. Swipe left or right. Find out what happens.
        </p>
      </div>

      <div className={styles.scenarioStack}>
        {EVERYDAY_SCENARIOS.map(s => (
          <ScenarioTile key={s.id} scenario={s} onPlay={onPlay} />
        ))}
      </div>

      <footer className={styles.footer}>
        <span>No personal data collected</span>
        <span>·</span>
        <Link to="/privacy">Privacy →</Link>
      </footer>
    </div>
  );
}

export function EverydayApp() {
  const [activeScenario, setActiveScenario] = useState(null);

  if (activeScenario) {
    return (
      <div className={`${styles.root} ${styles.page}`}>
        <Link to="/everyday" className={styles.playerBack} onClick={() => setActiveScenario(null)}>
          ← All scenarios
        </Link>
        <EverydayPlayer
          scenario={activeScenario}
          onBack={() => setActiveScenario(null)}
        />
        <footer className={styles.footer}>
          <span>No personal data collected</span>
          <span>·</span>
          <Link to="/privacy">Privacy →</Link>
        </footer>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <Landing onPlay={setActiveScenario} />
    </div>
  );
}
