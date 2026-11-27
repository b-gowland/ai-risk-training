// Flags — "what makes you pause", before the choices (27 Nov 2026).
//
// Ported from the commercial module's evidence-flagging step, which the free
// product review (docs/PRODUCT_REVIEW.md §2) had listed as a trial. Tapping
// details before choosing is a small forcing step: it asks the player to look
// at the evidence before acting on the feeling. After the choice, the reveal
// separates the warning signs from the details that settle nothing either
// way, which is the transferable part.
//
// Nothing is recorded. The step is skippable, and choices never depend on it.

import { useState } from 'react';
import s from './Player.module.css';

export function FlagPicker({ flags, onDone }) {
  const [picked, setPicked] = useState([]);
  const toggle = (id) =>
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  return (
    <section className={s.flags} aria-labelledby="flags-prompt">
      <h2 id="flags-prompt" className={s.prompt}>{flags.prompt}</h2>
      <ul className={s.flagList}>
        {flags.items.map((f) => (
          <li key={f.id}>
            <button
              type="button"
              className={picked.includes(f.id) ? s.flagOn : s.flag}
              aria-pressed={picked.includes(f.id)}
              onClick={() => toggle(f.id)}
            >
              {f.label}
            </button>
          </li>
        ))}
      </ul>
      <div className={s.flagActions}>
        <button type="button" className={s.primary} disabled={picked.length === 0} onClick={() => onDone(picked)}>
          {picked.length === 0 ? 'Tap at least one' : 'Now decide'}
        </button>
        <button type="button" className={s.skip} onClick={() => onDone([])}>
          Skip this
        </button>
      </div>
    </section>
  );
}

export function FlagReveal({ flags, picked }) {
  const signs = flags.items.filter((f) => f.matters);
  const neutral = flags.items.filter((f) => !f.matters);
  const mark = (f) => (picked.includes(f.id) ? ' (you tapped this)' : '');
  return (
    <section className={s.flagReveal} aria-label="What mattered in that call">
      <h3 className={s.flagHead}>{flags.signsHead}</h3>
      <ul>
        {signs.map((f) => <li key={f.id}>{f.label}<span className={s.flagMine}>{mark(f)}</span></li>)}
      </ul>
      <h3 className={s.flagHead}>{flags.neutralHead}</h3>
      <ul>
        {neutral.map((f) => <li key={f.id}>{f.label}<span className={s.flagMine}>{mark(f)}</span></li>)}
      </ul>
      {flags.note && <p className={s.flagNote}>{flags.note}</p>}
    </section>
  );
}
