import React from 'react';

// Shared character: Priya at desk
// character_state: 'focused' | 'deciding' | 'typing'

function PriyaHead({ cx, cy, state }) {
  const eyeState = state === 'deciding' ? 'wide' : state === 'typing' ? 'down' : 'normal';
  return (
    <g>
      {/* Head */}
      <circle cx={cx} cy={cy} r={22} fill="var(--panel-skin)" stroke="var(--panel-ink)" strokeWidth={2.5} />
      {/* Hair */}
      <path
        d={`M${cx - 20} ${cy - 8} Q${cx - 16} ${cy - 26} ${cx} ${cy - 28} Q${cx + 16} ${cy - 26} ${cx + 20} ${cy - 8}`}
        fill="var(--panel-ink)" opacity={0.85}
      />
      {/* Eyebrows */}
      {eyeState === 'wide' ? (
        <>
          <path d={`M${cx-11} ${cy-9} Q${cx-7} ${cy-13} ${cx-3} ${cy-10}`} fill="none" stroke="var(--panel-ink)" strokeWidth={1.5} strokeLinecap="round"/>
          <path d={`M${cx+3} ${cy-10} Q${cx+7} ${cy-13} ${cx+11} ${cy-9}`} fill="none" stroke="var(--panel-ink)" strokeWidth={1.5} strokeLinecap="round"/>
        </>
      ) : (
        <>
          <path d={`M${cx-11} ${cy-10} Q${cx-7} ${cy-12} ${cx-3} ${cy-10}`} fill="none" stroke="var(--panel-ink)" strokeWidth={1.5} strokeLinecap="round"/>
          <path d={`M${cx+3} ${cy-10} Q${cx+7} ${cy-12} ${cx+11} ${cy-10}`} fill="none" stroke="var(--panel-ink)" strokeWidth={1.5} strokeLinecap="round"/>
        </>
      )}
      {/* Eyes */}
      {eyeState === 'down' ? (
        <>
          <path d={`M${cx-11} ${cy-3} Q${cx-7} ${cy-1} ${cx-3} ${cy-3}`} fill="none" stroke="var(--panel-ink)" strokeWidth={2} strokeLinecap="round"/>
          <path d={`M${cx+3} ${cy-3} Q${cx+7} ${cy-1} ${cx+11} ${cy-3}`} fill="none" stroke="var(--panel-ink)" strokeWidth={2} strokeLinecap="round"/>
        </>
      ) : (
        <>
          <ellipse cx={cx - 7} cy={cy - 3} rx={4} ry={eyeState === 'wide' ? 5.5 : 4.5} fill="var(--panel-ink)"/>
          <ellipse cx={cx + 7} cy={cy - 3} rx={4} ry={eyeState === 'wide' ? 5.5 : 4.5} fill="var(--panel-ink)"/>
          <circle cx={cx - 6} cy={cy - 4} r={1.5} fill="white"/>
          <circle cx={cx + 8} cy={cy - 4} r={1.5} fill="white"/>
        </>
      )}
      {/* Mouth */}
      {state === 'deciding' ? (
        <path d={`M${cx-6} ${cy+9} Q${cx} ${cy+8} ${cx+6} ${cy+9}`} fill="none" stroke="var(--panel-ink)" strokeWidth={1.2} strokeLinecap="round"/>
      ) : state === 'typing' ? (
        <path d={`M${cx-5} ${cy+9} Q${cx} ${cy+12} ${cx+5} ${cy+9}`} fill="none" stroke="var(--panel-ink)" strokeWidth={1.2} strokeLinecap="round"/>
      ) : (
        <path d={`M${cx-6} ${cy+9} Q${cx} ${cy+11} ${cx+6} ${cy+9}`} fill="none" stroke="var(--panel-ink)" strokeWidth={1.2} strokeLinecap="round"/>
      )}
    </g>
  );
}

