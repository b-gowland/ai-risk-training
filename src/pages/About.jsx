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
          AI is turning up in everyday life and work faster than anyone is being taught to
          handle it. Most training is a course: watch, read, answer a quiz. Very little of it
          puts you in the situation and makes you decide. This does. Short, specific situations
          you play, free for anyone, with the reasoning open for you to check.
        </p>

        <section className={s.section}>
          <h2 className={s.h2}>What it is</h2>
          <p className={s.p}>
            Nine branching scenarios about AI going wrong, behind two doors: one for home, one
            for work. You are the person it&rsquo;s happening to. You make the calls with
            incomplete information and a clock running, then see what followed. Nothing is
            scored. No login, nothing to install.
          </p>
          <p className={s.p}>
            It&rsquo;s a story you play because people remember decisions they made far better
            than slides they clicked through.
          </p>
        </section>

        <section className={s.section}>
          <h2 className={s.h2}>What we&rsquo;re aiming for</h2>
          <ul className={s.list}>
            <li><strong>Free and open.</strong> The app, its source code and the reference library
              behind it are all public.</li>
            <li><strong>Accurate.</strong> Real risks, responses you can act on, and reasoning you
              can trace to a source.</li>
            <li><strong>Open to anyone.</strong> No login and no prerequisites. Start with
              whichever situation sounds most like your week.</li>
            <li><strong>Worth your time.</strong> An At Home scenario takes about five minutes, an
              At Work one eight to ten.</li>
          </ul>
          <p className={s.note}>
            This is practice, not a certification. It isn&rsquo;t legal or security advice, and
            it won&rsquo;t make anyone &ldquo;compliant.&rdquo; It&rsquo;s a place to make the
            decision once before you have to make it for real.
          </p>
        </section>

        <section className={s.section}>
          <h2 className={s.h2}>How it was made</h2>
          <p className={s.p}>
            This was built with AI, and a project about AI risk should say so. The code and much
            of the first-draft writing came from working with an AI model. A person reviewed and
            approved all of it. AI is useful when you check its work, which is roughly what this
            site is about.
          </p>
          <p className={s.p}>
            This is the second version. The first was aimed at corporate training: 32 scenarios,
            four roles each. Feedback said it was too technical for most people, so this version
            covers fewer risks, for a wider audience, with a simpler setup and a shorter ending.
          </p>
        </section>

        <section className={s.section}>
          <h2 className={s.h2}>Where the content comes from</h2>
          <p className={s.p}>
            Scenarios draw on documented incidents and published risk research. The characters
            and organisations are fictional. Every scenario links to a reference library entry
            with the full detail and citations. The main sources:
          </p>
          <ul className={s.list}>
            <li>
              <a href="https://airisk.mit.edu/" target="_blank" rel="noreferrer">The MIT AI Risk Repository</a>,
              the risk taxonomy the scenarios are organised by.
            </li>
            <li>
              <a href="https://www.nist.gov/itl/ai-risk-management-framework" target="_blank" rel="noreferrer">The NIST AI Risk Management Framework</a>,
              for how the controls are framed.
            </li>
            <li>
              <a href="https://library.airiskpractice.org" target="_blank" rel="noreferrer">The AI Risk Practice library</a>,
              the reference entries and citations behind each scenario.
            </li>
          </ul>
        </section>

        <section className={s.section}>
          <h2 className={s.h2}>Tell us what you think</h2>
          <p className={s.p}>
            This is a small project and feedback shapes it. Most useful:
          </p>
          <ul className={s.list}>
            <li>Which scenario stuck with you, and which fell flat.</li>
            <li>Anything that looked wrong, broke, or read as inaccurate.</li>
            <li>An AI risk you&rsquo;d like to see as a scenario.</li>
          </ul>
          <div className={s.actions}>
            <a className={s.primary} href={mailto('AI Risk Practice: feedback')}>Send feedback</a>
            <a className={s.secondary} href={mailto('AI Risk Practice: scenario idea')}>Suggest a scenario</a>
          </div>
        </section>

        <section className={s.section}>
          <h2 className={s.h2}>Help build it</h2>
          <p className={s.p}>
            If you work in AI risk, governance, security or learning design and want to review a
            scenario, correct something or collaborate, get in touch. The code and content
            are{' '}
            <a href="https://github.com/b-gowland/ai-risk-training" target="_blank" rel="noreferrer">open on GitHub</a>,
            and email is the quickest way to start.
          </p>
          <div className={s.actions}>
            <a className={s.primary} href={mailto('AI Risk Practice: collaboration')}>Get in touch</a>
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
