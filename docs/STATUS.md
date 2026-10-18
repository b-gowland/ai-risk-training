# Status

Last updated 18 October 2026. Update this file at the end of a working
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

## Outside the repo (set up, no action needed)

| Service | State |
|---|---|
| Google Search Console | Domain property `airiskpractice.org` (DNS TXT), covering app, library and baseline. All three sitemaps submitted. Indexed pages: 7 of about 80 known on 12 Oct. Indexing requested for the unindexed key pages on 18 Oct. |
| Bing Webmaster Tools | Site set up and all three sitemaps read. IndexNow key `public/b569d15f07f9b699dacfaf1d6f3a77ab.txt` validated (HTTP 200 on 18 Oct). |
| Cloudflare | Proxies only `airiskpractice.org` and `www`, which 301 to `https://app.airiskpractice.org/${1}` with the path and query string kept. Always Use HTTPS is on. AI crawlers are allowed (AI Crawl Control: none blocked). The app, library and baseline are served by GitHub Pages directly. |
| Plausible | One property, `airiskpractice.org`, covering the app and library. 14 visitors in the 28 days to 18 Oct. |

## Follow-ups

| When | What |
|---|---|
| About 29 Oct | **Good Things Australia.** If there's no reply, follow up with Linda Wortel directly (not the no-reply address). They are reviewing the cards for Digital Mentors. Offer printed cards or a 15-minute walkthrough. |
| About 1 Nov | **Search Console.** Export Page indexing and compare it with the 7 indexed pages on 12 Oct. |
| Next fortnight | **Second LinkedIn post**, on a workplace scenario (for example "paste the client brief into a free AI tool"), on a Tuesday or Wednesday morning. The first, on voice-clone scams for Cyber Security Action Month, went out 18 Oct with `?ref=linkedin-cybermonth`. |
| Ongoing | **Links from other sites:** AI literacy resource lists, library and community-education programs, targeted Reddit posts, a Show HN, GitHub lists. |

## Open decisions (owner)

- **"Make the call" wording.** It's an idiom, US-leaning, and it clashes with
  the phone-call scenario. The proposal is "You decide what to do and see what
  follows", and the "Your call" card heading becoming "Your decision". The
  tagline appears in 6 places in this repo and 2 in the KB (`about.md`,
  `how-to-use.md`). Not started.
- **KB timing text.** The KB's "Practise this" links still say At Home takes
  about five minutes and At Work about ten. They should say about seven and
  nine to ten.
- **Trade mark checks** for the invented names (Brieflark, Pellarin Read,
  Wrenfold, Marrowfield Group, Tarnwick DLP) on IP Australia, EUIPO and WIPO.
  ABN Lookup and web searches were clear.
- **Outside review.** `npm run review-pack` with `docs/REVIEW_PROMPT.md`.
