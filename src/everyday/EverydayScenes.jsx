// EverydayScenes.jsx
// Inline SVG scenes for the everyday bundle.
// ViewBox: 480x270 (16:9 portrait-first). Dark --ev-bg backgrounds.
// Phone frame is the primary motif. Flat, minimal, no external assets.

export function PhoneCallScene() {
  return (
    <svg viewBox="0 0 480 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Incoming call from Mum on a phone screen">
      {/* Background */}
      <rect width="480" height="270" fill="#0f0a1e"/>
      {/* Ambient glow */}
      <ellipse cx="240" cy="135" rx="180" ry="100" fill="#7c3aed" opacity="0.06"/>
      {/* Phone frame */}
      <rect x="155" y="20" width="170" height="230" rx="20" fill="#1a1035" stroke="#3d2080" strokeWidth="2"/>
      <rect x="163" y="30" width="154" height="210" rx="14" fill="#0d0820"/>
      {/* Notch */}
      <rect x="210" y="28" width="60" height="10" rx="5" fill="#1a1035"/>
      {/* Wallpaper subtle grid */}
      {[0,1,2,3,4,5,6].map(i => (
        <line key={`h${i}`} x1="163" y1={60+i*28} x2="317" y2={60+i*28} stroke="#ffffff" strokeWidth="0.3" opacity="0.04"/>
      ))}
      {/* Incoming call UI */}
      <text x="240" y="75" textAnchor="middle" fontSize="11" fill="#9d8ec7" fontFamily="system-ui">incoming call</text>
      {/* Contact avatar */}
      <circle cx="240" cy="118" r="34" fill="#251555" stroke="#7c3aed" strokeWidth="1.5"/>
      <text x="240" y="125" textAnchor="middle" fontSize="28" fill="#f0ebff">👩</text>
      {/* Name */}
      <text x="240" y="170" textAnchor="middle" fontSize="16" fontWeight="600" fill="#f0ebff" fontFamily="system-ui">Mum</text>
      <text x="240" y="188" textAnchor="middle" fontSize="11" fill="#9d8ec7" fontFamily="system-ui">mobile · 0412 *** ***</text>
      {/* Call buttons */}
      <circle cx="200" cy="218" r="18" fill="#ef4444" opacity="0.9"/>
      <text x="200" y="224" textAnchor="middle" fontSize="16" fill="white">✕</text>
      <circle cx="280" cy="218" r="18" fill="#10b981" opacity="0.9"/>
      <text x="280" y="224" textAnchor="middle" fontSize="16" fill="white">✓</text>
      {/* Pulse ring animation hint */}
      <circle cx="240" cy="118" r="44" fill="none" stroke="#7c3aed" strokeWidth="1" opacity="0.3"/>
      <circle cx="240" cy="118" r="54" fill="none" stroke="#7c3aed" strokeWidth="0.5" opacity="0.15"/>
    </svg>
  );
}

export function PaymentSentScene() {
  return (
    <svg viewBox="0 0 480 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Payment confirmation screen showing $800 sent">
      <rect width="480" height="270" fill="#0f0a1e"/>
      <ellipse cx="240" cy="135" rx="180" ry="100" fill="#ef4444" opacity="0.05"/>
      {/* Phone */}
      <rect x="155" y="20" width="170" height="230" rx="20" fill="#1a1035" stroke="#3d2080" strokeWidth="2"/>
      <rect x="163" y="30" width="154" height="210" rx="14" fill="#0d0820"/>
      <rect x="210" y="28" width="60" height="10" rx="5" fill="#1a1035"/>
      {/* Payment app header */}
      <rect x="163" y="30" width="154" height="32" rx="0" fill="#1a0505"/>
      <rect x="163" y="46" width="154" height="16" fill="#1a0505"/>
      <text x="240" y="51" textAnchor="middle" fontSize="10" fill="#ef4444" fontFamily="system-ui" fontWeight="600">PAYMENT SENT</text>
      {/* Large tick — red because it's wrong */}
      <circle cx="240" cy="110" r="36" fill="#2d0808" stroke="#ef4444" strokeWidth="1.5"/>
      <text x="240" y="122" textAnchor="middle" fontSize="30" fill="#ef4444">✓</text>
      {/* Amount */}
      <text x="240" y="160" textAnchor="middle" fontSize="20" fontWeight="700" fill="#ef4444" fontFamily="system-ui">$800.00</text>
      {/* To */}
      <text x="240" y="178" textAnchor="middle" fontSize="10" fill="#9d8ec7" fontFamily="system-ui">To: Unknown account</text>
      <text x="240" y="194" textAnchor="middle" fontSize="9" fill="#5a4e8a" fontFamily="system-ui">BSB 062-000 · ACC 8821-4203</text>
      {/* Warning */}
      <rect x="175" y="205" width="130" height="24" rx="6" fill="#2d0808" stroke="#ef4444" strokeWidth="1"/>
      <text x="240" y="221" textAnchor="middle" fontSize="9" fill="#ef4444" fontFamily="system-ui">Cannot be reversed</text>
    </svg>
  );
}

