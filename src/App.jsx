import { useReducer, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getScenario } from './scenarios/index.js';
import {
  STATES, createInitialState, reducer,
  resolveNext, getCurrentNode, getOutcome,
  PERSONA_ORDER,
} from './engine/narrativeEngine.js';
import styles from './App.module.css';

// ── Feedback generation ──────────────────────────────────────────
// Uses the scenario's authored 'note' field for each choice.
// This keeps the API key server-side and ensures feedback always works.
//
// To enable live Claude feedback in a self-hosted deployment:
// 1. Set up a serverless proxy (Cloudflare Worker / Vercel Edge Function)
//    that holds your ANTHROPIC_API_KEY server-side
// 2. Replace this function with a fetch() to your proxy endpoint
// 3. Never call api.anthropic.com directly from the browser — the key
//    would be visible to every visitor in DevTools → Network tab
function getLocalFeedback(choice, personaKey, personaData) {
  const quality = choice.quality;
  const name = personaData.character;

  const openers = {
    good:    `Good call by ${name}. `,
    partial: `Partially right, but ${name} isn't all the way there. `,
    poor:    `Not the right move for ${name} in this situation. `,
  };

  // Use the scenario author's note as the core of the feedback
  // This is accurate, specific, and always available
  const opener = openers[quality] || openers.poor;
  return opener + choice.note;
}

// ── Persona Select ────────────────────────────────────────────────
const PERSONA_ICONS = { business_user: '◇', executive: '◈', pm: '◎', analyst: '◉' };

function PersonaSelect({ scenario, onSelect }) {
  return (
    <div className={styles.personaWrap}>
      <div className={styles.riskBadge}>{scenario.risk_ref} — {scenario.domain}</div>
      <h1 className={styles.scenarioTitle}>{scenario.title}</h1>
      <p className={styles.scenarioSub}>{scenario.subtitle}</p>
      <div className={styles.personaPrompt}>Who are you in this story?</div>
      <div className={styles.personaGrid}>
        {PERSONA_ORDER.filter(key => scenario.personas[key]).map(key => {
          const p = scenario.personas[key];
          return (
            <button key={key} className={styles.personaCard} onClick={() => onSelect(key)}>
              <div className={styles.personaIcon}>{PERSONA_ICONS[key]}</div>
              <div className={styles.personaTag}>{p.label}</div>
              <div className={styles.personaRole}>{p.role}</div>
              <div className={styles.personaFraming}>{p.framing}</div>
              <div className={styles.personaCta}>Play this role →</div>
            </button>
          );
        })}
      </div>
      <div className={styles.scenarioMeta}>
        <span>{scenario.difficulty}</span><span>·</span>
        <span>~{scenario.estimated_minutes} min</span><span>·</span>
        <a href={scenario.kb_url} target="_blank" rel="noopener noreferrer">
          Knowledge base ↗
        </a>
      </div>
      <p className={styles.scenarioDisclaimer}>
        All characters and organisations in these scenarios are fictional.
        Incidents referenced in the knowledge base are real and cited.
      </p>
    </div>
  );
}

// ── Premise ───────────────────────────────────────────────────────
function Premise({ scenario, persona, onStart }) {
  const p = scenario.personas[persona];
  return (
    <div className={styles.premiseWrap}>
      <div className={styles.premiseRole}>
        <span className={styles.premiseIcon}>{PERSONA_ICONS[persona]}</span>
        <span>{p.label} — {p.role}</span>
      </div>
      <h2 className={styles.premiseCharacter}>You are {p.character}.</h2>
      <div className={styles.premiseText}>{p.premise}</div>
      <button className={styles.primaryBtn} onClick={onStart}>Begin →</button>
    </div>
  );
}

// ── Scene SVG (simplified inline, expand per scene key later) ─────
function ScenePanel({ node }) {
  const sceneKey = node.scene || 'desk-default';
  return (
    <div className={styles.scenePanel} data-scene={sceneKey}>
      <SceneSVG sceneKey={sceneKey} caption={node.caption} subCaption={node.sub_caption} />
    </div>
  );
}

// Scene keys that have watercolour PNG images ready — all 23 complete
const IMAGE_SCENES = new Set([
  'analyst-desk',
  'desk-working',
  'office-meeting',
  'boardroom',
  'desk-focused',
  'office-bright',
  'desk-review',
  'office-briefing',
  'desk-colleague',
  'desk-intranet',
  'desk-casual',
  'desk-typing',
  'office-busted',
  'video-call',
  'payment-screen',
  'document-error',
  'chart-declining',
  'phone-verify',
  'security-alert',
  'xray-ai',
  'news-leak',
  'drift-dashboard',
  'api-outage',
]);

// Accessibility alt text for image-backed scenes
const IMAGE_ALT = {
  'analyst-desk':   `Analyst desk with dual monitors showing a security operations dashboard`,
  'desk-working':   `Corporate office workstation with monitor and keyboard`,
  'office-meeting': `Modern corporate meeting room with conference table and whiteboard`,
  'boardroom':      `Formal boardroom with long rectangular table and presentation screen`,
  'desk-focused':   `Office desk in evening light with desk lamp and single monitor`,
  'office-bright':  `Bright meeting room with whiteboard covered in diagrams and sticky notes`,
  'desk-review':    `Corporate desk with a structured register displayed on screen`,
  'office-briefing':`Meeting area with a notification or alert dashboard on screen`,
  'desk-colleague': `Two adjacent corporate desks with shared documents between them`,
  'desk-intranet':  `Corporate desk with an intranet policy page on screen`,
  'desk-casual':    `Casual hot-desk setup with laptop and coffee in an open-plan office`,
  'desk-typing':    `Corporate desk with a chat or prompt interface open on laptop`,
  'office-busted':  `Corporate desk with a warning or incident report screen showing red alerts`,
  'video-call':     `Corporate desk with a video call interface showing participant grid`,
  'payment-screen': `Corporate desk with a financial transfer confirmation screen`,
  'document-error': `Corporate desk with a document showing highlighted error markers`,
  'chart-declining':`Corporate desk with a data dashboard showing a declining line chart`,
  'phone-verify':   `Corporate desk with a smartphone showing an active call screen`,
  'security-alert': `Corporate desk with a security monitoring dashboard showing an anomaly alert`,
  'xray-ai':        `Clinical medical workstation with a chest X-ray and AI diagnostic overlay`,
  'news-leak':      `Corporate desk with a news article or internal announcement on screen`,
  'drift-dashboard':`Corporate desk with an analytics dashboard showing a hidden segment diverging`,
  'api-outage':     `Corporate desk with a system status page showing red error indicators`,
};

// SVG scene lookup — used directly for non-image scenes and as fallback
function getSVGScene(sceneKey) {
  const scenes = {
    'desk-casual':      <DeskCasualScene />,
    'desk-typing':      <DeskTypingScene />,
    'desk-colleague':   <DeskColleagueScene />,
    'desk-intranet':    <DeskIntranetScene />,
    'desk-focused':     <DeskFocusedScene />,
    'desk-review':      <DeskReviewScene />,
    'desk-working':     <DeskWorkingScene />,
    'office-meeting':   <OfficeMeetingScene />,
    'office-busted':    <OfficeBustedScene />,
    'office-briefing':  <OfficeBriefingScene />,
    'office-bright':    <OfficeReviewScene />,
    'boardroom':        <BoardroomScene />,
    'analyst-desk':     <AnalystDeskScene />,
    'video-call':       <VideoCallScene />,
    'payment-screen':   <PaymentScreenScene />,
    'document-error':   <DocumentErrorScene />,
    'chart-declining':  <ChartDecliningScene />,
    'phone-verify':     <PhoneVerifyScene />,
    'security-alert':   <SecurityAlertScene />,
    'xray-ai':          <XrayAiScene />,
    'news-leak':        <NewsLeakScene />,
    'drift-dashboard':  <DriftDashboardScene />,
    'api-outage':       <ApiOutageScene />,
  };
  return scenes[sceneKey] || scenes['desk-casual'];
}

// Image-backed scene: shows SVG placeholder while loading, falls back to SVG on error
function ImageScene({ sceneKey }) {
  const [status, setStatus] = useState('loading'); // 'loading' | 'loaded' | 'error'
  const alt = IMAGE_ALT[sceneKey] || `Scene illustration`;
  return (
    <div className={styles.imageSceneWrap}>
      {status === 'loading' && (
        <div className={styles.imageScenePlaceholder} aria-hidden="true">
          {getSVGScene(sceneKey)}
        </div>
      )}
      {status !== 'error' && (
        <img
          src={`${import.meta.env.BASE_URL}scenes/${sceneKey}.png`}
          alt={alt}
          className={styles.sceneImg}
          style={{ display: status === 'loaded' ? 'block' : 'none' }}
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
        />
      )}
      {status === 'error' && getSVGScene(sceneKey)}
    </div>
  );
}

// Scene renderer — routes image-ready keys to PNG, everything else to SVG
function SceneSVG({ sceneKey, caption, subCaption }) {
  return (
    <div className={styles.sceneWrapper}>
      <div className={styles.svgWrap}>
        {IMAGE_SCENES.has(sceneKey)
          ? <ImageScene sceneKey={sceneKey} />
          : getSVGScene(sceneKey)
        }
      </div>
      <div className={styles.captionBar}>
        <p className={styles.captionMain}>{caption}</p>
        {subCaption && <p className={styles.captionSub}>{subCaption}</p>}
      </div>
    </div>
  );
}


// ── Additional scene components for C4 / A1 / E1 ─────────────────

// C4 — video call that looks convincingly real
function VideoCallScene() {
  return (
    <svg width="100%" viewBox="0 0 680 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Video call from CFO — is it real?">
      {/* Window background */}
      <rect x={460} y={20} width={180} height={150} rx={4} fill="var(--panel-window)" opacity={0.3}/>
      <line x1={550} y1={20} x2={550} y2={170} stroke="var(--panel-ink)" strokeWidth={1} opacity={0.2}/>
      <line x1={460} y1={95} x2={640} y2={95} stroke="var(--panel-ink)" strokeWidth={1} opacity={0.2}/>
      {/* Desk */}
      <rect x={60} y={280} width={480} height={12} rx={3} fill="var(--panel-desk)" opacity={0.5}/>
      <rect x={60} y={292} width={480} height={50} fill="var(--panel-desk)" opacity={0.12}/>
      {/* Monitor bezel */}
      <rect x={120} y={80} width={280} height={190} rx={7} fill="var(--panel-bg)" stroke="var(--panel-ink)" strokeWidth={2.5}/>
      {/* Screen — video call */}
      <rect x={128} y={88} width={264} height={174} rx={4} fill="var(--panel-screen)" opacity={0.5}/>
      {/* Video face — CFO */}
      <rect x={132} y={92} width={256} height={162} rx={3} fill="#1a3a5c"/>
      <circle cx={260} cy={158} r={36} fill="#2a5298"/>
      <rect x={224} y={194} width={72} height={44} rx={20} fill="#2a5298"/>
      {/* Name badge */}
      <rect x={136} y={228} width={140} height={22} rx={3} fill="var(--panel-ink)" opacity={0.85}/>
      <text x={206} y={242} textAnchor="middle" fill="var(--panel-bg)" fontSize={9} fontFamily="var(--font-mono,monospace)">Dana Okafor — CFO</text>
      {/* LIVE badge */}
      <rect x={246} y={96} width={36} height={15} rx={3} fill="var(--panel-danger)"/>
      <text x={264} y={107} textAnchor="middle" fill="white" fontSize={8} fontFamily="var(--font-mono,monospace)">LIVE</text>
      {/* Subtle scan lines — synthetic hint */}
      <line x1={132} y1={145} x2={388} y2={145} stroke="white" strokeWidth={0.4} opacity={0.12}/>
      <line x1={132} y1={120} x2={388} y2={120} stroke="white" strokeWidth={0.4} opacity={0.08}/>
      {/* Monitor stand */}
      <rect x={251} y={268} width={18} height={14} rx={2} fill="var(--panel-desk)" opacity={0.4}/>
      <rect x={234} y={280} width={52} height={6} rx={2} fill="var(--panel-desk)" opacity={0.4}/>
      {/* Person watching — uncertain */}
      <ellipse cx={530} cy={266} rx={28} ry={26} fill="var(--panel-shirt)" stroke="var(--panel-ink)" strokeWidth={2}/>
      <path d="M504 266 Q489 262 477 254" fill="none" stroke="var(--panel-ink)" strokeWidth={2} strokeLinecap="round"/>
      <path d="M556 266 Q571 262 583 254" fill="none" stroke="var(--panel-ink)" strokeWidth={2} strokeLinecap="round"/>
      <circle cx={530} cy={238} r={22} fill="var(--panel-bg)" stroke="var(--panel-ink)" strokeWidth={2.5}/>
      <path d="M510 231 Q515 217 530 215 Q545 217 550 231" fill="var(--panel-ink)" opacity={0.6}/>
      {/* Uncertain eyes — one brow raised */}
      <path d="M519 225 Q523 221 527 224" fill="none" stroke="var(--panel-ink)" strokeWidth={1.5} strokeLinecap="round"/>
      <path d="M533 222 Q537 219 541 223" fill="none" stroke="var(--panel-ink)" strokeWidth={1.5} strokeLinecap="round"/>
      <ellipse cx={523} cy={229} rx={4} ry={4.5} fill="var(--panel-ink)"/>
      <ellipse cx={537} cy={229} rx={4} ry={4.5} fill="var(--panel-ink)"/>
      <circle cx={525} cy={228} r={1.5} fill="white"/>
      <circle cx={539} cy={228} r={1.5} fill="white"/>
      <path d="M524 238 Q530 241 536 238" fill="none" stroke="var(--panel-ink)" strokeWidth={1.2} strokeLinecap="round"/>
      {/* Paper with account details */}
      <rect x={390} y={248} width={80} height={54} rx={3} fill="var(--panel-bg)" stroke="var(--panel-ink)" strokeWidth={1.5} transform="rotate(3,430,275)"/>
      <rect x={397} y={256} width={60} height={5} rx={1} fill="var(--panel-ink)" opacity={0.12} transform="rotate(3,430,275)"/>
      <rect x={397} y={265} width={50} height={5} rx={1} fill="var(--panel-ink)" opacity={0.12} transform="rotate(3,430,275)"/>
      <text x={430} y={286} textAnchor="middle" fontSize={8} fontWeight="600" fill="var(--panel-danger)" opacity={0.85} transform="rotate(3,430,275)">$180,000</text>
    </svg>
  );
}