function Desk({ x, y, w }) {
  return (
    <>
      <rect x={x} y={y} width={w} height={12} rx={3} fill="var(--panel-desk)" stroke="var(--panel-ink)" strokeWidth={1} opacity={0.6}/>
      <rect x={x} y={y+12} width={w} height={50} rx={0} fill="var(--panel-desk)" opacity={0.2}/>
    </>
  );
}

function WorkMonitor({ x, y, showChatgpt }) {
  return (
    <g>
      {/* Stand */}
      <rect x={x+34} y={y+90} width={8} height={14} rx={2} fill="var(--panel-desk)" opacity={0.5}/>
      <rect x={x+20} y={y+102} width={36} height={5} rx={2} fill="var(--panel-desk)" opacity={0.5}/>
      {/* Frame */}
      <rect x={x} y={y} width={96} height={92} rx={7} fill="var(--panel-bg)" stroke="var(--panel-ink)" strokeWidth={2.5}/>
      <rect x={x+6} y={y+6} width={84} height={78} rx={4} fill={showChatgpt ? '#f0f4ff' : 'var(--panel-screen)'} stroke="var(--panel-ink)" strokeWidth={0.5} opacity={0.4}/>
      {showChatgpt ? (
        <>
          {/* AI tool interface lines */}
          {[0,12,24,36,48].map((offset, i) => (
            <rect key={i} x={x+12} y={y+12+offset} width={i%2===0?60:44} height={7} rx={3}
              fill={i%2===0 ? '#10a37f' : '#e5e7eb'} opacity={0.5}/>
          ))}
          <text x={x+48} y={y+82} textAnchor="middle" fontSize={6} fill="#10a37f" fontFamily="monospace" opacity={0.9}>free-ai-tool.io</text>
        </>
      ) : (
        <>
          {/* Work document lines */}
          {[0,12,24,36].map((offset, i) => (
            <rect key={i} x={x+12} y={y+12+offset} width={i===2?44:60} height={7} rx={3}
              fill="var(--panel-ink)" opacity={0.12}/>
          ))}
          <text x={x+48} y={y+80} textAnchor="middle" fontSize={6} fill="var(--panel-ink)" fontFamily="monospace" opacity={0.4}>strategy-q3-final.pptx</text>
        </>
      )}
    </g>
  );
}

function Phone({ x, y, app }) {
  const colors = {
    chatgpt: { bg: '#f0f4ff', stripe: '#10a37f', label: 'free-ai-tool.io' },
    claude: { bg: '#fdf4ee', stripe: '#c47940', label: 'claude.ai (free)' },
    work: { bg: 'var(--panel-screen)', stripe: 'var(--panel-ink)', label: 'work app' },
  };
  const c = colors[app] || colors.work;
  return (
    <g>
      <rect x={x} y={y} width={48} height={80} rx={9} fill="var(--panel-bg)" stroke="var(--panel-ink)" strokeWidth={2.5}/>
      <rect x={x+5} y={y+6} width={38} height={68} rx={5} fill={c.bg}/>
      {[0,10,20,30,40].map((offset, i) => (
        <rect key={i} x={x+9} y={y+10+offset} width={i%2===0?30:22} height={6} rx={2}
          fill={i%2===0 ? c.stripe : '#ccc'} opacity={0.45}/>
      ))}
      <rect x={x+8} y={y+57} width={32} height={11} rx={3} fill="white" stroke="#ccc" strokeWidth={0.5}/>
      <text x={x+24} y={y+65} textAnchor="middle" fontSize={5.5} fill="#666" fontFamily="monospace">{c.label}</text>
    </g>
  );
}

function ConfidentialDoc({ x, y, rotation = -4 }) {
  return (
    <g transform={`rotate(${rotation}, ${x+35}, ${y+36})`}>
      <rect x={x} y={y} width={70} height={55} rx={3} fill="var(--panel-bg)" stroke="var(--panel-ink)" strokeWidth={1.5}/>
      {[0,10,20].map((offset, i) => (
        <rect key={i} x={x+8} y={y+8+offset} width={i===1?40:54} height={5} rx={1}
          fill="var(--panel-ink)" opacity={0.12}/>
      ))}
      <text x={x+35} y={y+44} textAnchor="middle" fontSize={7} fontWeight="600"
        fill="var(--panel-danger)" opacity={0.85} fontFamily="var(--font-mono, monospace)">CONFIDENTIAL</text>
    </g>
  );
}

