// Decision — prose, optional artefact, the question, the options.
//
// §4.3–4.4. Committing is irreversible, and the consequence is returned in
// place: the screen does not change to deliver a verdict, and no word in it
// grades the choice. The player draws the conclusion.
//
// The position indicator is a learning feature rather than decoration.
// Progress visualisation is one of the mechanics the evidence review says to
// borrow, and unclear decision points are one of the documented ways
// branching scenarios lose people — hence the rule above the prompt.

import { useEffect, useRef, useState } from 'react';
import Artefact from '../components/Artefact/Artefact.jsx';
import { FlagPicker, FlagReveal } from './Flags.jsx';
import { resolveParas } from '../engine/narrativeEngine.js';
import s from './Player.module.css';

export default function Decision({ node, path, revealedChoice, onCommit, onAdvance, index, minDepth, scenarioTitle }) {
  const consequenceRef = useRef(null);
  // Flags are per node: what was picked is kept with the node it belongs
  // to, so a new node starts with nothing picked.
  const [flagState, setFlagState] = useState({ node: null, picked: null });
  const flagged = flagState.node === node ? flagState.picked : null;
  const setFlagged = (picked) => setFlagState({ node, picked });
  const needsFlags = Boolean(node.flags) && flagged === null && !revealedChoice;

  useEffect(() => {
    if (revealedChoice && consequenceRef.current) consequenceRef.current.focus();
  }, [revealedChoice]);

  const ticks = Math.max(minDepth, index);

  return (
    <article className={s.screen} tabIndex={-1} aria-labelledby="decision-step">
      <div className={s.margin}>
        {scenarioTitle && <p className={s.caseTitle}>{scenarioTitle}</p>}
        {/* Visual only: "Decision {index}" below says the same thing to a
            screen reader, which otherwise hears "01decision". */}
        <span className={s.counter} aria-hidden="true">{String(index).padStart(2, '0')}</span>
        <span className={s.counterOf} aria-hidden="true">decision</span>
        <div className={s.rail} aria-hidden="true">
          {Array.from({ length: ticks }, (_, i) => (
            <span
              key={i}
              className={`${s.tick} ${i < index - 1 ? s.tickDone : ''} ${i === index - 1 ? s.tickNow : ''}`}
            />
          ))}
        </div>
        <p id="decision-step" className="srOnly">Decision {index}</p>
      </div>

      <div className={s.body}>
        <div className={s.prose}>
          {resolveParas(node.prose, path).map((para, i) => <p key={i}>{para}</p>)}
        </div>

        {node.artefact && <Artefact artefact={node.artefact} />}

        {node.decision && (
          <>
            {!needsFlags && <h2 className={s.prompt}>{node.decision.prompt}</h2>}

            {needsFlags && <FlagPicker flags={node.flags} onDone={setFlagged} />}

            {!revealedChoice && !needsFlags && (
              <ul className={s.options}>
                {node.decision.choices.map((c) => (
                  <li key={c.id}>
                    <button type="button" className={s.option} onClick={() => onCommit(c)}>
                      {c.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {revealedChoice && (
              <div className={s.consequence}>
                <p className={s.chosen}>{revealedChoice.label}</p>
                <div
                  className={s.consequenceBody}
                  ref={consequenceRef}
                  tabIndex={-1}
                  data-tone={revealedChoice.quality}
                >
                  <p>{revealedChoice.consequence}</p>
                </div>
                {node.flags && <FlagReveal flags={node.flags} picked={flagged || []} />}
                <button type="button" className={s.primary} onClick={onAdvance}>Keep going</button>
              </div>
            )}
          </>
        )}

        {!node.decision && (
          <button type="button" className={s.primary} onClick={onAdvance}>Keep going</button>
        )}
      </div>
    </article>
  );
}