export function CallSafeScene() {
  return (
    <svg viewBox="0 0 480 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Phone call ended safely with green verification tick">
      <rect width="480" height="270" fill="#0f0a1e"/>
      <ellipse cx="240" cy="135" rx="180" ry="100" fill="#10b981" opacity="0.06"/>
      {/* Phone */}
      <rect x="155" y="20" width="170" height="230" rx="20" fill="#1a1035" stroke="#3d2080" strokeWidth="2"/>
      <rect x="163" y="30" width="154" height="210" rx="14" fill="#0d0820"/>
      <rect x="210" y="28" width="60" height="10" rx="5" fill="#1a1035"/>
      {/* Call ended state */}
      <rect x="163" y="30" width="154" height="32" rx="0" fill="#052e1e"/>
      <rect x="163" y="46" width="154" height="16" fill="#052e1e"/>
      <text x="240" y="51" textAnchor="middle" fontSize="10" fill="#10b981" fontFamily="system-ui" fontWeight="600">VERIFIED SAFE</text>
      {/* Big green tick */}
      <circle cx="240" cy="110" r="36" fill="#052e1e" stroke="#10b981" strokeWidth="2"/>
      <path d="M222 110 L234 124 L260 96" fill="none" stroke="#10b981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Mum's actual number */}
      <text x="240" y="160" textAnchor="middle" fontSize="14" fontWeight="600" fill="#f0ebff" fontFamily="system-ui">Mum (real)</text>
      <text x="240" y="178" textAnchor="middle" fontSize="11" fill="#10b981" fontFamily="system-ui">She's at home. She's fine.</text>
      {/* Duration */}
      <text x="240" y="200" textAnchor="middle" fontSize="10" fill="#5a4e8a" fontFamily="system-ui">Call: 0:32</text>
      {/* Relief glow */}
      <ellipse cx="240" cy="110" r="50" fill="none" stroke="#10b981" strokeWidth="0.5" opacity="0.2"/>
    </svg>
  );
}

export function PhoneSearchScene() {
  return (
    <svg viewBox="0 0 480 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Phone screen showing AI assistant giving a confident but wrong insurance answer">
      <rect width="480" height="270" fill="#0f0a1e"/>
      <ellipse cx="240" cy="135" rx="180" ry="100" fill="#7c3aed" opacity="0.06"/>
      {/* Phone */}
      <rect x="145" y="15" width="190" height="240" rx="20" fill="#1a1035" stroke="#3d2080" strokeWidth="2"/>
      <rect x="153" y="25" width="174" height="220" rx="14" fill="#0d0820"/>
      <rect x="205" y="23" width="70" height="10" rx="5" fill="#1a1035"/>
      {/* AI chat header */}
      <rect x="153" y="25" width="174" height="30" rx="0" fill="#1a1035"/>
      <rect x="153" y="40" width="174" height="15" fill="#1a1035"/>
      <circle cx="170" cy="38" r="8" fill="#7c3aed" opacity="0.6"/>
      <text x="185" y="42" fontSize="9" fill="#9d8ec7" fontFamily="system-ui">AI Assistant</text>
      {/* User bubble */}
      <rect x="193" y="62" width="128" height="34" rx="10" fill="#251555"/>
      <text x="257" y="76" textAnchor="middle" fontSize="9" fill="#f0ebff" fontFamily="system-ui">Does my car</text>
      <text x="257" y="88" textAnchor="middle" fontSize="9" fill="#f0ebff" fontFamily="system-ui">insurance cover NZ?</text>
      {/* AI response bubble */}
      <rect x="157" y="104" width="142" height="80" rx="10" fill="#1e1040" stroke="#3d2080" strokeWidth="1"/>
      <text x="166" y="118" fontSize="8" fill="#10b981" fontFamily="system-ui" fontWeight="600">Yes —</text>
      <text x="166" y="130" fontSize="8" fill="#9d8ec7" fontFamily="system-ui">under Australian</text>
      <text x="166" y="142" fontSize="8" fill="#9d8ec7" fontFamily="system-ui">insurance law,</text>
      <text x="166" y="154" fontSize="8" fill="#9d8ec7" fontFamily="system-ui">comprehensive</text>
      <text x="166" y="166" fontSize="8" fill="#9d8ec7" fontFamily="system-ui">policies extend...</text>
      <text x="166" y="178" fontSize="7" fill="#5a4e8a" fontFamily="system-ui">s.4(2)(b) — 90 days</text>
      {/* Confident indicator */}
      <rect x="157" y="192" width="80" height="14" rx="4" fill="#052e1e" stroke="#10b981" strokeWidth="0.5"/>
      <text x="197" y="202" textAnchor="middle" fontSize="7" fill="#10b981" fontFamily="system-ui">High confidence</text>
      {/* Cursor/typing area */}
      <rect x="157" y="215" width="142" height="22" rx="8" fill="#1a1035" stroke="#3d2080" strokeWidth="1"/>
      <text x="170" y="230" fontSize="8" fill="#5a4e8a" fontFamily="system-ui">Ask anything...</text>
    </svg>
  );
}

