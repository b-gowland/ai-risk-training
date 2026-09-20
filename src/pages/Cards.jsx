// Cards.jsx — printable discussion cards, one deck of eight per scenario.
//
// A facilitated, offline version of each scenario for a table of three to six
// people: situation, evidence, a private vote, then face-down reveal cards for
// the consequences, the debrief frame and the recall. Everything on a card is
// read from the registered scenario at render time, so the cards cannot drift
// from the app. The only authored copy here is layout and facilitation.
//
// Deliberately cut at the first decision. The full branching scenario is one
// tap away, and card 8 says so.
//
// Print: single-sided A4, four cards a sheet, 6mm page margin to stay clear of
// home-printer dead zones. Duplex is avoided on purpose — it mis-registers.
//
// Claims discipline: no efficacy claim. No personal names on any surface.

import { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { scenarios } from '../scenarios/index.js';
import { trackCardsPrinted } from '../utils/analytics.js';
import a from './About.module.css';
import s from './Cards.module.css';

const APP_URL = 'app.airiskpractice.org/#/scenario/';
const DOOR = { home: 'At home', work: 'At work' };
const LETTERS = 'ABCD';
const SOURCE = 'github.com/b-gowland/ai-risk-training';

// ── Artefacts at card scale ─────────────────────────────────────────
// Compact renderers for the closed vocabulary of six (§5.2). They read the
// same fields as components/Artefact; cards.test.jsx asserts the authored
// content reaches the DOM for every artefact a card shows.

function Cap({ left, right }) {
  return left || right ? (
    <div className={s.artCap}><span>{left}</span><span>{right}</span></div>
  ) : null;
}

export function CardArtefact({ artefact: x }) {
  if (!x) return null;

  switch (x.type) {
    case 'transcript':
      return (
        <div className={s.art}>
          <Cap left={x.caption} right={[x.source, x.duration].filter(Boolean).join(', ')} />
          {(x.lines || []).map((l, i) => (
            <div key={i} className={s.tRow}>
              <span className={s.faint}>{l.time}</span>
              <span className={s.who}>{l.speaker}</span>
              <span>{l.text}</span>
            </div>
          ))}
          {x.note && <div className={s.artNote}>{x.note}</div>}
        </div>
      );
    case 'document':
      return (
        <div className={s.art}>
          <Cap left={x.caption} />
          <div className={s.meta}>{x.filename}{x.meta && <><br />{x.meta}</>}</div>
          {(x.lines || []).map((l, i) =>
            typeof l === 'string' ? <p key={i}>{l}</p> : (
              <p key={i} className={`${l.heading ? s.artH : ''} ${l.faint ? s.faint : ''}`}>{l.text}</p>
            )
          )}
        </div>
      );
    case 'assistant_output':
      return (
        <div className={s.art}>
          <Cap left={x.caption} right={x.tool} />
          {x.prompt && <div className={s.you}>{x.prompt}</div>}
          {(x.response || []).map((t, i) => <p key={i}>{t}</p>)}
          {x.citations?.length > 0 && (
            <div className={s.artNote}>{x.citations.map((c, i) => <div key={i}>{c}</div>)}</div>
          )}
        </div>
      );
    case 'email':
      return (
        <div className={s.art}>
          <Cap left={x.caption} />
          <div className={s.meta}>
            From {x.fromName} &lt;{x.fromAddress}&gt;<br />To {x.to}{x.date && `, ${x.date}`}
          </div>
          <div className={s.artH}>{x.subject}</div>
          {(x.body || []).map((t, i) => <p key={i}>{t}</p>)}
          {x.signature && <p>{x.signature}</p>}
        </div>
      );
    case 'system_output':
      return (
        <div className={s.art}>
          <Cap left={x.caption} />
          <div className={s.meta}>{x.system}</div>
          <div className={s.artH}>
            {x.status && <span className={s.status}>{x.status}</span>} {x.headline}
          </div>
          {(x.fields || []).map((f, i) => (
            <div key={i} className={s.field}><span className={s.faint}>{f.label}</span><span>{f.value}</span></div>
          ))}
          {x.rationale && <div className={s.artNote}>{x.rationale}</div>}
          {x.trail?.length > 0 && (
            <div className={s.artNote}>{x.trail.map((t, i) => <div key={i}>{t}</div>)}</div>
          )}
        </div>
      );
    case 'message_thread':
      return (
        <div className={s.art}>
          <Cap left={x.caption} right={x.contact} />
          {(x.messages || []).map((m, i) => (
            <div key={i} className={s.mRow}>
              <span className={s.who}>{m.from === 'you' ? 'You' : x.contact}</span><span>{m.text}</span>
            </div>
          ))}
        </div>
      );
    default:
      // Same stance as the app's dispatcher: an unknown type is a design
      // decision nobody made, so say so loudly rather than print a blank frame.
      if (import.meta.env?.DEV) throw new Error(`Cards: unsupported artefact type "${x.type}"`);
      return <div className={s.art}>Unsupported artefact: {x.type}</div>;
  }
}

// ── One card ────────────────────────────────────────────────────────

function Card({ sc, n, role, reveal, prompt, children }) {
  return (
    <div className={s.cell}>
      <article className={`${s.card} ${reveal ? s.reveal : ''}`} data-door={sc.door} data-card={n}>
        <div className={s.head}>
          <span><b>{n}</b> of 8&ensp;{role}</span>
          <span className={s.band}>{reveal || DOOR[sc.door]}</span>
        </div>
        <div className={s.body}><div className={s.inner}>{children}</div></div>
        {prompt && <div className={s.prompt}>{prompt}</div>}
        <div className={s.foot}><span>{sc.title}</span><span>airiskpractice.org</span></div>
      </article>
    </div>
  );
}

// ── A deck: eight cards, two A4 sheets ──────────────────────────────

export function Deck({ sc, printedOn }) {
  const start = sc.nodes[sc.entry || 'start'];
  const decision = start.decision;
  const base = import.meta.env?.BASE_URL ?? '/';

  const cards = [
    <Card key={1} sc={sc} n={1} role="The situation"
      prompt="Before anyone reads on: what would you want to know first?">
      {sc.scene && (
        <div className={s.scene}><img src={`${base}scenes/${sc.scene}.webp`} alt="" loading="lazy" /></div>
      )}
      <h3 className={s.title}>{sc.title}</h3>
      {sc.coldOpen.map((t, i) => <p key={i}>{t}</p>)}
      <div className={s.can}>
        {sc.standing && <><span className={s.lbl}>You are</span><p className={s.small}>{sc.standing}</p></>}
        <span className={s.lbl}>What you can do</span><p className={s.small}>{sc.authority}</p>
      </div>
    </Card>,

    <Card key={2} sc={sc} n={2} role="What's in front of you"
      prompt="What here is evidence, and what is just pressure?">
      {(start.prose || []).map((t, i) => <p key={i}>{t}</p>)}
      <CardArtefact artefact={start.artefact} />
    </Card>,

    <Card key={3} sc={sc} n={3} role="Your call"
      prompt="Everyone picks privately. Show fingers on three, then argue it out.">
      <h4 className={s.q}>{decision.prompt}</h4>
      <ol className={s.opts}>
        {decision.choices.map((c, i) => (
          <li key={c.id}><span className={s.let}>{LETTERS[i]}</span><span>{c.label}</span></li>
        ))}
      </ol>
      <div className={s.tally}>{decision.choices.map((c, i) => <span key={c.id}>{LETTERS[i]}</span>)}</div>
    </Card>,

    <Card key={4} sc={sc} n={4} role="What followed" reveal="Face down until everyone has chosen"
      prompt="Which of these went differently from what you expected?">
      <ol className={`${s.opts} ${s.revealOpts}`}>
        {decision.choices.map((c, i) => (
          <li key={c.id}><span className={s.let}>{LETTERS[i]}</span><span><b>{c.label}</b>{c.consequence}</span></li>
        ))}
      </ol>
    </Card>,

    <Card key={5} sc={sc} n={5} role="How it reads" reveal="Face down until after card 4">
      <h4 className={s.q}>How an experienced person reads it</h4>
      {sc.debrief.frame.map((t, i) => <p key={i}>{t}</p>)}
    </Card>,

    <Card key={6} sc={sc} n={6} role="Same trick, new disguise" prompt="Answer privately first.">
      <h4 className={s.q}>{sc.recall.prompt}</h4>
      <ol className={s.opts}>
        {sc.recall.options.map((o, i) => (
          <li key={o.id}><span className={s.let}>{LETTERS[i]}</span><span>{o.label}</span></li>
        ))}
      </ol>
    </Card>,

    <Card key={7} sc={sc} n={7} role="What settles it" reveal="Face down until everyone has answered card 6"
      prompt="Where does this show up in your own week?">
      <ol className={`${s.opts} ${s.revealOpts}`}>
        {sc.recall.options.map((o, i) => (
          <li key={o.id}><span className={s.let}>{LETTERS[i]}</span><span><b>{o.label}</b>{o.note}</span></li>
        ))}
      </ol>
    </Card>,

    <Card key={8} sc={sc} n={8} role="Take it home" prompt="Say your one action out loud to the table.">
      <p className={s.tell}>{sc.tell}</p>
      <span className={s.lbl}>Pick one for this week</span>
      <ul className={s.acts}>{sc.act.map((x) => <li key={x.id}><span>{x.label}</span></li>)}</ul>
      <div className={s.can}>
        <span className={s.lbl}>Play the full scenario, with every ending</span>
        <span className={s.url}>{APP_URL}{sc.id}</span>
        {printedOn && <span className={s.stamp}>Printed {printedOn}</span>}
      </div>
    </Card>,
  ];

  return (
    <>
      <div className={s.sheet}>{cards.slice(0, 4)}</div>
      <div className={s.sheet}>{cards.slice(4)}</div>
    </>
  );
}

// ── Facilitator sheet — prints as the last page of every job ────────

function FacilitatorSheet() {
  return (
    <section className={s.facil} aria-labelledby="facil-h">
      <h2 id="facil-h" className={s.facilH}>Running a table</h2>
      <p className={s.facilSub}>
        About twenty-five minutes per scenario. No preparation, and you do not need to know the
        answer — the cards carry it.
      </p>
      <ol className={s.steps}>
        <li><b>Deal the deck in order.</b> Cards 4, 5 and 7 have an orange band. Put those face down in a pile beside you.</li>
        <li><b>Read cards 1 and 2 aloud</b>, or pass them round. Let people look at the evidence properly; most of the discussion lives there.</li>
        <li><b>Card 3: everyone chooses privately.</b> Count to three and hold up fingers for A, B, C or D. Deciding before talking stops the loudest person setting the answer.</li>
        <li><b>Talk before you turn anything over.</b> Why did people pick differently? What would change their mind?</li>
        <li><b>Turn over card 4</b> to see what followed each choice, then <b>card 5</b> for how an experienced person reads the whole thing.</li>
        <li><b>Card 6 is the same trick in a new disguise.</b> Private answers again, then turn over card 7.</li>
        <li><b>Card 8 goes home.</b> Ask each person to pick one action and say it out loud.</li>
      </ol>
      <h3 className={s.facilH3}>If the table goes quiet</h3>
      <p>Ask who found the wrong answer tempting, and why. The pull of the wrong choice is the useful part — nobody in these scenarios is stupid.</p>
      <h3 className={s.facilH3}>What the cards leave out</h3>
      <p>
        The cards stop at the first decision. The full scenario branches from there to several
        different endings, and plays on a phone in about five minutes (at home) or eight to ten
        (at work) at app.airiskpractice.org.
      </p>
      <p className={s.fine}>
        AI Risk Practice is free and open source. Scenario content is licensed CC BY 4.0 — copy,
        adapt and share these cards, crediting AI Risk Practice ({SOURCE}).
      </p>
    </section>
  );
}

// ── Page ────────────────────────────────────────────────────────────

const today = () =>
  new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });

