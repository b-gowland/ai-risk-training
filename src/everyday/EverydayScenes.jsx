// EverydayScenes.jsx
// Inline SVG scenes for the everyday bundle.
// ViewBox: 480x270 (16:9). Dark #0D0D0D backgrounds with pixel grid motif.
// Amber #D97706 accent. No purple references.
// Redesigned May 3, 2026 — AI Risk Practice rebrand.
// Updated May 16, 2026 — fixed scene-key dispatcher; added missing scene components.

// ── Existing scenes ──────────────────────────────────────────────

export function PhoneCallScene() {
  return (
    <svg viewBox="0 0 480 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Incoming call from Mum on a phone screen">
      <rect width="480" height="270" fill="#0D0D0D"/>
      <ellipse cx="240" cy="135" rx="180" ry="100" fill="#D97706" opacity="0.03"/>
      <rect x="155" y="20" width="170" height="230" rx="16" fill="#141414" stroke="#2A2A2A" strokeWidth="1.5"/>
      <rect x="163" y="30" width="154" height="210" rx="10" fill="#0D0D0D"/>
      <rect x="210" y="28" width="60" height="8" rx="4" fill="#1A1A1A"/>
      <text x="240" y="74" textAnchor="middle" fontSize="10" fill="#666666" fontFamily="'Space Mono', monospace" letterSpacing="0.06em">INCOMING CALL</text>
      <circle cx="240" cy="118" r="34" fill="#1A1200" stroke="#D97706" strokeWidth="1" opacity="0.8"/>
      <text x="240" y="125" textAnchor="middle" fontSize="28" fill="#E8E8E8">&#x1F469;</text>
      <circle cx="240" cy="118" r="44" fill="none" stroke="#D97706" strokeWidth="0.8" opacity="0.2"/>
      <circle cx="240" cy="118" r="54" fill="none" stroke="#D97706" strokeWidth="0.5" opacity="0.1"/>
      <text x="240" y="170" textAnchor="middle" fontSize="15" fontWeight="600" fill="#E8E8E8" fontFamily="system-ui">Mum</text>
      <text x="240" y="188" textAnchor="middle" fontSize="10" fill="#AAAAAA" fontFamily="'Space Mono', monospace">mobile · 0412 *** ***</text>
      <circle cx="196" cy="220" r="18" fill="#991B1B"/>
      <text x="196" y="226" textAnchor="middle" fontSize="14" fill="#ffffff">&#x2715;</text>
      <circle cx="284" cy="220" r="18" fill="#166534"/>
      <text x="284" y="226" textAnchor="middle" fontSize="14" fill="#ffffff">&#x2713;</text>
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
      <text x="287" y="222" fontSize="12" fill="#D97706" fontFamily="system-ui">&#x2191;</text>
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
      <g>
        <text x="80" y="100" fontSize="11" fill="#AAAAAA" fontFamily="system-ui">Jordan M.</text>
        <rect x="180" y="88" width="280" height="14" rx="1" fill="#D97706" opacity="0.2"/>
        <rect x="180" y="88" width="112" height="14" rx="1" fill="#D97706" opacity="0.6"/>
        <text x="396" y="100" textAnchor="end" fontSize="11" fill="#D97706" fontFamily="'Space Mono', monospace" fontWeight="700">94</text>
      </g>
      <g>
        <text x="80" y="136" fontSize="11" fill="#AAAAAA" fontFamily="system-ui">Alex T.</text>
        <rect x="180" y="124" width="204" height="14" rx="1" fill="#D97706" opacity="0.2"/>
        <rect x="180" y="124" width="81" height="14" rx="1" fill="#D97706" opacity="0.6"/>
        <text x="396" y="136" textAnchor="end" fontSize="11" fill="#D97706" fontFamily="'Space Mono', monospace" fontWeight="700">91</text>
      </g>
      <g>
        <text x="80" y="172" fontSize="11" fill="#AAAAAA" fontFamily="system-ui">Sam K.</text>
        <rect x="180" y="160" width="100" height="14" rx="1" fill="#444444" opacity="0.2"/>
        <rect x="180" y="160" width="40" height="14" rx="1" fill="#444444" opacity="0.6"/>
        <text x="396" y="172" textAnchor="end" fontSize="11" fill="#444444" fontFamily="'Space Mono', monospace" fontWeight="700">43</text>
      </g>
      <g>
        <text x="80" y="208" fontSize="11" fill="#AAAAAA" fontFamily="system-ui">Riley P.</text>
        <rect x="180" y="196" width="88" height="14" rx="1" fill="#444444" opacity="0.2"/>
        <rect x="180" y="196" width="35" height="14" rx="1" fill="#444444" opacity="0.6"/>
        <text x="396" y="208" textAnchor="end" fontSize="11" fill="#444444" fontFamily="'Space Mono', monospace" fontWeight="700">38</text>
      </g>
      <rect x="80" y="228" width="320" height="1" fill="#1E1E1E"/>
      <text x="80" y="246" fontSize="9" fill="#444444" fontFamily="'Space Mono', monospace">AI_SCREEN v2.1 · 847 applicants processed</text>
      <rect x="330" y="234" width="50" height="16" rx="2" fill="#1A1200" stroke="#3A2800" strokeWidth="1"/>
      <text x="355" y="246" textAnchor="middle" fontSize="9" fill="#D97706" fontFamily="'Space Mono', monospace">EXPORT</text>
    </svg>
  );
}