export function BorderCrossingScene() {
  return (
    <svg viewBox="0 0 480 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Car approaching New Zealand border crossing with road and sign">
      <rect width="480" height="270" fill="#0f0a1e"/>
      {/* Sky */}
      <rect width="480" height="160" fill="#0d0515"/>
      {/* Road */}
      <rect x="0" y="170" width="480" height="100" fill="#111"/>
      <rect x="0" y="165" width="480" height="10" fill="#1a1035"/>
      {/* Road markings */}
      {[0,1,2,3,4].map(i => (
        <rect key={i} x={20+i*100} y="210" width="60" height="4" rx="2" fill="#3d2080" opacity="0.6"/>
      ))}
      {/* NZ border sign */}
      <rect x="190" y="80" width="100" height="60" rx="4" fill="#052e1e" stroke="#10b981" strokeWidth="2"/>
      <text x="240" y="103" textAnchor="middle" fontSize="10" fill="#10b981" fontFamily="system-ui" fontWeight="700">NEW ZEALAND</text>
      <text x="240" y="118" textAnchor="middle" fontSize="8" fill="#9d8ec7" fontFamily="system-ui">Welcome</text>
      {/* Sign post */}
      <rect x="236" y="140" width="8" height="30" fill="#3d2080"/>
      {/* Car silhouette */}
      <rect x="160" y="195" width="80" height="30" rx="6" fill="#251555" stroke="#3d2080" strokeWidth="1.5"/>
      <rect x="172" y="185" width="56" height="16" rx="4" fill="#1a1035" stroke="#3d2080" strokeWidth="1"/>
      {/* Car windows */}
      <rect x="176" y="188" width="22" height="10" rx="2" fill="#0d0820" opacity="0.8"/>
      <rect x="202" y="188" width="22" height="10" rx="2" fill="#0d0820" opacity="0.8"/>
      {/* Wheels */}
      <circle cx="180" cy="226" r="8" fill="#0d0820" stroke="#5a4e8a" strokeWidth="1.5"/>
      <circle cx="220" cy="226" r="8" fill="#0d0820" stroke="#5a4e8a" strokeWidth="1.5"/>
      {/* Headlights */}
      <ellipse cx="240" cy="210" rx="15" ry="4" fill="#f59e0b" opacity="0.2"/>
      {/* Damage indicator */}
      <text x="320" y="210" textAnchor="middle" fontSize="24" fill="#ef4444" opacity="0.8">!</text>
      <text x="320" y="228" textAnchor="middle" fontSize="9" fill="#ef4444" fontFamily="system-ui">collision</text>
    </svg>
  );
}

export function PdsOpenScene() {
  return (
    <svg viewBox="0 0 480 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Phone showing PDS document with NZ coverage exclusion highlighted">
      <rect width="480" height="270" fill="#0f0a1e"/>
      {/* Phone */}
      <rect x="145" y="15" width="190" height="240" rx="20" fill="#1a1035" stroke="#3d2080" strokeWidth="2"/>
      <rect x="153" y="25" width="174" height="220" rx="14" fill="#f0ebff"/>
      <rect x="205" y="23" width="70" height="10" rx="5" fill="#1a1035"/>
      {/* PDF viewer header */}
      <rect x="153" y="25" width="174" height="28" rx="0" fill="#251555"/>
      <rect x="153" y="39" width="174" height="14" fill="#251555"/>
      <text x="240" y="40" textAnchor="middle" fontSize="9" fill="#f0ebff" fontFamily="system-ui">Product Disclosure Statement</text>
      {/* Document content */}
      <text x="165" y="72" fontSize="10" fill="#1a1035" fontFamily="system-ui" fontWeight="700">Section 8 — International Cover</text>
      {/* Regular lines */}
      {[0,1,2].map(i => (
        <rect key={i} x="165" y={82+i*12} width={i===2?100:148} height="7" rx="2" fill="#1a1035" opacity="0.15"/>
      ))}
      {/* Highlighted exclusion clause */}
      <rect x="162" y="118" width="156" height="40" rx="4" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.5"/>
      <text x="170" y="132" fontSize="8" fill="#92400e" fontFamily="system-ui" fontWeight="600">International exclusions:</text>
      <text x="170" y="144" fontSize="8" fill="#92400e" fontFamily="system-ui">New Zealand: not covered</text>
      <text x="170" y="156" fontSize="8" fill="#92400e" fontFamily="system-ui">unless add-on purchased.</text>
      {/* More lines */}
      {[0,1,2,3].map(i => (
        <rect key={i} x="165" y={166+i*12} width={i===1?110:140} height="7" rx="2" fill="#1a1035" opacity="0.12"/>
      ))}
      {/* AI citation crossed out */}
      <rect x="162" y="218" width="156" height="18" rx="3" fill="#fde8e8"/>
      <text x="170" y="230" fontSize="7" fill="#ef4444" fontFamily="system-ui" fontStyle="italic">s.4(2)(b) — does not exist ✕</text>
    </svg>
  );
}

