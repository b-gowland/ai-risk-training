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

function ScenarioCard({ scenario }) {
  const isLive = !scenario.stub;
  const personas = ['business_user', 'executive', 'pm', 'analyst'];

  return (
    <div className={`${styles.card} ${isLive ? styles.cardLive : styles.cardStub}`}>
      <div className={styles.cardHeader}>
        <span className={styles.riskRef}>{scenario.risk_ref}</span>
        <span className={`${styles.diffPill} ${DIFFICULTY_PILL[scenario.difficulty] || ''}`}>
          {scenario.difficulty}
        </span>
      </div>

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
          <Link to={`/scenario/${scenario.id}`} className={styles.playBtn}>
            Play →
          </Link>
        ) : (
          <span className={styles.comingSoon}>Coming soon</span>
        )}
        <a href={scenario.kb_url} target="_blank" rel="noopener noreferrer"
          className={styles.kbRef} onClick={e => e.stopPropagation()}>
          KB ↗
        </a>
      </div>
    </div>
  );
}

export function Homepage() {
  const [filter, setFilter] = useState('all');
  const [diffFilter, setDiffFilter] = useState('all');

  const liveCount = scenarios.filter(s => !s.stub).length;

  const filtered = scenarios.filter(s => {
    const domainMatch = filter === 'all' || s.domain.startsWith(filter);
    const diffMatch   = diffFilter === 'all' || s.difficulty === diffFilter;
    return domainMatch && diffMatch;
  });

  // Group by domain
  const grouped = DOMAINS.map(d => ({
    ...d,
    items: filtered.filter(s => s.domain.startsWith(d.key)),
  })).filter(d => d.items.length > 0);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoMark}>◈</span>
          AI Risk Training
        </div>
        <a href="https://b-gowland.github.io/ai-risk-kb/"
          target="_blank" rel="noopener noreferrer"
          className={styles.kbLink}>
          Knowledge base ↗
        </a>
      </header>

      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroBadge}>Open source · Free · No login</div>
          <h1 className={styles.heroTitle}>
            Pick a scenario. Make the call.<br/>Find out what happens next.
          </h1>
          <p className={styles.heroSub}>
            Choose-your-own-adventure scenarios drawn from real AI incidents.
            Four roles. Branching decisions. Actual consequences — including the funny ones.
          </p>
          <div className={styles.heroStats}>
            <div className={styles.stat}>
              <span className={styles.statNum}>{liveCount}</span>
              <span className={styles.statLabel}>live scenario{liveCount !== 1 ? 's' : ''}</span>
            </div>
            <div className={styles.statDivider}/>
            <div className={styles.stat}>
              <a href="https://b-gowland.github.io/ai-risk-kb/" target="_blank" rel="noopener noreferrer" className={styles.statLink}>
                <span className={styles.statNum}>26</span>
                <span className={styles.statLabel}>KB entries ↗</span>
              </a>
            </div>
            <div className={styles.statDivider}/>
            <div className={styles.stat}>
              <span className={styles.statNum}>4</span>
              <span className={styles.statLabel}>personas</span>
            </div>
            <div className={styles.statDivider}/>
            <div className={styles.stat}>
              <span className={styles.statNum}>7</span>
              <span className={styles.statLabel}>risk domains</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Fork hero — everyday/personal track ── */}
      <div className={styles.forkBanner}>
        <div className={styles.forkBannerInner}>
          <div className={styles.forkLeft}>
            <div className={styles.forkEyebrow}>Free · No login · 5 minutes</div>
            <div className={styles.forkTitle}>Fork</div>
            <div className={styles.forkTagline}>Your choices. Your consequences.</div>
            <div className={styles.forkAudience}>Built for everyday life — not the office.</div>
            <p className={styles.forkDesc}>
              Three real AI risks — deepfake voice scams, AI hallucination, algorithmic hiring.
              You're in the scenario. What do you do?
            </p>
          </div>
          <div className={styles.forkRight}>
            <div className={styles.forkScenarios}>
              <div className={styles.forkScenarioItem}>
                <span className={styles.forkScenarioIcon}>📞</span>
                <span>Is that really Mum?</span>
              </div>
              <div className={styles.forkScenarioItem}>
                <span className={styles.forkScenarioIcon}>🔍</span>
                <span>The answer that wasn't</span>
              </div>
              <div className={styles.forkScenarioItem}>
                <span className={styles.forkScenarioIcon}>📋</span>
                <span>The algorithm said no</span>
              </div>
            </div>
            <Link to="/everyday" className={styles.forkCta}>
              Play Fork → free
            </Link>
          </div>
        </div>
      </div>

      {/* ── Professional track divider ── */}
      <div className={styles.proTrackDivider}>
        <span className={styles.proTrackLabel}>Workplace scenarios</span>
      </div>

      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <button
            className={`${styles.filterBtn} ${filter === 'all' ? styles.filterActive : ''}`}
            onClick={() => setFilter('all')}>
            All domains
          </button>
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
              <span className={styles.domainCount}>
                {domain.items.filter(s => !s.stub).length}/{domain.items.length}
              </span>
            </div>
            <div className={styles.domainCards}>
              {domain.items.map(s => (
                <ScenarioCard key={s.id} scenario={s} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <footer className={styles.footer}>
        <span>ai-risk-training · open source</span>
        <a href="https://github.com/b-gowland/ai-risk-training"
          target="_blank" rel="noopener noreferrer">GitHub ↗</a>
        <a href="https://b-gowland.github.io/ai-risk-kb/"
          target="_blank" rel="noopener noreferrer">Knowledge base ↗</a>
        <span className={styles.footerMid}>
          Scenarios are fictional · No personal data collected ·{' '}
          <a href="https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement"
            target="_blank" rel="noopener noreferrer">Privacy ↗</a>
        </span>
        <span className={styles.footerRight}>
          Taxonomy: MIT AI Risk Repository (CC BY 4.0) · NIST AI RMF · OWASP LLM Top 10
        </span>
      </footer>
    </div>
  );
}