// ── New scenes (May 16, 2026) ─────────────────────────────────────

export function PaymentSentScene() {
  return (
    <svg viewBox="0 0 480 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Banking app showing transfer confirmed, money sent">
      <rect width="480" height="270" fill="#0D0D0D"/>
      <rect x="155" y="20" width="170" height="230" rx="16" fill="#141414" stroke="#2A2A2A" strokeWidth="1.5"/>
      <rect x="163" y="30" width="154" height="210" rx="10" fill="#0D0D0D"/>
      <rect x="210" y="28" width="60" height="8" rx="4" fill="#1A1A1A"/>
      <text x="240" y="62" textAnchor="middle" fontSize="10" fill="#D97706" fontFamily="'Space Mono', monospace" letterSpacing="0.06em">BANK_APP</text>
      <rect x="173" y="72" width="134" height="1" fill="#1E1E1E"/>
      <circle cx="240" cy="108" r="22" fill="#0A1F12" stroke="#166534" strokeWidth="1"/>
      <text x="240" y="116" textAnchor="middle" fontSize="20" fill="#166534">&#x2713;</text>
      <text x="240" y="146" textAnchor="middle" fontSize="11" fontWeight="600" fill="#E8E8E8" fontFamily="system-ui">Transfer sent</text>
      <text x="240" y="168" textAnchor="middle" fontSize="18" fontWeight="700" fill="#D97706" fontFamily="system-ui">$4,200</text>
      <text x="240" y="190" textAnchor="middle" fontSize="9" fill="#666666" fontFamily="'Space Mono', monospace">To: Unknown account</text>
      <text x="240" y="206" textAnchor="middle" fontSize="9" fill="#444444" fontFamily="'Space Mono', monospace">BSB 062-000 · ACC 8821-4203</text>
      <rect x="173" y="218" width="134" height="1" fill="#1E1E1E"/>
      <text x="240" y="236" textAnchor="middle" fontSize="9" fill="#333333" fontFamily="'Space Mono', monospace">Ref: MUM_EMERGENCY</text>
    </svg>
  );
}

export function CallSafeScene() {
  return (
    <svg viewBox="0 0 480 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Phone showing a call ended safely after verification">
      <rect width="480" height="270" fill="#0D0D0D"/>
      <ellipse cx="240" cy="135" rx="180" ry="100" fill="#166534" opacity="0.03"/>
      <rect x="155" y="20" width="170" height="230" rx="16" fill="#141414" stroke="#2A2A2A" strokeWidth="1.5"/>
      <rect x="163" y="30" width="154" height="210" rx="10" fill="#0D0D0D"/>
      <rect x="210" y="28" width="60" height="8" rx="4" fill="#1A1A1A"/>
      <text x="240" y="74" textAnchor="middle" fontSize="10" fill="#166534" fontFamily="'Space Mono', monospace" letterSpacing="0.06em">CALL ENDED</text>
      <circle cx="240" cy="124" r="34" fill="#0A1F12" stroke="#166534" strokeWidth="1"/>
      <text x="240" y="131" textAnchor="middle" fontSize="28" fill="#E8E8E8">&#x1F469;</text>
      <text x="240" y="174" textAnchor="middle" fontSize="13" fontWeight="600" fill="#E8E8E8" fontFamily="system-ui">Mum · 0:42</text>
      <text x="240" y="194" textAnchor="middle" fontSize="9" fill="#166534" fontFamily="'Space Mono', monospace" letterSpacing="0.04em">CALL BACK CONFIRMED</text>
      <rect x="178" y="210" width="124" height="22" rx="11" fill="#0A1F12" stroke="#166534" strokeWidth="1"/>
      <text x="240" y="225" textAnchor="middle" fontSize="10" fill="#166534" fontFamily="system-ui">It wasn&apos;t her.</text>
    </svg>
  );
}

