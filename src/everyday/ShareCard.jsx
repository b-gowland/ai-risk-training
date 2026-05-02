// ShareCard.jsx
// Generates a 1080×1080 share card as PNG using HTML Canvas.
// Renders offscreen, exports via Web Share API (mobile) or download link.
// Updated May 2026: challenge hook CTA, brand name "Callout", URL on card.

import { useRef } from 'react';
import styles from './EverydayBundle.module.css';
import { trackForkCardShared } from '../utils/analytics.js';

const PALETTE = {
  bg:      '#0f0a1e',
  surface: '#1a1035',
  border:  '#3d2080',
  text:    '#f0ebff',
  text2:   '#9d8ec7',
  text3:   '#5a4e8a',
  good:    '#10b981',
  warn:    '#f59e0b',
  bad:     '#ef4444',
  accent:  '#7c3aed',
  accent2: '#db2777',
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
  ctx.fillText('FORK', 80, 82);

  // Separator dot
  ctx.fillStyle = PALETTE.text3;
  ctx.font = '400 28px system-ui, sans-serif';
  ctx.fillText(' · AI scenarios', 148, 82);

  // Challenge hook — the primary pull for the viewer
  const hook = `What would you do?`;
  ctx.font = '600 52px system-ui, sans-serif';
  ctx.fillStyle = PALETTE.text2;
  ctx.textAlign = 'left';
  ctx.fillText(hook, 80, 180);

  // Scenario title — slightly smaller, below hook
  ctx.font = 'bold 44px "Press Start 2P", monospace';
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
  ctx.font = 'bold 64px "Press Start 2P", monospace';
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
  ctx.fillText('b-gowland.github.io/ai-risk-training/#/everyday', SIZE / 2, SIZE - 32);

  // Bottom border
  ctx.fillStyle = tc;
  ctx.fillRect(0, SIZE - 10, SIZE, 10);
}

export function ShareCard({ scenario, outcome }) {
  const canvasRef = useRef(null);

  async function handleShare() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    renderCard(canvas, scenario, outcome);

    const shareMethod = navigator.share ? 'native' : 'download';
    trackForkCardShared(scenario.id, outcome.tone, shareMethod);

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], 'fork-result.png', { type: 'image/png' });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            title: `${scenario.title} — ${outcome.outcome_label || outcome.heading}`,
            text: `I got "${outcome.outcome_label || outcome.heading}" on Fork. What would you do? Play free →`,
            files: [file],
          });
          return;
        } catch {
          // User cancelled or share failed — fall through to download
        }
      }

      // Fallback: download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'fork-result.png';
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    }, 'image/png');
  }

  return (
    <>
      {/* Hidden canvas — rendered offscreen */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <div className={styles.sharePreview}>
        <div className={styles.sharePreviewText}>
          <strong>Challenge a friend</strong>
          Saves as an image — share to WhatsApp, LinkedIn, or anywhere.
        </div>
        <button className={styles.shareBtn} onClick={handleShare}>
          Challenge a friend ↗
        </button>
      </div>
    </>
  );
}