export function RejectionEmailScene() {
  return (
    <svg viewBox="0 0 480 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Phone showing automated rejection email from employer">
      <rect width="480" height="270" fill="#0f0a1e"/>
      <ellipse cx="240" cy="135" rx="180" ry="100" fill="#ef4444" opacity="0.04"/>
      {/* Phone */}
      <rect x="145" y="15" width="190" height="240" rx="20" fill="#1a1035" stroke="#3d2080" strokeWidth="2"/>
      <rect x="153" y="25" width="174" height="220" rx="14" fill="#0d0820"/>
      <rect x="205" y="23" width="70" height="10" rx="5" fill="#1a1035"/>
      {/* Email app header */}
      <rect x="153" y="25" width="174" height="28" rx="0" fill="#1a1035"/>
      <rect x="153" y="38" width="174" height="15" fill="#1a1035"/>
      <text x="240" y="40" textAnchor="middle" fontSize="9" fill="#9d8ec7" fontFamily="system-ui">Inbox</text>
      {/* Email item */}
      <rect x="153" y="53" width="174" height="72" rx="0" fill="#1e0808" stroke="#991b1b" strokeWidth="0" strokeDasharray="0"/>
      <rect x="153" y="53" width="3" height="72" fill="#ef4444"/>
      {/* Sender */}
      <circle cx="168" cy="68" r="8" fill="#3d0808"/>
      <text x="168" y="72" textAnchor="middle" fontSize="9" fill="#ef4444">HR</text>
      <text x="180" y="65" fontSize="8" fill="#9d8ec7" fontFamily="system-ui">noreply@company.com</text>
      <text x="180" y="76" fontSize="9" fill="#f0ebff" fontFamily="system-ui" fontWeight="600">Application Update</text>
      <text x="157" y="92" fontSize="8" fill="#9d8ec7" fontFamily="system-ui">After careful consideration,</text>
      <text x="157" y="104" fontSize="8" fill="#9d8ec7" fontFamily="system-ui">we are unable to progress</text>
      <text x="157" y="116" fontSize="8" fill="#9d8ec7" fontFamily="system-ui">your application...</text>
      {/* Contrast email — colleague got through */}
      <rect x="153" y="127" width="174" height="60" rx="0" fill="#052e1e" opacity="0.6"/>
      <rect x="153" y="127" width="3" height="60" fill="#10b981"/>
      <circle cx="168" cy="143" r="8" fill="#052e1e"/>
      <text x="168" y="147" textAnchor="middle" fontSize="9" fill="#10b981">HR</text>
      <text x="180" y="140" fontSize="8" fill="#9d8ec7" fontFamily="system-ui">noreply@company.com</text>
      <text x="180" y="151" fontSize="9" fill="#f0ebff" fontFamily="system-ui" fontWeight="600">Interview Invitation</text>
      <text x="157" y="167" fontSize="8" fill="#5a4e8a" fontFamily="system-ui">(your colleague)</text>
      {/* Robot icon hint */}
      <text x="290" y="95" fontSize="20" fill="#3d2080" opacity="0.5">🤖</text>
      <text x="283" y="112" fontSize="8" fill="#5a4e8a" fontFamily="system-ui">AI screened you out</text>
    </svg>
  );
}