export function PhoneIncomingScene() {
  return (
    <svg viewBox="0 0 480 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Phone ringing with an incoming call from an unknown number">
      <rect width="480" height="270" fill="#0D0D0D"/>
      <ellipse cx="240" cy="135" rx="180" ry="100" fill="#D97706" opacity="0.02"/>
      <rect x="155" y="20" width="170" height="230" rx="16" fill="#141414" stroke="#2A2A2A" strokeWidth="1.5"/>
      <rect x="163" y="30" width="154" height="210" rx="10" fill="#0D0D0D"/>
      <rect x="210" y="28" width="60" height="8" rx="4" fill="#1A1A1A"/>
      <text x="240" y="74" textAnchor="middle" fontSize="10" fill="#666666" fontFamily="'Space Mono', monospace" letterSpacing="0.06em">INCOMING CALL</text>
      <circle cx="240" cy="118" r="34" fill="#141414" stroke="#333333" strokeWidth="1"/>
      <text x="240" y="126" textAnchor="middle" fontSize="26" fill="#666666">?</text>
      <circle cx="240" cy="118" r="44" fill="none" stroke="#333333" strokeWidth="0.8" opacity="0.5"/>
      <circle cx="240" cy="118" r="54" fill="none" stroke="#2A2A2A" strokeWidth="0.5" opacity="0.3"/>
      <text x="240" y="170" textAnchor="middle" fontSize="13" fontWeight="600" fill="#888888" fontFamily="system-ui">Unknown caller</text>
      <text x="240" y="188" textAnchor="middle" fontSize="10" fill="#444444" fontFamily="'Space Mono', monospace">+61 4** *** ***</text>
      <circle cx="196" cy="220" r="18" fill="#991B1B"/>
      <text x="196" y="226" textAnchor="middle" fontSize="14" fill="#ffffff">&#x2715;</text>
      <circle cx="284" cy="220" r="18" fill="#166534"/>
      <text x="284" y="226" textAnchor="middle" fontSize="14" fill="#ffffff">&#x2713;</text>
    </svg>
  );
}

export function PhoneSearchScene() {
  return (
    <svg viewBox="0 0 480 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Phone showing search results for a medical query">
      <rect width="480" height="270" fill="#0D0D0D"/>
      <rect x="155" y="20" width="170" height="230" rx="16" fill="#141414" stroke="#2A2A2A" strokeWidth="1.5"/>
      <rect x="163" y="30" width="154" height="210" rx="10" fill="#0D0D0D"/>
      <rect x="210" y="28" width="60" height="8" rx="4" fill="#1A1A1A"/>
      <rect x="173" y="46" width="134" height="20" rx="10" fill="#1A1A1A" stroke="#2A2A2A" strokeWidth="0.5"/>
      <text x="192" y="60" fontSize="9" fill="#666666" fontFamily="system-ui">drug interaction search</text>
      <text x="294" y="61" fontSize="13" fill="#D97706" fontFamily="system-ui">&#x2315;</text>
      <rect x="173" y="74" width="134" height="1" fill="#1E1E1E"/>
      <rect x="173" y="82" width="134" height="38" rx="2" fill="#141414" stroke="#1E1E1E" strokeWidth="0.5"/>
      <rect x="179" y="88" width="80" height="7" rx="1" fill="#D97706" opacity="0.5"/>
      <rect x="179" y="100" width="118" height="5" rx="1" fill="#2A2A2A"/>
      <rect x="179" y="108" width="90" height="5" rx="1" fill="#2A2A2A"/>
      <rect x="173" y="126" width="134" height="38" rx="2" fill="#141414" stroke="#1E1E1E" strokeWidth="0.5"/>
      <rect x="179" y="132" width="60" height="7" rx="1" fill="#D97706" opacity="0.35"/>
      <rect x="179" y="144" width="118" height="5" rx="1" fill="#2A2A2A"/>
      <rect x="179" y="152" width="70" height="5" rx="1" fill="#2A2A2A"/>
      <rect x="173" y="170" width="134" height="38" rx="2" fill="#141414" stroke="#1E1E1E" strokeWidth="0.5"/>
      <rect x="179" y="176" width="70" height="7" rx="1" fill="#D97706" opacity="0.25"/>
      <rect x="179" y="188" width="118" height="5" rx="1" fill="#2A2A2A"/>
      <rect x="179" y="196" width="80" height="5" rx="1" fill="#2A2A2A"/>
      <text x="240" y="228" textAnchor="middle" fontSize="8" fill="#333333" fontFamily="'Space Mono', monospace">~4,200,000 results</text>
    </svg>
  );
}

