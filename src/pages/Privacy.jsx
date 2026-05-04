// Privacy.jsx — static privacy notice page at /#/privacy
// Content mirrors PRIVACY.md. No markdown parser needed.

import { Link } from 'react-router-dom';

const s = {
  page: {
    maxWidth: 640,
    margin: '0 auto',
    padding: '40px 24px 64px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    lineHeight: 1.75,
    color: '#1a1714',
  },
  back: {
    display: 'inline-block',
    marginBottom: 32,
    fontSize: 13,
    color: '#6b6763',
    textDecoration: 'none',
  },
  h1: { fontSize: 26, fontWeight: 700, marginBottom: 8, color: '#1a1714' },
  h2: { fontSize: 17, fontWeight: 600, marginTop: 36, marginBottom: 8, color: '#1a1714' },
  p:  { marginBottom: 14, fontSize: 15, color: '#2e2b27' },
  ul: { paddingLeft: 20, marginBottom: 14 },
  li: { fontSize: 15, color: '#2e2b27', marginBottom: 6 },
  strong: { fontWeight: 600, color: '#1a1714' },
  a:  { color: '#c4712a', textDecoration: 'underline' },
  divider: { border: 'none', borderTop: '1px solid #e4dfd6', margin: '28px 0' },
};

export function Privacy() {
  return (
    <div style={s.page}>
      <Link to="/" style={s.back}>← Back</Link>
      <h1 style={s.h1}>Privacy notice</h1>
      <p style={s.p}>This notice covers both sites: the AI Risk Practice Library (<a style={s.a} href="https://library.airiskpractice.org/" target="_blank" rel="noopener noreferrer">library.airiskpractice.org</a>) and the AI Risk Training app (<a style={s.a} href="https://app.airiskpractice.org/" target="_blank" rel="noopener noreferrer">app.airiskpractice.org</a>).</p>

      <hr style={s.divider}/>
      <h2 style={s.h2}>What this site collects — and what it doesn't</h2>
      <p style={s.p}>
        This site uses <a style={s.a} href="https://plausible.io" target="_blank" rel="noopener noreferrer">Plausible Analytics</a>,
        a cookieless, privacy-first analytics tool. Plausible does not use cookies, does not collect personal data,
        and does not track you across sites or devices.
      </p>
      <p style={s.p}><strong style={s.strong}>What Plausible collects about each visit:</strong></p>
      <ul style={s.ul}>
        {['The page you visited', 'How you arrived (e.g. a search engine, a shared link, direct)', 'Your country (derived from IP address, which is never stored)', 'Your browser and device type', 'Your screen size'].map(item => (
          <li style={s.li} key={item}>{item}</li>
        ))}
      </ul>
      <p style={s.p}>
        No IP address is stored. No personal identifier is created or retained.
        No data is shared with advertising networks. No consent banner is required
        because no personal data is collected.
      </p>
      <p style={s.p}>
        Plausible's data policy:{' '}
        <a style={s.a} href="https://plausible.io/data-policy" target="_blank" rel="noopener noreferrer">plausible.io/data-policy</a>
      </p>

      <hr style={s.divider}/>
      <h2 style={s.h2}>Scenario interaction data</h2>
      <p style={s.p}>When you play a scenario on either the practitioner track or the Fork everyday track, we track anonymous, aggregate information about how scenarios are used.</p>
      <p style={s.p}><strong style={s.strong}>What we track:</strong></p>
      <ul style={s.ul}>{[
        'That a scenario was started (scenario identifier only — not your name or any personal detail)',
        'That a choice was made at a decision point, and its quality rating (good / partial / poor — a label from the scenario schema, not your words)',
        'That a scenario was completed, and the outcome category reached (good / warn / bad) and score',
        'Whether you used the share or replay features on an outcome screen',
      ].map(item => <li style={s.li} key={item}>{item}</li>)}</ul>
      <p style={s.p}><strong style={s.strong}>What we do not track:</strong></p>
      <ul style={s.ul}>{[
        'Any text you type or say',
        'Which specific option label you selected (only whether it was rated good, partial, or poor)',
        'Any sequence linking your decisions across multiple plays or sessions',
        'Anything that could identify you as an individual',
      ].map(item => <li style={s.li} key={item}>{item}</li>)}</ul>
      <p style={s.p}>All interaction data is aggregate and anonymous by design. There is no way to reconstruct any individual player's path through a scenario.</p>

      <hr style={s.divider}/>
      <h2 style={s.h2}>How we use this data</h2>
      <p style={s.p}>We use aggregate scenario data to:</p>
      <ul style={s.ul}>
        {[
          'Understand which risk areas and decision points people find most challenging',
          'Improve and redesign scenarios where patterns suggest the content is unclear or the framing is not working',
          'Share public insights about AI risk literacy — for example, publishing findings such as "players most commonly struggled with decision X in scenario Y" in plain language',
        ].map(item => <li style={s.li} key={item}>{item}</li>)}
      </ul>
      <p style={s.p}>
        We do not sell data. We do not share data with third parties except as described above (Plausible, as our analytics provider).
        We do not use data for advertising or profiling of any kind.
      </p>
      <p style={s.p}>
        <strong style={s.strong}>A note on published findings:</strong> We only publish decision-level breakdowns once a scenario has been played enough times
        that no individual play could be inferred from the aggregate. In practice this means a minimum of 30 plays per scenario.
      </p>

      <hr style={s.divider}/>
      <h2 style={s.h2}>Cookies and consent</h2>
      <p style={s.p}>This site sets no cookies. No consent banner is shown because none is required — there is nothing to consent to. You can verify this by inspecting your browser's storage at any time.</p>

      <hr style={s.divider}/>
      <h2 style={s.h2}>Contact</h2>
      <p style={s.p}>Questions about this privacy notice or the data practices described here: <a style={s.a} href="mailto:hello@airiskpractice.org">hello@airiskpractice.org</a></p>
    </div>
  );
}
