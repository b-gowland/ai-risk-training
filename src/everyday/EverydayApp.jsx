// EverydayApp.jsx
<<<<<<< HEAD
// Root component for the everyday bundle at /#/everyday
// Handles landing (scenario selection) and episode mode (play all three in sequence).
// No practitioner vocabulary in any user-facing string.
=======
// Root component for the everyday bundle at /#/everyday/
// Handles landing (scenario selection) and in-scenario routing internally.
// No practitioner vocabulary used in any user-facing string.
>>>>>>> 55e30b2962a1d77d26a805759b1803c30f3b1e9d

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

<<<<<<< HEAD
// Episode progress indicator shown between scenarios
function EpisodeProgress({ current, total, onContinue, scenarioTitle }) {
  const completed = current; // number completed so far
  return (
    <div className={styles.episodeProgress}>
      <div className={styles.episodeProgressDots}>
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`${styles.episodeDot} ${i < completed ? styles.episodeDotDone : i === completed ? styles.episodeDotNext : ''}`}
          />
        ))}
      </div>
      <div className={styles.episodeProgressLabel}>
        {completed} of {total} done
      </div>
      <h2 className={styles.episodeNextTitle}>Up next</h2>
      <p className={styles.episodeNextName}>{scenarioTitle}</p>
      <button className={styles.startBtn} onClick={onContinue}>
        Keep going →
      </button>
    </div>
  );
}

=======
>>>>>>> 55e30b2962a1d77d26a805759b1803c30f3b1e9d
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

<<<<<<< HEAD
function Landing({ onPlay, onPlayAll }) {
=======
function Landing({ onPlay }) {
>>>>>>> 55e30b2962a1d77d26a805759b1803c30f3b1e9d
  return (
    <div className={styles.page}>
      <div className={styles.landingHero}>
        <p className={styles.landingEyebrow}>Free · No login · Takes 4 minutes</p>
        <h1 className={styles.landingTitle}>
          How would YOU handle it?
        </h1>
        <p className={styles.landingSub}>
<<<<<<< HEAD
          Three real AI risks. Pick one — or play all three as an episode.
        </p>
      </div>

      {/* Play all CTA */}
      <button className={styles.playAllBtn} onClick={onPlayAll}>
        ▶ Play all three (~10 min)
      </button>

      <div className={styles.orDivider}>
        <span>or pick one</span>
      </div>

=======
          Pick a scenario. Swipe left or right. Find out what happens.
        </p>
      </div>

>>>>>>> 55e30b2962a1d77d26a805759b1803c30f3b1e9d
      <div className={styles.scenarioStack}>
        {EVERYDAY_SCENARIOS.map(s => (
          <ScenarioTile key={s.id} scenario={s} onPlay={onPlay} />
        ))}
      </div>

<<<<<<< HEAD
      <p className={styles.auNote}>
        🇦🇺 This version uses Australian examples and law. A global edition is coming.
      </p>

=======
>>>>>>> 55e30b2962a1d77d26a805759b1803c30f3b1e9d
      <footer className={styles.footer}>
        <span>No personal data collected</span>
        <span>·</span>
        <Link to="/privacy">Privacy →</Link>
      </footer>
    </div>
  );
}

export function EverydayApp() {
<<<<<<< HEAD
  // null = landing, number = index into EVERYDAY_SCENARIOS
  const [episodeIndex, setEpisodeIndex] = useState(null);
  const [showingProgress, setShowingProgress] = useState(false);
  const [episodeMode, setEpisodeMode]   = useState(false);

  function handlePlayAll() {
    setEpisodeMode(true);
    setEpisodeIndex(0);
    setShowingProgress(false);
  }

  function handlePlayOne(scenario) {
    setEpisodeMode(false);
    const idx = EVERYDAY_SCENARIOS.findIndex(s => s.id === scenario.id);
    setEpisodeIndex(idx);
    setShowingProgress(false);
  }

  function handleBack() {
    setEpisodeIndex(null);
    setEpisodeMode(false);
    setShowingProgress(false);
  }

  function handleNextScenario() {
    // Called from outcome screen when not last in episode
    setShowingProgress(true);
  }

  function handleProgressContinue() {
    setEpisodeIndex(i => i + 1);
    setShowingProgress(false);
  }

  const activeScenario = episodeIndex !== null ? EVERYDAY_SCENARIOS[episodeIndex] : null;
  const isLastInEpisode = episodeMode
    ? episodeIndex === EVERYDAY_SCENARIOS.length - 1
    : true; // single-play always shows back, never next

  // Landing
  if (episodeIndex === null) {
    return (
      <div className={styles.root}>
        <Landing onPlay={handlePlayOne} onPlayAll={handlePlayAll} />
      </div>
    );
  }

  // Episode progress screen between scenarios
  if (showingProgress && episodeMode) {
    const nextScenario = EVERYDAY_SCENARIOS[episodeIndex + 1];
    return (
      <div className={`${styles.root} ${styles.page}`}>
        <EpisodeProgress
          current={episodeIndex + 1}
          total={EVERYDAY_SCENARIOS.length}
          scenarioTitle={nextScenario.title}
          onContinue={handleProgressContinue}
=======
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
>>>>>>> 55e30b2962a1d77d26a805759b1803c30f3b1e9d
        />
        <footer className={styles.footer}>
          <span>No personal data collected</span>
          <span>·</span>
          <Link to="/privacy">Privacy →</Link>
        </footer>
      </div>
    );
  }

<<<<<<< HEAD
  // Playing a scenario
  return (
    <div className={`${styles.root} ${styles.page}`}>
      <button className={styles.playerBack} onClick={handleBack}>
        ← All scenarios
      </button>
      {episodeMode && (
        <div className={styles.episodeProgressBar}>
          {EVERYDAY_SCENARIOS.map((s, i) => (
            <div
              key={s.id}
              className={`${styles.episodeBarSegment} ${i < episodeIndex ? styles.episodeBarDone : i === episodeIndex ? styles.episodeBarActive : ''}`}
            />
          ))}
        </div>
      )}
      <EverydayPlayer
        scenario={activeScenario}
        onBack={handleBack}
        isLastInEpisode={isLastInEpisode}
        onNextScenario={handleNextScenario}
      />
      <footer className={styles.footer}>
        <span>No personal data collected</span>
        <span>·</span>
        <Link to="/privacy">Privacy →</Link>
      </footer>
=======
  return (
    <div className={styles.root}>
      <Landing onPlay={setActiveScenario} />
>>>>>>> 55e30b2962a1d77d26a805759b1803c30f3b1e9d
    </div>
  );
}