export function BorderCrossingScene() {
  return (
    <svg viewBox="0 0 480 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Phone showing travel document and border crossing information">
      <rect width="480" height="270" fill="#0D0D0D"/>
      <rect x="155" y="20" width="170" height="230" rx="16" fill="#141414" stroke="#2A2A2A" strokeWidth="1.5"/>
      <rect x="163" y="30" width="154" height="210" rx="10" fill="#0D0D0D"/>
      <rect x="210" y="28" width="60" height="8" rx="4" fill="#1A1A1A"/>
      <text x="240" y="58" textAnchor="middle" fontSize="9" fill="#D97706" fontFamily="'Space Mono', monospace" letterSpacing="0.05em">TRAVEL · DOCS</text>
      <rect x="173" y="66" width="134" height="1" fill="#1E1E1E"/>
      <rect x="179" y="74" width="122" height="72" rx="3" fill="#0A1A2A" stroke="#1E3A5A" strokeWidth="1"/>
      <rect x="185" y="80" width="34" height="46" rx="2" fill="#1E3A5A"/>
      <text x="202" y="108" textAnchor="middle" fontSize="22" fill="#888888">&#x1F6C2;</text>
      <rect x="226" y="84" width="70" height="8" rx="1" fill="#2A4A6A"/>
      <rect x="226" y="96" width="52" height="5" rx="1" fill="#1E3A5A"/>
      <rect x="226" y="106" width="62" height="5" rx="1" fill="#1E3A5A"/>
      <rect x="226" y="116" width="40" height="5" rx="1" fill="#1E3A5A"/>
      <rect x="173" y="154" width="134" height="1" fill="#1E1E1E"/>
      <text x="240" y="172" textAnchor="middle" fontSize="9" fill="#666666" fontFamily="'Space Mono', monospace">ENTRY REQUIREMENTS</text>
      <rect x="179" y="180" width="122" height="14" rx="2" fill="#141414" stroke="#1E1E1E" strokeWidth="0.5"/>
      <rect x="185" y="185" width="80" height="4" rx="1" fill="#2A2A2A"/>
      <rect x="179" y="198" width="122" height="14" rx="2" fill="#141414" stroke="#1E1E1E" strokeWidth="0.5"/>
      <rect x="185" y="203" width="60" height="4" rx="1" fill="#2A2A2A"/>
      <rect x="179" y="216" width="122" height="14" rx="2" fill="#141414" stroke="#1E1E1E" strokeWidth="0.5"/>
      <rect x="185" y="221" width="90" height="4" rx="1" fill="#2A2A2A"/>
    </svg>
  );
}

