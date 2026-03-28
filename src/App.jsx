import { useReducer, useEffect } from 'react';
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
  const role = personaData.role;

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
        {PERSONA_ORDER.map(key => {
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
function ScenePanel({ node, persona }) {
  const sceneKey = node.scene || 'desk-default';
  return (
    <div className={styles.scenePanel} data-scene={sceneKey}>
      <SceneSVG sceneKey={sceneKey} caption={node.caption} subCaption={node.sub_caption} />
    </div>
  );
}

// Inline SVG scene renderer — maps scene keys to illustrations
function SceneSVG({ sceneKey, caption, subCaption }) {
  // We use the same rich SVG approach from the preview, keyed by scene
  const scenes = {
    'desk-casual':      <DeskCasualScene />,
    'desk-typing':      <DeskTypingScene />,
    'desk-colleague':   <DeskColleagueScene />,
    'desk-intranet':    <DeskColleagueScene />,
    'desk-focused':     <DeskCasualScene />,
    'office-meeting':   <OfficeMeetingScene />,
    'office-busted':    <OfficeBustedScene />,
    'office-bright':    <OfficeMeetingScene />,
    'boardroom':        <BoardroomScene />,
    'analyst-desk':     <AnalystDeskScene />,
    'video-call':        <VideoCallScene />,
    'payment-screen':    <PaymentScreenScene />,
    'document-error':    <DocumentErrorScene />,
    'chart-declining':   <ChartDecliningScene />,
    'phone-verify':      <PhoneVerifyScene />,
    'security-alert':    <SecurityAlertScene />,
  };
  return (
    <div className={styles.sceneWrapper}>
      <div className={styles.svgWrap}>
        {scenes[sceneKey] || scenes['desk-casual']}
      </div>
      <div className={styles.captionBar}>
        <p className={styles.captionMain}>{caption}</p>
        {subCaption && <p className={styles.captionSub}>{subCaption}</p>}
      </div>
    </div>
  );
}


// ── Additional scene components for C4 / A1 / E1 ─────────────────

// C4 — video call that looks real but isn't
function VideoCallScene() {
  return (
    <svg width="100%" viewBox="0 0 680 340" xmlns="http://www.w3.org/2000/svg">
      {/* Dark room, monitor glow */}
      <rect width="680" height="340" fill="#f5f1eb"/>
      <rect x="40" y="240" width="600" height="12" rx="3" fill="#c4a882" opacity=".5"/>
      {/* Large monitor — video call */}
      <rect x="120" y="60" width="320" height="200" rx="8" fill="#1a1916"/>
      <rect x="128" y="68" width="304" height="184" rx="5" fill="#0d1117"/>
      {/* Video call face — CFO silhouette, convincingly real */}
      <rect x="132" y="72" width="296" height="176" rx="3" fill="#1a3a5c"/>
      <circle cx="280" cy="140" r="34" fill="#2a5298"/>
      <rect x="246" y="174" width="68" height="50" rx="20" fill="#2a5298"/>
      {/* Name tag */}
      <rect x="136" y="224" width="130" height="20" rx="3" fill="#1a1916" opacity=".8"/>
      <text x="201" y="237" textAnchor="middle" fill="#faf9f7" fontSize="9" fontFamily="monospace">Dana Okafor — CFO</text>
      {/* LIVE badge */}
      <rect x="258" y="76" width="34" height="14" rx="3" fill="#c0392b"/>
      <text x="275" y="86" textAnchor="middle" fill="white" fontSize="8" fontFamily="monospace">LIVE</text>
      {/* Subtle scan line — synthetic hint */}
      <line x1="132" y1="148" x2="428" y2="148" stroke="#ffffff" strokeWidth=".4" opacity=".15"/>
      <line x1="132" y1="112" x2="428" y2="112" stroke="#ffffff" strokeWidth=".4" opacity=".1"/>
      {/* Monitor stand */}
      <rect x="271" y="260" width="18" height="12" rx="2" fill="#c4a882" opacity=".4"/>
      <rect x="254" y="270" width="52" height="6" rx="2" fill="#c4a882" opacity=".4"/>
      {/* Person watching — concerned */}
      <circle cx="560" cy="190" r="22" fill="#faf9f7" stroke="#1a1916" strokeWidth="2.5"/>
      <path d="M540 183 Q545 169 560 167 Q575 169 580 183" fill="#1a1916" opacity=".6"/>
      <ellipse cx="554" cy="194" rx="4" ry="4.5" fill="#1a1916"/>
      <ellipse cx="566" cy="194" rx="4" ry="4.5" fill="#1a1916"/>
      <circle cx="556" cy="193" r="1.5" fill="white"/>
      <circle cx="568" cy="193" r="1.5" fill="white"/>
      {/* Raised eyebrow — uncertain */}
      <path d="M549 182 Q554 179 559 181" fill="none" stroke="#1a1916" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M562 180 Q567 177 572 180" fill="none" stroke="#1a1916" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M552 202 Q560 198 568 202" fill="none" stroke="#1a1916" strokeWidth="1.2" strokeLinecap="round"/>
      <ellipse cx="560" cy="216" rx="26" ry="24" fill="#ddd8cc" stroke="#1a1916" strokeWidth="2"/>
      {/* Account details on paper beside monitor */}
      <rect x="455" y="200" width="90" height="60" rx="3" fill="#faf9f7" stroke="#1a1916" strokeWidth="1.5" transform="rotate(2,500,230)"/>
      <rect x="462" y="208" width="70" height="6" rx="1" fill="#1a1916" opacity=".15" transform="rotate(2,500,230)"/>
      <rect x="462" y="218" width="60" height="6" rx="1" fill="#1a1916" opacity=".15" transform="rotate(2,500,230)"/>
      <text x="500" y="246" textAnchor="middle" fontSize="7" fill="#c0392b" opacity=".8" fontWeight="600" transform="rotate(2,500,230)">$180,000</text>
    </svg>
  );
}

// C4 — payment confirmation screen
function PaymentScreenScene() {
  return (
    <svg width="100%" viewBox="0 0 680 340" xmlns="http://www.w3.org/2000/svg">
      <rect width="680" height="340" fill="#f5f1eb"/>
      <rect x="40" y="240" width="600" height="12" rx="3" fill="#c4a882" opacity=".5"/>
      {/* Browser window */}
      <rect x="100" y="40" width="480" height="240" rx="8" fill="#faf9f7" stroke="#1a1916" strokeWidth="2"/>
      <rect x="100" y="40" width="480" height="36" rx="8" fill="#e8e0d5"/>
      <rect x="100" y="64" width="480" height="12" fill="#e8e0d5"/>
      {/* Browser dots */}
      <circle cx="122" cy="58" r="5" fill="#c0392b" opacity=".6"/>
      <circle cx="138" cy="58" r="5" fill="#e67e22" opacity=".6"/>
      <circle cx="154" cy="58" r="5" fill="#27ae60" opacity=".6"/>
      {/* URL bar */}
      <rect x="170" y="50" width="340" height="16" rx="4" fill="#faf9f7"/>
      <text x="340" y="61" textAnchor="middle" fontSize="8" fill="#1a1916" opacity=".5" fontFamily="monospace">secure-payments.internal/transfer</text>
      {/* Payment form */}
      <text x="340" y="108" textAnchor="middle" fontSize="13" fontWeight="700" fill="#1a1916" fontFamily="serif">Confirm Transfer</text>
      <rect x="130" y="118" width="420" height="1" fill="#1a1916" opacity=".1"/>
      {/* Fields */}
      <text x="145" y="138" fontSize="9" fill="#1a1916" opacity=".5">RECIPIENT</text>
      <rect x="145" y="142" width="390" height="18" rx="3" fill="#f0ebe3"/>
      <text x="153" y="154" fontSize="9" fill="#1a1916" opacity=".7" fontFamily="monospace">ACC: 8821-****-****-4203  |  BSB: 062-000</text>
      <text x="145" y="176" fontSize="9" fill="#1a1916" opacity=".5">AMOUNT</text>
      <rect x="145" y="180" width="390" height="28" rx="3" fill="#fff3cd" stroke="#e67e22" strokeWidth="1"/>
      <text x="340" y="199" textAnchor="middle" fontSize="18" fontWeight="700" fill="#856404">$180,000.00</text>
      {/* Warning */}
      <rect x="145" y="216" width="390" height="18" rx="3" fill="#fdf2f2"/>
      <text x="340" y="228" textAnchor="middle" fontSize="8" fill="#c0392b">⚠  This transaction cannot be reversed once submitted</text>
      {/* Confirm button */}
      <rect x="220" y="242" width="240" height="28" rx="5" fill="#c0392b"/>
      <text x="340" y="260" textAnchor="middle" fontSize="11" fontWeight="600" fill="white">Confirm Transfer →</text>
    </svg>
  );
}

// A1 — document with fabricated citation highlighted
function DocumentErrorScene() {
  return (
    <svg width="100%" viewBox="0 0 680 340" xmlns="http://www.w3.org/2000/svg">
      <rect width="680" height="340" fill="#f5f1eb"/>
      <rect x="40" y="240" width="600" height="12" rx="3" fill="#c4a882" opacity=".5"/>
      {/* Document on desk */}
      <rect x="160" y="30" width="360" height="260" rx="4" fill="#faf9f7" stroke="#1a1916" strokeWidth="2"/>
      {/* Document header */}
      <text x="340" y="58" textAnchor="middle" fontSize="12" fontWeight="700" fill="#1a1916" fontFamily="serif">Regulatory Briefing — Client Confidential</text>
      <rect x="175" y="64" width="330" height="1" fill="#1a1916" opacity=".2"/>
      {/* Text lines */}
      {[0,1,2,3].map(i => (
        <rect key={i} x="175" y={76+i*14} width={280+i%2*20} height="8" rx="2" fill="#1a1916" opacity=".1"/>
      ))}
      {/* Fabricated citation — highlighted red */}
      <rect x="175" y="136" width="330" height="24" rx="2" fill="#ffebee" stroke="#ef5350" strokeWidth="1.5"/>
      <text x="185" y="149" fontSize="8" fill="#c0392b" fontFamily="monospace">¹ APRA Prudential Standard APS 330/AI-2024 cl.4.2(b),</text>
      <text x="185" y="159" fontSize="8" fill="#c0392b" fontFamily="monospace">  issued March 2024 — [citation not verified]</text>
      {/* More text lines */}
      {[0,1,2,3,4].map(i => (
        <rect key={i} x="175" y={168+i*14} width={260+i%3*15} height="8" rx="2" fill="#1a1916" opacity=".1"/>
      ))}
      {/* Red pen annotation */}
      <path d="M460 136 Q490 120 500 108" fill="none" stroke="#c0392b" strokeWidth="2" strokeLinecap="round"/>
      <text x="505" y="105" fontSize="9" fill="#c0392b" fontStyle="italic">Does not exist!</text>
      {/* Sticky note */}
      <rect x="420" y="190" width="90" height="70" rx="2" fill="#fff9c4" stroke="#f0c040" strokeWidth="1" transform="rotate(3,465,225)"/>
      <text x="465" y="213" textAnchor="middle" fontSize="8" fill="#856404" transform="rotate(3,465,225)">Check ALL</text>
      <text x="465" y="224" textAnchor="middle" fontSize="8" fill="#856404" transform="rotate(3,465,225)">citations</text>
      <text x="465" y="235" textAnchor="middle" fontSize="8" fill="#c0392b" fontWeight="600" transform="rotate(3,465,225)">before sending!</text>
      {/* Desk surface */}
      <rect x="40" y="286" width="600" height="4" rx="2" fill="#c4a882" opacity=".3"/>
    </svg>
  );
}

// E1 — declining diversity chart on screen
function ChartDecliningScene() {
  return (
    <svg width="100%" viewBox="0 0 680 340" xmlns="http://www.w3.org/2000/svg">
      <rect width="680" height="340" fill="#f5f1eb"/>
      <rect x="40" y="240" width="600" height="12" rx="3" fill="#c4a882" opacity=".5"/>
      {/* Monitor */}
      <rect x="80" y="50" width="400" height="220" rx="7" fill="#faf9f7" stroke="#1a1916" strokeWidth="2.5"/>
      <rect x="88" y="58" width="384" height="204" rx="4" fill="#f8f4ef"/>
      {/* Chart title */}
      <text x="280" y="80" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1a1916">Shortlist Diversity Index — Monthly</text>
      <line x1="100" y1="86" x2="460" y2="86" stroke="#1a1916" strokeWidth=".5" opacity=".3"/>
      {/* Y axis */}
      <line x1="120" y1="96" x2="120" y2="215" stroke="#1a1916" strokeWidth="1" opacity=".4"/>
      {/* X axis */}
      <line x1="120" y1="215" x2="450" y2="215" stroke="#1a1916" strokeWidth="1" opacity=".4"/>
      {/* Y axis labels */}
      {["100%","75%","50%","25%"].map((label, i) => (
        <text key={i} x="115" y={99+i*29} textAnchor="end" fontSize="7" fill="#1a1916" opacity=".5">{label}</text>
      ))}
      {/* Month labels */}
      {["Oct","Nov","Dec","Jan","Feb","Mar"].map((m, i) => (
        <text key={i} x={138+i*54} y="225" textAnchor="middle" fontSize="7" fill="#1a1916" opacity=".5">{m}</text>
      ))}
      {/* Tool launch marker */}
      <line x1="246" y1="96" x2="246" y2="215" stroke="#e67e22" strokeWidth="1.5" strokeDasharray="4 3" opacity=".7"/>
      <text x="248" y="104" fontSize="7" fill="#e67e22">AI tool</text>
      <text x="248" y="113" fontSize="7" fill="#e67e22">launched</text>
      {/* Line — healthy before launch, declining after */}
      <polyline
        points="138,108 192,105 246,103 300,125 354,148 408,172"
        fill="none" stroke="#27ae60" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity=".4"/>
      <polyline
        points="246,103 300,125 354,148 408,172"
        fill="none" stroke="#c0392b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Data points */}
      {[[138,108],[192,105],[246,103]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="4" fill="#27ae60" opacity=".6"/>
      ))}
      {[[300,125],[354,148],[408,172]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="4" fill="#c0392b"/>
      ))}
      {/* Trend arrow down */}
      <path d="M390 155 L420 180" stroke="#c0392b" strokeWidth="2" markerEnd="url(#arr)" opacity=".6"/>
      <text x="425" y="185" fontSize="8" fill="#c0392b" fontStyle="italic">–28%</text>
      {/* Monitor stand */}
      <rect x="271" y="268" width="18" height="12" rx="2" fill="#c4a882" opacity=".4"/>
      <rect x="254" y="278" width="52" height="6" rx="2" fill="#c4a882" opacity=".4"/>
      {/* Person viewing — worried */}
      <circle cx="560" cy="190" r="22" fill="#faf9f7" stroke="#1a1916" strokeWidth="2.5"/>
      <path d="M540 183 Q545 169 560 167 Q575 169 580 183" fill="#1a1916" opacity=".6"/>
      <ellipse cx="554" cy="194" rx="4" ry="4.5" fill="#1a1916"/>
      <ellipse cx="566" cy="194" rx="4" ry="4.5" fill="#1a1916"/>
      <path d="M553 202 Q560 205 567 202" fill="none" stroke="#1a1916" strokeWidth="1.5" strokeLinecap="round"/>
      <ellipse cx="560" cy="215" rx="26" ry="24" fill="#ddd8cc" stroke="#1a1916" strokeWidth="2"/>
    </svg>
  );
}

// C4 / shared — phone verification call
function PhoneVerifyScene() {
  return (
    <svg width="100%" viewBox="0 0 680 340" xmlns="http://www.w3.org/2000/svg">
      <rect width="680" height="340" fill="#f5f1eb"/>
      <rect x="40" y="240" width="600" height="12" rx="3" fill="#c4a882" opacity=".5"/>
      {/* Person at desk, phone to ear */}
      <circle cx="200" cy="175" r="26" fill="#faf9f7" stroke="#1a1916" strokeWidth="2.5"/>
      <path d="M176 168 Q181 154 200 152 Q219 154 224 168" fill="#1a1916" opacity=".6"/>
      <ellipse cx="194" cy="179" rx="4" ry="4.5" fill="#1a1916"/>
      <ellipse cx="206" cy="179" rx="4" ry="4.5" fill="#1a1916"/>
      <circle cx="196" cy="178" r="1.5" fill="white"/>
      <circle cx="208" cy="178" r="1.5" fill="white"/>
      {/* Relieved expression */}
      <path d="M192 188 Q200 193 208 188" fill="none" stroke="#1a1916" strokeWidth="1.5" strokeLinecap="round"/>
      <ellipse cx="200" cy="205" rx="28" ry="26" fill="#e8e0d5" stroke="#1a1916" strokeWidth="2"/>
      {/* Phone held to ear */}
      <rect x="212" y="155" width="26" height="44" rx="8" fill="#1a1916"/>
      <rect x="215" y="158" width="20" height="36" rx="5" fill="#2c3e50"/>
      {/* Sound waves — call active */}
      <path d="M242 166 Q252 172 242 178" fill="none" stroke="#1a1916" strokeWidth="1.5" strokeLinecap="round" opacity=".4"/>
      <path d="M245 161 Q260 172 245 183" fill="none" stroke="#1a1916" strokeWidth="1.2" strokeLinecap="round" opacity=".3"/>
      {/* Big green checkmark — verification successful */}
      <circle cx="430" cy="160" r="60" fill="#d5f0dd" stroke="#27ae60" strokeWidth="2.5"/>
      <path d="M400 160 L422 182 L462 138" fill="none" stroke="#27ae60" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Label */}
      <text x="430" y="238" textAnchor="middle" fontSize="12" fontWeight="600" fill="#27ae60">Verified.</text>
      <text x="430" y="253" textAnchor="middle" fontSize="10" fill="#1a1916" opacity=".6">Out-of-band check confirmed.</text>
      {/* Desk */}
      <rect x="40" y="255" width="600" height="1" fill="#c4a882" opacity=".3"/>
    </svg>
  );
}

