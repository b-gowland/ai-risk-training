# Plan

27 November 2026. What to do, in order, for the free sites (scenarios,
library, Baseline). The reasons are in [`STRATEGY.md`](STRATEGY.md) and
[`PRODUCT_REVIEW.md`](PRODUCT_REVIEW.md). Tick items off here as they land.

## Now: back on GitHub, hosting stays on Cloudflare

GitHub restored the account on 25 Nov. Code, reviews and checks are back on
GitHub; the sites stay on Cloudflare Pages, deployed by GitHub Actions.

**Owner (one-off, done 26 Nov)**
- [x] Create a Cloudflare API token with one permission, **Account ·
      Cloudflare Pages · Edit**, for this account only, expiring in 1 year,
      no IP filter (My Profile → API Tokens → Create Token → Custom token).
      Calendar reminder to replace it in November 2027.
- [x] In each of `ai-risk-training`, `ai-risk-baseline` and `ai-risk-kb`:
      Settings → Environments → **production** → Deployment branches and
      tags → **Selected branches** → add `main`. Then, on the same page,
      Environment secrets → add `CLOUDFLARE_API_TOKEN` (the token) and
      `CLOUDFLARE_ACCOUNT_ID` (shown on the Workers & Pages overview page).
      Not as repository secrets: environment secrets can only be read by
      the deploy job on `main`.
- [x] In the same three repos: Settings → Pages → turn GitHub Pages off and
      remove the custom domain, so GitHub stops expecting the old DNS.
- [x] Check after the first deploy from Actions that Cloudflare marks it
      **Production** (Workers & Pages → project → Deployments).

**Claude**
- [x] `_headers` and `404.html` in the build; deploy workflow switched to
      Cloudflare (this repo).
- [x] Front-door fixes 1 to 8 from `PRODUCT_REVIEW.md` §1.
- [x] Dependency updates and audit fixes.
- [x] The same hosting changes in the Baseline and library repos (and narrated-self).
- [x] Library PR #77 (corrections to the #75 incident write-ups in c5, d2
      and f1, plus the changelog): merged 26 Nov; issue #75 closed.
- [x] narrated-self PR #1 (deploy to Cloudflare Pages from Actions): merged;
      first Actions deploy live 26 Nov.
- [x] Fonts served from the app itself, not Google Fonts; Privacy page
      updated; "You decide, then see what follows" replaces "Make the call".

## Next: At Home, through the people who run sessions (1 Dec 2026 – 9 Mar 2027)

Decided after a first-principles review on 27 Nov, checked by an outside
review. Items marked (owner) wait for the owner's yes. The reasoning is
summarised here; the full review is kept privately.

**Why this shape**
- Nobody outside a handful of testers has used the scenarios yet, and
  there is no evidence yet that they change decisions. Those are the two
  things to find out. More building or polish tests neither.
- At Home only, for now. It is the largest audience, the warm lead is
  there (Good Things Australia), and group sessions and cue cards are the
  best available answer to the evidence that one-off sessions fade within
  weeks. At Work stays live, with no new work.
- Reach through people who already run sessions (digital mentors,
  libraries, U3A, schools), not paid ads. Ads buy clicks at about A$7–20
  per finished scenario and tell us little.
- No paid study yet. A small online panel can only detect large effects.
  A properly powered study comes once a partner or a university
  supervisor can co-design it, with ethics approval.

**Built on 27 Nov (branch, waiting for review)**
- [x] Is That Really Mum?: tap what makes you pause before choosing; the
      reveal separates warning signs from what settles nothing.
- [x] A benign twin after the recall item: the call is genuine, ringing
      back is still right, refusing without checking is costly.
- [x] Close screen: send to family on WhatsApp; a two-week reminder file
      made in the browser. Nothing new is collected.

**Weeks 1–2 (about 6 owner hours)**
- [ ] (owner) Follow up with Good Things Australia: the cards and the
      At Home scenarios for Digital Mentors and AI Hubs.
- [ ] (owner) Ask three facilitators outside our own contacts (a library
      digital-literacy lead, a U3A coordinator, a neighbourhood house or
      school): "If I send 10 printed decks free for a 15-minute session,
      will you run it? If not, what stops you?"
- [ ] (owner) Search Console and Bing: request reindexing of the home
      pages and resubmit the sitemaps (the sites were down three weeks).
- [ ] (owner) Check that the custom-event goals are registered in
      Plausible (the code sends them; the dashboard only shows registered
      goals).

**Weeks 3–6**
- [ ] (owner) Watch five people outside our circle play Is That Really
      Mum? on their own phones, without help. Note every hesitation.
- [ ] Fix what they trip on. Then the same flags, twin and close loop for
      the other two At Home scenarios.
- [ ] A5 table card for each At Home scenario, print-ready.
- [ ] (owner) Print and send decks only to facilitators who said yes.
- [ ] Monthly: what ChatGPT and Perplexity answer for about ten At Home
      questions; tighten the static pages to be the best answer.

**Weeks 7–12**
- [ ] (owner) Support the facilitators running sessions; collect three
      answers from each: how many played, what stuck, would you run it
      again.

**Gates**

| Gate | When | Pass | Then |
|---|---|---|---|
| 1. Facilitator pull | Early Feb 2027 | At least 2 facilitators outside our contacts commit to a session, or Good Things takes the kit to its mentors | Second print run; plan a properly powered study with a partner or supervisor |
| 2. Real use | Early Mar 2027 | At least 2 outside group sessions with "would run again", or unpaid completions averaging 5 a week over weeks 9–12 | Keep going into Q2 |

If both fail: stop active work and leave the sites up.

**Not doing in this window:** paid ads, paid panel studies, new scenarios,
translations, At Work changes, library additions, Baseline changes.

## Every week and month

| When | What |
|---|---|
| Monday | One row: visitors, challenge plays, scenario starts and completions, share-link visits, by country and source |
| Monthly | Dependency updates; Baseline date and URL checks; library citation ledger (the library's own source monitoring runs on Actions) |
| Quarterly | Review scenarios against new incidents; refresh "where to report" links |
