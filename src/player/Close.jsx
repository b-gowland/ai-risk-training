// Close — one screen. Why it worked, does it transfer, what to take.
//
// The frame analysis moved here from the debrief so the whole ending is two
// screens rather than five. It leads, because it is the transferable half:
// what made this look legitimate is the thing that shows up again in a
// different disguise.
//
// §4.6 Recall: one item, formative, ungated, never scored. Retrieval practice
//   is the strongest-evidenced mechanic in the research (g≈0.50–0.61), and it
//   sits after the frame so there is something to retrieve.
// §4.7 Act: two to four this-week-sized options inside the authority named at
//   Setup, plus an always-present "none of these fits". A selection, never
//   evidence of behaviour.
// §4.8 The tell: one transferable sentence. Nothing congratulates the player.
//
// Benign twin (27 Nov 2026): when a scenario has one, a second item follows
// the recall answer. Same surface, but the request is genuine, so refusing
// everything is the costly answer. Together the two answers let the existing
// anonymous events show judgement rather than caution alone.
//
// Coming back (27 Nov 2026, reversing the 27 Jul "no return" rule without a
// login): a WhatsApp message to family and a two-week reminder file, both
// made in the browser. Nothing is stored; the share method is the only thing
// counted, as the Privacy page already says.

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { scenarios } from '../scenarios/index.js';
import { reminderFile, scenarioUrl } from './reminder.js';
import s from './Player.module.css';