// E1 / general — security alert / analyst finding
function SecurityAlertScene() {
  return (
    <svg width="100%" viewBox="0 0 680 340" xmlns="http://www.w3.org/2000/svg">
      <rect width="680" height="340" fill="#f5f1eb"/>
      <rect x="40" y="240" width="600" height="12" rx="3" fill="#c4a882" opacity=".5"/>
      {/* Monitor with alert */}
      <rect x="80" y="40" width="420" height="230" rx="7" fill="#faf9f7" stroke="#1a1916" strokeWidth="2.5"/>
      <rect x="88" y="48" width="404" height="214" rx="4" fill="#f8f4ef"/>
      {/* Alert banner */}
      <rect x="88" y="48" width="404" height="36" rx="4" fill="#c0392b"/>
      <text x="290" y="71" textAnchor="middle" fontSize="12" fontWeight="700" fill="white">⚠  STATISTICAL ANOMALY DETECTED</text>
      {/* Report content */}
      <text x="105" y="104" fontSize="10" fontWeight="600" fill="#1a1916">Disaggregated Performance Report — AI Job Matching Tool</text>
      <line x1="100" y1="110" x2="476" y2="110" stroke="#1a1916" strokeWidth=".5" opacity=".3"/>
      {/* Table header */}
      <rect x="100" y="116" width="376" height="18" rx="1" fill="#e8e0d5"/>
      <text x="160" y="128" textAnchor="middle" fontSize="8" fontWeight="600" fill="#1a1916">Group</text>
      <text x="300" y="128" textAnchor="middle" fontSize="8" fontWeight="600" fill="#1a1916">Shortlist Rate</text>
      <text x="420" y="128" textAnchor="middle" fontSize="8" fontWeight="600" fill="#1a1916">vs Baseline</text>
      {/* Rows */}
      {[
        ["Overall",        "34%",  "—",    false],
        ["Group A",        "41%",  "+7pp", false],
        ["Group B",        "38%",  "+4pp", false],
        ["Group C",        "19%",  "−15pp",true ],
        ["Group D",        "17%",  "−17pp",true ],
      ].map(([g, rate, diff, flag], i) => (
        <g key={i}>
          <rect x="100" y={134+i*18} width="376" height="18" rx="1" fill={flag ? "#ffebee" : i%2===0 ? "#faf9f7" : "#f5f1eb"}/>
          <text x="160" y={146+i*18} textAnchor="middle" fontSize="8" fill="#1a1916">{g}</text>
          <text x="300" y={146+i*18} textAnchor="middle" fontSize="8" fill="#1a1916">{rate}</text>
          <text x="420" y={146+i*18} textAnchor="middle" fontSize="8" fill={flag ? "#c0392b" : "#27ae60"} fontWeight={flag ? "700" : "400"}>{diff}</text>
        </g>
      ))}
      {/* p-value note */}
      <text x="105" y="233" fontSize="8" fill="#c0392b" fontStyle="italic">p &lt; 0.001 — statistically significant disparity after controlling for qualifications</text>
      {/* Analyst */}
      <circle cx="580" cy="185" r="22" fill="#faf9f7" stroke="#1a1916" strokeWidth="2.5"/>
      <path d="M560 178 Q565 164 580 162 Q595 164 600 178" fill="#1a1916" opacity=".6"/>
      <ellipse cx="574" cy="189" rx="4" ry="4.5" fill="#1a1916"/>
      <ellipse cx="586" cy="189" rx="4" ry="4.5" fill="#1a1916"/>
      <path d="M573 178 Q577 175 580 177" fill="none" stroke="#1a1916" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M580 176 Q584 174 587 177" fill="none" stroke="#1a1916" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M573 198 Q580 194 587 198" fill="none" stroke="#1a1916" strokeWidth="1.2" strokeLinecap="round"/>
      <ellipse cx="580" cy="212" rx="26" ry="24" fill="#ddd8cc" stroke="#1a1916" strokeWidth="2"/>
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

function OutcomeScreen({ outcome, scenario, persona, onRestart }) {
  const personaData = scenario.personas[persona];
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
              <span className={styles.controlLabel}>{c.label}</span>
              <div className={styles.controlTags}>
                <span className={styles.tag}>{c.owner}</span>
                <span className={styles.tag}>{c.effort} effort</span>
                {c.go_live && <span className={`${styles.tag} ${styles.tagAccent}`}>Go-live</span>}
              </div>
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
          <OutcomeScreen outcome={currentOutcome} scenario={scenario} persona={state.persona}
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