function ThoughtBubble({ cx, cy, tailX, tailY, lines }) {
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={118} ry={46} fill="var(--panel-bg)" stroke="var(--panel-ink)" strokeWidth={1.5}/>
      {/* tail dots */}
      {[{ r:7, ox:0, oy:0 }, { r:5.5, ox:0, oy:0 }, { r:4, ox:0, oy:0 }].map((dot, i) => {
        const t = (i + 1) / 4;
        const x = cx + (tailX - cx) * t;
        const y = cy + 46 + (tailY - cy - 46) * ((i+1)/3);
        return <circle key={i} cx={x} cy={y} r={dot.r - i*1.5 + 1.5}
          fill="var(--panel-bg)" stroke="var(--panel-ink)" strokeWidth={1.2}/>;
      })}
      {lines.map((line, i) => (
        <text key={i} x={cx} y={cy - 8 + i * 18} textAnchor="middle"
          fontSize={13} fill="var(--panel-ink)" fontFamily="var(--font-serif, Georgia, serif)"
          fontStyle="italic">
          {line}
        </text>
      ))}
    </g>
  );
}

function DataLeakArrow({ x1, y1, x2, y2 }) {
  return (
    <>
      <defs>
        <marker id="leak-arrow" viewBox="0 0 10 10" refX={8} refY={5}
          markerWidth={6} markerHeight={6} orient="auto-start-reverse">
          <path d="M2 1L8 5L2 9" fill="none" stroke="var(--panel-danger)" strokeWidth={1.5}
            strokeLinecap="round" strokeLinejoin="round"/>
        </marker>
      </defs>
      <path d={`M${x1} ${y1} Q${(x1+x2)/2} ${y1-40} ${x2} ${y2}`}
        fill="none" stroke="var(--panel-danger)" strokeWidth={2}
        strokeDasharray="5 3" markerEnd="url(#leak-arrow)" opacity={0.8}/>
      {/* pulse circles */}
      <circle cx={x1 + (x2-x1)*0.3} cy={y1 - 20} r={5} fill="var(--panel-danger)" opacity={0.15}/>
      <circle cx={x1 + (x2-x1)*0.3} cy={y1 - 20} r={9} fill="none" stroke="var(--panel-danger)" strokeWidth={1} opacity={0.2}/>
    </>
  );
}

// ── Scene components ─────────────────────────────────────────────