// C4 — payment screen with large amount
function PaymentScreenScene() {
  return (
    <svg width="100%" viewBox="0 0 680 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Payment confirmation screen showing $180,000 transfer">
      {/* Desk */}
      <rect x={60} y={280} width={480} height={12} rx={3} fill="var(--panel-desk)" opacity={0.5}/>
      {/* Monitor */}
      <rect x={80} y={40} width={440} height={250} rx={7} fill="var(--panel-bg)" stroke="var(--panel-ink)" strokeWidth={2.5}/>
      {/* Browser chrome */}
      <rect x={80} y={40} width={440} height={34} rx={7} fill="var(--panel-screen)" opacity={0.5}/>
      <rect x={80} y={62} width={440} height={12} fill="var(--panel-screen)" opacity={0.5}/>
      {/* Browser dots */}
      <circle cx={100} cy={57} r={5} fill="var(--panel-danger)" opacity={0.6}/>
      <circle cx={116} cy={57} r={5} fill="#e67e22" opacity={0.6}/>
      <circle cx={132} cy={57} r={5} fill="#27ae60" opacity={0.6}/>
      {/* URL bar */}
      <rect x={148} y={49} width={300} height={16} rx={4} fill="var(--panel-bg)"/>
      <text x={298} y={60} textAnchor="middle" fontSize={8} fill="var(--panel-ink)" opacity={0.45} fontFamily="var(--font-mono,monospace)">secure-payments.internal/transfer</text>
      {/* Payment form */}
      <text x={300} y={104} textAnchor="middle" fontSize={14} fontWeight="700" fill="var(--panel-ink)" fontFamily="var(--font-display,serif)">Confirm Transfer</text>
      <rect x={100} y={112} width={360} height={1} fill="var(--panel-ink)" opacity={0.1}/>
      {/* Recipient field */}
      <text x={110} y={132} fontSize={9} fill="var(--panel-ink)" opacity={0.45}>RECIPIENT</text>
      <rect x={110} y={136} width={360} height={18} rx={3} fill="var(--panel-surface,#f3f1ed)"/>
      <text x={118} y={148} fontSize={9} fill="var(--panel-ink)" opacity={0.7} fontFamily="var(--font-mono,monospace)">ACC: 8821-****-****-4203  |  BSB: 062-000</text>
      {/* Amount — prominent warning */}
      <text x={110} y={172} fontSize={9} fill="var(--panel-ink)" opacity={0.45}>AMOUNT</text>
      <rect x={110} y={176} width={360} height={30} rx={3} fill="#fff3cd" stroke="#e67e22" strokeWidth={1.5}/>
      <text x={290} y={197} textAnchor="middle" fontSize={20} fontWeight="700" fill="#856404">$180,000.00</text>
      {/* Warning strip */}
      <rect x={110} y={212} width={360} height={18} rx={3} fill="#fdf2f2"/>
      <text x={290} y={224} textAnchor="middle" fontSize={8} fill="var(--panel-danger)">⚠  This transaction cannot be reversed once submitted</text>
      {/* Confirm button */}
      <rect x={170} y={236} width={260} height={30} rx={6} fill="var(--panel-danger)"/>
      <text x={300} y={256} textAnchor="middle" fontSize={12} fontWeight="600" fill="white">Confirm Transfer →</text>
      {/* Monitor stand */}
      <rect x={291} y={288} width={18} height={12} rx={2} fill="var(--panel-desk)" opacity={0.4}/>
      <rect x={274} y={298} width={52} height={6} rx={2} fill="var(--panel-desk)" opacity={0.4}/>
    </svg>
  );
}

// A1 — document with fabricated citation highlighted
function DocumentErrorScene() {
  return (
    <svg width="100%" viewBox="0 0 680 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Document with a fabricated regulatory citation highlighted in red">
      {/* Desk */}
      <rect x={40} y={295} width={600} height={12} rx={3} fill="var(--panel-desk)" opacity={0.5}/>
      {/* Document */}
      <rect x={150} y={20} width={380} height={280} rx={4} fill="var(--panel-bg)" stroke="var(--panel-ink)" strokeWidth={2}/>
      {/* Header */}
      <text x={340} y={48} textAnchor="middle" fontSize={12} fontWeight="700" fill="var(--panel-ink)" fontFamily="var(--font-display,serif)">Regulatory Briefing — Client Confidential</text>
      <rect x={165} y={54} width={350} height={1} fill="var(--panel-ink)" opacity={0.2}/>
      {/* Normal text lines */}
      {[0,1,2,3].map(i => (
        <rect key={i} x={165} y={62+i*14} width={280+i%2*20} height={8} rx={2} fill="var(--panel-ink)" opacity={0.1}/>
      ))}
      {/* Fabricated citation — red highlight */}
      <rect x={165} y={122} width={350} height={28} rx={2} fill="#ffebee" stroke="#ef5350" strokeWidth={1.5}/>
      <text x={174} y={136} fontSize={8} fill="var(--panel-danger)" fontFamily="var(--font-mono,monospace)">¹ APRA Prudential Standard APS 330/AI-2024 cl.4.2(b),</text>
      <text x={174} y={146} fontSize={8} fill="var(--panel-danger)" fontFamily="var(--font-mono,monospace)">  issued March 2024 — [citation not verified]</text>
      {/* More text lines */}
      {[0,1,2,3,4].map(i => (
        <rect key={i} x={165} y={158+i*14} width={260+i%3*15} height={8} rx={2} fill="var(--panel-ink)" opacity={0.1}/>
      ))}
      {/* Red pen annotation */}
      <path d="M460 122 Q488 108 498 96" fill="none" stroke="var(--panel-danger)" strokeWidth={2} strokeLinecap="round"/>
      <text x={502} y={93} fontSize={9} fill="var(--panel-danger)" fontStyle="italic">Does not exist!</text>
      {/* Sticky note */}
      <rect x={418} y={196} width={92} height={72} rx={2} fill="#fffde7" stroke="#f0c040" strokeWidth={1} transform="rotate(3,464,232)"/>
      <text x={464} y={220} textAnchor="middle" fontSize={8} fill="#856404" transform="rotate(3,464,232)">Check ALL</text>
      <text x={464} y={232} textAnchor="middle" fontSize={8} fill="#856404" transform="rotate(3,464,232)">citations</text>
      <text x={464} y={246} textAnchor="middle" fontSize={9} fontWeight="600" fill="var(--panel-danger)" transform="rotate(3,464,232)">before sending!</text>
    </svg>
  );
}

// E1 — diversity index chart declining after AI tool launch
function ChartDecliningScene() {
  return (
    <svg width="100%" viewBox="0 0 680 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Chart showing shortlist diversity declining after AI tool launch">
      {/* Desk */}
      <rect x={40} y={295} width={600} height={12} rx={3} fill="var(--panel-desk)" opacity={0.5}/>
      {/* Monitor */}
      <rect x={70} y={30} width={420} height={242} rx={7} fill="var(--panel-bg)" stroke="var(--panel-ink)" strokeWidth={2.5}/>
      <rect x={78} y={38} width={404} height={226} rx={4} fill="var(--panel-screen)" opacity={0.3}/>
      {/* Chart title */}
      <text x={280} y={62} textAnchor="middle" fontSize={11} fontWeight="700" fill="var(--panel-ink)">Shortlist Diversity Index — Monthly</text>
      <line x1={90} y1={68} x2={470} y2={68} stroke="var(--panel-ink)" strokeWidth={0.5} opacity={0.3}/>
      {/* Axes */}
      <line x1={110} y1={78} x2={110} y2={210} stroke="var(--panel-ink)" strokeWidth={1} opacity={0.4}/>
      <line x1={110} y1={210} x2={460} y2={210} stroke="var(--panel-ink)" strokeWidth={1} opacity={0.4}/>
      {/* Y labels */}
      {["100%","75%","50%","25%"].map((label, i) => (
        <text key={i} x={106} y={82+i*32} textAnchor="end" fontSize={7} fill="var(--panel-ink)" opacity={0.5}>{label}</text>
      ))}
      {/* X labels */}
      {["Oct","Nov","Dec","Jan","Feb","Mar"].map((m, i) => (
        <text key={i} x={126+i*60} y={222} textAnchor="middle" fontSize={7} fill="var(--panel-ink)" opacity={0.5}>{m}</text>
      ))}
      {/* AI tool launch line */}
      <line x1={246} y1={78} x2={246} y2={210} stroke="#e67e22" strokeWidth={1.5} strokeDasharray="4 3" opacity={0.8}/>
      <text x={250} y={87} fontSize={7} fill="#e67e22">AI tool</text>
      <text x={250} y={97} fontSize={7} fill="#e67e22">launched</text>
      {/* Healthy line (before launch) */}
      <polyline points="126,96 186,92 246,90" fill="none" stroke="#27ae60" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" opacity={0.45}/>
      {/* Declining line (after launch) — red */}
      <polyline points="246,90 306,118 366,148 426,174" fill="none" stroke="var(--panel-danger)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/>
      {/* Data points — green (before) */}
      {[[126,96],[186,92],[246,90]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r={4} fill="#27ae60" opacity={0.6}/>
      ))}
      {/* Data points — red (after) */}
      {[[306,118],[366,148],[426,174]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r={4} fill="var(--panel-danger)"/>
      ))}
      {/* –28% label */}
      <text x={434} y={180} fontSize={9} fill="var(--panel-danger)" fontStyle="italic" fontWeight="600">–28%</text>
      {/* Monitor stand */}
      <rect x={271} y={270} width={18} height={12} rx={2} fill="var(--panel-desk)" opacity={0.4}/>
      <rect x={254} y={280} width={52} height={6} rx={2} fill="var(--panel-desk)" opacity={0.4}/>
      {/* Person — worried */}
      <ellipse cx={560} cy={266} rx={26} ry={24} fill="var(--panel-shirt)" stroke="var(--panel-ink)" strokeWidth={2}/>
      <path d="M536 266 Q521 262 509 254" fill="none" stroke="var(--panel-ink)" strokeWidth={2} strokeLinecap="round"/>
      <path d="M584 266 Q599 262 611 254" fill="none" stroke="var(--panel-ink)" strokeWidth={2} strokeLinecap="round"/>
      <circle cx={560} cy={240} r={22} fill="var(--panel-bg)" stroke="var(--panel-ink)" strokeWidth={2.5}/>
      <path d="M540 233 Q545 219 560 217 Q575 219 580 233" fill="var(--panel-ink)" opacity={0.6}/>
      <ellipse cx={554} cy={244} rx={4} ry={4.5} fill="var(--panel-ink)"/>
      <ellipse cx={566} cy={244} rx={4} ry={4.5} fill="var(--panel-ink)"/>
      <path d="M553 253 Q560 257 567 253" fill="none" stroke="var(--panel-ink)" strokeWidth={1.5} strokeLinecap="round"/>
    </svg>
  );
}

// C4 — phone verification, confirmed fraud stopped
function PhoneVerifyScene() {
  return (
    <svg width="100%" viewBox="0 0 680 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Person on phone verifying the call was a fraud — large green checkmark">
      {/* Desk */}
      <rect x={60} y={290} width={480} height={12} rx={3} fill="var(--panel-desk)" opacity={0.5}/>
      {/* Person — on phone */}
      <ellipse cx={180} cy={272} rx={28} ry={26} fill="var(--panel-shirt)" stroke="var(--panel-ink)" strokeWidth={2}/>
      <path d="M154 272 Q139 268 127 260" fill="none" stroke="var(--panel-ink)" strokeWidth={2} strokeLinecap="round"/>
      <path d="M206 272 Q221 268 233 260" fill="none" stroke="var(--panel-ink)" strokeWidth={2} strokeLinecap="round"/>
      <circle cx={180} cy={244} r={22} fill="var(--panel-bg)" stroke="var(--panel-ink)" strokeWidth={2.5}/>
      <path d="M160 237 Q165 223 180 221 Q195 223 200 237" fill="var(--panel-ink)" opacity={0.6}/>
      {/* Phone to ear */}
      <rect x={193} y={226} width={24} height={42} rx={8} fill="var(--panel-ink)"/>
      <rect x={196} y={229} width={18} height={34} rx={5} fill="var(--panel-screen)" opacity={0.8}/>
      {/* Relieved expression */}
      <ellipse cx={174} cy={248} rx={4} ry={4.5} fill="var(--panel-ink)"/>
      <ellipse cx={186} cy={248} rx={4} ry={4.5} fill="var(--panel-ink)"/>
      <circle cx={176} cy={247} r={1.5} fill="white"/>
      <circle cx={188} cy={247} r={1.5} fill="white"/>
      <path d="M172 258 Q180 263 188 258" fill="none" stroke="var(--panel-ink)" strokeWidth={1.5} strokeLinecap="round"/>
      {/* Big green verified checkmark */}
      <circle cx={430} cy={160} r={70} fill="#e8f5e9" stroke="#27ae60" strokeWidth={2.5}/>
      <path d="M394 160 L420 186 L466 128" fill="none" stroke="#27ae60" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round"/>
      <text x={430} y={248} textAnchor="middle" fontSize={13} fontWeight="700" fill="#2e7d32">Fraud confirmed.</text>
      <text x={430} y={266} textAnchor="middle" fontSize={11} fill="var(--panel-ink)" opacity={0.5}>Out-of-band verification worked.</text>
    </svg>
  );
}

// E1 — analyst at monitors, statistical finding on screen
function SecurityAlertScene() {
  return (
    <svg width="100%" viewBox="0 0 680 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Analyst at desk with statistical anomaly alert on monitor">
      {/* Desk */}
      <rect x={40} y={290} width={600} height={12} rx={3} fill="var(--panel-desk)" opacity={0.5}/>
      {/* Monitor */}
      <rect x={60} y={28} width={440} height={244} rx={7} fill="var(--panel-bg)" stroke="var(--panel-ink)" strokeWidth={2.5}/>
      <rect x={68} y={36} width={424} height={228} rx={4} fill="var(--panel-screen)" opacity={0.3}/>
      {/* Alert banner */}
      <rect x={68} y={36} width={424} height={38} rx={4} fill="var(--panel-danger)"/>
      <text x={280} y={59} textAnchor="middle" fontSize={12} fontWeight="700" fill="white">⚠  STATISTICAL ANOMALY DETECTED</text>
      {/* Report title */}
      <text x={80} y={92} fontSize={10} fontWeight="600" fill="var(--panel-ink)">Disaggregated Performance Report — AI Job Matching Tool</text>
      <line x1={72} y1={98} x2={476} y2={98} stroke="var(--panel-ink)" strokeWidth={0.5} opacity={0.3}/>
      {/* Table header */}
      <rect x={72} y={104} width={400} height={18} rx={1} fill="var(--panel-desk)" opacity={0.4}/>
      <text x={152} y={116} textAnchor="middle" fontSize={8} fontWeight="600" fill="var(--panel-ink)">Group</text>
      <text x={300} y={116} textAnchor="middle" fontSize={8} fontWeight="600" fill="var(--panel-ink)">Shortlist Rate</text>
      <text x={432} y={116} textAnchor="middle" fontSize={8} fontWeight="600" fill="var(--panel-ink)">vs Baseline</text>
      {/* Data rows */}
      {[
        ["Overall", "34%", "—",     false],
        ["Group A", "41%", "+7pp",  false],
        ["Group B", "38%", "+4pp",  false],
        ["Group C", "19%", "−15pp", true ],
        ["Group D", "17%", "−17pp", true ],
      ].map(([g, rate, diff, flag], i) => (
        <g key={i}>
          <rect x={72} y={122+i*20} width={400} height={20} rx={1} fill={flag ? "#ffebee" : i%2===0 ? "var(--panel-bg)" : "var(--panel-screen)"} opacity={flag ? 1 : 0.5}/>
          <text x={152} y={135+i*20} textAnchor="middle" fontSize={8} fill="var(--panel-ink)">{g}</text>
          <text x={300} y={135+i*20} textAnchor="middle" fontSize={8} fill="var(--panel-ink)">{rate}</text>
          <text x={432} y={135+i*20} textAnchor="middle" fontSize={8} fill={flag ? "var(--panel-danger)" : "#27ae60"} fontWeight={flag ? "700" : "400"}>{diff}</text>
        </g>
      ))}
      {/* p-value note */}
      <text x={76} y={230} fontSize={8} fill="var(--panel-danger)" fontStyle="italic">p &lt; 0.001 — statistically significant after controlling for qualifications</text>
      {/* Monitor stand */}
      <rect x={271} y={270} width={18} height={12} rx={2} fill="var(--panel-desk)" opacity={0.4}/>
      <rect x={254} y={280} width={52} height={6} rx={2} fill="var(--panel-desk)" opacity={0.4}/>
      {/* Analyst — focused */}
      <ellipse cx={590} cy={266} rx={26} ry={24} fill="var(--panel-shirt)" stroke="var(--panel-ink)" strokeWidth={2}/>
      <path d="M566 266 Q551 262 539 254" fill="none" stroke="var(--panel-ink)" strokeWidth={2} strokeLinecap="round"/>
      <path d="M614 266 Q629 262 641 254" fill="none" stroke="var(--panel-ink)" strokeWidth={2} strokeLinecap="round"/>
      <circle cx={590} cy={240} r={22} fill="var(--panel-bg)" stroke="var(--panel-ink)" strokeWidth={2.5}/>
      <path d="M570 233 Q575 219 590 217 Q605 219 610 233" fill="var(--panel-ink)" opacity={0.6}/>
      {/* Raised eyebrows — alarmed */}
      <path d="M579 226 Q583 222 587 225" fill="none" stroke="var(--panel-ink)" strokeWidth={1.5} strokeLinecap="round"/>
      <path d="M593 225 Q597 222 601 226" fill="none" stroke="var(--panel-ink)" strokeWidth={1.5} strokeLinecap="round"/>
      <ellipse cx={583} cy={230} rx={4} ry={4.5} fill="var(--panel-ink)"/>
      <ellipse cx={597} cy={230} rx={4} ry={4.5} fill="var(--panel-ink)"/>
      <circle cx={585} cy={229} r={1.5} fill="white"/>
      <circle cx={599} cy={229} r={1.5} fill="white"/>
      <path d="M583 242 Q590 239 597 242" fill="none" stroke="var(--panel-ink)" strokeWidth={1.2} strokeLinecap="round"/>
    </svg>
  );
}

