// About.jsx — the aim, why it exists, where the content comes from, and how to
// reach out. Static; on the poster register via About.module.css.
//
// Claims discipline: no efficacy claim anywhere ("designed to", never "proven
// to"). No employer reference. Contribution-first voice, not a pitch.

import { Link } from 'react-router-dom';
import s from './About.module.css';

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
          AI is turning up in ordinary life and ordinary jobs faster than anyone is being
          taught to handle it. The training that does exist is mostly corporate, mostly dull,
          and mostly aimed at ticking a box. There is almost nothing for the general public at
          all. This is an attempt at the opposite: short, specific situations you actually play,
          free for anyone, with the reasoning left open for you to check.
        </p>

        <section className={s.section}>
          <h2 className={s.h2}>What it is</h2>
          <p className={s.p}>
            This v2 build has nine core branching scenarios about AI going wrong, split across
            two doors: one for personal life, one for work. You are the person it is happening to.
            You make the calls with incomplete information and some time pressure, and then you see
            what followed. Nothing is scored. There is no login and nothing to install.
          </p>
          <p className={s.p}>
            It is a <em>branching story</em> on purpose. People remember decisions they
            made and consequences they lived far better than slides they clicked through — so the
            format is the point, not decoration.
          </p>
        </section>

        <section className={s.section}>
          <h2 className={s.h2}>What it is trying to do</h2>
          <ul className={s.list}>
            <li><strong>Free and open.</strong> The whole thing is free, and the source and the
              reference library behind it are public. Nothing important is hidden behind a wall.</li>
            <li><strong>Actually good.</strong> The aim is training that stands up to scrutiny —
              accurate risks, actionable responses, and reasoning you can follow to its source,
              rather than confident hand-waving.</li>
            <li><strong>For everyone, not just professionals.</strong> The workplace scenarios run
              from general staff through specialists, and the home scenarios assume no background
              at all. Zero-friction access is deliberate.</li>
            <li><strong>Worth five minutes.</strong> It is designed to be quick, specific and,
              honestly, a bit gripping — because training nobody wants to do teaches nobody
              anything.</li>
          </ul>
          <p className={s.note}>
            A note on honesty: this is designed to help you think through AI risk, and it is not a
            certification, not legal or security advice, and it makes no claim to make anyone
            &ldquo;compliant.&rdquo; It is a place to practise the decision before you have to make
            it for real.
          </p>
        </section>

        <section className={s.section}>
          <h2 className={s.h2}>How it was made — and remade</h2>
          <p className={s.p}>
            This is built with AI, and it feels right to be plain about that in a project about
            AI risk. The code and much of the first-draft writing were produced by working with
            an AI model, and then reviewed and approved by a human. AI is a genuinely useful tool
            when you check its work — which is, more or less, the whole point of this site.
          </p>
          <p className={s.p}>
            The version you are looking at is the second attempt. The first was built mainly with
            corporate training in mind — 32 scenarios, four personas each. With feedback we found
            it was too technical and suited to only a small slice of people, so we have tried to
            both simplify it and focus on the core AI risks that might resonate with a broader
            audience. At the same time we leaned harder into what works in training design, so the
            setup, flow and wrap-up are all better than they were. We are always looking to
            improve — so please send any feedback below, or help us build this better.
          </p>
        </section>

        <section className={s.section}>
          <h2 className={s.h2}>Where the content comes from</h2>
          <p className={s.p}>
            Scenarios are built from documented incidents and established risk research, not
            invented for effect. The reference library sits behind the workplace scenarios and
            carries the full detail and citations for each risk. A few of the foundations the
            content draws on:
          </p>
          <ul className={s.list}>
            <li>
              <a href="https://airisk.mit.edu/" target="_blank" rel="noreferrer">The MIT AI Risk Repository</a>
              {' '}— the risk taxonomy the scenarios are organised against.
            </li>
            <li>
              <a href="https://www.nist.gov/itl/ai-risk-management-framework" target="_blank" rel="noreferrer">The NIST AI Risk Management Framework</a>
              {' '}— for how controls are framed.
            </li>
            <li>
              <a href="https://library.airiskpractice.org" target="_blank" rel="noreferrer">The AI Risk knowledge base</a>
              {' '}— the reference layer, with a citation ledger, that the workplace scenarios rest on.
            </li>
          </ul>
        </section>

        <section className={s.section}>
          <h2 className={s.h2}>Tell me what you think</h2>
          <p className={s.p}>
            This is a solo project and feedback genuinely shapes it. The most useful things you
            could send:
          </p>
          <ul className={s.list}>
            <li>Which scenario landed hardest — and which fell flat.</li>
            <li>Anything that looked wrong, broke, or read as inaccurate.</li>
            <li>An AI risk you want to see turned into a scenario next.</li>
          </ul>
          <div className={s.actions}>
            <a className={s.primary} href={mailto('AI Risk Practice — feedback')}>Send feedback</a>
            <a className={s.secondary} href={mailto('AI Risk Practice — a scenario idea')}>Suggest a scenario</a>
          </div>
        </section>

        <section className={s.section}>
          <h2 className={s.h2}>Want to help build it</h2>
          <p className={s.p}>
            If you work in AI risk, governance, security or learning design and want to contribute
            a scenario, review one, or collaborate more seriously, that would be very welcome. The
            code and content are{' '}
            <a href="https://github.com/b-gowland" target="_blank" rel="noreferrer">open on GitHub</a>,
            and the fastest way to start a conversation is an email.
          </p>
          <div className={s.actions}>
            <a className={s.primary} href={mailto('AI Risk Practice — collaboration')}>Get in touch</a>
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
