// Doorway + index — one page.
//
// The doors are the hero (two featured scenarios). Below them, every scenario
// is present as a designed, full-width index grouped by door — not hidden
// behind a toggle. The catalogue is the product's substance; hiding it treated
// it like an advanced feature. "explore all 9" now scrolls to the index rather
// than revealing it.

import { Link } from 'react-router-dom';
import { scenarios, FEATURED_PAIR } from '../../scenarios/index.js';
import s from './Homepage.module.css';

export default function Homepage() {
  const pair = FEATURED_PAIR.map((id) => scenarios.find((sc) => sc.id === id)).filter(Boolean);
  const home = scenarios.filter((sc) => sc.door === 'home');
  const work = scenarios.filter((sc) => sc.door === 'work');

  return (
    <main className={s.page}>
      <section className={s.hero}>
        <h1 className={s.headline}>
          What would<span className={s.outline}>you do?</span>
        </h1>
        <div className={s.heroRight}>
          <p className={s.explain}>
            Choose your own adventure in AI risk. Start at home or at work below — or{' '}
            <button
              type="button"
              className={s.inlineLink}
              onClick={() => document.getElementById('all')?.scrollIntoView({ behavior: 'smooth' })}
            >
              see all {scenarios.length} situations
            </button>.
          </p>
          <ul className={s.facts}>
            <li>About 5 minutes</li>
            <li>Nothing scored</li>
            <li>Just explore</li>
          </ul>
        </div>
      </section>

      <div className={s.doors}>
        {pair.map((sc) => (
          <Link
            key={sc.id}
            to={`/scenario/${sc.id}`}
            className={`${s.door} ${sc.door === 'home' ? s.doorHome : s.doorWork}`}
          >
            {sc.doorScene && (
              <img
                className={s.doorImage}
                src={`${import.meta.env.BASE_URL}scenes/${sc.doorScene}.webp`}
                alt=""
                width="928"
                height="1152"
                loading="eager"
              />
            )}
            <div className={s.doorInk}>
              <span className={s.doorLabel}>{sc.door === 'home' ? 'At home' : 'At work'}</span>
              <h2 className={s.hook}>{sc.hook}</h2>
              <span className={s.doorGo}>Start</span>
            </div>
          </Link>
        ))}
      </div>

      <section className={s.index} id="all">
        <div className={s.indexHead}>
          <h2 className={s.indexTitle}>All {scenarios.length} situations</h2>
          <p className={s.indexSub}>Start with whichever one sounds most like your week.</p>
        </div>

        <IndexGroup label="At home" door="home" items={home} s={s} />
        <IndexGroup label="At work" door="work" items={work} s={s} />
      </section>
    </main>
  );
}

function IndexGroup({ label, door, items, s }) {
  return (
    <div className={`${s.group} ${door === 'home' ? s.groupHome : s.groupWork}`}>
      <div className={s.groupBar}>
        <span className={s.groupLabel}>{label}</span>
        <span className={s.groupCount}>{items.length}</span>
      </div>
      <ul className={s.rows}>
        {items.map((sc) => (
          <li key={sc.id}>
            <Link to={`/scenario/${sc.id}`} className={s.row}>
              <span className={s.rowLine}>{sc.shelfLine}</span>
              <span className={s.rowGo} aria-hidden="true">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