export function DeskReviewScene() {
  return (
    <svg viewBox="0 0 480 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Office desk with document open for review on screen">
      <rect width="480" height="270" fill="#0D0D0D"/>
      <rect x="20" y="200" width="440" height="70" fill="#111111"/>
      <rect x="60" y="20" width="360" height="200" rx="4" fill="#141414" stroke="#1E1E1E" strokeWidth="1"/>
      <rect x="60" y="20" width="360" height="28" rx="4" fill="#0D0D0D"/>
      <rect x="60" y="36" width="360" height="12" fill="#0D0D0D"/>
      <text x="80" y="38" fontSize="9" fill="#444444" fontFamily="'Space Mono', monospace" letterSpacing="0.05em">DOCUMENT · REVIEW</text>
      <rect x="80" y="56" width="320" height="1" fill="#1E1E1E"/>
      <rect x="80" y="64" width="180" height="9" rx="1" fill="#2A2A2A"/>
      <rect x="80" y="78" width="220" height="6" rx="1" fill="#1E1E1E"/>
      <rect x="80" y="90" width="200" height="6" rx="1" fill="#1E1E1E"/>
      <rect x="80" y="106" width="180" height="9" rx="1" fill="#2A2A2A"/>
      <rect x="80" y="120" width="240" height="6" rx="1" fill="#1E1E1E"/>
      <rect x="80" y="132" width="200" height="6" rx="1" fill="#1E1E1E"/>
      <rect x="80" y="144" width="170" height="6" rx="1" fill="#1E1E1E"/>
      <rect x="80" y="160" width="180" height="9" rx="1" fill="#2A2A2A"/>
      <rect x="80" y="174" width="220" height="6" rx="1" fill="#1E1E1E"/>
      <rect x="300" y="64" width="80" height="120" rx="2" fill="#0D0D0D" stroke="#1E1E1E" strokeWidth="0.5"/>
      <rect x="306" y="70" width="68" height="16" rx="1" fill="#1A1200" stroke="#3A2800" strokeWidth="0.5"/>
      <text x="340" y="82" textAnchor="middle" fontSize="8" fill="#D97706" fontFamily="'Space Mono', monospace">APPROVE</text>
      <rect x="306" y="92" width="68" height="16" rx="1" fill="#1A1A1A"/>
      <rect x="306" y="114" width="68" height="16" rx="1" fill="#1A1A1A"/>
      <rect x="160" y="214" width="160" height="20" rx="2" fill="#141414" stroke="#1E1E1E" strokeWidth="0.5"/>
      <rect x="168" y="220" width="60" height="8" rx="1" fill="#1E1E1E"/>
      <rect x="236" y="220" width="60" height="8" rx="1" fill="#1E1E1E"/>
    </svg>
  );
}

export function PdsOpenScene() {
  return (
    <svg viewBox="0 0 480 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Long legal product disclosure document open on screen">
      <rect width="480" height="270" fill="#0D0D0D"/>
      <rect x="20" y="200" width="440" height="70" fill="#111111"/>
      <rect x="80" y="10" width="320" height="220" rx="4" fill="#141414" stroke="#1E1E1E" strokeWidth="1"/>
      <rect x="80" y="10" width="320" height="30" rx="4" fill="#0D0D0D"/>
      <rect x="80" y="28" width="320" height="12" fill="#0D0D0D"/>
      <text x="100" y="30" fontSize="9" fill="#444444" fontFamily="'Space Mono', monospace" letterSpacing="0.04em">PRODUCT DISCLOSURE STATEMENT</text>
      <rect x="96" y="48" width="140" height="10" rx="1" fill="#2A2A2A"/>
      <rect x="96" y="48" width="44" height="10" rx="1" fill="#D97706" opacity="0.3"/>
      <rect x="100" y="66" width="288" height="1" fill="#1E1E1E"/>
      <rect x="100" y="74" width="200" height="8" rx="1" fill="#2A2A2A"/>
      <rect x="100" y="86" width="270" height="5" rx="1" fill="#1E1E1E"/>
      <rect x="100" y="94" width="240" height="5" rx="1" fill="#1E1E1E"/>
      <rect x="100" y="102" width="260" height="5" rx="1" fill="#1E1E1E"/>
      <rect x="100" y="116" width="180" height="8" rx="1" fill="#2A2A2A"/>
      <rect x="100" y="128" width="270" height="5" rx="1" fill="#1E1E1E"/>
      <rect x="100" y="136" width="200" height="5" rx="1" fill="#1E1E1E"/>
      <rect x="100" y="150" width="160" height="8" rx="1" fill="#2A2A2A"/>
      <rect x="100" y="162" width="270" height="5" rx="1" fill="#1E1E1E"/>
      <rect x="100" y="170" width="230" height="5" rx="1" fill="#1E1E1E"/>
      <rect x="100" y="178" width="250" height="5" rx="1" fill="#1E1E1E"/>
      <rect x="374" y="48" width="10" height="180" rx="2" fill="#1A1A1A"/>
      <rect x="374" y="48" width="10" height="24" rx="2" fill="#D97706" opacity="0.35"/>
      <text x="240" y="242" textAnchor="middle" fontSize="8" fill="#333333" fontFamily="'Space Mono', monospace">Page 1 of 47</text>
    </svg>
  );
}

