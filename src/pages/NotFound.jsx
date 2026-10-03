// NotFound.jsx — catch-all for any unmatched hash route.
//
// Before this existed, a mistyped or stale hash (#/everydy, #/scenarios/a1,
// anything from an old link) matched no route and React Router rendered
// nothing at all — a blank white page with no way out. Silent, and
// indistinguishable from the app being broken.
//
// Two exits, because the two doors are the two things a lost visitor could
// have been looking for.

import { Link } from 'react-router-dom';

const s = {
  page: {
    maxWidth: 560,
    margin: '0 auto',
    padding: '96px 24px 64px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    lineHeight: 1.7,
    color: '#1a1714',
    textAlign: 'center',
  },
  mark: { fontSize: 40, marginBottom: 20, color: '#c4712a' },
  h1: { fontSize: 24, fontWeight: 700, marginBottom: 10, color: '#1a1714' },
  p: { marginBottom: 32, fontSize: 15, color: '#6b6763' },
  row: { display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' },
  btn: {
    display: 'inline-block',
    padding: '11px 20px',
    fontSize: 15,
    borderRadius: 8,
    textDecoration: 'none',
    background: '#c4712a',
    color: '#fff',
    fontWeight: 600,
  },
  btnAlt: {
    display: 'inline-block',
    padding: '11px 20px',
    fontSize: 15,
    borderRadius: 8,
    textDecoration: 'none',
    background: 'transparent',
    color: '#1a1714',
    border: '1px solid #e4dfd6',
    fontWeight: 600,
  },
};

export function NotFound() {
  return (
    <main id="main-content" style={s.page} tabIndex={-1}>
      <div style={s.mark}>◎</div>
      <h1 style={s.h1}>That page isn&rsquo;t here</h1>
      <p style={s.p}>
        The link may be out of date, or the address may have a typo in it.
        Both doors are open.
      </p>
      <div style={s.row}>
        <Link to="/" style={s.btn}>Back to the start</Link>
      </div>
    </main>
  );
}
