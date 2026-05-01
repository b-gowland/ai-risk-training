// ShareCard.jsx
// Generates a 1080×1080 share card as PNG using HTML Canvas.
// Renders offscreen, exports via Web Share API (mobile) or download link.

import { useRef } from 'react';
import styles from './EverydayBundle.module.css';
import { trackCardShared } from '../utils/analytics.js';

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

  // Background
  ctx.fillStyle = PALETTE.bg;
  ctx.fillRect(0, 0, SIZE, SIZE);

  // Subtle corner accent
  ctx.fillStyle = toneColour(outcome.tone);
  ctx.globalAlpha = 0.08;
  ctx.beginPath();
  ctx.arc(SIZE, 0, 320, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  // Top border stripe
  ctx.fillStyle = toneColour(outcome.tone);
  ctx.fillRect(0, 0, SIZE, 8);

  // Logo / eyebrow
  ctx.font = '600 32px system-ui, sans-serif';
  ctx.fillStyle = PALETTE.text3;
  ctx.textAlign = 'left';
  ctx.fillText('AI Everyday Risk', 80, 90);

  // Scenario title
  ctx.font = 'bold 52px "Press Start 2P", monospace';
  ctx.fillStyle = PALETTE.text;
  ctx.textAlign = 'left';
  // Wrap at ~920px wide
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
    ctx.fillText(l, 80, 200 + i * 80);
  });

  const afterTitle = 200 + titleLines.length * 80 + 40;

  // Outcome label — large, coloured
  ctx.font = 'bold 88px "Press Start 2P", monospace';
  ctx.fillStyle = toneColour(outcome.tone);
  ctx.textAlign = 'left';
  const labelLines = [];
  const labelWords = (outcome.outcome_label || outcome.heading).split(' ');
  let labelLine = '';
  for (const w of labelWords) {
    const test = labelLine ? `${labelLine} ${w}` : w;
    if (ctx.measureText(test).width > 920 && labelLine) {
      labelLines.push(labelLine); labelLine = w;
    } else { labelLine = test; }
  }
  if (labelLine) labelLines.push(labelLine);
  labelLines.forEach((l, i) => ctx.fillText(l, 80, afterTitle + i * 110));

  const afterLabel = afterTitle + labelLines.length * 110 + 50;

  // Divider
  ctx.strokeStyle = PALETTE.border;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(80, afterLabel);
  ctx.lineTo(SIZE - 80, afterLabel);
  ctx.stroke();

  // Learning text
  ctx.font = '400 42px system-ui, sans-serif';
  ctx.fillStyle = PALETTE.text2;
  ctx.textAlign = 'left';
  wrapText(ctx, outcome.learning, 80, afterLabel + 60, 920, 60);

  // URL — bottom
  ctx.font = '400 30px system-ui, sans-serif';
  ctx.fillStyle = PALETTE.text3;
  ctx.textAlign = 'center';
  ctx.fillText('b-gowland.github.io/ai-risk-training/#/everyday/', SIZE / 2, SIZE - 60);

  // Bottom border
  ctx.fillStyle = toneColour(outcome.tone);
  ctx.fillRect(0, SIZE - 8, SIZE, 8);
}

export function ShareCard({ scenario, outcome }) {
  const canvasRef = useRef(null);

  async function handleShare() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    renderCard(canvas, scenario, outcome);

    const shareMethod = navigator.share ? 'native' : 'download';
    trackCardShared(scenario.id, outcome.tone, shareMethod);

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], 'ai-risk-result.png', { type: 'image/png' });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            title: `${scenario.title} — ${outcome.outcome_label || outcome.heading}`,
            text: outcome.learning,
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
      a.download = 'ai-risk-result.png';
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
          <strong>Share your result</strong>
          Card saves as an image — share to LinkedIn, WhatsApp, or anywhere.
        </div>
        <button className={styles.shareBtn} onClick={handleShare}>
          Share ↗
        </button>
      </div>
    </>
  );
}