export function RejectionEmailScene() {
  return (
    <svg viewBox="0 0 480 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Email inbox showing an application rejection notification">
      <rect width="480" height="270" fill="#0D0D0D"/>
      <rect x="60" y="20" width="360" height="230" rx="4" fill="#141414" stroke="#1E1E1E" strokeWidth="1"/>
      <rect x="60" y="20" width="360" height="32" rx="4" fill="#0D0D0D"/>
      <rect x="60" y="40" width="360" height="12" fill="#0D0D0D"/>
      <text x="80" y="42" fontSize="9" fill="#444444" fontFamily="'Space Mono', monospace" letterSpacing="0.05em">INBOX · 1 new</text>
      <rect x="80" y="60" width="320" height="1" fill="#1E1E1E"/>
      <rect x="76" y="62" width="4" height="60" rx="1" fill="#D97706" opacity="0.8"/>
      <rect x="80" y="62" width="320" height="60" fill="#1A1200" opacity="0.25"/>
      <text x="100" y="82" fontSize="11" fontWeight="600" fill="#E8E8E8" fontFamily="system-ui">Re: Your application</text>
      <text x="100" y="98" fontSize="10" fill="#888888" fontFamily="system-ui">careers@company.com</text>
      <rect x="100" y="108" width="180" height="7" rx="1" fill="#2A2A2A"/>
      <rect x="100" y="118" width="120" height="5" rx="1" fill="#1E1E1E"/>
      <rect x="80" y="130" width="320" height="1" fill="#1E1E1E"/>
      <rect x="80" y="138" width="320" height="24" fill="#141414"/>
      <rect x="100" y="146" width="160" height="7" rx="1" fill="#1E1E1E"/>
      <text x="368" y="153" fontSize="9" fill="#333333" fontFamily="'Space Mono', monospace">2d</text>
      <rect x="80" y="168" width="320" height="1" fill="#111111"/>
      <rect x="80" y="170" width="320" height="24" fill="#141414"/>
      <rect x="100" y="178" width="180" height="7" rx="1" fill="#1E1E1E"/>
      <text x="368" y="185" fontSize="9" fill="#333333" fontFamily="'Space Mono', monospace">5d</text>
      <rect x="80" y="200" width="320" height="1" fill="#111111"/>
      <rect x="80" y="202" width="320" height="24" fill="#141414"/>
      <rect x="100" y="210" width="140" height="7" rx="1" fill="#1E1E1E"/>
      <text x="368" y="217" fontSize="9" fill="#333333" fontFamily="'Space Mono', monospace">1w</text>
    </svg>
  );
}

export function EmailSentScene() {
  return (
    <svg viewBox="0 0 480 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Email compose window showing message sent confirmation">
      <rect width="480" height="270" fill="#0D0D0D"/>
      <rect x="60" y="20" width="360" height="230" rx="4" fill="#141414" stroke="#1E1E1E" strokeWidth="1"/>
      <rect x="60" y="20" width="360" height="32" rx="4" fill="#0D0D0D"/>
      <rect x="60" y="40" width="360" height="12" fill="#0D0D0D"/>
      <text x="80" y="42" fontSize="9" fill="#444444" fontFamily="'Space Mono', monospace" letterSpacing="0.05em">COMPOSE · SENT</text>
      <rect x="80" y="60" width="320" height="1" fill="#1E1E1E"/>
      <circle cx="240" cy="120" r="28" fill="#0A1F12" stroke="#166534" strokeWidth="1"/>
      <text x="240" y="129" textAnchor="middle" fontSize="24" fill="#166534">&#x2713;</text>
      <text x="240" y="168" textAnchor="middle" fontSize="13" fontWeight="600" fill="#E8E8E8" fontFamily="system-ui">Message sent</text>
      <rect x="140" y="182" width="200" height="7" rx="1" fill="#1E1E1E"/>
      <rect x="160" y="194" width="160" height="5" rx="1" fill="#1A1A1A"/>
      <rect x="80" y="216" width="320" height="1" fill="#1E1E1E"/>
      <text x="240" y="236" textAnchor="middle" fontSize="9" fill="#333333" fontFamily="'Space Mono', monospace">To: hiring@company.com</text>
    </svg>
  );
}

