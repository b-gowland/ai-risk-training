// ShareCard.jsx
// Renders share card canvas as a visual display.
// Three sharing actions: Copy caption (clipboard), Share to LinkedIn, Download image.
// Web Share API with files removed — too unreliable across iOS/desktop contexts.
// OG meta tags on index.html provide LinkedIn link preview from fork-og.png.
// Updated May 2, 2026.

import { useRef, useState } from 'react';
import styles from './EverydayBundle.module.css';
import { trackForkCardShared } from '../utils/analytics.js';

const FORK_URL = 'https://airiskpractice.org/#/everyday';

const PALETTE = {
  bg:      '#0D0D0D',
  surface: '#141414',
  border:  '#1E1E1E',
  text:    '#E8E8E8',
  text2:   '#AAAAAA',
  text3:   '#666666',
  good:    '#4ade80',
  warn:    '#D97706',
  bad:     '#f87171',
  accent:  '#D97706',
  accent2: '#D97706',
};

function toneColour(tone) {
  return { good: PALETTE.good, warn: PALETTE.warn, bad: PALETTE.bad }[tone] || PALETTE.warn;
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  const lines = [];
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  lines.forEach((l, i) => ctx.fillText(l, x, y + i * lineHeight));
  return lines.length * lineHeight;
}