// F1 — chest X-ray on medical display with AI confidence overlay: "Normal — 91%"
// Subtle highlight on lower right lobe — the finding the AI missed
function XrayAiScene() {
  return (
    <svg width="100%" viewBox="0 0 680 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Medical monitor showing chest X-ray with AI diagnostic overlay reading Normal 91% confidence">
      {/* Dark clinical room background */}
      <rect x="0" y="0" width="680" height="340" fill="#1a1916" opacity=".06"/>
      {/* Desk / lightbox surface */}
      <rect x="40" y="285" width="600" height="10" rx="3" fill="#c4a882" opacity=".4"/>
      {/* Medical monitor — large, landscape, dark screen */}
      <rect x="80" y="28" width="400" height="268" rx="8" fill="#0d0d0d" stroke="#2a2a2a" strokeWidth="3"/>
      <rect x="88" y="36" width="384" height="252" rx="4" fill="#111"/>
      {/* Monitor stand */}
      <rect x="271" y="296" width="18" height="14" rx="2" fill="#c4a882" opacity=".35"/>
      <rect x="254" y="308" width="52" height="5" rx="2" fill="#c4a882" opacity=".35"/>
      {/* ── X-ray image on screen ── */}
      {/* Chest cavity outline — rib cage silhouette */}
      <ellipse cx="280" cy="162" rx="148" ry="108" fill="#1e2020"/>
      {/* Spine — central white line */}
      <rect x="276" y="68" width="8" height="188" rx="3" fill="#4a4a4a" opacity=".7"/>
      {/* Ribs — left side (patient right) */}
      {[0,1,2,3,4,5,6].map(i => (
        <path key={`rl${i}`}
          d={`M276 ${88+i*22} Q${210-i*4} ${88+i*22} ${185-i*3} ${102+i*22}`}
          fill="none" stroke="#3a3a3a" strokeWidth="3.5" strokeLinecap="round" opacity=".8"/>
      ))}
      {/* Ribs — right side */}
      {[0,1,2,3,4,5,6].map(i => (
        <path key={`rr${i}`}
          d={`M284 ${88+i*22} Q${350+i*4} ${88+i*22} ${373+i*3} ${102+i*22}`}
          fill="none" stroke="#3a3a3a" strokeWidth="3.5" strokeLinecap="round" opacity=".8"/>
      ))}
      {/* Left lung field (patient right) — lighter grey */}
      <ellipse cx="232" cy="158" rx="68" ry="88" fill="#2a2e2e" opacity=".9"/>
      {/* Right lung field (patient left) — lighter grey */}
      <ellipse cx="328" cy="155" rx="65" ry="86" fill="#2a2e2e" opacity=".9"/>
      {/* Trachea */}
      <rect x="275" y="54" width="10" height="38" rx="4" fill="#3a3a3a" opacity=".6"/>
      {/* Carina split */}
      <path d="M275 90 Q260 105 240 112" fill="none" stroke="#3a3a3a" strokeWidth="3" opacity=".6"/>
      <path d="M285 90 Q298 105 316 112" fill="none" stroke="#3a3a3a" strokeWidth="3" opacity=".6"/>
      {/* Heart shadow — central, slightly left */}
      <ellipse cx="265" cy="175" rx="42" ry="52" fill="#1a1e1e" opacity=".7"/>
      {/* Diaphragm */}
      <path d="M140 240 Q210 220 280 218 Q350 220 420 240" fill="none" stroke="#3a3a3a" strokeWidth="3" opacity=".5"/>
      {/* ── Subtle finding — lower right lobe ── */}
      {/* Small density — the thing the AI missed. Faint, radiologically plausible */}
      <ellipse cx="366" cy="214" rx="11" ry="9" fill="#3d4242" opacity=".85"/>
      <ellipse cx="366" cy="214" rx="7" ry="6" fill="#464c4c" opacity=".7"/>
      {/* Dotted highlight ring — very faint, just enough to catch the eye on close look */}
      <ellipse cx="366" cy="214" rx="16" ry="13" fill="none"
        stroke="#7ab8d4" strokeWidth="1.2" strokeDasharray="3 3" opacity=".35"/>
      {/* ── AI overlay panel — top right of screen ── */}
      <rect x="440" y="44" width="168" height="98" rx="5" fill="#0d1a2a" opacity=".97" stroke="#1e3a5a" strokeWidth="1.5"/>
      {/* Panel header */}
      <rect x="440" y="44" width="168" height="22" rx="5" fill="#1a3a5a"/>
      <rect x="440" y="55" width="168" height="11" fill="#1a3a5a"/>
      <text x="524" y="59" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#7ab8d4" fontFamily="monospace">AI DIAGNOSTIC AID</text>
      {/* Finding */}
      <text x="452" y="82" fontSize="8" fill="#b0b8b8" fontFamily="monospace">FINDING</text>
      <text x="452" y="96" fontSize="13" fontWeight="700" fill="#4cdd8a" fontFamily="monospace">NORMAL</text>
      {/* Confidence bar */}
      <text x="452" y="112" fontSize="7.5" fill="#b0b8b8" fontFamily="monospace">CONFIDENCE</text>
      <rect x="452" y="116" width="140" height="7" rx="3" fill="#1e2a2a"/>
      <rect x="452" y="116" width="127" height="7" rx="3" fill="#4cdd8a" opacity=".8"/>
      <text x="598" y="123" textAnchor="end" fontSize="7" fill="#4cdd8a" fontFamily="monospace">91%</text>
      {/* Timestamp */}
      <text x="452" y="136" fontSize="6.5" fill="#5a6868" fontFamily="monospace">16:04:12  SCAN 75 / 80</text>
      {/* ── Second smaller panel: region analysis ── */}
      <rect x="440" y="152" width="168" height="64" rx="5" fill="#0d1a2a" opacity=".97" stroke="#1e3a5a" strokeWidth="1.5"/>
      <text x="452" y="168" fontSize="7.5" fill="#b0b8b8" fontFamily="monospace">REGION ANALYSIS</text>
      {[
        { label: "Upper zones",  val: "Clear",  col: "#4cdd8a" },
        { label: "Mid zones",    val: "Clear",  col: "#4cdd8a" },
        { label: "Lower zones",  val: "Clear",  col: "#4cdd8a" },
      ].map((r, i) => (
        <g key={i}>
          <text x="452" y={182+i*14} fontSize="7" fill="#7a8888" fontFamily="monospace">{r.label}</text>
          <text x="600" y={182+i*14} textAnchor="end" fontSize="7" fontWeight="600" fill={r.col} fontFamily="monospace">{r.val}</text>
        </g>
      ))}
      {/* ── Radiologist — right of monitor, leaning in, scrutinising ── */}
      {/* Body */}
      <ellipse cx="590" cy="255" rx="28" ry="24" fill="#e8e0d5" stroke="#1a1916" strokeWidth="2"/>
      {/* White coat suggestion */}
      <ellipse cx="590" cy="255" rx="28" ry="24" fill="white" opacity=".5" stroke="#1a1916" strokeWidth="1.5"/>
      {/* Head — leaning slightly forward toward screen */}
      <circle cx="590" cy="228" r="22" fill="#faf9f7" stroke="#1a1916" strokeWidth="2.5"/>
      <path d="M570 221 Q575 207 590 205 Q605 207 610 221" fill="#1a1916" opacity=".6"/>
      {/* Eyes — focused, slightly narrowed */}
      <path d="M579 222 Q583 219 587 222" fill="none" stroke="#1a1916" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M593 222 Q597 219 601 222" fill="none" stroke="#1a1916" strokeWidth="1.5" strokeLinecap="round"/>
      <ellipse cx="583" cy="225" rx="3.5" ry="4" fill="#1a1916"/>
      <ellipse cx="597" cy="225" rx="3.5" ry="4" fill="#1a1916"/>
      <circle cx="584.5" cy="224" r="1.2" fill="white"/>
      <circle cx="598.5" cy="224" r="1.2" fill="white"/>
      {/* Neutral/thoughtful expression */}
      <path d="M584 236 Q590 237 596 236" fill="none" stroke="#1a1916" strokeWidth="1.2" strokeLinecap="round"/>
      {/* Arm — hand raised to chin, thinking posture */}
      <path d="M568 248 Q560 242 558 234" fill="none" stroke="#1a1916" strokeWidth="7" strokeLinecap="round" opacity=".2"/>
      <circle cx="558" cy="232" r="6" fill="#faf9f7" stroke="#1a1916" strokeWidth="1.5" opacity=".8"/>
    </svg>
  );
}

// G3 — employee reads redundancy news on phone/screen before any internal communication
// Phone notification showing a news article; colleagues visible in background reacting
function NewsLeakScene() {
  return (
    <svg width="100%" viewBox="0 0 680 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Employee reads news article about redundancies on their phone while colleagues react in background">
      {/* Open-plan office background */}
      <rect x="0" y="0" width="680" height="340" fill="#f5f4f0" opacity=".5"/>
      <line x1="0" y1="280" x2="680" y2="280" stroke="#c4a882" strokeWidth="1" opacity=".25"/>
      {/* Desk surface */}
      <rect x="40" y="258" width="320" height="10" rx="3" fill="#c4a882" opacity=".4"/>
      {/* Monitor on desk — ignored, dark */}
      <rect x="60" y="138" width="180" height="118" rx="6" fill="#1a1916" stroke="#2a2a2a" strokeWidth="2" opacity=".6"/>
      <rect x="66" y="144" width="168" height="106" rx="3" fill="#111" opacity=".8"/>
      <rect x="133" y="256" width="14" height="12" rx="2" fill="#c4a882" opacity=".3"/>
      <rect x="120" y="266" width="40" height="4" rx="2" fill="#c4a882" opacity=".3"/>
      {/* ── Phone — held in hands, centre of attention ── */}
      <rect x="248" y="148" width="78" height="130" rx="10" fill="#1a1916" stroke="#3a3a3a" strokeWidth="2"/>
      <rect x="253" y="154" width="68" height="118" rx="7" fill="#faf9f7"/>
      {/* News article on phone screen */}
      {/* Publication header */}
      <rect x="255" y="156" width="64" height="12" rx="3" fill="#1a1916" opacity=".85"/>
      <text x="287" y="165" textAnchor="middle" fontSize="6.5" fontWeight="700" fill="white" fontFamily="sans-serif">Financial Review</text>
      {/* Article headline — the news */}
      <text x="258" y="178" fontSize="6" fontWeight="700" fill="#1a1916" fontFamily="sans-serif">Lenders deploy AI to</text>
      <text x="258" y="187" fontSize="6" fontWeight="700" fill="#1a1916" fontFamily="sans-serif">slash processing</text>
      <text x="258" y="196" fontSize="6" fontWeight="700" fill="#1a1916" fontFamily="sans-serif">headcount</text>
      {/* Firm name highlighted */}
      <rect x="256" y="200" width="64" height="11" rx="2" fill="#fff3cd"/>
      <text x="258" y="208" fontSize="5.5" fill="#856404" fontWeight="600" fontFamily="sans-serif">Meridian Bank — 25 roles</text>
      {/* Article body lines */}
      {[0,1,2,3].map(i => (
        <rect key={i} x="256" y={216+i*9} width={i===3 ? 32 : 62} height="5" rx="2" fill="#1a1916" opacity=".1"/>
      ))}
      {/* Notification dot */}
      <circle cx="311" cy="157" r="5" fill="#e74c3c"/>
      <text x="311" y="160" textAnchor="middle" fontSize="5.5" fontWeight="700" fill="white">!</text>
      {/* ── Primary character — holding phone, stunned expression ── */}
      <ellipse cx="180" cy="290" rx="30" ry="22" fill="#e8e0d5" stroke="#1a1916" strokeWidth="1.8"/>
      <circle cx="180" cy="264" r="24" fill="#faf9f7" stroke="#1a1916" strokeWidth="2.5"/>
      <path d="M158 257 Q163 242 180 240 Q197 242 202 257" fill="#1a1916" opacity=".6"/>
      {/* Raised eyebrows — shocked */}
      <path d="M168 250 Q172 245 176 249" fill="none" stroke="#1a1916" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M184 249 Q188 245 192 250" fill="none" stroke="#1a1916" strokeWidth="1.8" strokeLinecap="round"/>
      {/* Wide eyes */}
      <ellipse cx="172" cy="254" rx="4.5" ry="5" fill="#1a1916"/>
      <ellipse cx="188" cy="254" rx="4.5" ry="5" fill="#1a1916"/>
      <circle cx="173.5" cy="252.5" r="1.5" fill="white"/>
      <circle cx="189.5" cy="252.5" r="1.5" fill="white"/>
      {/* Open mouth — shock */}
      <ellipse cx="180" cy="265" rx="5" ry="3.5" fill="#1a1916" opacity=".6"/>
      {/* Arms — holding phone up */}
      <path d="M156 278 Q200 265 248 192" fill="none" stroke="#1a1916" strokeWidth="9" strokeLinecap="round" opacity=".18"/>
      <path d="M204 278 Q220 268 248 210" fill="none" stroke="#1a1916" strokeWidth="8" strokeLinecap="round" opacity=".15"/>
      {/* ── Background colleagues reacting ── */}
      {/* Colleague 1 — leaning over to look at same phone */}
      <circle cx="490" cy="210" r="18" fill="#faf9f7" stroke="#1a1916" strokeWidth="2"/>
      <path d="M474 203 Q478 192 490 190 Q502 192 506 203" fill="#1a1916" opacity=".55"/>
      <path d="M483 208 Q487 205 491 208" fill="none" stroke="#1a1916" strokeWidth="1.5" strokeLinecap="round"/>
      <ellipse cx="487" cy="206" rx="2.5" ry="3" fill="#1a1916"/>
      <ellipse cx="493" cy="206" rx="2.5" ry="3" fill="#1a1916"/>
      <path d="M484 215 Q490 218 496 215" fill="none" stroke="#1a1916" strokeWidth="1" strokeLinecap="round"/>
      <ellipse cx="490" cy="232" rx="20" ry="18" fill="#e8e0d5" stroke="#1a1916" strokeWidth="1.5"/>
      {/* Colleague 2 — on phone, separate conversation */}
      <circle cx="590" cy="195" r="16" fill="#faf9f7" stroke="#1a1916" strokeWidth="1.8"/>
      <path d="M576 189 Q580 179 590 177 Q600 179 604 189" fill="#1a1916" opacity=".5"/>
      <path d="M584 194 Q587 192 590 194" fill="none" stroke="#1a1916" strokeWidth="1.2" strokeLinecap="round"/>
      <ellipse cx="587" cy="193" rx="2" ry="2.5" fill="#1a1916"/>
      <ellipse cx="593" cy="193" rx="2" ry="2.5" fill="#1a1916"/>
      {/* Phone held to ear */}
      <rect x="573" y="186" width="10" height="17" rx="3" fill="#2a2a2a" opacity=".7"/>
      <ellipse cx="590" cy="215" rx="18" ry="16" fill="#e8e0d5" stroke="#1a1916" strokeWidth="1.5"/>
      {/* Slack/chat notification bubble */}
      <rect x="390" y="120" width="160" height="48" rx="8" fill="white" stroke="#c4a882" strokeWidth="1.5" opacity=".95"/>
      <rect x="390" y="120" width="160" height="16" rx="8" fill="#4a3728" opacity=".9"/>
      <rect x="390" y="128" width="160" height="8" fill="#4a3728" opacity=".9"/>
      <text x="470" y="131" textAnchor="middle" fontSize="7" fontWeight="600" fill="white" fontFamily="sans-serif">Team Channel</text>
      <text x="398" y="148" fontSize="6.5" fill="#1a1916" fontFamily="sans-serif">Did anyone see the FR article?</text>
      <text x="398" y="159" fontSize="6.5" fill="#1a1916" fontFamily="sans-serif">Is this about our team?? 😰</text>
    </svg>
  );
}

