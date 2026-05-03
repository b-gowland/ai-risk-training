// EverydayScenes.jsx
// Inline SVG scenes for the everyday bundle.
// ViewBox: 480x270 (16:9). Dark #0D0D0D backgrounds with pixel grid motif.
// Amber #D97706 accent. No purple references.
// Redesigned May 3, 2026 — AI Risk Practice rebrand.

export function PhoneCallScene() {
  return (
    <svg viewBox="0 0 480 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Incoming call from Mum on a phone screen">
      <rect width="480" height="270" fill="#0D0D0D"/>
      <ellipse cx="240" cy="135" rx="180" ry="100" fill="#D97706" opacity="0.03"/>
      <rect x="155" y="20" width="170" height="230" rx="16" fill="#141414" stroke="#2A2A2A" strokeWidth="1.5"/>
      <rect x="163" y="30" width="154" height="210" rx="10" fill="#0D0D0D"/>
      <rect x="210" y="28" width="60" height="8" rx="4" fill="#1A1A1A"/>
      {[0,1,2,3,4,5,6].map(i => (
        <line key={`h${i}`} x1="163" y1={60+i*28} x2="317" y2={60+i*28} stroke="#ffffff" strokeWidth="0.3" opacity="0.03"/>
      ))}
      <text x="240" y="74" textAnchor="middle" fontSize="10" fill="#666666" fontFamily="'Space Mono', monospace" letterSpacing="0.06em">INCOMING CALL</text>
      <circle cx="240" cy="118" r="34" fill="#1A1200" stroke="#D97706" strokeWidth="1" opacity="0.8"/>
      <text x="240" y="125" textAnchor="middle" fontSize="28" fill="#E8E8E8">👩</text>
      <circle cx="240" cy="118" r="44" fill="none" stroke="#D97706" strokeWidth="0.8" opacity="0.2"/>
      <circle cx="240" cy="118" r="54" fill="none" stroke="#D97706" strokeWidth="0.5" opacity="0.1"/>
      <text x="240" y="170" textAnchor="middle" fontSize="15" fontWeight="600" fill="#E8E8E8" fontFamily="system-ui">Mum</text>
      <text x="240" y="188" textAnchor="middle" fontSize="10" fill="#AAAAAA" fontFamily="'Space Mono', monospace">mobile · 0412 *** ***</text>
      <circle cx="196" cy="220" r="18" fill="#991B1B"/>
      <text x="196" y="226" textAnchor="middle" fontSize="14" fill="#ffffff">✕</text>
      <circle cx="284" cy="220" r="18" fill="#166534"/>
      <text x="284" y="226" textAnchor="middle" fontSize="14" fill="#ffffff">✓</text>
    </svg>
  );
}

export function TransferScene() {
  return (
    <svg viewBox="0 0 480 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Banking app showing a transfer request">
      <rect width="480" height="270" fill="#0D0D0D"/>
      <rect x="155" y="20" width="170" height="230" rx="16" fill="#141414" stroke="#2A2A2A" strokeWidth="1.5"/>
      <rect x="163" y="30" width="154" height="210" rx="10" fill="#0D0D0D"/>
      <rect x="210" y="28" width="60" height="8" rx="4" fill="#1A1A1A"/>
      <text x="240" y="62" textAnchor="middle" fontSize="10" fill="#D97706" fontFamily="'Space Mono', monospace" letterSpacing="0.06em">BANK_APP</text>
      <rect x="173" y="72" width="134" height="1" fill="#1E1E1E"/>
      <text x="240" y="94" textAnchor="middle" fontSize="10" fill="#666666" fontFamily="'Space Mono', monospace">TRANSFER REQUEST</text>
      <rect x="178" y="103" width="124" height="42" rx="3" fill="#1A1200" stroke="#3A2800" strokeWidth="1"/>
      <text x="240" y="120" textAnchor="middle" fontSize="18" fontWeight="700" fill="#D97706" fontFamily="system-ui">$4,200</text>
      <text x="240" y="138" textAnchor="middle" fontSize="9" fill="#D97706" fontFamily="'Space Mono', monospace" opacity="0.7">AUD</text>
      <text x="240" y="163" textAnchor="middle" fontSize="10" fill="#AAAAAA" fontFamily="'Space Mono', monospace">To: Unknown account</text>
      <text x="240" y="178" textAnchor="middle" fontSize="9" fill="#444444" fontFamily="'Space Mono', monospace">BSB 062-000 · ACC 8821-4203</text>
      <rect x="178" y="190" width="124" height="28" rx="2" fill="#991B1B"/>
      <text x="240" y="209" textAnchor="middle" fontSize="11" fontWeight="600" fill="#ffffff" fontFamily="system-ui">CONFIRM TRANSFER</text>
      <text x="240" y="235" textAnchor="middle" fontSize="9" fill="#444444" fontFamily="'Space Mono', monospace">Sent by: Mum</text>
    </svg>
  );
}

