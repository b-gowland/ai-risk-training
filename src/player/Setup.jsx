// Setup — the frame, not the story.
//
// §4.2: "Setup contains only what the player cannot infer." It carries the
// standing, the authority (what you cannot do matters more than what you
// can), how it ends, and its shape.
//
// It also carries the cold open. The doorway card shows one display line over
// the image — a cover, not a poster with body copy — so the open is read here
// for the first time however the player arrived, and nothing is shown twice.

import { depthBand, spell } from './depth.js';
import s from './Player.module.css';

export default function Setup({ scenario, onBegin }) {
  const { min, max } = depthBand(scenario);

  return (
    <article className={s.screen} data-door={scenario.door} tabIndex={-1} aria-labelledby="setup-title">
      <div className={s.margin}>
        <p className={s.door}>{scenario.door === 'home' ? 'At home' : 'At work'}</p>
      </div>

      <div className={s.body}>
        <h1 id="setup-title" className={s.title}>{scenario.title}</h1>

        {scenario.scene && (
          <img
            className={s.scene}
            src={`${import.meta.env.BASE_URL}scenes/${scenario.scene}.webp`}
            alt=""
            width="1024"
            height="448"
            loading="eager"
          />
        )}

        <div className={s.coldOpen}>
          {scenario.coldOpen.map((para, i) => <p key={i}>{para}</p>)}
        </div>

        <dl className={s.standing}>
          {scenario.standing && (
            <div>
              <dt>You are</dt>
              <dd>{scenario.standing}</dd>
            </div>
          )}
          <div>
            <dt>You can</dt>
            <dd>{scenario.authority}</dd>
          </div>
          <div>
            <dt>How it ends</dt>
            <dd>
              {scenario.ending}
              {scenario.determinacy === 'open' && (
                <> There is no clean answer here, and the debrief says so.</>
              )}
            </dd>
          </div>
        </dl>

        <button type="button" className={s.primary} onClick={onBegin}>
          {scenario.begin || 'Start'}
        </button>

        <p className={s.setupMeta}>
          {min === max ? `${spell(min)} decisions` : `${spell(min)} to ${spell(max)} decisions`}
          {' · nothing scored'}
        </p>
      </div>
    </article>
  );
}