export function DeskCasualScene() {
  return (
    <svg viewBox="0 0 480 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Laptop on a regular office desk with a casual browsing session">
      <rect width="480" height="270" fill="#0D0D0D"/>
      <rect x="20" y="190" width="440" height="80" fill="#111111"/>
      <rect x="30" y="40" width="60" height="140" rx="2" fill="#0D0D0D" stroke="#141414" strokeWidth="0.5" opacity="0.5"/>
      <rect x="390" y="40" width="60" height="140" rx="2" fill="#0D0D0D" stroke="#141414" strokeWidth="0.5" opacity="0.5"/>
      <rect x="110" y="100" width="260" height="170" rx="4" fill="#141414" stroke="#1E1E1E" strokeWidth="1"/>
      <rect x="110" y="100" width="260" height="8" rx="2" fill="#0D0D0D"/>
      <rect x="120" y="112" width="240" height="148" rx="2" fill="#0D0D0D"/>
      <rect x="128" y="120" width="224" height="8" rx="1" fill="#1A1A1A"/>
      <rect x="128" y="132" width="224" height="50" rx="1" fill="#141414"/>
      <rect x="134" y="138" width="100" height="7" rx="1" fill="#D97706" opacity="0.3"/>
      <rect x="134" y="150" width="200" height="5" rx="1" fill="#1E1E1E"/>
      <rect x="134" y="160" width="170" height="5" rx="1" fill="#1E1E1E"/>
      <rect x="128" y="188" width="100" height="10" rx="1" fill="#1A1A1A"/>
      <rect x="234" y="188" width="118" height="10" rx="1" fill="#1A1A1A"/>
      <rect x="128" y="204" width="224" height="40" rx="1" fill="#1A1A1A" opacity="0.5"/>
      <rect x="330" y="200" width="24" height="24" rx="12" fill="#141414" stroke="#1E1E1E" strokeWidth="1"/>
      <text x="342" y="216" textAnchor="middle" fontSize="12" fill="#444444">&#x2615;</text>
    </svg>
  );
}

export function OfficeBriefingScene() {
  return (
    <svg viewBox="0 0 480 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Meeting room with people gathered around a presentation screen">
      <rect width="480" height="270" fill="#0D0D0D"/>
      <rect x="0" y="0" width="480" height="270" fill="#0D0D0D"/>
      <rect x="30" y="180" width="420" height="90" fill="#111111"/>
      <rect x="60" y="40" width="360" height="24" rx="2" fill="#141414" stroke="#1E1E1E" strokeWidth="1"/>
      <rect x="80" y="46" width="100" height="8" rx="1" fill="#D97706" opacity="0.3"/>
      <rect x="188" y="46" width="220" height="8" rx="1" fill="#1E1E1E"/>
      <rect x="60" y="70" width="360" height="110" rx="2" fill="#141414" stroke="#1E1E1E" strokeWidth="1"/>
      <rect x="70" y="78" width="340" height="94" rx="1" fill="#0D0D0D"/>
      <rect x="80" y="86" width="140" height="10" rx="1" fill="#2A2A2A"/>
      <rect x="80" y="100" width="320" height="6" rx="1" fill="#1E1E1E"/>
      <rect x="80" y="110" width="300" height="6" rx="1" fill="#1E1E1E"/>
      <rect x="80" y="120" width="280" height="6" rx="1" fill="#1E1E1E"/>
      <rect x="80" y="136" width="320" height="20" rx="1" fill="#1A1200" opacity="0.4"/>
      <rect x="80" y="136" width="100" height="20" rx="1" fill="#D97706" opacity="0.15"/>
      <rect x="80" y="162" width="320" height="1" fill="#1E1E1E"/>
      <rect x="160" y="190" width="160" height="20" rx="2" fill="#141414" stroke="#1E1E1E" strokeWidth="0.5"/>
      <rect x="168" y="196" width="60" height="8" rx="1" fill="#1E1E1E"/>
      <rect x="236" y="196" width="60" height="8" rx="1" fill="#1E1E1E"/>
    </svg>
  );
}


