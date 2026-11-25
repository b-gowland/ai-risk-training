// App — the shell. Black bar, black footer, outlet. No state; one hook, to
// know when a scenario is being played.
// The two black bands are load-bearing in the poster register: they are what
// make the colour panels read as deliberate rather than as a tinted section.
//
// During play the footer shrinks to one line. The full footer under every
// decision was noise, and five ways out.

import { Outlet, Link, useLocation } from 'react-router-dom';
import RouteFocus from './components/RouteFocus.jsx';
import s from './Shell.module.css';

// HashRouter owns the URL fragment, so the browser's default jump to
// #main-content would be read as a route and land on NotFound. Move focus
// by hand instead and leave the URL alone.
function skipToMain(e) {
  const main = document.getElementById('main-content');
  if (!main) return;
  e.preventDefault();
  main.focus();
  main.scrollIntoView();
}

export default function App() {
  const playing = useLocation().pathname.startsWith('/scenario/');

  return (
    <div className={s.shell}>
      <a className={s.skipLink} href="#main-content" onClick={skipToMain}>Skip to main content</a>
      <RouteFocus />

      <header className={s.head}>
        <Link className={s.brand} to="/">AI Risk Practice</Link>
        <nav className={s.headNav} aria-label="Site">
          <Link to="/cards">Run a session</Link>
          <Link to="/about">About</Link>
          <span className={s.tag}>Free · No login</span>
        </nav>
      </header>

      <Outlet />

      {playing ? (
        <footer className={s.footSlim}>
          <Link to="/">All situations</Link>
          <span className={s.footNote}>Not legal or security advice</span>
        </footer>
      ) : (
        <footer className={s.foot}>
          <p className={s.footLine}>
            Short situations where AI could go wrong. You make the calls and find out what
            follows. Based on real incidents and known risks.
          </p>
          <nav className={s.footNav}>
            <Link to="/privacy">What we don&rsquo;t collect</Link>
            <a href="https://library.airiskpractice.org" target="_blank" rel="noreferrer">Reference library</a>
            <a href="https://baseline.airiskpractice.org" target="_blank" rel="noreferrer">Governance baseline</a>
            <a href="https://github.com/b-gowland/ai-risk-training" target="_blank" rel="noreferrer">Source code</a>
            <span className={s.footNote}>Not legal or security advice</span>
          </nav>
        </footer>
      )}
    </div>
  );
}