export function SceneOfficeFocused() {
  return (
    <svg width="100%" viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Priya at her desk reviewing strategy documents">
      {/* Background: office window */}
      <rect x={440} y={30} width={200} height={180} rx={4} fill="var(--panel-window)" opacity={0.3}/>
      <line x1={540} y1={30} x2={540} y2={210} stroke="var(--panel-ink)" strokeWidth={1} opacity={0.2}/>
      <line x1={440} y1={120} x2={640} y2={120} stroke="var(--panel-ink)" strokeWidth={1} opacity={0.2}/>
      {/* Floor line */}
      <line x1={0} y1={335} x2={680} y2={335} stroke="var(--panel-ink)" strokeWidth={0.5} opacity={0.2}/>
      {/* Desk */}
      <Desk x={60} y={282} w={440}/>
      {/* Monitor */}
      <WorkMonitor x={110} y={168} showChatgpt={false}/>
      {/* Confidential doc on desk */}
      <ConfidentialDoc x={260} y={252}/>
      {/* Coffee cup */}
      <rect x={380} y={260} width={24} height={22} rx={4} fill="var(--panel-bg)" stroke="var(--panel-ink)" strokeWidth={1.2}/>
      <path d="M404 268 Q414 268 414 274 Q414 280 404 280" fill="none" stroke="var(--panel-ink)" strokeWidth={1} opacity={0.5}/>
      {/* Priya: body */}
      <ellipse cx={175} cy={272} rx={24} ry={26} fill="var(--panel-shirt)" stroke="var(--panel-ink)" strokeWidth={2}/>
      <path d="M153 272 Q138 268 126 260" fill="none" stroke="var(--panel-ink)" strokeWidth={2} strokeLinecap="round"/>
      <path d="M197 272 Q212 268 224 260" fill="none" stroke="var(--panel-ink)" strokeWidth={2} strokeLinecap="round"/>
      {/* Priya: head */}
      <PriyaHead cx={175} cy={242} state="focused"/>
      {/* Clock on wall */}
      <circle cx={560} cy={80} r={22} fill="var(--panel-bg)" stroke="var(--panel-ink)" strokeWidth={1.5}/>
      <line x1={560} y1={80} x2={560} y2={64} stroke="var(--panel-ink)" strokeWidth={1.5} strokeLinecap="round"/>
      <line x1={560} y1={80} x2={572} y2={85} stroke="var(--panel-ink)" strokeWidth={1.2} strokeLinecap="round"/>
      <text x={560} y={118} textAnchor="middle" fontSize={9} fill="var(--panel-ink)" opacity={0.4}>9:00 AM</text>
      {/* Deadline note on wall */}
      <rect x={460} y={250} width={130} height={60} rx={3} fill="#fffde7" stroke="var(--panel-ink)" strokeWidth={1} opacity={0.9} transform="rotate(1,525,280)"/>
      <text x={464} y={268} fontSize={9} fill="#555" fontFamily="var(--font-mono,monospace)">Board paper due</text>
      <text x={464} y={281} fontSize={9} fill="#555" fontFamily="var(--font-mono,monospace)">TODAY 5pm</text>
      <text x={464} y={298} fontSize={11} fill="var(--panel-danger)" fontWeight="600" fontFamily="var(--font-mono,monospace)">!!!</text>
    </svg>
  );
}

export function SceneOfficePdeciding() {
  return (
    <svg width="100%" viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Priya looking at her phone, considering using an unapproved AI tool">
      <line x1={0} y1={335} x2={680} y2={335} stroke="var(--panel-ink)" strokeWidth={0.5} opacity={0.2}/>
      <Desk x={60} y={282} w={440}/>
      {/* Both monitor and phone visible */}
      <WorkMonitor x={90} y={168} showChatgpt={false}/>
      <ConfidentialDoc x={230} y={252}/>
      {/* Phone in hand */}
      <Phone x={340} y={220} app="chatgpt"/>
      {/* Hand holding phone */}
      <ellipse cx={364} cy={316} rx={20} ry={10} fill="var(--panel-skin)" stroke="var(--panel-ink)" strokeWidth={1.5}/>
      {/* Priya deciding */}
      <ellipse cx={160} cy={272} rx={24} ry={26} fill="var(--panel-shirt)" stroke="var(--panel-ink)" strokeWidth={2}/>
      <path d="M138 272 Q123 268 111 258" fill="none" stroke="var(--panel-ink)" strokeWidth={2} strokeLinecap="round"/>
      <path d="M182 272 Q197 268 209 258" fill="none" stroke="var(--panel-ink)" strokeWidth={2} strokeLinecap="round"/>
      <PriyaHead cx={160} cy={242} state="deciding"/>
      {/* Thought bubble */}
      <ThoughtBubble cx={470} cy={120} tailX={210} tailY={220}
        lines={['"The approved tool has', 'a queue… this is faster."']}/>
      {/* Versus indicators */}
      <rect x={72} y={148} width={80} height={22} rx={4} fill="#e8f5e9" stroke="#4caf50" strokeWidth={1} opacity={0.8}/>
      <text x={112} y={163} textAnchor="middle" fontSize={8.5} fill="#2e7d32">✓ Approved tool</text>
      <rect x={320} y={208} width={80} height={22} rx={4} fill="#fff3e0" stroke="#ff9800" strokeWidth={1} opacity={0.8}/>
      <text x={360} y={223} textAnchor="middle" fontSize={8.5} fill="#e65100">⚡ Free / fast</text>
    </svg>
  );
}