export function EmailSentScene() {
  return (
    <svg viewBox="0 0 480 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Phone composing email to HR asking about AI screening criteria">
      <rect width="480" height="270" fill="#0f0a1e"/>
      {/* Phone */}
      <rect x="145" y="15" width="190" height="240" rx="20" fill="#1a1035" stroke="#3d2080" strokeWidth="2"/>
      <rect x="153" y="25" width="174" height="220" rx="14" fill="#0d0820"/>
      <rect x="205" y="23" width="70" height="10" rx="5" fill="#1a1035"/>
      {/* Email compose header */}
      <rect x="153" y="25" width="174" height="28" rx="0" fill="#1a1035"/>
      <rect x="153" y="38" width="174" height="15" fill="#1a1035"/>
      <text x="196" y="40" fontSize="9" fill="#9d8ec7" fontFamily="system-ui">New Message</text>
      <text x="306" y="40" textAnchor="end" fontSize="9" fill="#7c3aed" fontFamily="system-ui" fontWeight="600">Send</text>
      {/* To field */}
      <rect x="153" y="53" width="174" height="22" rx="0" fill="#1a1035" stroke="#3d2080" strokeWidth="0"/>
      <text x="160" y="67" fontSize="8" fill="#5a4e8a" fontFamily="system-ui">To:</text>
      <text x="178" y="67" fontSize="8" fill="#9d8ec7" fontFamily="system-ui">hr@company.com</text>
      {/* Subject */}
      <rect x="153" y="75" width="174" height="22" rx="0" fill="#1a1035"/>
      <text x="160" y="89" fontSize="8" fill="#5a4e8a" fontFamily="system-ui">Re: Application Update</text>
      <line x1="153" y1="97" x2="327" y2="97" stroke="#3d2080" strokeWidth="0.5"/>
      {/* Email body */}
      <text x="160" y="113" fontSize="8" fill="#9d8ec7" fontFamily="system-ui">Dear Hiring Team,</text>
      <rect x="160" y="120" width="152" height="7" rx="2" fill="#9d8ec7" opacity="0.2"/>
      <rect x="160" y="131" width="140" height="7" rx="2" fill="#9d8ec7" opacity="0.2"/>
      <rect x="160" y="142" width="148" height="7" rx="2" fill="#9d8ec7" opacity="0.2"/>
      {/* Key sentence highlighted */}
      <rect x="158" y="156" width="156" height="24" rx="4" fill="#251555" stroke="#7c3aed" strokeWidth="1"/>
      <text x="163" y="167" fontSize="8" fill="#f0ebff" fontFamily="system-ui" fontWeight="600">What criteria were used,</text>
      <text x="163" y="178" fontSize="8" fill="#f0ebff" fontFamily="system-ui">and why did I not meet them?</text>
      <rect x="160" y="186" width="100" height="7" rx="2" fill="#9d8ec7" opacity="0.15"/>
      {/* Cursor */}
      <rect x="160" y="198" width="2" height="11" rx="1" fill="#7c3aed" opacity="0.8"/>
    </svg>
  );
}

export function PhoneVerifyScene() {
  return (
    <svg viewBox="0 0 480 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Phone showing bank fraud line call in progress with transfer flagged">
      <rect width="480" height="270" fill="#0f0a1e"/>
      <ellipse cx="240" cy="135" rx="180" ry="100" fill="#f59e0b" opacity="0.05"/>
      {/* Phone */}
      <rect x="145" y="15" width="190" height="240" rx="20" fill="#1a1035" stroke="#3d2080" strokeWidth="2"/>
      <rect x="153" y="25" width="174" height="220" rx="14" fill="#0d0820"/>
      <rect x="205" y="23" width="70" height="10" rx="5" fill="#1a1035"/>
      {/* Bank call header */}
      <rect x="153" y="25" width="174" height="32" rx="0" fill="#1a1208"/>
      <rect x="153" y="42" width="174" height="15" fill="#1a1208"/>
      <text x="240" y="40" textAnchor="middle" fontSize="9" fill="#f59e0b" fontFamily="system-ui" fontWeight="600">FRAUD LINE — ACTIVE CALL</text>
      {/* Bank logo */}
      <circle cx="240" cy="90" r="28" fill="#1a1208" stroke="#f59e0b" strokeWidth="1.5"/>
      <text x="240" y="96" textAnchor="middle" fontSize="20" fill="#f59e0b">🏦</text>
      {/* Transfer status */}
      <rect x="162" y="128" width="156" height="38" rx="6" fill="#1a1208" stroke="#f59e0b" strokeWidth="1"/>
      <text x="240" y="144" textAnchor="middle" fontSize="9" fill="#f59e0b" fontFamily="system-ui" fontWeight="600">Transfer: FLAGGED</text>
      <text x="240" y="158" textAnchor="middle" fontSize="8" fill="#9d8ec7" fontFamily="system-ui">$800.00 · Under review</text>
      {/* Call timer */}
      <text x="240" y="182" textAnchor="middle" fontSize="11" fill="#9d8ec7" fontFamily="system-ui">02:14</text>
      {/* Call action buttons */}
      <circle cx="200" cy="215" r="18" fill="#3d0808"/>
      <text x="200" y="221" textAnchor="middle" fontSize="16" fill="#ef4444">✕</text>
      <circle cx="240" cy="215" r="14" fill="#251555"/>
      <text x="240" y="221" textAnchor="middle" fontSize="12" fill="#9d8ec7">🔇</text>
      <circle cx="280" cy="215" r="14" fill="#251555"/>
      <text x="280" y="221" textAnchor="middle" fontSize="12" fill="#9d8ec7">📢</text>
    </svg>
  );
}