export default function Close({ scenario, recallAnswer, actChoice, onRecall, onRecallTwin, onAct, onReplay, onShared }) {
  const [copied, setCopied] = useState(false);
  const [twinAnswer, setTwinAnswer] = useState(null);
  const answered = Boolean(recallAnswer);
  const twin = scenario.recallTwin;
  const twinChosen = twin?.options.find((o) => o.id === twinAnswer);
  const link = scenarioUrl(scenario.id);
  const familyText = `${scenario.tell}\n\nTry it (about seven minutes, free): ${link}`;

  const answerTwin = (id) => {
    setTwinAnswer(id);
    onRecallTwin?.(id);
  };

  const downloadReminder = () => {
    const blob = new Blob([reminderFile(scenario, new Date())], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-risk-practice-reminder.ics`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    onShared?.('calendar');
  };

  // The person who just finished is the most engaged they will ever be — offer
  // the next one here rather than sending them back to the homepage to hunt.
  const others = scenarios.filter((sc) => sc.id !== scenario.id);
  const otherDoor = others.filter((sc) => sc.door !== scenario.door);
  const sameDoor = others.filter((sc) => sc.door === scenario.door);
  const nextUp = [otherDoor[0], sameDoor[0], otherDoor[1]].filter(Boolean).slice(0, 2);
  const chosen = scenario.recall.options.find((o) => o.id === recallAnswer);

  const shareTell = async () => {
    const text = `${scenario.tell}\n\n— ${scenario.title}, AI Risk Practice\n${window.location.origin}`;
    try {
      if (navigator.share) await navigator.share({ text });
      else {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2400);
      }
      onShared?.('tell');
    } catch { /* dismissed or unavailable; the tell is on screen regardless */ }
  };

  return (
    <article className={s.screen} tabIndex={-1} aria-labelledby="close-title">
      <div className={s.margin}>
        <p className={s.beat}>What made this look legitimate</p>
      </div>

      <div className={s.body}>
        <h1 id="close-title" className="srOnly">What made this look legitimate</h1>
        {(() => {
          const frame = scenario.debrief.frame;
          const explicit = scenario.debrief.keyLine;
          // Derive a lead line from the first sentence if none is given.
          const first = frame[0] || '';
          const m = first.match(/^(.*?[.!?])(\s+)(.*)$/s);
          const lead = explicit || (m ? m[1] : first);
          const rest = explicit ? frame : (m ? [m[3], ...frame.slice(1)] : frame.slice(1));
          return (
            <>
              <p className={s.keyLine}>{lead}</p>
              <div className={s.proseSoft}>
                {rest.filter(Boolean).map((para, i) => <p key={i}>{para}</p>)}
              </div>
              {scenario.sources?.length > 0 && (
                <ul className={s.sources} aria-label="Sources">
                  {scenario.sources.map((src) => (
                    <li key={src.url}>
                      Source: {src.who}, <a href={src.url} target="_blank" rel="noreferrer">{src.title}</a>,
                      {' '}{src.date}: &ldquo;{src.quote}&rdquo;
                    </li>
                  ))}
                </ul>
              )}
            </>
          );
        })()}

        <section className={s.closeSection}>
          <h2 className={s.sectionHead}>{scenario.recall.prompt}</h2>
          {!answered && (
            <>
              <ul className={s.options}>
                {scenario.recall.options.map((o) => (
                  <li key={o.id}>
                    <button type="button" className={s.option} onClick={() => onRecall(o.id)}>
                      {o.label}
                    </button>
                  </li>
                ))}
              </ul>
              <button type="button" className={s.skip} onClick={() => onRecall('skipped')}>
                Skip this
              </button>
            </>
          )}
          {answered && chosen && (
            <>
              <p className={s.chosen}>{chosen.label}</p>
              <div className={s.prose}><p>{chosen.note}</p></div>
            </>
          )}
        </section>

        {twin && answered && (
          <section className={s.closeSection}>
            <h2 className={s.sectionHead}>{twin.prompt}</h2>
            {!twinAnswer && (
              <>
                <ul className={s.options}>
                  {twin.options.map((o) => (
                    <li key={o.id}>
                      <button type="button" className={s.option} onClick={() => answerTwin(o.id)}>
                        {o.label}
                      </button>
                    </li>
                  ))}
                </ul>
                <button type="button" className={s.skip} onClick={() => answerTwin('skipped')}>
                  Skip this
                </button>
              </>
            )}
            {twinChosen && (
              <>
                <p className={s.chosen}>{twinChosen.label}</p>
                <div className={s.prose}><p>{twinChosen.note}</p></div>
              </>
            )}
          </section>
        )}

        <section className={s.tellBlock}>
          <blockquote className={s.tell}>{scenario.tell}</blockquote>
          <div className={s.shareRow}>
            <button type="button" className={s.secondary} onClick={shareTell}>
              {copied ? 'Copied' : 'Share this'}
            </button>
            <a
              className={s.secondaryAsLink}
              href={`https://wa.me/?text=${encodeURIComponent(familyText)}`}
              target="_blank"
              rel="noreferrer"
              onClick={() => onShared?.('whatsapp')}
            >
              Send to family on WhatsApp
            </a>
            <button type="button" className={s.secondary} onClick={downloadReminder}>
              Remind me in two weeks
            </button>
          </div>
        </section>

        <section className={s.closeSection}>
          <h2 className={s.sectionHead}>One thing you could do this week</h2>
          <ul className={s.options}>
            {[...scenario.act, { id: 'none', label: `None of these fits` }].map((a) => (
              <li key={a.id}>
                <button
                  type="button"
                  className={actChoice === a.id ? s.optionChosen : s.option}
                  aria-pressed={actChoice === a.id}
                  onClick={() => onAct(a.id)}
                >
                  {a.label}
                </button>
              </li>
            ))}
          </ul>
        </section>

        {nextUp.length > 0 && (
          <section className={s.nextBlock}>
            <h2 className={s.sectionHead}>Try another</h2>
            <ul className={s.nextList}>
              {nextUp.map((sc) => (
                <li key={sc.id}>
                  <Link
                    to={`/scenario/${sc.id}`}
                    className={`${s.nextRow} ${sc.door === 'home' ? s.nextHome : s.nextWork}`}
                  >
                    <span className={s.nextDoor}>{sc.door === 'home' ? 'At home' : 'At work'}</span>
                    <span className="srOnly">: </span>
                    <span className={s.nextLine}>{sc.shelfLine}</span>
                    <span className={s.nextGo} aria-hidden="true">→</span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link className={s.allLink} to="/">See all situations</Link>
          </section>
        )}

        <div className={s.closeFoot}>
          <button type="button" className={s.secondary} onClick={onReplay}>Play it differently</button>
          <Link className={s.secondaryLink} to="/about">
            Where to go next
          </Link>
        </div>
      </div>
    </article>
  );
}