export function SceneOfficeTyping() {
  return (
    <svg width="100%" viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Priya pasting confidential data into an AI tool — data leaving the organisation">
      <defs>
        <marker id="leak-arrow" viewBox="0 0 10 10" refX={8} refY={5}
          markerWidth={6} markerHeight={6} orient="auto-start-reverse">
          <path d="M2 1L8 5L2 9" fill="none" stroke="var(--panel-danger)"
            strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"/>
        </marker>
      </defs>
      <line x1={0} y1={335} x2={680} y2={335} stroke="var(--panel-ink)" strokeWidth={0.5} opacity={0.2}/>
      <Desk x={60} y={282} w={440}/>
      {/* Monitor now showing ChatGPT */}
      <WorkMonitor x={90} y={168} showChatgpt={true}/>
      {/* Doc, slightly dishevelled */}
      <ConfidentialDoc x={240} y={258} rotation={-8}/>
      {/* Keyboard action */}
      <rect x={100} y={292} width={90} height={12} rx={4} fill="var(--panel-desk)" opacity={0.3} stroke="var(--panel-ink)" strokeWidth={0.5}/>
      {/* Priya typing, focused down */}
      <ellipse cx={155} cy={272} rx={24} ry={26} fill="var(--panel-shirt)" stroke="var(--panel-ink)" strokeWidth={2}/>
      <path d="M133 272 Q118 270 106 264" fill="none" stroke="var(--panel-ink)" strokeWidth={2} strokeLinecap="round"/>
      <path d="M177 272 Q192 270 204 264" fill="none" stroke="var(--panel-ink)" strokeWidth={2} strokeLinecap="round"/>
      <PriyaHead cx={155} cy={242} state="typing"/>
      {/* DATA LEAVING — dramatic arrow to cloud */}
      <path d={`M186 168 Q340 80 520 100`}
        fill="none" stroke="var(--panel-danger)" strokeWidth={2}
        strokeDasharray="5 3" markerEnd="url(#leak-arrow)" opacity={0.8}/>
      {/* Cloud / server icon at end */}
      <ellipse cx={540} cy={94} rx={30} ry={18} fill="var(--panel-bg)" stroke="var(--panel-danger)" strokeWidth={1.5} opacity={0.7}/>
      <ellipse cx={522} cy={100} rx={20} ry={13} fill="var(--panel-bg)" stroke="var(--panel-danger)" strokeWidth={1.5} opacity={0.7}/>
      <ellipse cx={558} cy={102} rx={16} ry={11} fill="var(--panel-bg)" stroke="var(--panel-danger)" strokeWidth={1.5} opacity={0.7}/>
      <text x={540} y={100} textAnchor="middle" fontSize={8} fill="var(--panel-danger)" opacity={0.9}>3rd party</text>
      <text x={540} y={111} textAnchor="middle" fontSize={8} fill="var(--panel-danger)" opacity={0.9}>server</text>
      {/* Warning pulse rings */}
      <circle cx={186} cy={168} r={8} fill="var(--panel-danger)" opacity={0.15}/>
      <circle cx={186} cy={168} r={14} fill="none" stroke="var(--panel-danger)" strokeWidth={1} opacity={0.2}/>
      <circle cx={186} cy={168} r={20} fill="none" stroke="var(--panel-danger)" strokeWidth={0.5} opacity={0.1}/>
      {/* Lock icon broken */}
      <rect x={170} y={154} width={16} height={12} rx={3} fill="none" stroke="var(--panel-danger)" strokeWidth={1.5} opacity={0.6}/>
      <path d="M173 154 Q173 148 178 148 Q183 148 183 154" fill="none" stroke="var(--panel-danger)" strokeWidth={1.5} opacity={0.6}/>
      <path d="M183 150 Q188 145 190 148" fill="none" stroke="var(--panel-danger)" strokeWidth={1.5} strokeLinecap="round" opacity={0.6}/>
    </svg>
  );
}