export function DeskReviewScene() {
  return (
    <svg viewBox="0 0 480 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Person at desk reviewing bad news on laptop screen">
      <rect width="480" height="270" fill="#0f0a1e"/>
      <ellipse cx="240" cy="200" rx="200" ry="60" fill="#1a1035" opacity="0.8"/>
      {/* Desk surface */}
      <rect x="0" y="195" width="480" height="75" rx="0" fill="#150d30"/>
      <rect x="0" y="192" width="480" height="6" rx="0" fill="#1e1245"/>
      {/* Laptop base */}
      <rect x="120" y="165" width="240" height="10" rx="4" fill="#1e1245" stroke="#3d2080" strokeWidth="1"/>
      {/* Laptop screen */}
      <rect x="130" y="55" width="220" height="140" rx="8" fill="#1a1035" stroke="#3d2080" strokeWidth="2"/>
      <rect x="138" y="63" width="204" height="124" rx="4" fill="#0d0820"/>
      {/* Screen content — rejection/bad news */}
      <rect x="146" y="72" width="188" height="20" rx="3" fill="#1e0808"/>
      <text x="240" y="86" textAnchor="middle" fontSize="9" fill="#ef4444" fontFamily="system-ui" fontWeight="600">Transfer complete. Funds cleared.</text>
      {/* Email lines */}
      {[0,1,2,3].map(i => (
        <rect key={i} x="146" y={98+i*14} width={i===1?120:i===3?100:170} height="7" rx="2" fill="#5a4e8a" opacity="0.4"/>
      ))}
      {/* Mug */}
      <rect x="370" y="168" width="28" height="26" rx="4" fill="#251555" stroke="#3d2080" strokeWidth="1"/>
      <path d="M398 176 Q410 176 410 182 Q410 188 398 188" fill="none" stroke="#3d2080" strokeWidth="1.5"/>
      {/* Person silhouette — head */}
      <ellipse cx="240" cy="225" rx="22" ry="14" fill="#1e1245"/>
      <circle cx="240" cy="210" r="12" fill="#251555" stroke="#3d2080" strokeWidth="1"/>
    </svg>
  );
}

export function DeskColleagueScene() {
  return (
    <svg viewBox="0 0 480 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Two people in conversation at a table, one explaining something to the other">
      <rect width="480" height="270" fill="#0f0a1e"/>
      <ellipse cx="240" cy="230" rx="220" ry="50" fill="#1a1035" opacity="0.9"/>
      {/* Table */}
      <rect x="80" y="185" width="320" height="8" rx="4" fill="#1e1245" stroke="#3d2080" strokeWidth="1"/>
      <rect x="100" y="193" width="8" height="40" rx="2" fill="#1a1035"/>
      <rect x="372" y="193" width="8" height="40" rx="2" fill="#1a1035"/>
      {/* Left person */}
      <circle cx="155" cy="148" r="22" fill="#251555" stroke="#3d2080" strokeWidth="1.5"/>
      <text x="155" y="155" textAnchor="middle" fontSize="18" fill="#f0ebff">👤</text>
      <rect x="120" y="170" width="70" height="18" rx="4" fill="#1a1035" stroke="#3d2080" strokeWidth="1"/>
      {/* Right person */}
      <circle cx="325" cy="148" r="22" fill="#052e1e" stroke="#10b981" strokeWidth="1.5"/>
      <text x="325" y="155" textAnchor="middle" fontSize="18" fill="#f0ebff">👤</text>
      <rect x="290" y="170" width="70" height="18" rx="4" fill="#1a1035" stroke="#3d2080" strokeWidth="1"/>
      {/* Speech bubble from right */}
      <rect x="195" y="110" width="100" height="30" rx="8" fill="#052e1e" stroke="#10b981" strokeWidth="1"/>
      <path d="M280 132 L295 143 L270 138" fill="#052e1e" stroke="#10b981" strokeWidth="1"/>
      <text x="245" y="128" textAnchor="middle" fontSize="8" fill="#10b981" fontFamily="system-ui">Got it. I'll check</text>
      <text x="245" y="138" textAnchor="middle" fontSize="8" fill="#10b981" fontFamily="system-ui">my PDS directly.</text>
      {/* Connection line */}
      <line x1="178" y1="160" x2="302" y2="160" stroke="#3d2080" strokeWidth="1" strokeDasharray="4 3" opacity="0.5"/>
    </svg>
  );
}

