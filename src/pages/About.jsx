// About.jsx — the north star (owner, 28 Nov 2026), why it matters, what it is,
// where the content comes from, where to go further, and how to reach out.
// Kept short for phones; the full redesign comes later (owner, 28 Nov).
// Static; on the poster register via About.module.css.
//
// Claims discipline: no efficacy claim anywhere ("designed to", never "proven
// to"). No employer reference. Contribution-first voice, not a pitch.

import { Link } from 'react-router-dom';
import s from './About.module.css';
import { scenarios } from '../scenarios/index.js';
import { rangeWords } from '../engine/timing.js';

const HOME = scenarios.filter((sc) => sc.door === 'home');
const WORK = scenarios.filter((sc) => sc.door === 'work');

const FEEDBACK_EMAIL = 'hello@airiskpractice.org';

export default function About() {
  const mailto = (subject) =>
    `mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent(subject)}`;

  return (
    <main id="main-content" className={s.page} tabIndex={-1}>
      <div className={s.inner}>
        <Link to="/" className={s.back}>← Back to the situations</Link>

        <h1 className={s.h1}>Why this exists</h1>

        <p className={s.lede}>
          Basic AI risk training for everyone that is accessible and makes a real difference.
        </p>

        <p className={s.p}>That means it is:</p>
        <ul className={s.list}>
          <li><strong>Free.</strong> No cost and no login. We count plays and choices anonymously
            to improve it, and nothing we keep identifies you.</li>
          <li><strong>For as many people as possible,</strong> regardless of location, age,
            ability, language or device, and on paper as well as online.</li>
          <li><strong>About real AI risks affecting people today:</strong> scams, wrong answers,
            personal information, mistakes at work.</li>
          <li><strong>Tested and improved.</strong> We try it with real people, change it based on
            feedback, and compare it with the best training anywhere, free or paid.</li>
        </ul>

        <section className={s.section}>
          <h2 className={s.h2}>Why it matters</h2>
          <p className={s.p}>
            AI now writes, decides and even speaks for people, including people trying to trick
            you. In Australia, more than half of adults are worried that scams are getting harder
            to spot, and fewer than a third feel confident they can avoid them online (
            <a href="https://newshub.medianet.com.au/2026/09/more-than-half-of-australians-say-scams-are-becoming-harder-to-spot/171480/" target="_blank" rel="noreferrer">Good Things Australia, 2026</a>).
          </p>
        </section>

        <section className={s.section}>
          <h2 className={s.h2}>What it is</h2>
          <p className={s.p}>
            Nine short scenarios about AI going wrong, at home and at work. You decide with part of
            the picture, see what follows, and leave with one check you can use the next day. An At
            Home scenario takes {rangeWords(HOME)}, an At Work
            one {rangeWords(WORK).replace(/^about /, '')}. Each also comes
            as <Link to="/cards" className={s.inlineLink}>printable cards</Link> for a group.
          </p>
          <p className={s.p}>
            The scenarios draw on documented incidents and published research, organised
            by <a href="https://airisk.mit.edu/" target="_blank" rel="noreferrer">the MIT AI Risk Repository</a>.
            The characters and organisations are fictional. Where a scenario states a fact
            with a date or a law, its source is shown at the end. It was built with AI and
            every part was reviewed by a person.
          </p>
          <p className={s.note}>
            This is practice, not a certification.
          </p>
        </section>

        <section className={s.section}>
          <h2 className={s.h2}>Want to go further?</h2>
          <ul className={s.list}>
            <li><strong>If something has gone wrong:</strong> in Australia,{' '}
              <a href="https://www.scamwatch.gov.au/" target="_blank" rel="noreferrer">Scamwatch</a> to
              report a scam and{' '}
              <a href="https://www.idcare.org/" target="_blank" rel="noreferrer">IDCARE</a> for
              help with your identity or accounts. Elsewhere, your country&rsquo;s fraud reporting
              service.</li>
            <li><strong>Learn more, free:</strong>{' '}
              <a href="https://bluedot.org/courses/future-of-ai" target="_blank" rel="noreferrer">The Future of AI</a> from
              BlueDot Impact, and <a href="https://www.ai.gov.au/" target="_blank" rel="noreferrer">ai.gov.au</a>.</li>
            <li><strong>Work on AI risk:</strong>{' '}
              <a href="https://80000hours.org/problem-profiles/artificial-intelligence-risk/" target="_blank" rel="noreferrer">80,000 Hours</a>.</li>
          </ul>
        </section>

        <section className={s.section}>
          <h2 className={s.h2}>Get in touch</h2>
          <p className={s.p}>
            Tell us what stuck, what fell flat or what looked wrong. If you&rsquo;d like to review a
            scenario or help build it, the code and content
            are <a href="https://github.com/b-gowland/ai-risk-training" target="_blank" rel="noreferrer">open on GitHub</a>.
          </p>
          <div className={s.actions}>
            <a className={s.primary} href={mailto('AI Risk Practice: feedback')}>Send feedback</a>
            <a className={s.secondary} href={mailto('AI Risk Practice: collaboration')}>Help build it</a>
          </div>
        </section>

        <p className={s.footNote}>
          No legal or security advice. See{' '}
          <Link to="/privacy" className={s.inlineLink}>what we don&rsquo;t collect</Link>.
        </p>
      </div>
    </main>
  );
}
