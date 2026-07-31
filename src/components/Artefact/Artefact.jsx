// ─────────────────────────────────────────────────────────────────────────
// Artefact — the thing under judgement.
//
// FREE_PRODUCT §5.2 defines a closed vocabulary of six types. Adding a
// seventh is a design decision, not an authoring one, so this dispatcher
// throws in development rather than silently rendering nothing.
//
// Every type renders in its own native visual language (§5.1). The product
// register stops at the frame edge. Source marks sit INSIDE the frame so
// they survive a screenshot (§5.3).
// ─────────────────────────────────────────────────────────────────────────

import s from './Artefact.module.css';

const TYPES = ['message_thread', 'email', 'assistant_output', 'document', 'system_output', 'transcript'];

/* ── Message thread ──────────────────────────────────────────────────────
   Sender identity as DISPLAYED, never as true. The frame states whose
   phone this is, because At Home players are often reading someone
   else's conversation. */
function MessageThread({ a }) {
  return (
    <div className={`${s.frame} ${s.phone}`}>
      <div className={s.phoneBar}>
        <span className={s.phoneWho}>{a.contact}</span>
        {a.contactNote && <span className={s.phoneNote}>{a.contactNote}</span>}
      </div>
      <ol className={s.thread}>
        {a.messages.map((m, i) => (
          <li key={i} className={m.gap ? s.msgGap : undefined}>
            {m.gap && <p className={s.elapsed}>{m.gap}</p>}
            <div className={m.from === 'you' ? s.bubbleOut : s.bubbleIn}>
              <p>{m.text}</p>
              {m.meta && <span className={s.bubbleMeta}>{m.meta}</span>}
            </div>
          </li>
        ))}
      </ol>
      {a.mark && <p className={s.mark}>{a.mark}</p>}
    </div>
  );
}

/* ── Email ───────────────────────────────────────────────────────────────
   The gap between display name and actual address is the most reusable
   tell in the product, so the address is always rendered, always in mono,
   and never truncated. */
function Email({ a }) {
  return (
    <div className={`${s.frame} ${s.email}`}>
      <div className={s.emailHead}>
        <p className={s.emailSubject}>{a.subject}</p>
        <p className={s.emailFrom}>
          <span className={s.emailName}>{a.fromName}</span>
          <span className={s.emailAddr}>&lt;{a.fromAddress}&gt;</span>
        </p>
        <p className={s.emailTo}>to {a.to}{a.date ? ` · ${a.date}` : ''}</p>
      </div>
      <div className={s.emailBody}>
        {a.body.map((para, i) => <p key={i}>{para}</p>)}
        {a.signature && <p className={s.emailSig}>{a.signature}</p>}
      </div>
      {a.attachment && (
        <p className={s.attachment}>
          <span aria-hidden="true">▤</span> {a.attachment}
        </p>
      )}
    </div>
  );
}

/* ── Assistant output ────────────────────────────────────────────────────
   Prompt and response together. Machine-authored and it should look it.
   Fabricated citations use invented journals and invented authors (§5.3). */
function AssistantOutput({ a }) {
  return (
    <div className={`${s.frame} ${s.assistant}`}>
      <p className={s.assistantMark}>{a.tool || 'Assistant'}</p>
      {a.prompt && (
        <div className={s.prompt}>
          <p className={s.promptLabel}>You asked</p>
          <p>{a.prompt}</p>
        </div>
      )}
      <div className={s.response}>
        {a.response.map((para, i) => <p key={i}>{para}</p>)}
        {a.citations && (
          <ol className={s.citations}>
            {a.citations.map((c, i) => <li key={i}>{c}</li>)}
          </ol>
        )}
      </div>
    </div>
  );
}

/* ── Document excerpt ────────────────────────────────────────────────────
   Must be able to carry content that is present, visible and missable —
   that is the entire mechanism of indirect prompt injection, so `lines`
   accepts a `faint` flag rather than hiding anything from assistive tech. */
function DocumentExcerpt({ a }) {
  return (
    <div className={`${s.frame} ${s.doc}`}>
      <p className={s.docName}>{a.filename}</p>
      {a.meta && <p className={s.docMeta}>{a.meta}</p>}
      <div className={s.docBody}>
        {a.lines.map((l, i) =>
          typeof l === 'string'
            ? <p key={i}>{l}</p>
            : <p key={i} className={l.faint ? s.docFaint : s.docHeading}>{l.text}</p>
        )}
      </div>
    </div>
  );
}

/* ── System output ───────────────────────────────────────────────────────
   Carries a confidence figure, a rationale line, and a trail of what has
   already been done. The trail is the part that makes automation feel
   like it has run ahead of you. */
function SystemOutput({ a }) {
  return (
    <div className={`${s.frame} ${s.system}`}>
      <div className={s.systemHead}>
        <span className={s.systemTool}>{a.system}</span>
        {a.status && <span className={s.systemStatus}>{a.status}</span>}
      </div>
      <p className={s.systemHeadline}>{a.headline}</p>
      {a.fields && (
        <dl className={s.systemFields}>
          {a.fields.map((f, i) => (
            <div key={i} className={s.systemRow}>
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>
      )}
      {a.rationale && <p className={s.systemRationale}>{a.rationale}</p>}
      {a.trail && (
        <ol className={s.trail}>
          {a.trail.map((t, i) => <li key={i}>{t}</li>)}
        </ol>
      )}
    </div>
  );
}

/* ── Transcript ──────────────────────────────────────────────────────────
   A call rendered as text, so no beat in the product requires hearing
   (§5.2). Disfluencies and timing are where voice-clone tells live, so
   they are authored into the line, not described around it. */
function Transcript({ a }) {
  return (
    <div className={`${s.frame} ${s.transcript}`}>
      <div className={s.transcriptHead}>
        <span>{a.source}</span>
        {a.duration && <span className={s.transcriptDur}>{a.duration}</span>}
      </div>
      <ol className={s.lines}>
        {a.lines.map((l, i) => (
          <li key={i}>
            {l.time && <span className={s.time}>{l.time}</span>}
            <span className={s.speaker}>{l.speaker}</span>
            <span className={s.said}>{l.text}</span>
          </li>
        ))}
      </ol>
      {a.note && <p className={s.transcriptNote}>{a.note}</p>}
    </div>
  );
}

const RENDERERS = {
  message_thread:   MessageThread,
  email:            Email,
  assistant_output: AssistantOutput,
  document:         DocumentExcerpt,
  system_output:    SystemOutput,
  transcript:       Transcript,
};

export default function Artefact({ artefact }) {
  if (!artefact) return null;

  const Renderer = RENDERERS[artefact.type];
  if (!Renderer) {
    if (import.meta.env.DEV) {
      throw new Error(
        `Artefact type "${artefact.type}" is outside the closed vocabulary. ` +
        `Valid types: ${TYPES.join(', ')}. Adding one is a design decision (FREE_PRODUCT §5.2).`
      );
    }
    return null;
  }

  return (
    <figure className={s.wrap}>
      {artefact.caption && <figcaption className={s.caption}>{artefact.caption}</figcaption>}
      <Renderer a={artefact} />
    </figure>
  );
}

export { TYPES };