export function DeskCasualScene() {
  return (
    <svg viewBox="0 0 480 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Person alone at desk in reflective moment, no urgent activity">
      <rect width="480" height="270" fill="#0f0a1e"/>
      {/* Ambient warm glow — quieter moment */}
      <ellipse cx="240" cy="180" rx="160" ry="80" fill="#7c3aed" opacity="0.04"/>
      {/* Desk */}
      <rect x="0" y="195" width="480" height="75" fill="#150d30"/>
      <rect x="0" y="192" width="480" height="5" fill="#1e1245"/>
      {/* Closed laptop */}
      <rect x="140" y="178" width="200" height="16" rx="4" fill="#1e1245" stroke="#3d2080" strokeWidth="1.5"/>
      <rect x="148" y="162" width="184" height="18" rx="6" fill="#1a1035" stroke="#3d2080" strokeWidth="1"/>
      {/* Notebook + pen */}
      <rect x="355" y="168" width="45" height="30" rx="3" fill="#1e1245" stroke="#3d2080" strokeWidth="1"/>
      {[0,1,2].map(i => (
        <line key={i} x1="360" y1={175+i*7} x2="394" y2={175+i*7} stroke="#3d2080" strokeWidth="0.5" opacity="0.6"/>
      ))}
      <rect x="390" y="163" width="3" height="20" rx="1" fill="#7c3aed" opacity="0.7" transform="rotate(15 391 173)"/>
      {/* Coffee mug */}
      <rect x="78" y="172" width="30" height="25" rx="5" fill="#251555" stroke="#3d2080" strokeWidth="1"/>
      <path d="M108 180 Q118 180 118 186 Q118 192 108 192" fill="none" stroke="#3d2080" strokeWidth="1.5"/>
      {/* Steam lines */}
      <path d="M88 168 Q90 162 88 156" fill="none" stroke="#5a4e8a" strokeWidth="1" opacity="0.5"/>
      <path d="M96 165 Q98 159 96 153" fill="none" stroke="#5a4e8a" strokeWidth="1" opacity="0.4"/>
      {/* Person silhouette */}
      <ellipse cx="240" cy="228" rx="28" ry="14" fill="#1e1245"/>
      <circle cx="240" cy="212" r="14" fill="#251555" stroke="#3d2080" strokeWidth="1"/>
      {/* Thought bubble — reflective */}
      <circle cx="265" cy="188" r="4" fill="#251555" stroke="#3d2080" strokeWidth="1" opacity="0.6"/>
      <circle cx="275" cy="178" r="6" fill="#251555" stroke="#3d2080" strokeWidth="1" opacity="0.7"/>
      <circle cx="288" cy="165" r="10" fill="#1e1245" stroke="#3d2080" strokeWidth="1"/>
      <text x="288" y="169" textAnchor="middle" fontSize="10" fill="#9d8ec7">?</text>
    </svg>
  );
}

export function PaymentScreenScene() {
  return (
    <svg viewBox="0 0 480 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Payment receipt screen showing out of pocket repair cost paid">
      <rect width="480" height="270" fill="#0f0a1e"/>
      <ellipse cx="240" cy="135" rx="180" ry="100" fill="#f59e0b" opacity="0.04"/>
      {/* Phone */}
      <rect x="145" y="15" width="190" height="240" rx="20" fill="#1a1035" stroke="#3d2080" strokeWidth="2"/>
      <rect x="153" y="25" width="174" height="220" rx="14" fill="#0d0820"/>
      <rect x="205" y="23" width="70" height="10" rx="5" fill="#1a1035"/>
      {/* Header */}
      <rect x="153" y="25" width="174" height="32" rx="0" fill="#1a1208"/>
      <rect x="153" y="42" width="174" height="15" fill="#1a1208"/>
      <text x="240" y="40" textAnchor="middle" fontSize="9" fill="#f59e0b" fontFamily="system-ui" fontWeight="600">PAYMENT COMPLETE</text>
      {/* Receipt icon */}
      <circle cx="240" cy="95" r="28" fill="#1a1208" stroke="#f59e0b" strokeWidth="1.5"/>
      <text x="240" y="103" textAnchor="middle" fontSize="22" fill="#f59e0b">🧾</text>
      {/* Amount */}
      <text x="240" y="142" textAnchor="middle" fontSize="22" fontWeight="700" fill="#f59e0b" fontFamily="system-ui">$480.00</text>
      <text x="240" y="158" textAnchor="middle" fontSize="9" fill="#9d8ec7" fontFamily="system-ui">Vehicle repair — out of pocket</text>
      {/* Note */}
      <rect x="162" y="170" width="156" height="34" rx="6" fill="#1a1208" stroke="#f59e0b" strokeWidth="0.5" opacity="0.8"/>
      <text x="240" y="184" textAnchor="middle" fontSize="8" fill="#9d8ec7" fontFamily="system-ui">AI said you were covered.</text>
      <text x="240" y="196" textAnchor="middle" fontSize="8" fill="#9d8ec7" fontFamily="system-ui">PDS said otherwise.</text>
      {/* Lesson forming */}
      <text x="240" y="222" textAnchor="middle" fontSize="8" fill="#5a4e8a" fontFamily="system-ui" fontStyle="italic">Check the actual document next time.</text>
    </svg>
  );
}