export function DeskColleagueScene() {
  return (
    <svg viewBox="0 0 480 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Two people talking at a desk — sharing what happened">
      <rect width="480" height="270" fill="#0D0D0D"/>
      <rect x="20" y="190" width="440" height="80" fill="#111111"/>
      {/* Left monitor */}
      <rect x="40" y="50" width="180" height="130" rx="4" fill="#141414" stroke="#1E1E1E" strokeWidth="1"/>
      <rect x="48" y="58" width="164" height="114" rx="2" fill="#0D0D0D"/>
      <rect x="56" y="66" width="100" height="8" rx="1" fill="#2A2A2A"/>
      <rect x="56" y="80" width="148" height="5" rx="1" fill="#1E1E1E"/>
      <rect x="56" y="90" width="120" height="5" rx="1" fill="#1E1E1E"/>
      <rect x="56" y="104" width="100" height="8" rx="1" fill="#2A2A2A"/>
      <rect x="56" y="118" width="140" height="5" rx="1" fill="#1E1E1E"/>
      <rect x="56" y="128" width="110" height="5" rx="1" fill="#1E1E1E"/>
      {/* Right monitor */}
      <rect x="260" y="50" width="180" height="130" rx="4" fill="#141414" stroke="#1E1E1E" strokeWidth="1"/>
      <rect x="268" y="58" width="164" height="114" rx="2" fill="#0D0D0D"/>
      <rect x="276" y="66" width="100" height="8" rx="1" fill="#1A1200"/>
      <rect x="276" y="80" width="148" height="5" rx="1" fill="#1E1E1E"/>
      <rect x="276" y="90" width="130" height="5" rx="1" fill="#1E1E1E"/>
      <rect x="276" y="104" width="80" height="8" rx="1" fill="#D97706" opacity="0.25"/>
      <rect x="276" y="118" width="148" height="5" rx="1" fill="#1E1E1E"/>
      <rect x="276" y="128" width="100" height="5" rx="1" fill="#1E1E1E"/>
      {/* Speech bubble — conversation indicator */}
      <ellipse cx="240" cy="60" rx="28" ry="16" fill="#1A1200" stroke="#3A2800" strokeWidth="1"/>
      <text x="240" y="65" textAnchor="middle" fontSize="16" fill="#D97706">&#x1F4AC;</text>
      {/* Desk surface */}
      <rect x="20" y="190" width="440" height="6" fill="#1A1A1A"/>
    </svg>
  );
}

// ── Scene key dispatcher ─────────────────────────────────────────
// Dispatches by node.scene key — the string set on each scenario node.
// EverydayPlayer passes (scenarioId, sceneKey) where sceneKey = node.scene.
// Fallback per scenario if scene key is missing or unrecognised.

const SCENE_MAP = {
  'phone-call':      <PhoneCallScene />,
  'phone-incoming':  <PhoneIncomingScene />,
  'phone-verify':    <PhoneCallScene />,
  'phone-search':    <PhoneSearchScene />,
  'call-safe':       <CallSafeScene />,
  'payment-sent':    <PaymentSentScene />,
  'payment-screen':  <TransferScene />,
  'transfer':        <TransferScene />,
  'border-crossing': <BorderCrossingScene />,
  'pds-open':        <PdsOpenScene />,
  'desk-review':     <DeskReviewScene />,
  'desk-casual':     <DeskCasualScene />,
  'desk-colleague':  <DeskColleagueScene />,
  'rejection-email': <RejectionEmailScene />,
  'email-sent':      <EmailSentScene />,
  'office-briefing': <OfficeBriefingScene />,
  'hiring':          <HiringScene />,
};

const FALLBACK = {
  'everyday-p1-deepfake-voice':        <PhoneCallScene />,
  'everyday-p2-hallucination':         <PhoneSearchScene />,
  'everyday-p3-employment-screening':  <RejectionEmailScene />,
};

export function getEverydayScene(scenarioId, sceneKey) {
  return SCENE_MAP[sceneKey] || FALLBACK[scenarioId] || <PhoneCallScene />;
}
