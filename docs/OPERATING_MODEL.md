# Operating model: how the AI Risk Practice sites are run

Written 26 November 2026. How work on the free sites is organised, so it
keeps running with very little of the owner's time.

| Site | Repo |
|---|---|
| app.airiskpractice.org (scenarios) | `ai-risk-training` (this repo) |
| library.airiskpractice.org (reference library) | `ai-risk-kb` |
| baseline.airiskpractice.org (Governance Baseline) | `ai-risk-baseline` |
| narratedself.airiskpractice.org | `narrated-self` |

## What went wrong before

From August to November the work ran as many separate sessions, a few per
repo, each started for one job. That produced good work, but:

- **No one saw across the sites.** Each repo drifted on its own: hosting
  notes, headers, footers, docs and QA checks differed for no reason.
- **Work lived in sessions, not repos.** When containers were rebuilt during
  the November GitHub suspension, unpushed commits and prepared branches
  were lost.
- **Context ran out.** One long session that tries to hold everything
  eventually summarises away the detail it needs.
- **Monitoring piled up.** Automated library reviews waited weeks for a
  person to read 300-item issues.

## The model: state in the repos, short sessions, routines for the repeat work

**1. The repos hold all state.** A session can start cold and pick up.

| Repo file | Holds |
|---|---|
| `CLAUDE.md` | Rules that are easy to break, and the checks to run before pushing |
| `docs/STATUS.md` (or the repo's equivalent) | Where things stand, what's open, dated follow-ups |
| `docs/PLAN.md` | What to do next, in order, ticked off as it lands |
| This file | How work is organised across the sites (only in `ai-risk-training`) |

Nothing that matters is kept only in a session. Plans and reviews are
committed to `docs/`; prepared changes go on a pushed branch, as a draft PR
if they need the owner.

**2. One session per piece of work, in the repo it's about.** Start a new
session for each job (a feature, a content batch, a review), with that
repo selected. It reads `CLAUDE.md` and `STATUS.md`, does the job, opens
a PR, merges once checks pass (the owner has authorised this for low-risk
work), updates `STATUS.md` and ends. Short sessions keep context small and
cost low.

**3. A portfolio session only for cross-site work.** When a change spans
sites (hosting, shared standards, design alignment, a strategy pass),
start one session with all the repos attached. It plans, hands repo-sized
pieces to helper agents that each work in their own branch, reviews and
merges, and records the outcome in each repo's `STATUS.md`. It doesn't
become the place where everything happens.

**4. Scheduled routines do the repeat work.** These run unattended as
scheduled tasks that start a fresh session each time:

| Routine | When | What it does |
|---|---|---|
| Weekly upkeep | Monday morning (Australian time) | In every repo: merge green Dependabot patch and minor updates; fix or report red CI on `main`; check the four sites load with their headers; triage new library source-monitoring issues into a PR; one-line update to each `STATUS.md` |
| Monthly review | First Monday of the month | Library monthly-maintenance triage (verify, then apply, reject or defer); dependency audit; link check results; update `docs/PLAN.md` |

Each routine reports in a short summary. It merges only what passes the
repo's checks and its `CLAUDE.md` rules, and leaves anything that needs
the owner as a clearly labelled PR or issue.

**5. The owner's part.** Read the routine summaries. Answer the items
marked as needing you: spending, outreach, employment or legal questions,
and anything a PR says it isn't sure about. Everything else is meant to
proceed without you.

## Shared standards across the sites

Every site follows these, and each repo's `CLAUDE.md` points here:

- **Hosting:** Cloudflare Pages, deployed from GitHub Actions with
  `wrangler pages deploy` (pinned version). The Cloudflare token is an
  environment secret in `production`, limited to `main`, given only to the
  publish step. It expires 26 Nov 2027. `_headers` sets the security
  headers and keeps `*.pages.dev` out of search. Unknown paths return a
  real 404, or the app's own route for single-page apps.
- **Privacy:** Plausible only, anonymous events, listed on each site's
  privacy page and matching the code. No ad pixels.
- **Writing:** plain language, Australian English, no machine-writing
  patterns. Dated legal or factual claims carry a source.
- **QA:** each repo's checks run in CI, and the deploy waits for them.
  When a mistake gets through, add a check that would have caught it.
- **Work in the repo:** push before stopping.