function renderCard(canvas, scenario, outcome) {
  const SIZE = 1080;
  canvas.width  = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext('2d');
  const tc = toneColour(outcome.tone);

  // Background
  ctx.fillStyle = PALETTE.bg;
  ctx.fillRect(0, 0, SIZE, SIZE);

  // Corner glow accent — bottom right
  ctx.fillStyle = tc;
  ctx.globalAlpha = 0.07;
  ctx.beginPath();
  ctx.arc(SIZE, SIZE, 480, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  // Top border stripe
  ctx.fillStyle = tc;
  ctx.fillRect(0, 0, SIZE, 10);

  // Brand name — top left
  ctx.font = '700 28px system-ui, sans-serif';
  ctx.fillStyle = PALETTE.text3;
  ctx.textAlign = 'left';
  ctx.fillText('FORK_', 80, 82);

  // Separator dot
  ctx.fillStyle = PALETTE.text3;
  ctx.font = '400 28px system-ui, sans-serif';
  ctx.fillText(' · AI Risk Practice', 168, 82);

  // Challenge hook — the primary pull for the viewer
  const hook = `What would you do?`;
  ctx.font = '600 52px system-ui, sans-serif';
  ctx.fillStyle = PALETTE.text2;
  ctx.textAlign = 'left';
  ctx.fillText(hook, 80, 180);

  // Scenario title — slightly smaller, below hook
  ctx.font = "bold 40px 'Space Mono', monospace";
  ctx.fillStyle = PALETTE.text;
  ctx.textAlign = 'left';
  const titleLines = [];
  const titleWords = scenario.title.split(' ');
  let titleLine = '';
  for (const w of titleWords) {
    const test = titleLine ? `${titleLine} ${w}` : w;
    if (ctx.measureText(test).width > 920 && titleLine) {
      titleLines.push(titleLine); titleLine = w;
    } else { titleLine = test; }
  }
  if (titleLine) titleLines.push(titleLine);
  titleLines.forEach((l, i) => {
    ctx.fillText(l, 80, 270 + i * 68);
  });

  const afterTitle = 270 + titleLines.length * 68 + 50;

  // Result badge background
  const badgeH = 100;
  ctx.fillStyle = tc;
  ctx.globalAlpha = 0.15;
  ctx.beginPath();
  ctx.roundRect(60, afterTitle - 14, SIZE - 120, badgeH, 12);
  ctx.fill();
  ctx.globalAlpha = 1;

  // "I got:" label
  ctx.font = '400 28px system-ui, sans-serif';
  ctx.fillStyle = PALETTE.text3;
  ctx.textAlign = 'left';
  ctx.fillText('I got:', 80, afterTitle + 28);

  // Outcome label — large, coloured
  ctx.font = "bold 52px 'Space Mono', monospace";
  ctx.fillStyle = tc;
  ctx.textAlign = 'right';
  ctx.fillText(outcome.outcome_label || outcome.heading, SIZE - 80, afterTitle + 70);

  const afterLabel = afterTitle + badgeH + 50;

  // Divider
  ctx.strokeStyle = PALETTE.border;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(80, afterLabel);
  ctx.lineTo(SIZE - 80, afterLabel);
  ctx.stroke();

  // Learning text — what you take away
  ctx.font = '400 40px system-ui, sans-serif';
  ctx.fillStyle = PALETTE.text2;
  ctx.textAlign = 'left';
  const learningBottom = afterLabel + 50 + wrapText(ctx, outcome.learning, 80, afterLabel + 50, 920, 58);

  // Prompt to play — prominent, action-oriented
  const promptY = Math.max(learningBottom + 60, SIZE - 200);
  ctx.fillStyle = tc;
  ctx.globalAlpha = 0.12;
  ctx.beginPath();
  ctx.roundRect(60, promptY - 20, SIZE - 120, 90, 12);
  ctx.fill();
  ctx.globalAlpha = 1;

  ctx.font = '600 36px system-ui, sans-serif';
  ctx.fillStyle = tc;
  ctx.textAlign = 'center';
  ctx.fillText('Could you do better? Play free →', SIZE / 2, promptY + 45);

  // URL — bottom, readable size
  ctx.font = '400 26px system-ui, sans-serif';
  ctx.fillStyle = PALETTE.text3;
  ctx.textAlign = 'center';
  ctx.fillText('airiskpractice.org/#/everyday', SIZE / 2, SIZE - 32);

  // Bottom border
  ctx.fillStyle = tc;
  ctx.fillRect(0, SIZE - 10, SIZE, 10);
}

export function ShareCard({ scenario, outcome }) {
  const canvasRef = useRef(null);
  const [copied, setCopied] = useState(false);

  // Render canvas on mount — shown as visual preview
  function handleCanvasRef(el) {
    canvasRef.current = el;
    if (el && !el.dataset.rendered) {
      renderCard(el, scenario, outcome);
      el.dataset.rendered = 'true';
    }
  }

  // 1. Copy pre-written caption — works everywhere, no API dependencies
  async function handleCopy() {
    const label = outcome.outcome_label || outcome.heading;
    const caption = `I got "${label}" on Fork — could you do better?\n\nPlay free: ${FORK_URL}`;
    try {
      await navigator.clipboard.writeText(caption);
      trackForkCardShared(scenario.id, outcome.tone, 'copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard API blocked — show prompt as fallback
      window.prompt('Copy this caption:', caption);
    }
  }

  // 2. LinkedIn share — opens share dialog, LinkedIn fetches OG preview from FORK_URL
  function handleLinkedIn() {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(FORK_URL)}`;
    trackForkCardShared(scenario.id, outcome.tone, 'linkedin');
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  // 3. Download card PNG — tertiary, for manual attachment to posts
  function handleDownload() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      trackForkCardShared(scenario.id, outcome.tone, 'download');
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'fork-result.png';
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    }, 'image/png');
  }

  return (
    <div className={styles.shareSection}>
      {/* Card — displayed as visual, not the sharing mechanism */}
      <canvas
        ref={handleCanvasRef}
        className={styles.shareCardCanvas}
        aria-label={`Fork result: ${outcome.outcome_label || outcome.heading}`}
      />

      {/* Primary actions — side by side */}
      <div className={styles.shareActions}>
        <button
          className={`${styles.shareBtn} ${styles.shareBtnCopy} ${copied ? styles.shareBtnCopied : ''}`}
          onClick={handleCopy}
        >
          {copied ? '✓ Copied!' : '📋 Copy caption'}
        </button>
        <button
          className={`${styles.shareBtn} ${styles.shareBtnLinkedIn}`}
          onClick={handleLinkedIn}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: 6, verticalAlign: 'middle', flexShrink: 0 }}>
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
          Share to LinkedIn
        </button>
      </div>

      {/* Tertiary — download for manual post attachment */}
      <button className={styles.shareDownloadBtn} onClick={handleDownload}>
        ↓ Download image to attach manually
      </button>

      <p className={styles.shareHint}>
        Copy the caption then paste into any post — WhatsApp, LinkedIn, iMessage, anywhere.
      </p>
    </div>
  );
}