// A2 / G1 — monitoring dashboard showing healthy aggregate metric
// but a hidden segment breakdown showing severe failure, or API outage state
function DriftDashboardScene() {
  return (
    <svg width="100%" viewBox="0 0 680 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Model monitoring dashboard showing healthy aggregate accuracy metric with segment breakdown revealing hidden failure">
      {/* Dark dashboard background */}
      <rect x="0" y="0" width="680" height="340" fill="#0f1117" opacity=".06"/>
      {/* Main monitor */}
      <rect x="50" y="20" width="580" height="300" rx="8" fill="#0d1117" stroke="#1e2530" strokeWidth="2"/>
      <rect x="58" y="28" width="564" height="284" rx="5" fill="#0d1117"/>
      {/* Dashboard header bar */}
      <rect x="58" y="28" width="564" height="28" rx="5" fill="#161b22"/>
      <rect x="58" y="46" width="564" height="10" fill="#161b22"/>
      <text x="72" y="46" fontSize="9" fontWeight="700" fill="#7ab8d4" fontFamily="monospace">FRAUD DETECTION MODEL — PRODUCTION MONITORING</text>
      <text x="580" y="46" textAnchor="end" fontSize="7.5" fill="#5a6878" fontFamily="monospace">Last updated: 09:14:22</text>
      {/* ── Top KPI cards ── */}
      {/* Card 1 — Aggregate accuracy — GREEN, looks healthy */}
      <rect x="68" y="66" width="160" height="72" rx="5" fill="#161b22" stroke="#21d474" strokeWidth="1.5"/>
      <text x="78" y="82" fontSize="7" fill="#7a8898" fontFamily="monospace">AGGREGATE ACCURACY</text>
      <text x="78" y="108" fontSize="26" fontWeight="700" fill="#21d474" fontFamily="monospace">96.2%</text>
      <text x="78" y="124" fontSize="6.5" fill="#21d474" fontFamily="monospace">▲ +0.1pp vs last month</text>
      {/* Card 2 — False positive rate aggregate — also green */}
      <rect x="242" y="66" width="160" height="72" rx="5" fill="#161b22" stroke="#21d474" strokeWidth="1.5"/>
      <text x="252" y="82" fontSize="7" fill="#7a8898" fontFamily="monospace">FALSE POSITIVE RATE</text>
      <text x="252" y="108" fontSize="26" fontWeight="700" fill="#21d474" fontFamily="monospace">3.8%</text>
      <text x="252" y="124" fontSize="6.5" fill="#21d474" fontFamily="monospace">Within normal range</text>
      {/* Card 3 — Complaints — RED, the signal */}
      <rect x="416" y="66" width="190" height="72" rx="5" fill="#161b22" stroke="#e74c3c" strokeWidth="2"/>
      <text x="426" y="82" fontSize="7" fill="#7a8898" fontFamily="monospace">CUSTOMER COMPLAINTS</text>
      <text x="426" y="108" fontSize="26" fontWeight="700" fill="#e74c3c" fontFamily="monospace">+340%</text>
      <text x="426" y="124" fontSize="6.5" fill="#e74c3c" fontFamily="monospace">▲ 6-week trend — REVIEW</text>
      {/* ── Segment breakdown table ── the hidden story ── */}
      <rect x="68" y="152" width="538" height="148" rx="5" fill="#161b22" stroke="#1e2530" strokeWidth="1"/>
      <text x="78" y="168" fontSize="8" fontWeight="600" fill="#7ab8d4" fontFamily="monospace">ACCURACY BY CUSTOMER SEGMENT — current vs validation baseline</text>
      <line x1="68" y1="172" x2="606" y2="172" stroke="#1e2530" strokeWidth="1"/>
      {/* Table header */}
      <rect x="68" y="172" width="538" height="18" fill="#0f1419"/>
      {["SEGMENT", "BASELINE", "CURRENT", "CHANGE", "FALSE POS RATE"].map((h, i) => (
        <text key={i} x={[82, 230, 330, 420, 490][i]} y={184} fontSize="7" fontWeight="600" fill="#5a6878" fontFamily="monospace">{h}</text>
      ))}
      {/* Data rows */}
      {[
        ["All customers",                "96.1%", "94.1%", "−2.0pp", "3.8%",  false],
        ["Traditional banking",          "96.3%", "95.8%", "−0.5pp", "2.1%",  false],
        ["Online banking (pre-2022)",     "95.9%", "95.1%", "−0.8pp", "3.2%",  false],
        ["Digital onboarding (2022–23)", "96.0%", "88.4%", "−7.6pp", "11.6%", true ],
        ["Digital onboarding (2024+)",   "—",     "66.2%", "n/a",    "34.0%", true ],
      ].map(([seg, base, cur, chg, fp, flag], i) => (
        <g key={i}>
          <rect x="68" y={191+i*21} width="538" height="21" fill={flag ? "#2a0f0f" : i%2===0 ? "#0d1117" : "#111620"} opacity={flag ? 1 : 0.8}/>
          {flag && <rect x="68" y={191+i*21} width="3" height="21" fill="#e74c3c"/>}
          <text x="82" y={205+i*21} fontSize="7.5" fill={flag ? "#ffaaaa" : "#8a9aaa"} fontFamily="monospace">{seg}</text>
          <text x="230" y={205+i*21} fontSize="7.5" fill={flag ? "#ff6666" : "#5a6878"} fontFamily="monospace">{base}</text>
          <text x="330" y={205+i*21} fontSize="7.5" fontWeight={flag ? "700" : "400"} fill={flag ? "#ff4444" : "#8a9aaa"} fontFamily="monospace">{cur}</text>
          <text x="420" y={205+i*21} fontSize="7.5" fill={flag ? "#ff4444" : "#5a7858"} fontFamily="monospace">{chg}</text>
          <text x="490" y={205+i*21} fontSize="7.5" fontWeight={flag ? "700" : "400"} fill={flag ? "#ff2222" : "#5a7858"} fontFamily="monospace">{fp}</text>
        </g>
      ))}
      {/* Warning annotation */}
      <rect x="370" y="277" width="226" height="16" rx="3" fill="#2a0f0f" stroke="#e74c3c" strokeWidth="1"/>
      <text x="378" y="288" fontSize="6.5" fill="#e74c3c" fontFamily="monospace">⚠  Segment not in original validation set</text>
    </svg>
  );
}

// G1 — API outage state: error screen on monitor, service unavailable
function ApiOutageScene() {
  return (
    <svg width="100%" viewBox="0 0 680 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Monitor showing API service outage error with status page visible">
      {/* Office environment */}
      <rect x="0" y="0" width="680" height="340" fill="#f5f4f0" opacity=".4"/>
      <line x1="0" y1="280" x2="680" y2="280" stroke="#c4a882" strokeWidth="1" opacity=".25"/>
      {/* Desk */}
      <rect x="40" y="258" width="580" height="10" rx="3" fill="#c4a882" opacity=".4"/>
      <rect x="40" y="268" width="580" height="40" fill="#c4a882" opacity=".1"/>
      {/* Monitor */}
      <rect x="140" y="48" width="400" height="220" rx="8" fill="#faf9f7" stroke="#1a1916" strokeWidth="2.5"/>
      <rect x="148" y="56" width="384" height="204" rx="5" fill="#fff"/>
      {/* Monitor stand */}
      <rect x="331" y="268" width="18" height="14" rx="2" fill="#c4a882" opacity=".35"/>
      <rect x="314" y="280" width="52" height="5" rx="2" fill="#c4a882" opacity=".35"/>
      {/* ── Error screen content ── */}
      {/* Red error banner */}
      <rect x="148" y="56" width="384" height="52" rx="5" fill="#c0392b"/>
      <rect x="148" y="90" width="384" height="18" fill="#c0392b"/>
      {/* Error icon */}
      <circle cx="178" cy="82" r="14" fill="white" opacity=".2"/>
      <text x="178" y="88" textAnchor="middle" fontSize="16" fill="white">✕</text>
      {/* Error heading */}
      <text x="340" y="76" textAnchor="middle" fontSize="12" fontWeight="700" fill="white" fontFamily="sans-serif">Service Unavailable</text>
      <text x="340" y="94" textAnchor="middle" fontSize="8" fill="#ffcccc" fontFamily="sans-serif">AI Assistant — Connection Failed</text>
      {/* Error detail */}
      <text x="168" y="126" fontSize="8.5" fontWeight="600" fill="#1a1916" fontFamily="sans-serif">Unable to connect to AI provider</text>
      <rect x="160" y="132" width="360" height="36" rx="4" fill="#f8f0f0" stroke="#e0b0b0" strokeWidth="1"/>
      <text x="168" y="145" fontSize="7" fill="#888" fontFamily="monospace">Error: upstream_provider_unavailable</text>
      <text x="168" y="157" fontSize="7" fill="#888" fontFamily="monospace">Provider status: MAJOR OUTAGE (all regions)</text>
      {/* Provider status panel */}
      <rect x="160" y="178" width="360" height="66" rx="4" fill="#f5f5f5" stroke="#ddd" strokeWidth="1"/>
      <rect x="160" y="178" width="360" height="18" rx="4" fill="#eee"/>
      <rect x="160" y="188" width="360" height="8" fill="#eee"/>
      <text x="168" y="190" fontSize="7.5" fontWeight="600" fill="#555" fontFamily="sans-serif">Provider Status Page — api-provider.com/status</text>
      {/* Status items */}
      {[
        ["AI Assistant API",        "Major Outage",   true ],
        ["Authentication Service",  "Major Outage",   true ],
        ["Dashboard",               "Operational",    false],
      ].map(([svc, status, fail], i) => (
        <g key={i}>
          <text x="168" y={207+i*13} fontSize="7" fill="#555" fontFamily="sans-serif">{svc}</text>
          <rect x="440" y={198+i*13} width={fail ? 74 : 62} height="11" rx="3" fill={fail ? "#fde8e8" : "#e8fde8"}/>
          <text x="477" y={207+i*13} textAnchor="middle" fontSize="6.5" fontWeight="600" fill={fail ? "#c0392b" : "#27ae60"} fontFamily="sans-serif">{status}</text>
        </g>
      ))}
      {/* Estimated resolution */}
      <text x="168" y="254" fontSize="7.5" fill="#c0392b" fontWeight="600" fontFamily="sans-serif">Estimated resolution: 2–4 hours  •  Incident started 09:05</text>
      {/* ── Customer queue indicator — right side ── */}
      <rect x="560" y="80" width="90" height="160" rx="6" fill="#fff3cd" stroke="#f0ad4e" strokeWidth="1.5"/>
      <text x="605" y="96" textAnchor="middle" fontSize="7" fontWeight="700" fill="#856404" fontFamily="sans-serif">QUEUE</text>
      <text x="605" y="148" textAnchor="middle" fontSize="34" fontWeight="700" fill="#c0392b" fontFamily="sans-serif">47</text>
      <text x="605" y="164" textAnchor="middle" fontSize="6.5" fill="#856404" fontFamily="sans-serif">customers</text>
      <text x="605" y="176" textAnchor="middle" fontSize="6.5" fill="#856404" fontFamily="sans-serif">waiting</text>
      <text x="605" y="194" textAnchor="middle" fontSize="6" fill="#856404" fontFamily="sans-serif">↑ building</text>
      {/* Person at desk — stressed */}
      <circle cx="90" cy="200" r="22" fill="#faf9f7" stroke="#1a1916" strokeWidth="2.5"/>
      <path d="M70 193 Q75 179 90 177 Q105 179 110 193" fill="#1a1916" opacity=".6"/>
      <path d="M79 196 Q83 200 87 197" fill="none" stroke="#1a1916" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M93 197 Q97 200 101 196" fill="none" stroke="#1a1916" strokeWidth="1.8" strokeLinecap="round"/>
      {/* Furrowed brow */}
      <path d="M78 191 Q83 188 87 191" fill="none" stroke="#1a1916" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M93 191 Q97 188 102 191" fill="none" stroke="#1a1916" strokeWidth="1.5" strokeLinecap="round"/>
      {/* Stressed mouth */}
      <path d="M83 208 Q90 205 97 208" fill="none" stroke="#1a1916" strokeWidth="1.2" strokeLinecap="round"/>
      <ellipse cx="90" cy="222" rx="24" ry="20" fill="#e8e0d5" stroke="#1a1916" strokeWidth="2"/>
      <path d="M70 220 Q105 238 148 258" fill="none" stroke="#1a1916" strokeWidth="8" strokeLinecap="round" opacity=".18"/>
    </svg>
  );
}

