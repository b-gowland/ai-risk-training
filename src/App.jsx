// App — the shell. Black bar, black footer, outlet. No hooks, no state.
// The two black bands are load-bearing in the poster register: they are what
// make the colour panels read as deliberate rather than as a tinted section.

import { Outlet, Link } from 'react-router-dom';
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
  return (
    <div className={s.shell}>
      <a className={s.skipLink} href="#main-content" onClick={skipToMain}>Skip to main content</a>
      <RouteFocus />

      <header className={s.head}>
        <Link className={s.brand} to="/">AI Risk Practice</Link>
        <span className={s.tag}>Free · No login</span>
      </header>

      <Outlet />

      <footer className={s.foot}>
        <p className={s.footLine}>
          Short situations where AI could go wrong. You make the calls and find out what
          follows. Based on real incidents and known risks.
        </p>
        <nav className={s.footNav}>
          <Link to="/about">About</Link>
          <Link to="/privacy">What we don&rsquo;t collect</Link>
          <a href="https://library.airiskpractice.org" target="_blank" rel="noreferrer">Reference library</a>
          <a href="https://github.com/b-gowland/ai-risk-training" target="_blank" rel="noreferrer">Source code</a>
          <span className={s.footNote}>Not legal or security advice</span>
        </nav>
      </footer>
    </div>
  );
}
