# Status

Last updated 25 November 2026. Update this file at the end of a working
session.

## Where things stand

- **Content:** nine scenarios, four At Home and five At Work. They were
  checked against the KB and rewritten in plain language in October.
  - Endings are route-aware.
  - Option order and length are balanced.
  - Times are worked out from the content: about seven minutes At Home, nine
    to ten At Work.
- **Site:**
  - A Content Security Policy on every page.
  - Static scenario pages styled like the app, each showing a search-style
    question with its tell.
  - FAQPage and LearningResource structured data, plus `llms.txt`.
  - An IndexNow ping to Bing after each deploy.
- **Checks:** 187 tests, the scenario audit, the route audit and the SCORM
  test. All run in CI.

## Hosting and the GitHub suspension

GitHub suspended the owner's account in early November 2026 without notice.
Every GitHub Pages site went offline and the repos were hidden. On 17 Nov the
owner moved the four sites to Cloudflare Pages as direct uploads:

| Address | Pages project |
|---|---|
| app.airiskpractice.org | `ai-risk-app` |
| baseline.airiskpractice.org | `ai-risk-baseline` |
| library.airiskpractice.org | `ai-risk-library` |
| narratedself.airiskpractice.org | `narratedself` |

The GitHub CNAMEs were deleted (nothing on the domain points at GitHub now).
GitHub restored the account on 25 Nov. Hosting stays on Cloudflare and,
since 26 Nov, the app, Baseline and library deploy from GitHub Actions
(`wrangler pages deploy`) on every merge to `main`; a GitHub outage stops
deploys, not the sites. The Cloudflare token (Pages: Edit only, expires
26 Nov 2027) is a secret of each repo's `production` environment, limited
to `main`. GitHub Pages is switched off in those repos.

Lesson: a cloud container was rebuilt during the outage and lost every
unpushed commit. Plans and reviews now live in `docs/`.

## Outside the repo (set up, no action needed)

| Service | State |
|---|---|
| Google Search Console | Domain property `airiskpractice.org` (DNS TXT), covering app, library and baseline. All three sitemaps submitted. Indexed pages: 7 of about 80 known on 12 Oct. Indexing requested for the unindexed key pages on 18 Oct. |
| Bing Webmaster Tools | Site set up and all three sitemaps read. IndexNow key `public/b569d15f07f9b699dacfaf1d6f3a77ab.txt` validated (HTTP 200 on 18 Oct). |
| Cloudflare | Proxies only `airiskpractice.org` and `www`, which 301 to `https://app.airiskpractice.org/${1}` with the path and query string kept. Always Use HTTPS is on. AI crawlers are allowed (AI Crawl Control: none blocked). Since 17 Nov the app, library, baseline and The Narrated Self are Cloudflare Pages projects (above). |
| Plausible | One property, `airiskpractice.org`, covering the app and library. 14 visitors in the 28 days to 18 Oct. |

## Follow-ups

The working plan is `docs/PLAN.md` (what to do, in order) and
`docs/STRATEGY.md` (why). Dated items from before the outage:

| When | What |
|---|---|
| Overdue (was 29 Oct) | **Good Things Australia.** Follow up with Linda Wortel directly (not the no-reply address). They were reviewing the cards for Digital Mentors. Offer printed cards or a 15-minute walkthrough. |
| Now | **Search Console and Bing.** The sites returned errors for about three weeks. Request indexing for the three home pages and resubmit the sitemaps; then compare indexed pages with the 7 on 12 Oct. |
| Dropped | Organic LinkedIn posting: repeated posts drew little response. Paid seed traffic and published findings replace it (see `docs/STRATEGY.md`). |

## Open decisions (owner)

- **"Make the call" wording.** It's an idiom, US-leaning, and it clashes with
  the phone-call scenario. The proposal is "You decide what to do and see what
  follows", and the "Your call" card heading becoming "Your decision". The
  tagline appears in 6 places in this repo and 2 in the KB (`about.md`,
  `how-to-use.md`). The homepage now uses "You decide, then see what follows";
  the tagline itself is still undecided.
- **KB timing text.** The KB's "Practise this" links still say At Home takes
  about five minutes and At Work about ten. They should say about seven and
  nine to ten.
- **Trade mark checks** for the invented names (Brieflark, Pellarin Read,
  Wrenfold, Marrowfield Group, Tarnwick DLP) on IP Australia, EUIPO and WIPO.
  ABN Lookup and web searches were clear.
- **Outside review.** `npm run review-pack` with `docs/REVIEW_PROMPT.md`.