// ── SVG Scene Components ──────────────────────────────────────────
function DeskCasualScene() {
  return (
    <svg width="100%" viewBox="0 0 680 340" xmlns="http://www.w3.org/2000/svg">
      {/* Window */}
      <rect x="460" y="20" width="180" height="150" rx="4" fill="#b8d4f0" opacity=".2"/>
      <line x1="550" y1="20" x2="550" y2="170" stroke="#1a1916" strokeWidth="1" opacity=".12"/>
      <line x1="460" y1="95" x2="640" y2="95" stroke="#1a1916" strokeWidth="1" opacity=".12"/>
      {/* Desk */}
      <rect x="40" y="240" width="580" height="12" rx="3" fill="#c4a882" opacity=".5"/>
      <rect x="40" y="252" width="580" height="50" fill="#c4a882" opacity=".12"/>
      {/* Monitor */}
      <rect x="80" y="120" width="110" height="82" rx="7" fill="#faf9f7" stroke="#1a1916" strokeWidth="2.5"/>
      <rect x="88" y="128" width="94" height="66" rx="4" fill="#e8ecf0" opacity=".5"/>
      {[0,12,24,36].map((o,i)=><rect key={i} x="94" y={134+o} width={i===2?52:70} height="7" rx="2" fill="#1a1916" opacity=".1"/>)}
      <rect x="125" y="200" width="8" height="12" rx="2" fill="#c4a882" opacity=".4"/>
      <rect x="111" y="210" width="36" height="5" rx="2" fill="#c4a882" opacity=".4"/>
      {/* Confidential doc */}
      <rect x="260" y="222" width="72" height="54" rx="3" fill="#faf9f7" stroke="#1a1916" strokeWidth="1.5" transform="rotate(-3,296,249)"/>
      {[0,10,20].map((o,i)=><rect key={i} x={268} y={230+o} width={i===1?44:56} height="5" rx="1" fill="#1a1916" opacity=".1" transform="rotate(-3,296,249)"/>)}
      <text x="296" y="267" textAnchor="middle" fontSize="7" fontWeight="600" fill="#c0392b" opacity=".8" transform="rotate(-3,296,249)">CONFIDENTIAL</text>
      {/* Person - Jamie, curious expression */}
      <ellipse cx="170" cy="210" rx="24" ry="24" fill="#e8e0d5" stroke="#1a1916" strokeWidth="2"/>
      <path d="M148 210 Q134 206 122 198" fill="none" stroke="#1a1916" strokeWidth="2" strokeLinecap="round"/>
      <path d="M192 210 Q206 206 218 198" fill="none" stroke="#1a1916" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="170" cy="182" r="22" fill="#faf9f7" stroke="#1a1916" strokeWidth="2.5"/>
      <path d="M150 175 Q155 161 170 159 Q185 161 190 175" fill="#1a1916" opacity=".7"/>
      {/* Curious eyes — one eyebrow raised */}
      <path d="M160 172 Q164 168 168 171" fill="none" stroke="#1a1916" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M172 169 Q176 166 180 170" fill="none" stroke="#1a1916" strokeWidth="1.5" strokeLinecap="round"/>
      <ellipse cx="164" cy="176" rx="4" ry="4.5" fill="#1a1916"/>
      <ellipse cx="176" cy="176" rx="4" ry="4.5" fill="#1a1916"/>
      <circle cx="166" cy="175" r="1.5" fill="white"/>
      <circle cx="178" cy="175" r="1.5" fill="white"/>
      <path d="M164 186 Q170 188 176 186" fill="none" stroke="#1a1916" strokeWidth="1.2" strokeLinecap="round"/>
      {/* Colleague leaning over */}
      <circle cx="400" cy="182" r="20" fill="#faf9f7" stroke="#1a1916" strokeWidth="2"/>
      <path d="M382 175 Q386 163 400 161 Q414 163 418 175" fill="#1a1916" opacity=".6"/>
      <ellipse cx="394" cy="186" rx="3.5" ry="4" fill="#1a1916"/>
      <ellipse cx="406" cy="186" rx="3.5" ry="4" fill="#1a1916"/>
      <path d="M393 193 Q400 196 407 193" fill="none" stroke="#1a1916" strokeWidth="1.2" strokeLinecap="round"/>
      <ellipse cx="400" cy="208" rx="22" ry="20" fill="#ddd8cc" stroke="#1a1916" strokeWidth="1.5"/>
      {/* Speech bubble from colleague */}
      <ellipse cx="490" cy="130" rx="100" ry="38" fill="#faf9f7" stroke="#1a1916" strokeWidth="1.5"/>
      <circle cx="418" cy="162" r="5" fill="#faf9f7" stroke="#1a1916" strokeWidth="1.2"/>
      <circle cx="426" cy="152" r="4" fill="#faf9f7" stroke="#1a1916" strokeWidth="1.2"/>
      <circle cx="433" cy="143" r="3" fill="#faf9f7" stroke="#1a1916" strokeWidth="1"/>
      <text x="490" y="123" textAnchor="middle" fontSize="12" fill="#1a1916" fontStyle="italic">"Just paste it into</text>
      <text x="490" y="140" textAnchor="middle" fontSize="12" fill="#1a1916" fontStyle="italic">an AI tool — 2 minutes."</text>
    </svg>
  );
}

