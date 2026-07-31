// Debrief — one screen. What happened, and how it reads.
//
// This was three paced screens, which was itself a fix for a single 350-word
// wall. Testers found five wrap-up screens too many, and they are right: the
// segmenting principle argues for one idea per screen during instruction, not
// for stretching an ending across five taps after the decisions are over.
//
// What was cut to get here: the decision recap. It listed back the choices the
// player had just made, one screen after making them — the lowest-value
// element in the sequence and the only one that told them nothing new. The
// four movements survive; the summary of themselves does not.

import s from './Player.module.css';

export default function Debrief({ outcome, onClose }) {
  return (
    <article className={s.screen}>
      <div className={s.margin}>
        <p className={s.beat}>What happened</p>
      </div>

      <div className={s.body}>
        <h1 className={s.title}>{outcome.heading}</h1>

        <p className={s.reaction}>{outcome.reaction}</p>

        <div className={s.proseSoft}>
          {outcome.description.map((para, i) => <p key={i}>{para}</p>)}
        </div>

        <div className={`${s.prose} ${s.afterRecap}`}>
          <p>{outcome.judgement}</p>
        </div>

        <button type="button" className={s.primary} onClick={onClose}>
          Go on
        </button>
      </div>
    </article>
  );
}
