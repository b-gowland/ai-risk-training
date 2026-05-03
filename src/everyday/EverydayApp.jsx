// EverydayApp.jsx
// Root component for the everyday bundle at /#/everyday
// Handles landing (scenario selection) and episode mode (play all three in sequence).
// No practitioner vocabulary in any user-facing string.
// Redesigned May 3, 2026 — AI Risk Practice rebrand.

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

function Header() {
  return (
    <div className={styles.header}>
      <div className={styles.headerBrand}>
        <div className={styles.headerMark}>FORK_</div>
        <div className={styles.headerBy}>by <span>AI Risk Practice</span></div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className={styles.footer}>
      <span className={styles.footerBrand}>FORK_ by <span>AI Risk Practice</span></span>
      <Link to="/privacy">Privacy</Link>
    </footer>
  );
}

function EpisodeProgress({ current, total, onContinue, scenarioTitle }) {
  const completed = current;
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

function Landing({ onPlay, onPlayAll }) {
  return (
    <div className={styles.page}>
      <Header />
      <div className={styles.landingHero}>
        <p className={styles.landingEyebrow}>Free · No login · Takes 5 minutes</p>
        <h1 className={styles.landingTitle}>
          Your choices.{'\n'}Your consequences.
        </h1>
        <p className={styles.landingSub}>
          Three real AI risks. You're in the scenario. What do you do?
        </p>
      </div>

      <button className={styles.playAllBtn} onClick={onPlayAll}>
        ▶ Play all three (~10 min)
      </button>

      <div className={styles.orDivider}>
        <span>or pick one</span>
      </div>

      <div className={styles.scenarioStack}>
        {EVERYDAY_SCENARIOS.map(s => (
          <ScenarioTile key={s.id} scenario={s} onPlay={onPlay} />
        ))}
      </div>

      <p className={styles.auNote}>
        🇦🇺 This version uses Australian examples and law. A global edition is coming.
      </p>

      <Footer />
    </div>
  );
}

export function EverydayApp() {
  const [episodeIndex, setEpisodeIndex] = useState(null);
  const [showingProgress, setShowingProgress] = useState(false);
  const [episodeMode, setEpisodeMode] = useState(false);

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
    setShowingProgress(true);
  }

  function handleProgressContinue() {
    setEpisodeIndex(i => i + 1);
    setShowingProgress(false);
  }

  const activeScenario = episodeIndex !== null ? EVERYDAY_SCENARIOS[episodeIndex] : null;
  const isLastInEpisode = episodeMode
    ? episodeIndex === EVERYDAY_SCENARIOS.length - 1
    : true;

  if (episodeIndex === null) {
    return (
      <div className={styles.root}>
        <Landing onPlay={handlePlayOne} onPlayAll={handlePlayAll} />
      </div>
    );
  }

  if (showingProgress && episodeMode) {
    const nextScenario = EVERYDAY_SCENARIOS[episodeIndex + 1];
    return (
      <div className={`${styles.root} ${styles.page}`}>
        <Header />
        <EpisodeProgress
          current={episodeIndex + 1}
          total={EVERYDAY_SCENARIOS.length}
          scenarioTitle={nextScenario.title}
          onContinue={handleProgressContinue}
        />
        <Footer />
      </div>
    );
  }

  return (
    <div className={`${styles.root} ${styles.page}`}>
      <Header />
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
      <Footer />
    </div>
  );
}