function DeskTypingScene() {
  return (
    <svg width="100%" viewBox="0 0 680 340" xmlns="http://www.w3.org/2000/svg">
      <defs><marker id="la" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M2 1L8 5L2 9" fill="none" stroke="#c0392b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></marker></defs>
      <rect x="40" y="240" width="580" height="12" rx="3" fill="#c4a882" opacity=".5"/>
      <rect x="40" y="252" width="580" height="50" fill="#c4a882" opacity=".12"/>
      {/* Monitor showing unapproved AI tool */}
      <rect x="80" y="120" width="110" height="82" rx="7" fill="#faf9f7" stroke="#1a1916" strokeWidth="2.5"/>
      <rect x="88" y="128" width="94" height="66" rx="4" fill="#f0f4ff"/>
      {[0,12,24,36,48].map((o,i)=><rect key={i} x="94" y={134+o} width={i%2===0?66:46} height="6" rx="2" fill={i%2===0?'#10a37f':'#ccc'} opacity=".45"/>)}
      <text x="135" y="200" textAnchor="middle" fontSize="6" fill="#10a37f" fontFamily="monospace">free-ai-tool.io</text>
      <rect x="125" y="202" width="8" height="12" rx="2" fill="#c4a882" opacity=".4"/>
      {/* Keyboard */}
      <rect x="100" y="250" width="90" height="12" rx="4" fill="#c4a882" opacity=".2" stroke="#1a1916" strokeWidth=".5"/>
      {/* Confidential doc shifted */}
      <rect x="240" y="226" width="72" height="54" rx="3" fill="#faf9f7" stroke="#1a1916" strokeWidth="1.5" transform="rotate(-7,276,253)"/>
      <text x="276" y="265" textAnchor="middle" fontSize="7" fontWeight="600" fill="#c0392b" opacity=".8" transform="rotate(-7,276,253)">CONFIDENTIAL</text>
      {/* Data leaving arrow */}
      <path d="M190 120 Q360 50 520 80" fill="none" stroke="#c0392b" strokeWidth="2" strokeDasharray="5 3" markerEnd="url(#la)" opacity=".8"/>
      {/* Cloud server */}
      <ellipse cx="540" cy="74" rx="28" ry="16" fill="#faf9f7" stroke="#c0392b" strokeWidth="1.5" opacity=".7"/>
      <ellipse cx="524" cy="80" rx="18" ry="12" fill="#faf9f7" stroke="#c0392b" strokeWidth="1.5" opacity=".7"/>
      <ellipse cx="556" cy="82" rx="14" ry="10" fill="#faf9f7" stroke="#c0392b" strokeWidth="1.5" opacity=".7"/>
      <text x="540" y="72" textAnchor="middle" fontSize="7" fill="#c0392b">3rd party</text>
      <text x="540" y="83" textAnchor="middle" fontSize="7" fill="#c0392b">server</text>
      <circle cx="190" cy="120" r="8" fill="#c0392b" opacity=".15"/>
      <circle cx="190" cy="120" r="14" fill="none" stroke="#c0392b" strokeWidth="1" opacity=".2"/>
      {/* Person typing */}
      <ellipse cx="165" cy="210" rx="24" ry="22" fill="#e8e0d5" stroke="#1a1916" strokeWidth="2"/>
      <path d="M143 210 Q128 208 116 202" fill="none" stroke="#1a1916" strokeWidth="2" strokeLinecap="round"/>
      <path d="M187 210 Q202 208 214 202" fill="none" stroke="#1a1916" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="165" cy="180" r="22" fill="#faf9f7" stroke="#1a1916" strokeWidth="2.5"/>
      <path d="M145 173 Q150 159 165 157 Q180 159 185 173" fill="#1a1916" opacity=".7"/>
      <path d="M154 185 Q158 183 162 185" fill="none" stroke="#1a1916" strokeWidth="2" strokeLinecap="round"/>
      <path d="M155 178 Q159 175 163 177" fill="none" stroke="#1a1916" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M167 177 Q171 175 175 178" fill="none" stroke="#1a1916" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function DeskColleagueScene() {
  return (
    <svg width="100%" viewBox="0 0 680 340" xmlns="http://www.w3.org/2000/svg">
      <rect x="40" y="240" width="580" height="12" rx="3" fill="#c4a882" opacity=".5"/>
      <rect x="40" y="252" width="580" height="50" fill="#c4a882" opacity=".12"/>
      <rect x="80" y="130" width="110" height="82" rx="7" fill="#faf9f7" stroke="#1a1916" strokeWidth="2.5"/>
      <rect x="88" y="138" width="94" height="66" rx="4" fill="#e8ecf0" opacity=".5"/>
      {[0,12,24,36].map((o,i)=><rect key={i} x="94" y={144+o} width={i===2?52:70} height="7" rx="2" fill="#1a1916" opacity=".1"/>)}
      {/* Question mark thought bubble */}
      <ellipse cx="290" cy="100" rx="80" ry="40" fill="#faf9f7" stroke="#1a1916" strokeWidth="1.5"/>
      <circle cx="218" cy="138" r="5" fill="#faf9f7" stroke="#1a1916" strokeWidth="1.2"/>
      <circle cx="210" cy="148" r="4" fill="#faf9f7" stroke="#1a1916" strokeWidth="1.2"/>
      <text x="290" y="106" textAnchor="middle" fontSize="26" fill="#1a1916" opacity=".6">?</text>
      {/* Two people at desk */}
      <circle cx="175" cy="185" r="22" fill="#faf9f7" stroke="#1a1916" strokeWidth="2.5"/>
      <path d="M155 178 Q160 164 175 162 Q190 164 195 178" fill="#1a1916" opacity=".7"/>
      <ellipse cx="169" cy="189" rx="4" ry="4.5" fill="#1a1916"/>
      <ellipse cx="181" cy="189" rx="4" ry="4.5" fill="#1a1916"/>
      <path d="M169 197 Q175 200 181 197" fill="none" stroke="#1a1916" strokeWidth="1.2" strokeLinecap="round"/>
      <ellipse cx="175" cy="213" rx="24" ry="22" fill="#e8e0d5" stroke="#1a1916" strokeWidth="2"/>
      <circle cx="360" cy="185" r="22" fill="#faf9f7" stroke="#1a1916" strokeWidth="2.5"/>
      <path d="M340 178 Q345 164 360 162 Q375 164 380 178" fill="#1a1916" opacity=".55"/>
      <ellipse cx="354" cy="189" rx="4" ry="4.5" fill="#1a1916"/>
      <ellipse cx="366" cy="189" rx="4" ry="4.5" fill="#1a1916"/>
      <path d="M355 197 Q361 195 367 197" fill="none" stroke="#1a1916" strokeWidth="1.2" strokeLinecap="round"/>
      <ellipse cx="360" cy="213" rx="24" ry="22" fill="#ddd8cc" stroke="#1a1916" strokeWidth="1.5"/>
      <text x="290" y="300" textAnchor="middle" fontSize="11" fill="#1a1916" opacity=".5" fontStyle="italic">"I think it's fine? Everyone does it."</text>
    </svg>
  );
}

function OfficeMeetingScene() {
  return (
    <svg width="100%" viewBox="0 0 680 340" xmlns="http://www.w3.org/2000/svg">
      {/* Meeting table */}
      <ellipse cx="340" cy="260" rx="240" ry="50" fill="#d4b896" stroke="#1a1916" strokeWidth="1.5" opacity=".4"/>
      {/* Folders/documents on table */}
      <rect x="260" y="238" width="80" height="14" rx="2" fill="#faf9f7" stroke="#1a1916" strokeWidth="1" transform="rotate(-2,300,245)"/>
      <rect x="348" y="235" width="80" height="14" rx="2" fill="#faf9f7" stroke="#1a1916" strokeWidth="1" transform="rotate(3,388,242)"/>
      {/* Laptop */}
      <rect x="304" y="220" width="72" height="48" rx="4" fill="#444" stroke="#1a1916" strokeWidth="1.5"/>
      <rect x="308" y="224" width="64" height="38" rx="2" fill="#1a1916" opacity=".7"/>
      <rect x="290" y="268" width="100" height="5" rx="2" fill="#555"/>
      {/* Three people around table */}
      <circle cx="160" cy="220" r="22" fill="#faf9f7" stroke="#1a1916" strokeWidth="2.5"/>
      <path d="M140 213 Q145 199 160 197 Q175 199 180 213" fill="#1a1916" opacity=".6"/>
      <ellipse cx="154" cy="224" rx="4" ry="4.5" fill="#1a1916"/>
      <ellipse cx="166" cy="224" rx="4" ry="4.5" fill="#1a1916"/>
      <path d="M153 232 Q160 229 167 232" fill="none" stroke="#1a1916" strokeWidth="1.2" strokeLinecap="round"/>
      <ellipse cx="160" cy="246" rx="28" ry="24" fill="#e8e0d5" stroke="#1a1916" strokeWidth="2"/>
      <circle cx="340" cy="180" r="22" fill="#faf9f7" stroke="#1a1916" strokeWidth="2.5"/>
      <path d="M320 173 Q325 159 340 157 Q355 159 360 173" fill="#1a1916" opacity=".55"/>
      <ellipse cx="334" cy="184" rx="4" ry="4.5" fill="#1a1916"/>
      <ellipse cx="346" cy="184" rx="4" ry="4.5" fill="#1a1916"/>
      <path d="M335 192 Q341 195 347 192" fill="none" stroke="#1a1916" strokeWidth="1.2" strokeLinecap="round"/>
      <ellipse cx="340" cy="208" rx="28" ry="20" fill="#ddd8cc" stroke="#1a1916" strokeWidth="1.5"/>
      <circle cx="520" cy="220" r="22" fill="#faf9f7" stroke="#1a1916" strokeWidth="2.5"/>
      <path d="M500 213 Q505 199 520 197 Q535 199 540 213" fill="#1a1916" opacity=".5"/>
      <ellipse cx="514" cy="224" rx="4" ry="4.5" fill="#1a1916"/>
      <ellipse cx="526" cy="224" rx="4" ry="4.5" fill="#1a1916"/>
      <path d="M512 231 Q519 228 526 231" fill="none" stroke="#1a1916" strokeWidth="1.2" strokeLinecap="round"/>
      <ellipse cx="520" cy="246" rx="28" ry="24" fill="#ccc8be" stroke="#1a1916" strokeWidth="1.5"/>
      <text x="480" y="78" textAnchor="middle" fontSize="10" fill="#1a1916" opacity=".4" fontStyle="italic">HR</text>
      <text x="160" y="180" textAnchor="middle" fontSize="10" fill="#1a1916" opacity=".4" fontStyle="italic">Manager</text>
    </svg>
  );
}

function OfficeBustedScene() {
  return (
    <svg width="100%" viewBox="0 0 680 340" xmlns="http://www.w3.org/2000/svg">
      {/* Office desk */}
      <rect x="100" y="230" width="480" height="12" rx="3" fill="#c4a882" opacity=".5"/>
      {/* IT report printout */}
      <rect x="300" y="195" width="120" height="90" rx="3" fill="#faf9f7" stroke="#1a1916" strokeWidth="2"/>
      {[0,12,24,36,50].map((o,i)=><rect key={i} x="310" y={203+o} width={i===4?80:100} height="7" rx="1" fill="#1a1916" opacity={i===4?.25:.12}/>)}
      <text x="360" y="290" textAnchor="middle" fontSize="8" fill="#c0392b" opacity=".7">Incident Report</text>
      {/* Highlighted row */}
      <rect x="310" y="243" width="100" height="9" rx="1" fill="#ffebee" stroke="#ef5350" strokeWidth=".5"/>
      <text x="312" y="250" fontSize="7" fill="#c0392b">free-ai-tool.io — 847KB</text>
      {/* Two people: manager standing, employee seated looking sheepish */}
      <circle cx="200" cy="185" r="22" fill="#faf9f7" stroke="#1a1916" strokeWidth="2.5"/>
      <path d="M180 178 Q185 164 200 162 Q215 164 220 178" fill="#1a1916" opacity=".6"/>
      <ellipse cx="194" cy="189" rx="4" ry="4.5" fill="#1a1916"/>
      <ellipse cx="206" cy="189" rx="4" ry="4.5" fill="#1a1916"/>
      <path d="M195 185 Q200 182 205 185" fill="none" stroke="#1a1916" strokeWidth="1.5" strokeLinecap="round"/>
      <ellipse cx="200" cy="212" rx="28" ry="26" fill="#ddd8cc" stroke="#1a1916" strokeWidth="2"/>
      {/* Employee - looking down, embarrassed */}
      <circle cx="520" cy="200" r="22" fill="#faf9f7" stroke="#1a1916" strokeWidth="2.5"/>
      <path d="M500 193 Q505 179 520 177 Q535 179 540 193" fill="#1a1916" opacity=".65"/>
      <path d="M510 208 Q514 205 518 208" fill="none" stroke="#1a1916" strokeWidth="2" strokeLinecap="round"/>
      <path d="M511 203 Q515 200 519 202" fill="none" stroke="#1a1916" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M521 202 Q525 200 529 203" fill="none" stroke="#1a1916" strokeWidth="1.5" strokeLinecap="round"/>
      <ellipse cx="520" cy="222" rx="28" ry="24" fill="#e8e0d5" stroke="#1a1916" strokeWidth="2"/>
      {/* Sweat drop */}
      <path d="M536 185 Q538 178 540 185 Q540 189 538 189 Q536 189 536 185Z" fill="#b8d4f0" opacity=".7"/>
    </svg>
  );
}

// desk-intranet: Jamie reading policy on intranet — monitor shows policy page, no colleague
function DeskIntranetScene() {
  return (
    <svg width="100%" viewBox="0 0 680 340" xmlns="http://www.w3.org/2000/svg">
      {/* Window light */}
      <rect x="500" y="20" width="150" height="130" rx="4" fill="#b8d4f0" opacity=".18"/>
      <line x1="575" y1="20" x2="575" y2="150" stroke="#1a1916" strokeWidth="1" opacity=".1"/>
      {/* Desk */}
      <rect x="40" y="240" width="580" height="12" rx="3" fill="#c4a882" opacity=".5"/>
      <rect x="40" y="252" width="580" height="50" fill="#c4a882" opacity=".12"/>
      {/* Monitor — showing intranet policy page */}
      <rect x="200" y="100" width="280" height="190" rx="7" fill="#faf9f7" stroke="#1a1916" strokeWidth="2.5"/>
      <rect x="208" y="108" width="264" height="174" rx="4" fill="#f4f6f9"/>
      {/* Browser chrome */}
      <rect x="208" y="108" width="264" height="20" rx="4" fill="#e8ecf0"/>
      <rect x="218" y="113" width="180" height="10" rx="3" fill="#faf9f7" stroke="#1a1916" strokeWidth=".5"/>
      <text x="308" y="121" textAnchor="middle" fontSize="7" fill="#5a6a7a" fontFamily="monospace">intranet/governance/ai-policy</text>
      {/* Policy document content */}
      <rect x="218" y="136" width="140" height="9" rx="2" fill="#1a1916" opacity=".55"/>
      <text x="288" y="144" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#faf9f7">AI Acceptable Use Policy</text>
      <rect x="218" y="150" width="40" height="5" rx="1" fill="#5a7abf" opacity=".6"/>
      <text x="238" y="155" textAnchor="middle" fontSize="6" fill="#faf9f7">v2.1 — 2024</text>
      {[0,9,18,27,36,45,54].map((o,i) =>
        <rect key={i} x="218" y={162+o} width={i===2||i===5?120:i===4?90:200} height="5" rx="1" fill="#1a1916" opacity={i===3?.08:.13}/>
      )}
      {/* Highlighted "do not submit" line */}
      <rect x="218" y="218" width="244" height="14" rx="2" fill="#fff3cd" stroke="#e6a817" strokeWidth=".8"/>
      <text x="340" y="228" textAnchor="middle" fontSize="7.5" fontWeight="600" fill="#856404">Do not submit confidential data to external AI tools.</text>
      {[0,9].map((o,i) =>
        <rect key={i} x="218" y={236+o} width={i===1?160:220} height="5" rx="1" fill="#1a1916" opacity=".1"/>
      )}
      {/* Monitor stand */}
      <rect x="330" y="288" width="20" height="14" rx="2" fill="#c4a882" opacity=".5"/>
      <rect x="316" y="300" width="48" height="5" rx="2" fill="#c4a882" opacity=".4"/>
      {/* Person reading — leaning forward, focused */}
      <circle cx="130" cy="182" r="22" fill="#faf9f7" stroke="#1a1916" strokeWidth="2.5"/>
      <path d="M110 175 Q115 161 130 159 Q145 161 150 175" fill="#1a1916" opacity=".7"/>
      {/* Focused eyes — both looking slightly down toward screen */}
      <path d="M119 179 Q123 176 127 178" fill="none" stroke="#1a1916" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M133 178 Q137 176 141 179" fill="none" stroke="#1a1916" strokeWidth="1.5" strokeLinecap="round"/>
      <ellipse cx="123" cy="182" rx="3.5" ry="3.5" fill="#1a1916"/>
      <ellipse cx="137" cy="182" rx="3.5" ry="3.5" fill="#1a1916"/>
      <circle cx="124" cy="181" r="1.2" fill="white"/>
      <circle cx="138" cy="181" r="1.2" fill="white"/>
      <path d="M124 191 Q130 188 136 191" fill="none" stroke="#1a1916" strokeWidth="1.2" strokeLinecap="round"/>
      <ellipse cx="130" cy="208" rx="24" ry="22" fill="#e8e0d5" stroke="#1a1916" strokeWidth="2"/>
      {/* Arm reaching toward mouse */}
      <path d="M150 210 Q175 218 192 226" fill="none" stroke="#1a1916" strokeWidth="8" strokeLinecap="round" opacity=".25"/>
      <circle cx="196" cy="228" r="5" fill="#1a1916" opacity=".2"/>
    </svg>
  );
}

// desk-focused: solo focused work — head down, no distractions, writing on paper
function DeskFocusedScene() {
  return (
    <svg width="100%" viewBox="0 0 680 340" xmlns="http://www.w3.org/2000/svg">
      {/* Evening light — warm, low angle */}
      <rect x="480" y="0" width="200" height="200" rx="0" fill="#f5e6c8" opacity=".2"/>
      {/* Desk lamp */}
      <line x1="540" y1="238" x2="540" y2="160" stroke="#1a1916" strokeWidth="3" strokeLinecap="round" opacity=".5"/>
      <line x1="540" y1="160" x2="490" y2="180" stroke="#1a1916" strokeWidth="2.5" strokeLinecap="round" opacity=".5"/>
      <ellipse cx="480" cy="184" rx="22" ry="10" fill="#f5e6c8" opacity=".7" stroke="#1a1916" strokeWidth="1" />
      {/* Warm lamp glow pool on desk */}
      <ellipse cx="380" cy="248" rx="140" ry="20" fill="#f5e6c8" opacity=".2"/>
      {/* Desk */}
      <rect x="40" y="238" width="580" height="12" rx="3" fill="#c4a882" opacity=".5"/>
      <rect x="40" y="250" width="580" height="50" fill="#c4a882" opacity=".12"/>
      {/* Notepad — being written on */}
      <rect x="200" y="190" width="130" height="100" rx="4" fill="#fffef5" stroke="#c4a882" strokeWidth="1.5"/>
      <line x1="200" y1="204" x2="330" y2="204" stroke="#c4a882" strokeWidth="1" opacity=".5"/>
      {[0,12,24,36,48,60].map((o,i) =>
        <line key={i} x1="210" x2={i===5?250:310} y1={214+o} y2={214+o} stroke="#1a1916" strokeWidth="1" opacity={i===5?.3:.18}/>
      )}
      {/* Pen in hand */}
      <line x1="305" y1="262" x2="328" y2="238" stroke="#1a1916" strokeWidth="2" strokeLinecap="round" opacity=".6"/>
      {/* Monitor off / closed laptop in background */}
      <rect x="380" y="170" width="110" height="75" rx="5" fill="#333" stroke="#1a1916" strokeWidth="1.5" opacity=".3"/>
      <rect x="370" y="243" width="130" height="5" rx="2" fill="#555" opacity=".25"/>
      {/* Coffee cup */}
      <rect x="448" y="215" width="28" height="24" rx="4" fill="#faf9f7" stroke="#1a1916" strokeWidth="1.2"/>
      <path d="M476 220 Q486 220 486 228 Q486 236 476 236" fill="none" stroke="#1a1916" strokeWidth="1" opacity=".5"/>
      <path d="M452 212 Q456 206 460 212" fill="none" stroke="#1a1916" strokeWidth="1" opacity=".3" strokeLinecap="round"/>
      {/* Person — head down, writing, alone */}
      <circle cx="148" cy="188" r="22" fill="#faf9f7" stroke="#1a1916" strokeWidth="2.5"/>
      <path d="M128 181 Q133 167 148 165 Q163 167 168 181" fill="#1a1916" opacity=".65"/>
      {/* Eyes looking down at notepad */}
      <path d="M137 186 Q141 184 145 186" fill="none" stroke="#1a1916" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M151 186 Q155 184 159 186" fill="none" stroke="#1a1916" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M140 194 Q148 198 156 194" fill="none" stroke="#1a1916" strokeWidth="1.2" strokeLinecap="round"/>
      <ellipse cx="148" cy="212" rx="24" ry="22" fill="#e8e0d5" stroke="#1a1916" strokeWidth="2"/>
      {/* Arms on desk */}
      <path d="M130 218 Q160 235 200 240" fill="none" stroke="#1a1916" strokeWidth="8" strokeLinecap="round" opacity=".22"/>
      <path d="M166 218 Q185 232 200 238" fill="none" stroke="#1a1916" strokeWidth="7" strokeLinecap="round" opacity=".18"/>
    </svg>
  );
}

// office-bright: post-incident governance review — whiteboard with action items, small group
function OfficeReviewScene() {
  return (
    <svg width="100%" viewBox="0 0 680 340" xmlns="http://www.w3.org/2000/svg">
      {/* Room walls */}
      <rect x="0" y="0" width="680" height="340" fill="#f7f5f2"/>
      {/* Whiteboard */}
      <rect x="60" y="40" width="300" height="200" rx="4" fill="#faf9f7" stroke="#1a1916" strokeWidth="2"/>
      <rect x="65" y="45" width="290" height="190" rx="2" fill="white"/>
      {/* Whiteboard frame rail */}
      <rect x="60" y="236" width="300" height="8" rx="2" fill="#c4a882" opacity=".5"/>
      {/* Whiteboard content — action plan */}
      <text x="210" y="70" textAnchor="middle" fontSize="10" fontWeight="700" fill="#1a1916" opacity=".7">Action Plan</text>
      <line x1="75" y1="76" x2="345" y2="76" stroke="#1a1916" strokeWidth="1" opacity=".2"/>
      {/* Action items */}
      {[
        { y: 92,  check: true,  text: '1. Suspend AI tool pending audit' },
        { y: 112, check: false, text: '2. Notify affected parties' },
        { y: 132, check: false, text: '3. Independent bias review' },
        { y: 152, check: false, text: '4. Controls implementation' },
        { y: 172, check: false, text: '5. Board briefing — 2 weeks' },
      ].map((item, i) => (
        <g key={i}>
          <rect x="75" y={item.y - 9} width="10" height="10" rx="2"
            fill={item.check ? '#27ae60' : 'none'}
            stroke={item.check ? '#27ae60' : '#1a1916'}
            strokeWidth="1.2" opacity=".7"/>
          {item.check && <text x="80" y={item.y} textAnchor="middle" fontSize="8" fill="white">✓</text>}
          <text x="92" y={item.y} fontSize="9" fill="#1a1916" opacity=".7">{item.text}</text>
        </g>
      ))}
      {/* Red underline on item 2 — being discussed */}
      <line x1="92" y1="115" x2="230" y2="115" stroke="#c0392b" strokeWidth="1.5" opacity=".5" strokeDasharray="3 2"/>
      {/* Round table — smaller, review setting */}
      <ellipse cx="500" cy="270" rx="140" ry="45" fill="#c4a882" stroke="#1a1916" strokeWidth="1.5" opacity=".35"/>
      {/* Laptops / documents on table */}
      <rect x="450" y="240" width="55" height="38" rx="3" fill="#444" stroke="#1a1916" strokeWidth="1" opacity=".4"/>
      <rect x="453" y="243" width="49" height="28" rx="2" fill="#1a1916" opacity=".5"/>
      <rect x="440" y="278" width="75" height="4" rx="2" fill="#555" opacity=".3"/>
      <rect x="530" y="245" width="60" height="44" rx="3" fill="#fffef5" stroke="#c4a882" strokeWidth="1" transform="rotate(5,560,267)"/>
      {/* Three people around table */}
      <circle cx="440" cy="208" r="20" fill="#faf9f7" stroke="#1a1916" strokeWidth="2"/>
      <path d="M422 202 Q427 190 440 188 Q453 190 458 202" fill="#1a1916" opacity=".6"/>
      <ellipse cx="435" cy="212" rx="3.5" ry="4" fill="#1a1916"/>
      <ellipse cx="445" cy="212" rx="3.5" ry="4" fill="#1a1916"/>
      <path d="M435 220 Q440 217 446 220" fill="none" stroke="#1a1916" strokeWidth="1.2" strokeLinecap="round"/>
      <ellipse cx="440" cy="234" rx="24" ry="20" fill="#e8e0d5" stroke="#1a1916" strokeWidth="1.5"/>
      <circle cx="560" cy="208" r="20" fill="#faf9f7" stroke="#1a1916" strokeWidth="2"/>
      <path d="M542 202 Q547 190 560 188 Q573 190 578 202" fill="#1a1916" opacity=".5"/>
      <ellipse cx="555" cy="212" rx="3.5" ry="4" fill="#1a1916"/>
      <ellipse cx="565" cy="212" rx="3.5" ry="4" fill="#1a1916"/>
      <path d="M555 220 Q561 222 566 220" fill="none" stroke="#1a1916" strokeWidth="1.2" strokeLinecap="round"/>
      <ellipse cx="560" cy="234" rx="24" ry="20" fill="#ddd8cc" stroke="#1a1916" strokeWidth="1.5"/>
      <circle cx="500" cy="196" r="20" fill="#faf9f7" stroke="#1a1916" strokeWidth="2"/>
      <path d="M482 190 Q487 178 500 176 Q513 178 518 190" fill="#1a1916" opacity=".55"/>
      <ellipse cx="495" cy="200" rx="3.5" ry="4" fill="#1a1916"/>
      <ellipse cx="505" cy="200" rx="3.5" ry="4" fill="#1a1916"/>
      <path d="M496 208 Q501 211 507 208" fill="none" stroke="#1a1916" strokeWidth="1.2" strokeLinecap="round"/>
      <ellipse cx="500" cy="222" rx="24" ry="20" fill="#ccc8be" stroke="#1a1916" strokeWidth="1.5"/>
      {/* Person at whiteboard — presenting */}
      <text x="370" y="110" fontSize="9" fill="#1a1916" opacity=".4" fontStyle="italic">Risk</text>
    </svg>
  );
}

function BoardroomScene() {
  return (
    <svg width="100%" viewBox="0 0 680 340" xmlns="http://www.w3.org/2000/svg">
      {/* Large boardroom table */}
      <ellipse cx="340" cy="240" rx="300" ry="60" fill="#b8935a" stroke="#1a1916" strokeWidth="2" opacity=".35"/>
      {/* Legal letter prominently on table */}
      <rect x="270" y="195" width="160" height="110" rx="3" fill="#faf9f7" stroke="#1a1916" strokeWidth="2"/>
      <rect x="282" y="207" width="136" height="8" rx="1" fill="#1a1916" opacity=".15"/>
      <rect x="282" y="220" width="100" height="6" rx="1" fill="#1a1916" opacity=".1"/>
      <rect x="282" y="230" width="120" height="6" rx="1" fill="#1a1916" opacity=".1"/>
      <rect x="282" y="240" width="90" height="6" rx="1" fill="#1a1916" opacity=".1"/>
      <text x="350" y="268" textAnchor="middle" fontSize="9" fill="#8b1a1a" fontWeight="600" opacity=".8">LEGAL HOLD NOTICE</text>
      <rect x="282" y="274" width="136" height="6" rx="1" fill="#8b1a1a" opacity=".2"/>
      <rect x="282" y="284" width="100" height="6" rx="1" fill="#1a1916" opacity=".08"/>
      {/* Board members around table */}
      {[{x:120,y:195},{x:220,y:165},{x:460,y:165},{x:560,y:195}].map((pos,i)=>(
        <g key={i}>
          <circle cx={pos.x} cy={pos.y} r="20" fill="#faf9f7" stroke="#1a1916" strokeWidth="2"/>
          <path d={`M${pos.x-18} ${pos.y-7} Q${pos.x-13} ${pos.y-19} ${pos.x} ${pos.y-21} Q${pos.x+13} ${pos.y-19} ${pos.x+18} ${pos.y-7}`} fill="#1a1916" opacity={0.4+i*0.08}/>
          <ellipse cx={pos.x-6} cy={pos.y-2} rx="3.5" ry="4" fill="#1a1916"/>
          <ellipse cx={pos.x+6} cy={pos.y-2} rx="3.5" ry="4" fill="#1a1916"/>
          <ellipse cx={pos.x} cy={pos.y+16} rx="24" ry="18" fill="#ddd8cc" stroke="#1a1916" strokeWidth="1.5"/>
        </g>
      ))}
      {/* CRO standing */}
      <circle cx="340" cy="120" r="24" fill="#faf9f7" stroke="#1a1916" strokeWidth="2.5"/>
      <path d="M318 113 Q323 97 340 95 Q357 97 362 113" fill="#1a1916" opacity=".7"/>
      <ellipse cx="334" cy="124" rx="4.5" ry="5" fill="#1a1916"/>
      <ellipse cx="346" cy="124" rx="4.5" ry="5" fill="#1a1916"/>
      <circle cx="336" cy="123" r="1.5" fill="white"/>
      <circle cx="348" cy="123" r="1.5" fill="white"/>
      <path d="M333 135 Q340 132 347 135" fill="none" stroke="#1a1916" strokeWidth="1.3" strokeLinecap="round"/>
      <ellipse cx="340" cy="150" rx="30" ry="26" fill="#e8e0d5" stroke="#1a1916" strokeWidth="2"/>
    </svg>
  );
}

function AnalystDeskScene() {
  return (
    <svg width="100%" viewBox="0 0 680 340" xmlns="http://www.w3.org/2000/svg">
      {/* Multi-monitor setup */}
      <rect x="40" y="240" width="600" height="12" rx="3" fill="#8a7a6a" opacity=".4"/>
      {/* Main monitor - log viewer */}
      <rect x="200" y="100" width="280" height="110" rx="6" fill="#1a1916" stroke="#333" strokeWidth="2"/>
      <rect x="208" y="108" width="264" height="96" rx="3" fill="#0a0f0a"/>
      {/* Terminal-style log lines */}
      {[
        {y:118, w:200, col:'#4caf50', t:'[09:14:02] scan complete — 847 events'},
        {y:130, w:240, col:'#888', t:'[09:14:03] processing...'},
        {y:142, w:200, col:'#888', t:'[09:14:04] 11 low-priority flags'},
        {y:154, w:260, col:'#ffeb3b', t:'[09:14:05] !! ANOMALY: CORP-LAP-0482'},
        {y:166, w:220, col:'#ef5350', t:'free-ai-tool.io — 847KB — 14:32:08'},
        {y:178, w:200, col:'#ef5350', t:'personal browser session (no DLP)'},
        {y:190, w:180, col:'#888', t:'[09:14:06] classify? [Y/n]_'},
      ].map((l,i)=>(
        <text key={i} x="214" y={l.y} fontSize="9" fill={l.col} fontFamily="monospace">{l.t}</text>
      ))}
      {/* Highlighted anomaly row */}
      <rect x="208" y="148" width="264" height="34" rx="1" fill="#ffeb3b" opacity=".08"/>
      {/* Monitor stand */}
      <rect x="330" y="210" width="8" height="14" rx="2" fill="#555"/>
      <rect x="316" y="222" width="36" height="5" rx="2" fill="#555"/>
      {/* Side monitor - other alerts */}
      <rect x="50" y="130" width="130" height="90" rx="5" fill="#1a1916" stroke="#333" strokeWidth="1.5"/>
      <rect x="57" y="137" width="116" height="76" rx="2" fill="#0d1117"/>
      {['#4caf50','#888','#888','#888','#888','#888'].map((c,i)=>(
        <rect key={i} x="63" y={143+i*11} width={i===0?90:70+i*3} height="6" rx="1" fill={c} opacity=".6"/>
      ))}
      <text x="115" y="224" textAnchor="middle" fontSize="8" fill="#888">12 alerts open</text>
      {/* Analyst */}
      <circle cx="520" cy="190" r="22" fill="#faf9f7" stroke="#1a1916" strokeWidth="2.5"/>
      <path d="M500 183 Q505 169 520 167 Q535 169 540 183" fill="#1a1916" opacity=".6"/>
      <ellipse cx="514" cy="194" rx="4" ry="4.5" fill="#1a1916"/>
      <ellipse cx="526" cy="194" rx="4" ry="4.5" fill="#1a1916"/>
      <circle cx="516" cy="193" r="1.5" fill="white"/>
      <circle cx="528" cy="193" r="1.5" fill="white"/>
      <path d="M514 175 Q517 172 520 174" fill="none" stroke="#1a1916" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M520 173 Q523 171 526 174" fill="none" stroke="#1a1916" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M514 202 Q520 200 526 202" fill="none" stroke="#1a1916" strokeWidth="1.2" strokeLinecap="round"/>
      <ellipse cx="520" cy="216" rx="26" ry="24" fill="#ddd8cc" stroke="#1a1916" strokeWidth="2"/>
      {/* Coffee mug */}
      <rect x="586" y="230" width="26" height="22" rx="4" fill="#faf9f7" stroke="#1a1916" strokeWidth="1.2"/>
      <path d="M612 236 Q622 236 622 242 Q622 248 612 248" fill="none" stroke="#1a1916" strokeWidth="1" opacity=".5"/>
    </svg>
  );
}

// ── Neutral governance / working scenes (shared across B/C/D/E domains) ──

// desk-review: person reviewing a register or form on screen — no domain-specific text
function DeskReviewScene() {
  return (
    <svg width="100%" viewBox="0 0 680 340" xmlns="http://www.w3.org/2000/svg">
      {/* Window — daylight */}
      <rect x="460" y="20" width="180" height="150" rx="4" fill="#b8d4f0" opacity=".18"/>
      <line x1="550" y1="20" x2="550" y2="170" stroke="#1a1916" strokeWidth="1" opacity=".1"/>
      <line x1="460" y1="95" x2="640" y2="95" stroke="#1a1916" strokeWidth="1" opacity=".1"/>
      {/* Desk */}
      <rect x="40" y="240" width="580" height="12" rx="3" fill="#c4a882" opacity=".5"/>
      <rect x="40" y="252" width="580" height="50" fill="#c4a882" opacity=".12"/>
      {/* Monitor */}
      <rect x="80" y="110" width="260" height="140" rx="7" fill="#faf9f7" stroke="#1a1916" strokeWidth="2.5"/>
      <rect x="90" y="120" width="240" height="122" rx="4" fill="#eef2f7"/>
      {/* Register / form on screen */}
      <rect x="96" y="126" width="228" height="14" rx="2" fill="#1a1916" opacity=".07"/>
      <text x="210" y="136" textAnchor="middle" fontSize="8" fontWeight="700" fill="#1a1916" opacity=".5" fontFamily="monospace">AI System Register</text>
      {/* Form rows — label + blank field */}
      {[
        { label: 'System ID',        y: 152 },
        { label: 'Accountable Person', y: 172 },
        { label: 'Risk Rating',       y: 192 },
        { label: 'Last Review',       y: 212 },
        { label: 'Status',            y: 232 },
      ].map((row, i) => (
        <g key={i}>
          <text x="100" y={row.y} fontSize="7" fill="#1a1916" opacity=".45">{row.label}</text>
          <rect x="170" y={row.y - 9} width="148" height="11" rx="2" fill="white" stroke="#c4a882" strokeWidth="1" opacity=".8"/>
        </g>
      ))}
      {/* Monitor stand */}
      <rect x="200" y="250" width="8" height="14" rx="2" fill="#c4a882" opacity=".4"/>
      <rect x="186" y="262" width="36" height="5" rx="2" fill="#c4a882" opacity=".4"/>
      {/* Coffee — solo working context */}
      <rect x="370" y="215" width="28" height="24" rx="4" fill="#faf9f7" stroke="#1a1916" strokeWidth="1.2"/>
      <path d="M398 220 Q408 220 408 228 Q408 236 398 236" fill="none" stroke="#1a1916" strokeWidth="1" opacity=".5"/>
      <path d="M374 212 Q378 206 382 212" fill="none" stroke="#1a1916" strokeWidth="1" opacity=".3" strokeLinecap="round"/>
      {/* Person — reading, calm */}
      <circle cx="530" cy="185" r="22" fill="#faf9f7" stroke="#1a1916" strokeWidth="2.5"/>
      <path d="M510 178 Q515 164 530 162 Q545 164 550 178" fill="#1a1916" opacity=".65"/>
      <path d="M519 187 Q523 184 527 186" fill="none" stroke="#1a1916" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M533 186 Q537 184 541 187" fill="none" stroke="#1a1916" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M522 195 Q530 199 538 195" fill="none" stroke="#1a1916" strokeWidth="1.2" strokeLinecap="round"/>
      <ellipse cx="530" cy="210" rx="24" ry="22" fill="#e8e0d5" stroke="#1a1916" strokeWidth="2"/>
      <path d="M512 216 Q530 232 560 238" fill="none" stroke="#1a1916" strokeWidth="8" strokeLinecap="round" opacity=".2"/>
    </svg>
  );
}

// desk-working: person typing at desk — clean document on screen, no domain-specific text
function DeskWorkingScene() {
  return (
    <svg width="100%" viewBox="0 0 680 340" xmlns="http://www.w3.org/2000/svg">
      {/* Desk */}
      <rect x="40" y="240" width="580" height="12" rx="3" fill="#c4a882" opacity=".5"/>
      <rect x="40" y="252" width="580" height="50" fill="#c4a882" opacity=".12"/>
      {/* Monitor */}
      <rect x="200" y="100" width="280" height="150" rx="7" fill="#faf9f7" stroke="#1a1916" strokeWidth="2.5"/>
      <rect x="210" y="110" width="260" height="132" rx="4" fill="#f0f4ff"/>
      {/* Generic document — title + body lines */}
      <rect x="220" y="118" width="240" height="10" rx="2" fill="#1a1916" opacity=".12"/>
      <text x="340" y="126" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#1a1916" opacity=".4">Internal Review Document</text>
      <line x1="220" y1="132" x2="460" y2="132" stroke="#c4a882" strokeWidth="1" opacity=".5"/>
      {[0,10,20,30,40,50,60,70,80].map((o,i) => (
        <rect key={i} x="222" y={138+o} width={i%3===2 ? 140 : i%3===0 ? 220 : 180} height="6" rx="2" fill="#1a1916" opacity=".08"/>
      ))}
      {/* Cursor blink indicator */}
      <rect x="222" y="228" width="2" height="9" rx="1" fill="#4a90d9" opacity=".7"/>
      {/* Monitor stand */}
      <rect x="333" y="250" width="8" height="14" rx="2" fill="#c4a882" opacity=".4"/>
      <rect x="319" y="262" width="36" height="5" rx="2" fill="#c4a882" opacity=".4"/>
      {/* Keyboard */}
      <rect x="240" y="268" width="200" height="14" rx="4" fill="#e8e0d5" opacity=".6" stroke="#1a1916" strokeWidth=".5"/>
      {[0,1,2,3,4,5,6,7].map(i => (
        <rect key={i} x={248+i*22} y={271} width="16" height="8" rx="2" fill="#faf9f7" opacity=".8"/>
      ))}
      {/* Person typing — focused */}
      <circle cx="120" cy="180" r="22" fill="#faf9f7" stroke="#1a1916" strokeWidth="2.5"/>
      <path d="M100 173 Q105 159 120 157 Q135 159 140 173" fill="#1a1916" opacity=".65"/>
      <path d="M109 182 Q113 179 117 181" fill="none" stroke="#1a1916" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M123 181 Q127 179 131 182" fill="none" stroke="#1a1916" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M112 190 Q120 193 128 190" fill="none" stroke="#1a1916" strokeWidth="1.2" strokeLinecap="round"/>
      <ellipse cx="120" cy="205" rx="24" ry="22" fill="#e8e0d5" stroke="#1a1916" strokeWidth="2"/>
      {/* Arms reaching to keyboard */}
      <path d="M102 210 Q155 238 240 270" fill="none" stroke="#1a1916" strokeWidth="8" strokeLinecap="round" opacity=".18"/>
      <path d="M138 210 Q180 232 240 270" fill="none" stroke="#1a1916" strokeWidth="7" strokeLinecap="round" opacity=".15"/>
    </svg>
  );
}

// office-briefing: person at desk reviewing an alert/notification — professional, no shadow-AI text
function OfficeBriefingScene() {
  return (
    <svg width="100%" viewBox="0 0 680 340" xmlns="http://www.w3.org/2000/svg">
      {/* Office walls */}
      <rect x="0" y="0" width="680" height="340" fill="#f5f4f0" opacity=".4"/>
      <line x1="0" y1="270" x2="680" y2="270" stroke="#c4a882" strokeWidth="1" opacity=".3"/>
      {/* Desk */}
      <rect x="40" y="240" width="600" height="14" rx="3" fill="#c4a882" opacity=".5"/>
      <rect x="40" y="254" width="600" height="50" fill="#c4a882" opacity=".12"/>
      {/* Monitor — showing a notification/alert panel */}
      <rect x="180" y="95" width="300" height="160" rx="7" fill="#faf9f7" stroke="#1a1916" strokeWidth="2.5"/>
      <rect x="190" y="105" width="280" height="142" rx="4" fill="#1a1916" opacity=".04"/>
      {/* Alert header bar */}
      <rect x="190" y="105" width="280" height="22" rx="4" fill="#2c5282" opacity=".85"/>
      <text x="330" y="120" textAnchor="middle" fontSize="9" fontWeight="700" fill="white">Notification — Action Required</text>
      {/* Alert body rows */}
      {[
        { label: 'Reference:', value: 'REV-2024-0847',   y: 142 },
        { label: 'Priority:',  value: 'High',             y: 162, highlight: true },
        { label: 'Assigned:',  value: 'Pending review',  y: 182 },
        { label: 'Due:',       value: 'End of business', y: 202 },
      ].map((row, i) => (
        <g key={i}>
          <text x="200" y={row.y} fontSize="8" fill="#1a1916" opacity=".45">{row.label}</text>
          <text x="270" y={row.y} fontSize="8" fontWeight={row.highlight ? '700' : '400'} fill={row.highlight ? '#c0392b' : '#1a1916'} opacity=".8">{row.value}</text>
        </g>
      ))}
      {/* Action button */}
      <rect x="370" y="220" width="88" height="20" rx="4" fill="#2c5282" opacity=".85"/>
      <text x="414" y="234" textAnchor="middle" fontSize="8" fontWeight="600" fill="white">Review →</text>
      {/* Monitor stand */}
      <rect x="325" y="255" width="8" height="14" rx="2" fill="#c4a882" opacity=".4"/>
      <rect x="311" y="267" width="36" height="5" rx="2" fill="#c4a882" opacity=".4"/>
      {/* Stack of papers on desk */}
      <rect x="510" y="215" width="80" height="6" rx="1" fill="#faf9f7" stroke="#c4a882" strokeWidth="1" opacity=".9"/>
      <rect x="508" y="221" width="80" height="6" rx="1" fill="#faf9f7" stroke="#c4a882" strokeWidth="1" opacity=".7"/>
      <rect x="512" y="227" width="80" height="6" rx="1" fill="#faf9f7" stroke="#c4a882" strokeWidth="1" opacity=".5"/>
      {/* Person — looking at screen, attentive */}
      <circle cx="100" cy="178" r="22" fill="#faf9f7" stroke="#1a1916" strokeWidth="2.5"/>
      <path d="M80 171 Q85 157 100 155 Q115 157 120 171" fill="#1a1916" opacity=".65"/>
      <path d="M89 181 Q93 178 97 180" fill="none" stroke="#1a1916" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M103 180 Q107 178 111 181" fill="none" stroke="#1a1916" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M91 190 Q100 194 109 190" fill="none" stroke="#1a1916" strokeWidth="1.2" strokeLinecap="round"/>
      <ellipse cx="100" cy="205" rx="24" ry="22" fill="#e8e0d5" stroke="#1a1916" strokeWidth="2"/>
      <path d="M82 212 Q100 228 140 238" fill="none" stroke="#1a1916" strokeWidth="8" strokeLinecap="round" opacity=".2"/>
    </svg>
  );
}

// ── Choice Point ─────────────────────────────────────────────────
function ChoicePoint({ node, persona, scenario, onSelect }) {
  const personaData = scenario.personas[persona];
  return (
    <div className={styles.choiceWrap}>
      <div className={styles.choicePrompt}>{node.decision.prompt}</div>
      <div className={styles.choices}>
        {node.decision.choices.map(choice => (
          <button key={choice.id} className={styles.choiceBtn}
            onClick={() => onSelect(choice, resolveNext(node, choice.id))}>
            <span className={styles.choiceLabel}>{choice.label}</span>
            <span className={styles.choiceArrow}>→</span>
          </button>
        ))}
      </div>
      <p className={styles.choiceHint}>Playing as: {personaData.character}, {personaData.role}</p>
    </div>
  );
}

// ── Feedback ─────────────────────────────────────────────────────
const QUALITY_CONFIG = {
  good:    { label: 'Good call', colorClass: styles.qualityGood },
  partial: { label: 'Partially right', colorClass: styles.qualityPartial },
  poor:    { label: 'Missed the mark', colorClass: styles.qualityPoor },
};

function Feedback({ choice, feedbackText, loading, onContinue }) {
  const config = QUALITY_CONFIG[choice.quality] || QUALITY_CONFIG.poor;
  const pct = choice.quality === 'good' ? 100 : choice.quality === 'partial' ? 60 : 12;

  return (
    <div className={styles.feedbackWrap}>
      <div className={`${styles.qualityBar} ${config.colorClass}`}>
        <span className={styles.qualityLabel}>{config.label}</span>
        <span className={styles.qualityEcho}>"{choice.label}"</span>
      </div>
      <div className={styles.feedbackBody}>
        <div className={styles.aiAnalysis}>
          <span className={styles.aiLabel}>What happened</span>
          {loading
            ? <div className={styles.loadingDots}><span/><span/><span/></div>
            : <p className={styles.analysisText}>{feedbackText}</p>
          }
        </div>
      </div>
      <div className={styles.scoreRow}>
        <span className={styles.scoreLabel}>Decision score</span>
        <div className={styles.scoreBar}>
          <div className={`${styles.scoreFill} ${config.colorClass}`} style={{width:`${pct}%`}}/>
        </div>
        <span className={styles.scoreVal}>{pct}/100</span>
      </div>
      {!loading && (
        <div className={styles.nav}>
          <button className={styles.primaryBtn} onClick={onContinue}>Continue →</button>
        </div>
      )}
    </div>
  );
}

// ── Outcome ──────────────────────────────────────────────────────
const TONE_CLASS = { good: styles.outcomeGood, warn: styles.outcomeWarn, bad: styles.outcomeBad };

function OutcomeScreen({ outcome, scenario, onRestart }) {
  const toneClass = TONE_CLASS[outcome.tone] || TONE_CLASS.warn;

  return (
    <div className={styles.outcomeWrap}>
      <div className={`${styles.outcomeCard} ${toneClass}`}>
        <div className={styles.outcomeHeading}>{outcome.heading}</div>
        <p className={styles.outcomeResult}>{outcome.result}</p>
        <div className={styles.learningBlock}>
          <span className={styles.learningLabel}>Key learning</span>
          <p>{outcome.learning}</p>
        </div>
      </div>

      {scenario.controls_summary?.length > 0 && (
      <div className={styles.controlsSection}>
        <div className={styles.sectionTitle}>Controls this scenario demonstrates</div>
        <div className={styles.controlsList}>
          {scenario.controls_summary.map(c => (
            <div key={c.id} className={styles.controlItem}>
              <div className={styles.controlHeader}>
                <span className={styles.controlLabel}>{c.label}</span>
                <div className={styles.controlTags}>
                  <span className={styles.tag}>{c.owner}</span>
                  <span className={styles.tag}>{c.effort} effort</span>
                  {c.go_live && <span className={`${styles.tag} ${styles.tagAccent}`}>Go-live</span>}
                </div>
              </div>
              {c.context && <p className={styles.controlContext}>{c.context}</p>}
            </div>
          ))}
        </div>
      </div>
      )}

      <div className={styles.kbCta}>
        <div>
          <div className={styles.kbCtaLabel}>Go deeper</div>
          <p>Full {scenario.risk_ref} reference — controls, frameworks, technical implementation.</p>
        </div>
        <a href={scenario.kb_url} target="_blank" rel="noopener noreferrer" className={styles.kbBtn}>
          Knowledge base ↗
        </a>
      </div>

      <div className={styles.outcomeActions}>
        <button className={styles.secondaryBtn} onClick={() => onRestart('persona')}>Try another role</button>
        <button className={styles.secondaryBtn} onClick={() => onRestart('start')}>Play again</button>
        <Link to="/" className={styles.accentLink}>All scenarios →</Link>
      </div>
    </div>
  );
}

// ── App shell ─────────────────────────────────────────────────────
// ── App shell ─────────────────────────────────────────────────────
// ScenarioPlayer owns ALL hooks — receives scenario as a prop
// This satisfies React rules of hooks (no conditional returns before hooks)
function ScenarioPlayer({ scenario }) {
  const [state, dispatch] = useReducer(reducer, scenario, createInitialState);

  // Auto-advance nodes with no decision (e.g. n3_manager_saved_it)
  useEffect(() => {
    if (state.state !== STATES.NODE) return;
    const node = getCurrentNode(scenario, state.persona, state.currentNodeId);
    if (!node || node.decision) return;
    const nextId = node.branches.auto;
    if (!nextId) return;
    dispatch({ type: 'AUTO_ADVANCE', payload: { nextNodeId: nextId } });
  }, [state.state, state.currentNodeId, state.persona, scenario]);

  // Generate feedback — fires once when feedbackLoading becomes true
  // Depends only on feedbackLoading (not state.state) to avoid double-firing
  useEffect(() => {
    if (!state.feedbackLoading) return;
    if (!state.selectedChoice) return;
    const lastEntry = state.history[state.history.length - 1];
    if (!lastEntry) return;
    const node = getCurrentNode(scenario, state.persona, lastEntry.nodeId);
    if (!node?.decision) return;
    const choice = node.decision.choices.find(c => c.id === state.selectedChoice.id);
    if (!choice) return;
    const personaData = scenario.personas[state.persona];
    if (!personaData) return;
    const text = getLocalFeedback(choice, state.persona, personaData);
    const timer = setTimeout(() => dispatch({ type: 'FEEDBACK_LOADED', payload: text }), 600);
    return () => clearTimeout(timer);
  // Intentionally depends only on feedbackLoading — adding scenario/history/persona
  // would cause double-firing (see QA_REVIEW.md RT-004). This is a known safe exception.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.feedbackLoading]);

  const currentNode = getCurrentNode(scenario, state.persona, state.currentNodeId);
  const currentOutcome = getOutcome(scenario, state.persona, state.outcomeId);

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoMark}>◈</span>AI Risk Training
        </Link>
        <div className={styles.headerRight}>
          {state.persona && state.state !== STATES.PERSONA_SELECT && (
            <span className={styles.headerTag}>{scenario.risk_ref} — {scenario.title}</span>
          )}
          <a href="https://b-gowland.github.io/ai-risk-kb/" target="_blank" rel="noopener noreferrer"
            className={styles.headerLink}>Knowledge base ↗</a>
        </div>
      </header>

      <main className={styles.main}>
        {state.state === STATES.PERSONA_SELECT && (
          <PersonaSelect scenario={scenario}
            onSelect={p => dispatch({ type: 'SELECT_PERSONA', payload: p })} />
        )}
        {state.state === STATES.PREMISE && (
          <Premise scenario={scenario} persona={state.persona}
            onStart={() => dispatch({ type: 'START_SCENARIO' })} />
        )}
        {state.state === STATES.NODE && currentNode && (
          <div className={styles.nodeWrap}>
            <ScenePanel node={currentNode} persona={state.persona} />
            {currentNode.decision && (
              <ChoicePoint node={currentNode} persona={state.persona} scenario={scenario}
                onSelect={(choice, nextId) =>
                  dispatch({ type: 'SELECT_CHOICE', payload: { choice, nextNodeId: nextId } })} />
            )}
          </div>
        )}
        {state.state === STATES.FEEDBACK && state.selectedChoice && (
          <div className={styles.nodeWrap}>
            {currentNode && <ScenePanel node={currentNode} persona={state.persona} />}
            <Feedback
              choice={state.selectedChoice}
              feedbackText={state.feedbackText}
              loading={state.feedbackLoading}
              onContinue={() => dispatch({ type: 'CONTINUE_FROM_FEEDBACK' })} />
          </div>
        )}
        {state.state === STATES.OUTCOME && currentOutcome && (
          <OutcomeScreen outcome={currentOutcome} scenario={scenario}
            onRestart={mode => dispatch({
              type: mode === 'persona' ? 'CHANGE_PERSONA' : 'RESTART',
              payload: scenario,
            })} />
        )}
      </main>

      <footer className={styles.footer}>
        <span>ai-risk-training · open source</span>
        <a href="https://github.com/b-gowland/ai-risk-training" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
        <a href="https://b-gowland.github.io/ai-risk-kb/" target="_blank" rel="noopener noreferrer">Knowledge base ↗</a>
        <span className={styles.footerDisclaimer}>
          Scenarios are fictional. No personal data collected.{' '}
          <a href="https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement" target="_blank" rel="noopener noreferrer">Privacy ↗</a>
        </span>
      </footer>
    </div>
  );
}

// App is a pure router — no hooks, just picks the right component to render
export default function App() {
  const { id } = useParams();
  const scenario = getScenario(id);

  if (!scenario || scenario.stub) {
    return (
      <div className={styles.app}>
        <header className={styles.header}>
          <Link to="/" className={styles.logo}>
            <span className={styles.logoMark}>◈</span>AI Risk Training
          </Link>
        </header>
        <main className={styles.main} style={{textAlign:'center', paddingTop:'80px'}}>
          <div style={{fontSize:'48px', marginBottom:'20px'}}>◎</div>
          <h2 style={{fontFamily:'var(--font-display)', fontSize:'28px', marginBottom:'12px'}}>
            {scenario ? 'Coming soon' : 'Scenario not found'}
          </h2>
          <p style={{color:'var(--c-text-secondary)', marginBottom:'32px', fontSize:'16px'}}>
            {scenario
              ? `${scenario.risk_ref} — ${scenario.title} is in development.`
              : "That scenario doesn't exist yet."}
          </p>
          <Link to="/" className={styles.primaryBtn} style={{textDecoration:'none', display:'inline-block'}}>
            ← Back to all scenarios
          </Link>
        </main>
      </div>
    );
  }

  return <ScenarioPlayer scenario={scenario} />;
}