export function OfficeBriefingScene() {
  return (
    <svg viewBox="0 0 480 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Office meeting with hiring manager explaining the screening tool error">
      <rect width="480" height="270" fill="#0f0a1e"/>
      <ellipse cx="240" cy="220" rx="200" ry="50" fill="#1a1035" opacity="0.9"/>
      {/* Conference table */}
      <ellipse cx="240" cy="195" rx="160" ry="22" fill="#1e1245" stroke="#3d2080" strokeWidth="1.5"/>
      {/* Hiring manager — left */}
      <circle cx="145" cy="148" r="24" fill="#251555" stroke="#7c3aed" strokeWidth="1.5"/>
      <text x="145" y="156" textAnchor="middle" fontSize="20" fill="#f0ebff">👔</text>
      <text x="145" y="180" textAnchor="middle" fontSize="8" fill="#9d8ec7" fontFamily="system-ui">Hiring Manager</text>
      {/* You — right */}
      <circle cx="335" cy="148" r="24" fill="#052e1e" stroke="#10b981" strokeWidth="1.5"/>
      <text x="335" y="156" textAnchor="middle" fontSize="20" fill="#f0ebff">👤</text>
      <text x="335" y="180" textAnchor="middle" fontSize="8" fill="#10b981" fontFamily="system-ui">You</text>
      {/* Speech bubble from manager */}
      <rect x="165" y="95" width="136" height="42" rx="8" fill="#251555" stroke="#7c3aed" strokeWidth="1"/>
      <path d="M165 118 L148 132 L172 124" fill="#251555" stroke="#7c3aed" strokeWidth="1"/>
      <text x="233" y="111" textAnchor="middle" fontSize="8" fill="#f0ebff" fontFamily="system-ui">I wasn't aware the</text>
      <text x="233" y="123" textAnchor="middle" fontSize="8" fill="#f0ebff" fontFamily="system-ui">tool used undisclosed</text>
      <text x="233" y="135" textAnchor="middle" fontSize="8" fill="#f0ebff" fontFamily="system-ui">criteria. I'm sorry.</text>
      {/* Documents on table */}
      <rect x="195" y="188" width="50" height="14" rx="2" fill="#1a1035" stroke="#3d2080" strokeWidth="1" transform="rotate(-5 220 195)"/>
      <rect x="230" y="186" width="50" height="14" rx="2" fill="#1a1035" stroke="#3d2080" strokeWidth="1" transform="rotate(3 255 193)"/>
    </svg>
  );
}

export function PhoneIncomingScene() {
  return (
    <svg viewBox="0 0 480 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Incoming call from sister on a phone screen, distressed">
      <rect width="480" height="270" fill="#0f0a1e"/>
      <ellipse cx="240" cy="135" rx="180" ry="100" fill="#ef4444" opacity="0.05"/>
      {/* Phone frame */}
      <rect x="155" y="20" width="170" height="230" rx="20" fill="#1a1035" stroke="#3d2080" strokeWidth="2"/>
      <rect x="163" y="30" width="154" height="210" rx="14" fill="#0d0820"/>
      <rect x="210" y="28" width="60" height="10" rx="5" fill="#1a1035"/>
      {/* Incoming call UI */}
      <text x="240" y="75" textAnchor="middle" fontSize="11" fill="#9d8ec7" fontFamily="system-ui">incoming call</text>
      {/* Contact avatar */}
      <circle cx="240" cy="118" r="34" fill="#2d0808" stroke="#ef4444" strokeWidth="1.5"/>
      <text x="240" y="125" textAnchor="middle" fontSize="28" fill="#f0ebff">👩</text>
      {/* Name */}
      <text x="240" y="170" textAnchor="middle" fontSize="16" fontWeight="600" fill="#f0ebff" fontFamily="system-ui">Sister</text>
      <text x="240" y="188" textAnchor="middle" fontSize="11" fill="#ef4444" fontFamily="system-ui">She sounds distressed</text>
      {/* Call buttons */}
      <circle cx="200" cy="218" r="18" fill="#ef4444" opacity="0.9"/>
      <text x="200" y="224" textAnchor="middle" fontSize="16" fill="white">✕</text>
      <circle cx="280" cy="218" r="18" fill="#10b981" opacity="0.9"/>
      <text x="280" y="224" textAnchor="middle" fontSize="16" fill="white">✓</text>
      {/* Warning pulse rings */}
      <circle cx="240" cy="118" r="44" fill="none" stroke="#ef4444" strokeWidth="1" opacity="0.25"/>
      <circle cx="240" cy="118" r="54" fill="none" stroke="#ef4444" strokeWidth="0.5" opacity="0.1"/>
    </svg>
  );
}

export function getEverydayScene(sceneKey) {
  const scenes = {
    'phone-call':       <PhoneCallScene />,
    'payment-sent':     <PaymentSentScene />,
    'call-safe':        <CallSafeScene />,
    'phone-search':     <PhoneSearchScene />,
    'border-crossing':  <BorderCrossingScene />,
    'pds-open':         <PdsOpenScene />,
    'rejection-email':  <RejectionEmailScene />,
    'email-sent':       <EmailSentScene />,
    'phone-incoming':   <PhoneIncomingScene />,
    'phone-verify':     <PhoneVerifyScene />,
    'desk-review':      <DeskReviewScene />,
    'desk-colleague':   <DeskColleagueScene />,
    'desk-casual':      <DeskCasualScene />,
    'payment-screen':   <PaymentScreenScene />,
    'office-briefing':  <OfficeBriefingScene />,
  };
  return scenes[sceneKey] ?? <PhoneCallScene />;
}