export default function Cards() {
  const [params, setParams] = useSearchParams();
  const requested = params.get('s');
  const current = scenarios.some((x) => x.id === requested) ? requested : scenarios[0].id;
  const [all, setAll] = useState(false);
  const [pictures, setPictures] = useState(true);
  const deckRef = useRef(null);

  const shown = all ? scenarios : scenarios.filter((x) => x.id === current);
  const one = scenarios.find((x) => x.id === current);

  // Auto-fit: each card's text is scaled between 0.8x and 1.3x so the dense
  // cards fit and the sparse ones are readable across a table. Sizes are in
  // card-relative units, so a fit measured on screen holds on paper; the 4%
  // slack absorbs line-break differences between the two.
  const fit = useCallback(() => {
    const root = deckRef.current;
    if (!root) return;
    root.querySelectorAll(`.${s.card}`).forEach((el) => {
      const body = el.querySelector(`.${s.body}`);
      const inner = el.querySelector(`.${s.inner}`);
      if (!body || !inner || !body.clientHeight) return; // not laid out (tests, hidden)
      const room = () => body.clientHeight - parseFloat(getComputedStyle(body).paddingTop || 0);
      let f = 1.3;
      el.style.setProperty('--fit', f);
      while (inner.offsetHeight > room() * 0.96 && f > 0.8) {
        f = Math.round((f - 0.025) * 1000) / 1000;
        el.style.setProperty('--fit', f);
      }
      el.dataset.overflow = inner.offsetHeight > room() ? 'true' : 'false';
    });
  }, []);

  useLayoutEffect(() => { fit(); }, [fit, current, all, pictures]);

  useEffect(() => {
    document.body.classList.add(s.printScope);
    let t;
    const onResize = () => { clearTimeout(t); t = setTimeout(fit, 150); };
    window.addEventListener('resize', onResize);
    document.fonts?.ready?.then(fit);
    const after = () => setAll(false);
    window.addEventListener('afterprint', after);
    return () => {
      document.body.classList.remove(s.printScope);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('afterprint', after);
      clearTimeout(t);
    };
  }, [fit]);

  const printOne = () => { trackCardsPrinted(current); window.print(); };
  const printAll = () => {
    trackCardsPrinted('all');
    setAll(true);
    // Let the other eight decks render and fit before the print dialog opens.
    setTimeout(() => window.print(), 250);
  };

  const pick = (id) => { setAll(false); setParams({ s: id }, { replace: true }); };

  return (
    <main className={`${a.page} ${s.page}`}>
      <div className={`${a.inner} ${s.intro} ${s.screenOnly}`}>
        <Link to="/" className={a.back}>← Back to the situations</Link>
        <h1 className={a.h1}>Discussion cards</h1>
        <p className={a.lede}>
          Every situation also comes as eight printable cards, for a table of three to six people
          at work, in a class or at a community session. The group reads the situation, looks at
          the evidence, and everyone makes the call privately before anyone argues. Then the
          face-down cards come over.
        </p>

        <section className={a.section}>
          <h2 className={a.h2}>Printing</h2>
          <ul className={a.list}>
            <li><strong>Single-sided, A4, actual size.</strong> Choose 100% or &ldquo;actual size&rdquo; in the print dialog, not &ldquo;fit to page&rdquo;, or the cut lines will be off.</li>
            <li><strong>Two sheets per scenario</strong>, plus a facilitator sheet at the end of every print job.</li>
            <li><strong>Cut along the dashed lines.</strong> Each card is a little under A6. Card stock helps but plain paper works.</li>
            <li><strong>Black and white is fine.</strong> Nothing depends on colour. Turn pictures off below to save ink.</li>
            <li><strong>Saving a PDF to share?</strong> Choose &ldquo;Save as PDF&rdquo; as the printer.</li>
          </ul>
        </section>

        <section className={a.section}>
          <h2 className={a.h2}>Running a table</h2>
          <p className={a.p}>
            Allow about twenty-five minutes a scenario. The facilitator does not need to know the
            answer; the cards carry the reasoning. The steps are printed on the facilitator sheet.
            The one rule that matters: everyone chooses on card 3 before anyone discusses it.
          </p>
        </section>
      </div>

      <div className={`${s.bar} ${s.screenOnly}`}>
        <div className={s.barIn}>
          <nav className={s.picker} aria-label="Choose a scenario">
            {['home', 'work'].map((d) => (
              <div key={d} className={s.doorRow}>
                <span className={s.doorLbl}>{DOOR[d]}</span>
                {scenarios.filter((x) => x.door === d).map((x) => (
                  <button key={x.id} type="button" className={s.pick}
                    aria-pressed={!all && x.id === current} title={x.shelfLine}
                    onClick={() => pick(x.id)}>
                    {x.title}
                  </button>
                ))}
              </div>
            ))}
          </nav>
          <div className={s.actions}>
            <label className={s.toggle}>
              <input type="checkbox" checked={pictures} onChange={(e) => setPictures(e.target.checked)} /> Pictures
            </label>
            <button type="button" className={s.ghost} onClick={printAll}>
              Print all {scenarios.length} ({scenarios.length * 2 + 1} sheets)
            </button>
            <button type="button" className={s.primary} onClick={printOne}>
              Print {one.title} (3 sheets)
            </button>
          </div>
        </div>
      </div>

      <div ref={deckRef} className={`${s.deck} ${pictures ? '' : s.noPictures}`}>
        {shown.map((x) => <Deck key={x.id} sc={x} printedOn={today()} />)}
        <div className={s.facilPage}><FacilitatorSheet /></div>
      </div>
    </main>
  );
}
