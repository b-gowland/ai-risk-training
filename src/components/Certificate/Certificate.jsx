import React, { useRef } from 'react';
import { trackCertificateGenerated } from '../../utils/analytics.js';
import styles from './Certificate.module.css';

// Foundation Bundle — the three scenarios that together address EU AI Act Article 4
// AI literacy requirements for organisations deploying AI systems.
const BUNDLE_SCENARIOS = ['f2-shadow-ai', 'c5-ai-cyber-attacks', 'a1-hallucination'];

const BUNDLE_LABELS = {
  'f2-shadow-ai':        { ref: 'F2', title: 'Shadow AI',             risk: 'Unsanctioned AI use and data leakage' },
  'c5-ai-cyber-attacks': { ref: 'C5', title: 'The Convincing Email',  risk: 'AI-enabled business email compromise' },
  'a1-hallucination':    { ref: 'A1', title: 'Confident and Wrong',   risk: 'Hallucination and over-reliance' },
};

// Score band labels — what appears on the certificate
function scoreBand(score) {
  if (score >= 85) return { label: 'Distinction', color: '#2d6a4f' };
  if (score >= 65) return { label: 'Pass',        color: '#92520a' };
  return              { label: 'Completed',     color: '#555555' };
}

// Format today's date for certificate
function formatDate(d) {
  return d.toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function Certificate({ scenario, outcome, persona, onDismiss }) {
  const ref = useRef(null);
  const isBundle = BUNDLE_SCENARIOS.includes(scenario.id);
  if (!isBundle) return null;

  const outcomeScore = outcome.score ?? 0;
  const band = scoreBand(outcomeScore);
  const date = formatDate(new Date());

  // Fire once on mount — certificate was opened
  React.useEffect(() => {
    trackCertificateGenerated(scenario.id, band.label);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const personaData = scenario.personas[persona];
  const scenarioMeta = BUNDLE_LABELS[scenario.id];

  function handlePrint() {
    window.print();
  }

  return (
    <div className={styles.overlay} role="dialog" aria-label="Training certificate">
      <div className={styles.sheet} ref={ref}>
        {/* Header band */}
        <div className={styles.headerBand}>
          <span className={styles.logoMark}>◈</span>
          <span className={styles.headerTitle}>AI Risk Training</span>
          <span className={styles.headerSub}>airiskpractice.org · Open Source AI Governance</span>
        </div>

        {/* Main certificate body */}
        <div className={styles.body}>
          <div className={styles.certLabel}>Certificate of Completion</div>

          <div className={styles.scenarioRef}>
            {scenarioMeta.ref} — {scenarioMeta.title}
          </div>

          <div className={styles.riskStatement}>
            <em>{scenarioMeta.risk}</em>
          </div>

          <div className={styles.divider} />

          <div className={styles.detail}>
            <div className={styles.detailRow}>
              <span className={styles.detailKey}>Role played</span>
              <span className={styles.detailVal}>{personaData.label} — {personaData.role}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailKey}>Outcome</span>
              <span className={styles.detailVal}>{outcome.heading}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailKey}>Score</span>
              <span className={styles.detailVal} style={{ color: band.color, fontWeight: 700 }}>
                {outcomeScore}/100 — {band.label}
              </span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailKey}>Completed</span>
              <span className={styles.detailVal}>{date}</span>
            </div>
          </div>

          <div className={styles.divider} />

          {/* EU AI Act framing — this is what gives it organisational weight */}
          <div className={styles.compliance}>
            <div className={styles.complianceTitle}>EU AI Act Article 4 — AI Literacy</div>
            <p className={styles.complianceText}>
              This training scenario addresses Article 4 of EU Regulation 2024/1689 (EU AI Act),
              which requires organisations to ensure their staff possess sufficient AI literacy to
              understand the capabilities, limitations, and risks of AI systems they use or oversee.
              Enforcement: August 2, 2026.
            </p>
            <div className={styles.bundleRow}>
              <span className={styles.bundleLabel}>Foundation Bundle scenarios:</span>
              <span className={styles.bundleScenarios}>F2 Shadow AI · C5 AI Cyber Attacks · A1 Hallucination</span>
            </div>
          </div>

          <div className={styles.divider} />

          {/* Footer */}
          <div className={styles.footer}>
            <div className={styles.footerLeft}>
              <div className={styles.footerItem}>
                <span className={styles.footerKey}>Platform</span>
                <span className={styles.footerVal}>app.airiskpractice.org</span>
              </div>
              <div className={styles.footerItem}>
                <span className={styles.footerKey}>Licence</span>
                <span className={styles.footerVal}>Apache 2.0 · CC BY 4.0</span>
              </div>
              <div className={styles.footerItem}>
                <span className={styles.footerKey}>Repository</span>
                <span className={styles.footerVal}>github.com/b-gowland/ai-risk-training</span>
              </div>
            </div>
            <div className={styles.footerDisclaimer}>
              This certificate records completion of an open-source scenario-based training exercise.
              It does not constitute a formal qualification or regulatory certification.
            </div>
          </div>
        </div>
      </div>

      {/* Print / close controls — hidden on print */}
      <div className={styles.controls} aria-hidden="false">
        <button className={styles.printBtn} onClick={handlePrint}>
          Print / Save as PDF
        </button>
        <button className={styles.dismissBtn} onClick={onDismiss}>
          Close
        </button>
      </div>
    </div>
  );
}
