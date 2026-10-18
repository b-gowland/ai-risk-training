# AI Risk Practice — notes for Claude

Free, open-source practice scenarios on AI risk (app.airiskpractice.org).
React 19 + Vite, HashRouter, deployed to GitHub Pages on push to `main`.
Companion repos: `b-gowland/ai-risk-kb` (the reference library,
library.airiskpractice.org) and `b-gowland/ai-risk-baseline`.

Start with [`docs/STATUS.md`](docs/STATUS.md) for where things stand and
what is open, then [`ARCHITECTURE.md`](ARCHITECTURE.md) and
[`CONTRIBUTING.md`](CONTRIBUTING.md) for how it works and the rules.

## Before you push

Run what CI runs: `npm run lint`, `npm test`, `npm run route-audit`,
`npm run audit`, `npm run test:scorm`, `npm run build`. After any change to
scenario branches or endings, also read `npm run joins`.

## Rules that are easy to break

- **Scenario text:** plain language for an average adult reader, in Australian
  English. Avoid machine-writing patterns: "isn't X. It's Y" contrasts,
  aphorism closers, filler intensifiers, signposting. `npm run readability`
  and the audit flag them.
- **Endings and joins:** a screen or ending reached from several choices may
  only claim what every one of those routes did. Use `{ when }` / `{ unless }`
  paragraphs (`resolveParas`), never text written for one route.
- **Option order and length:** the best option must not be findable by its
  position or by being the longest. Tests enforce both.
- **Times:** never type a time into a page. They come from
  `src/engine/timing.js`.
- **Invented names:** they must not belong to real organisations, and domains
  must be `.example`. Dated legal claims need a `sources` entry.
- **Static pages:** `/scenarios/<id>/` show the tell only, never consequences
  or debrief (decided 20 Sep). They are what link previews and search see.
- **Privacy:** the site runs Plausible (anonymous events, listed on the Privacy
  page). Add no new tracking or data collection, and keep the Privacy page
  matching `src/utils/analytics.js` (a test checks this).
- **Hosting:** don't change hosting, DNS or Cloudflare. List the change for the
  owner to make.