export function ChatScene() {
  return (
    <svg viewBox="0 0 480 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Chat conversation with an AI assistant showing a confident but wrong answer">
      <rect width="480" height="270" fill="#0D0D0D"/>
      <rect x="155" y="20" width="170" height="230" rx="16" fill="#141414" stroke="#2A2A2A" strokeWidth="1.5"/>
      <rect x="163" y="30" width="154" height="210" rx="10" fill="#0D0D0D"/>
      <rect x="210" y="28" width="60" height="8" rx="4" fill="#1A1A1A"/>
      <text x="240" y="62" textAnchor="middle" fontSize="10" fill="#D97706" fontFamily="'Space Mono', monospace" letterSpacing="0.06em">AI_CHAT</text>
      <rect x="173" y="70" width="134" height="1" fill="#1E1E1E"/>
      <rect x="178" y="80" width="100" height="44" rx="3" fill="#1A1200" stroke="#2A2A2A" strokeWidth="0.5"/>
      <text x="186" y="96" fontSize="10" fill="#AAAAAA" fontFamily="system-ui">What medication</text>
      <text x="186" y="110" fontSize="10" fill="#AAAAAA" fontFamily="system-ui">interacts with X?</text>
      <text x="186" y="128" fontSize="8" fill="#444444" fontFamily="'Space Mono', monospace">YOU · 2:14pm</text>
      <rect x="183" y="138" width="110" height="56" rx="3" fill="#141414" stroke="#2A2A2A" strokeWidth="0.5"/>
      <text x="191" y="154" fontSize="10" fill="#E8E8E8" fontFamily="system-ui">Absolutely safe</text>
      <text x="191" y="168" fontSize="10" fill="#E8E8E8" fontFamily="system-ui">to combine. No</text>
      <text x="191" y="182" fontSize="10" fill="#E8E8E8" fontFamily="system-ui">interactions.</text>
      <text x="191" y="196" fontSize="8" fill="#D97706" fontFamily="'Space Mono', monospace" opacity="0.8">AI · 2:14pm</text>
      <rect x="178" y="206" width="124" height="22" rx="2" fill="#1A1A1A" stroke="#1E1E1E" strokeWidth="0.5"/>
      <text x="190" y="221" fontSize="10" fill="#444444" fontFamily="system-ui">Reply...</text>
      <text x="287" y="222" fontSize="12" fill="#D97706" fontFamily="system-ui">↑</text>
      <rect x="270" y="74" width="14" height="14" rx="7" fill="#D97706" opacity="0.15"/>
      <text x="277" y="84" textAnchor="middle" fontSize="9" fill="#D97706">!</text>
    </svg>
  );
}

export function HiringScene() {
  return (
    <svg viewBox="0 0 480 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Hiring platform dashboard showing AI screening results">
      <rect width="480" height="270" fill="#0D0D0D"/>
      <rect x="60" y="30" width="360" height="210" rx="4" fill="#141414" stroke="#1E1E1E" strokeWidth="1"/>
      <rect x="60" y="30" width="360" height="36" rx="4" fill="#0D0D0D" stroke="#1E1E1E" strokeWidth="1"/>
      <rect x="60" y="54" width="360" height="12" fill="#0D0D0D"/>
      <text x="80" y="54" fontSize="10" fill="#D97706" fontFamily="'Space Mono', monospace" letterSpacing="0.06em">HIRING_PLATFORM · AI SCREENING</text>
      <rect x="80" y="76" width="320" height="1" fill="#1E1E1E"/>
      {[
        { name: 'Jordan M.', score: 94, bar: 280, col: '#D97706' },
        { name: 'Alex T.',   score: 91, bar: 268, col: '#D97706' },
        { name: 'Sam K.',    score: 43, bar: 128, col: '#444444' },
        { name: 'Riley P.',  score: 38, bar: 112, col: '#444444' },
      ].map((c, i) => (
        <g key={i}>
          <text x="80" y={100+i*36} fontSize="11" fill="#AAAAAA" fontFamily="system-ui">{c.name}</text>
          <rect x="180" y={88+i*36} width={c.bar} height="14" rx="1" fill={c.col} opacity="0.2"/>
          <rect x="180" y={88+i*36} width={c.bar * 0.4} height="14" rx="1" fill={c.col} opacity="0.6"/>
          <text x="488" y={100+i*36} textAnchor="end" fontSize="11" fill={c.col} fontFamily="'Space Mono', monospace" fontWeight="700">{c.score}</text>
        </g>
      ))}
      <rect x="80" y="228" width="320" height="1" fill="#1E1E1E"/>
      <text x="80" y="246" fontSize="9" fill="#444444" fontFamily="'Space Mono', monospace">AI_SCREEN v2.1 · 847 applicants processed</text>
      <rect x="330" y="234" width="50" height="16" rx="2" fill="#1A1200" stroke="#3A2800" strokeWidth="1"/>
      <text x="355" y="246" textAnchor="middle" fontSize="9" fill="#D97706" fontFamily="'Space Mono', monospace">EXPORT</text>
    </svg>
  );
}

export function getEverydayScene(scenarioId, nodeId) {
  if (scenarioId === 'everyday-p1-deepfake-voice') {
    if (nodeId === 'transfer_request') return <TransferScene />;
    return <PhoneCallScene />;
  }
  if (scenarioId === 'everyday-p2-hallucination') {
    return <ChatScene />;
  }
  if (scenarioId === 'everyday-p3-employment-screening') {
    return <HiringScene />;
  }
  return <PhoneCallScene />;
}
