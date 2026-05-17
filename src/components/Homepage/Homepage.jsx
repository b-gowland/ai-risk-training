import { useState } from 'react';
import { Link } from 'react-router-dom';
import { scenarios, DOMAINS, DIFFICULTY_ORDER } from '../../scenarios/index.js';
import styles from './Homepage.module.css';

const DIFFICULTY_PILL = {
  Foundational: styles.diffFoundational,
  Intermediate: styles.diffIntermediate,
  Advanced:     styles.diffAdvanced,
};

const PERSONA_ICONS = {
  business_user: { icon: '◇', label: 'Business User' },
  executive:     { icon: '◈', label: 'Executive' },
  pm:            { icon: '◎', label: 'PM' },
  analyst:       { icon: '◉', label: 'Analyst' },
};

const FOUNDATION_BUNDLE_IDS = new Set(['f2-shadow-ai', 'c5-ai-cyber-attacks', 'a1-hallucination']);

function ScenarioCard({ scenario }) {
  const isLive   = !scenario.stub;
  const isBundle = FOUNDATION_BUNDLE_IDS.has(scenario.id);
  const personas = ['business_user', 'executive', 'pm', 'analyst'];

  return (
    <div className={`${styles.card} ${isLive ? styles.cardLive : styles.cardStub}`}>
      <div className={styles.cardHeader}>
        <span className={styles.riskRef}>{scenario.risk_ref}</span>
        <span className={`${styles.diffPill} ${DIFFICULTY_PILL[scenario.difficulty] || ''}`}>
          {scenario.difficulty}
        </span>
      </div>

      {isBundle && <div className={styles.bundleBadge}>◈ Bundle</div>}

      <div className={styles.cardTitle}>{scenario.title}</div>
      {scenario.subtitle && (
        <div className={styles.cardSubtitle}>{scenario.subtitle}</div>
      )}

      <div className={styles.personaRow}>
        {personas.map(key => {
          const available = isLive
            ? (key === 'business_user' ? scenario.has_business_user : true)
            : (key === 'business_user' ? scenario.has_business_user : false);
          const p = PERSONA_ICONS[key];
          return (
            <span key={key}
              className={`${styles.personaPip} ${available ? styles.pipAvailable : styles.pipUnavailable}`}
              title={available ? p.label : `${p.label} — coming soon`}>
              {p.icon}
            </span>
          );
        })}
      </div>

      <div className={styles.cardFooter}>
        {isLive ? (
          <Link to={`/scenario/${scenario.id}`} className={styles.playBtn}>Play →</Link>
        ) : (
          <span className={styles.comingSoon}>Coming soon</span>
        )}
        <a href={scenario.kb_url} target="_blank" rel="noopener noreferrer"
          className={styles.kbRef} onClick={e => e.stopPropagation()}>KB ↗</a>
      </div>
    </div>
  );
}

