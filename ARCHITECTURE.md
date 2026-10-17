# Architecture

How the app is put together, and the checks that keep it honest. The scenario
file format has its own reference: [`src/scenarios/README.md`](src/scenarios/README.md).

Code comments cite `FREE_PRODUCT §n`, `CONTENT_STYLE_GUIDE` and
`CONTENT_QA_CHECKLIST`. Those are the project's design documents and are kept
outside this repository.

## Routes

`src/main.jsx` mounts a `HashRouter`. GitHub Pages can't rewrite paths, so every
app URL carries a `#` (`/#/scenario/f2-shadow-ai`).

| Route | Renders |
|---|---|
| `/` | `Homepage` — the two doors and the nine scenarios |
| `/scenario/:id` | `ScenarioPlayer` |
| `/cards` | `Cards` — printable discussion cards |
| `/about`, `/privacy` | Static pages |
| `/everyday`, `/everyday/:id` | Redirect to `/` (retired surface) |
| `*` | `NotFound` |

`App.jsx` is the shell around every route: header, footer, skip link and
`RouteFocus`. Each route renders a `<main id="main-content" tabIndex={-1}>`,
which is where the skip link and route changes put keyboard focus.

Because the router owns the URL fragment, an in-page `#anchor` link is read as
a route. Don't add one. Move focus or scroll by hand, as the skip link does.

## The player

`src/engine/narrativeEngine.js` is a pure reducer with no React in it. A
scenario moves through four phases:

```
SETUP → DECISION → DEBRIEF → CLOSE
```

- **Setup** — cold open, who you are, what you can and can't do.
- **Decision** — one node at a time. Committing a choice reveals its
  consequence in place; there is no back button and no separate feedback
  screen. `ADVANCE` moves to the next node or to an outcome.
- **Debrief** — the outcome reached, then the scenario-level frame.
- **Close** — recall question, "one thing you could do this week", the tell,
  and links on to other scenarios.

`score` routes outcomes and is never shown.

`src/player/ScenarioPlayer.jsx` holds all the hooks and renders one of
`Setup`, `Decision`, `Debrief` or `Close`. The exported component is a thin
wrapper keyed on the scenario id, so moving to another scenario remounts the
player and resets its state (see the comment at the top of the file for the
bug this fixed).

Ids that are not live are handled before the player starts:

- `REPLACED` in `src/scenarios/index.js` redirects the three old
  `everyday-*` ids to their `home-*` successors.
- `RETIRED` maps the other pre-rebuild ids to their library entry, and the
  player shows a short "retired" page with that link.

`src/player/depth.js` derives the decision-count band shown on Setup from the
tree, so it can't drift from what was written.

`src/components/Artefact/` renders the six artefact types (message thread,
email, assistant output, document, system output, transcript). The set is
closed; an unknown type throws in development.

## Scenarios

`src/scenarios/index.js` is the registry, and the nine files it imports are
the only scenarios in the repo. The pre-rebuild scenarios were deleted in
October 2026; they are in git history before that if ever needed.

`FEATURED_PAIR` fixes the two scenarios shown first on the homepage.

## Analytics

`src/utils/analytics.js` sends anonymous custom events through the Plausible
script in `index.html`. No free text and nothing that identifies a person. The
list on the privacy page (`src/pages/Privacy.jsx`) must match the events in
that file; add to both together.

SCORM builds set `VITE_LMS_BUILD=1`, which turns every call into a no-op.

## Build and deploy

`npm run build` runs `vite build`, then `scripts/build-static-pages.mjs`. That
script writes plain HTML pages for crawlers (`/scenarios/`, one page per
scenario, `/cards/`) and `sitemap.xml`, all generated from the registry.

`.github/workflows/deploy.yml` runs on every push and pull request: lint,
tests, route audit, scenario audit, build. Pushes to `main` deploy to GitHub
Pages at <https://app.airiskpractice.org/>.

## Checks

| Command | What it guards |
|---|---|
| `npm test` | Engine, screens, navigation and focus, artefacts, cards, analytics, static pages (CSP, share tags, structured data), content quality (answer position and length, times, invented names), privacy claims, screen-reader text |
| `npm run audit` | Every registered scenario: graph integrity, depth band, choice counts, unverdicted consequences, artefact types, scene keys, wrap-up length caps measured on the longest route, route conditions (`when`/`unless`) that can actually occur, a primary source for any dated claim in the debrief; warns on machine-writing patterns, jargon, sentences over 25 words and reading grade |
| `npm run readability` | Per-scenario reading grade, sentence length, pattern and jargon table (`-- --json` for before/after diffs). Rules live in `scripts/lib/readability.mjs` |
| `npm run joins` | Prints every screen with every way into it, and every ending with the choices made on every route into it. Read it after any change to branches or endings |
| `npm run route-audit` | Cross-surface integrity: registry vs. routes vs. links vs. files |
| `npm run lint` | ESLint |
| `npm run test:scorm` | SCORM adapter call sequence against a mock LMS |

All of these run in CI. Not in CI, run by hand:

| Command | What it does |
|---|---|
| `npm run og` | Regenerates `public/og.png`, the homepage share image, as a screenshot of the built homepage (needs Playwright; see the script header) |
| `npm run review-pack` | Builds `review-pack/` for an outside reviewer: text, joins, reports, and with `-- --shots` screenshots. Send it with [`docs/REVIEW_PROMPT.md`](docs/REVIEW_PROMPT.md) |

## Route-aware text

A screen or ending reached from several choices must read correctly from
each. A paragraph in a node's `prose` or an outcome's `description` can be a
plain string or `{ when: 'node.choice' | [...], text }` /
`{ unless: …, text }`, resolved against the choices taken
(`resolveParas` in `src/engine/narrativeEngine.js`). Headings, reactions and
judgements are plain strings, so they must hold on every route.

## Times

Every time shown to players comes from `src/engine/timing.js`: words on
each route at 238 a minute (Brysbaert 2019) plus 30 seconds a decision, with
the median route as the headline. Nothing types a time in by hand; a test
checks.

## Content Security Policy

`scripts/lib/csp.mjs` holds the policy. GitHub Pages cannot set response
headers, so it ships as a `<meta>` tag, added by the Vite build and by
`build-static-pages.mjs`. Scripts and connections are limited to this site
and Plausible; no page has an inline script (Plausible's queue stub is
`public/plausible-init.js`). A meta policy cannot set `frame-ancestors`; that
needs a response header, which means a proxy or host in front of Pages.

## Scene images

`public/scenes/<key>.webp` are the images the app ships, one per key a live
scenario uses. To add one, put the full-size PNG or JPG in `scenes-raw/<key>.png`
(gitignored) and run `node scripts/optimize-scenes.mjs`.

## SCORM

`npm run build:scorm -- <scenario-id> "Title"` packages one scenario for an
LMS. See [`tools/scorm/README.md`](tools/scorm/README.md).