export function Homepage() {
  const [filter, setFilter]         = useState('all');
  const [diffFilter, setDiffFilter] = useState('all');

  const liveCount = scenarios.filter(s => !s.stub).length;

  const filtered = scenarios.filter(s => {
    const domainMatch = filter === 'all' || s.domain.startsWith(filter);
    const diffMatch   = diffFilter === 'all' || s.difficulty === diffFilter;
    return domainMatch && diffMatch;
  });

  const grouped = DOMAINS.map(d => ({
    ...d,
    items: filtered.filter(s => s.domain.startsWith(d.key)),
  })).filter(d => d.items.length > 0);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoMark}>◈</span>
          AI Risk Practice
        </div>
        <a href="https://library.airiskpractice.org/" target="_blank" rel="noopener noreferrer" className={styles.kbLink}>Library ↗</a>
        <a href="https://baseline.airiskpractice.org/" target="_blank" rel="noopener noreferrer" className={styles.kbLink}>Governance Baseline ↗</a>
      </header>

      {/* ── Hero ── */}
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroBadge}>Open source · Free · No login</div>
          <h1 className={styles.heroTitle}>
            Interactive AI risk training<br/>for practitioners and the public.
          </h1>
          <p className={styles.heroSub}>
            Choose-your-own-adventure scenarios drawn from real AI incidents.
            Four roles. Branching decisions. Actual consequences.
          </p>
          <div className={styles.heroStats}>
            <div className={styles.stat}>
              <span className={styles.statNum}>{liveCount}</span>
              <span className={styles.statLabel}>live scenarios</span>
            </div>
            <div className={styles.stat}>
              <a href="https://library.airiskpractice.org/" target="_blank" rel="noopener noreferrer" className={styles.statLink}>
                <span className={styles.statNum}>32</span>
                <span className={styles.statLabel}>KB entries ↗</span>
              </a>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNum}>4</span>
              <span className={styles.statLabel}>personas</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNum}>7</span>
              <span className={styles.statLabel}>risk domains</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Two equal tracks ── */}
      <div className={styles.tracks}>
        <div className={styles.track}>
          <div className={styles.trackTag}>Workplace training</div>
          <div className={styles.trackName}>32 practitioner scenarios</div>
          <p className={styles.trackDesc}>
            Scenario-based training for staff working with AI systems. Four roles per
            scenario — business user, executive, PM, analyst. Branching decisions drawn
            from real AI incidents across seven risk domains.
          </p>
          <div className={styles.trackMeta}>Foundational · Intermediate · Advanced · 7 risk domains</div>
          <div className={styles.trackPills}>
            <span className={styles.trackPill}>Shadow AI</span>
            <span className={styles.trackPill}>Hallucination</span>
            <span className={styles.trackPill}>AI-enabled BEC</span>
            <span className={styles.trackPill}>Model drift</span>
            <span className={styles.trackPill}>Agentic risk</span>
          </div>
          <a href="#scenarios" className={styles.trackCta}>Browse scenarios ↓</a>
        </div>

        <div className={`${styles.track} ${styles.trackFork}`}>
          <div className={styles.trackTag}>Everyday AI · Fork</div>
          <div className={styles.trackName}>3 public scenarios</div>
          <p className={styles.trackDesc}>
            Built for everyday life, not the office. Five minutes. Deepfake voice scams,
            AI hallucination, algorithmic hiring. You're in the scenario — what do you do?
          </p>
          <div className={styles.trackMeta}>Free · No login · No workplace context needed</div>
          <div className={styles.trackPills}>
            <span className={styles.trackPill}>Is that really Mum?</span>
            <span className={styles.trackPill}>The answer that wasn't</span>
            <span className={styles.trackPill}>The algorithm said no</span>
          </div>
          <Link to="/everyday" className={styles.trackCtaFork}>Play Fork → free</Link>
        </div>
      </div>

      {/* ── Foundation Bundle ── */}
      <div className={styles.bundleSection}>
        <div className={styles.bundleInner}>
          <div className={styles.bundleLeft}>
            <div className={styles.bundleEyebrow}>Foundation Bundle — EU AI Act Article 4</div>
            <div className={styles.bundleTitle}>
              Three scenarios addressing the Article 4 AI literacy obligation
            </div>
            <p className={styles.bundleDesc}>
              EU Regulation 2024/1689 Article 4 requires organisations to ensure staff working
              with AI systems have sufficient AI literacy to understand AI capabilities,
              limitations, and risks. These three scenarios address the risk categories most
              relevant to that obligation. Completing each generates a printable record for
              your training files. Enforcement: August 2, 2026.
            </p>
            <div className={styles.bundleScenarios}>
              <span className={styles.bundleScen}>F2 Shadow AI</span>
              <span className={styles.bundleDot}>·</span>
              <span className={styles.bundleScen}>C5 The Convincing Email</span>
              <span className={styles.bundleDot}>·</span>
              <span className={styles.bundleScen}>A1 Confident and Wrong</span>
            </div>
          </div>
          <div className={styles.bundleRight}>
            <div className={styles.bundleRegRef}>EU AI Act Art. 4</div>
            <div className={styles.bundleDeadline}>Enforcement: Aug 2, 2026</div>
          </div>
        </div>
      </div>

      {/* ── Scenario grid ── */}
      <div id="scenarios" className={styles.proTrackDivider}>
        <span className={styles.proTrackLabel}>Workplace scenarios</span>
      </div>

      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <button className={`${styles.filterBtn} ${filter === 'all' ? styles.filterActive : ''}`} onClick={() => setFilter('all')}>All domains</button>
          {DOMAINS.map(d => (
            <button key={d.key}
              className={`${styles.filterBtn} ${filter === d.key ? styles.filterActive : ''}`}
              onClick={() => setFilter(d.key)}>
              {d.key} — {d.label}
            </button>
          ))}
        </div>
        <div className={styles.filterGroup}>
          {['all', 'Foundational', 'Intermediate', 'Advanced'].map(d => (
            <button key={d}
              className={`${styles.filterBtn} ${diffFilter === d ? styles.filterActive : ''}`}
              onClick={() => setDiffFilter(d)}>
              {d === 'all' ? 'All levels' : d}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.grid}>
        {grouped.map(domain => (
          <div key={domain.key} className={styles.domainGroup}>
            <div className={styles.domainHeader}>
              <span className={styles.domainKey}>{domain.key}</span>
              <span className={styles.domainLabel}>{domain.label}</span>
              <span className={styles.domainCount}>{domain.items.filter(s => !s.stub).length}/{domain.items.length}</span>
            </div>
            <div className={styles.domainCards}>
              {domain.items.map(s => <ScenarioCard key={s.id} scenario={s} />)}
            </div>
          </div>
        ))}
      </div>

      <footer className={styles.footer}>
        <span>AI Risk Practice · airiskpractice.org · open source</span>
        <a href="https://github.com/b-gowland/ai-risk-training" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
        <a href="https://library.airiskpractice.org/" target="_blank" rel="noopener noreferrer">Library ↗</a>
        <a href="https://baseline.airiskpractice.org/" target="_blank" rel="noopener noreferrer">Governance Baseline ↗</a>
        <span className={styles.footerMid}>Scenarios are fictional · No personal data collected · <a href="/privacy">Privacy</a></span>
        <span className={styles.footerRight}>Taxonomy: MIT AI Risk Repository (CC BY 4.0) · NIST AI RMF · OWASP LLM Top 10</span>
      </footer>
    </div>
  );
}
