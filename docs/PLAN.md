# Plan

25 November 2026. What to do, in order, for the free sites (scenarios,
library, Baseline). The reasons are in [`STRATEGY.md`](STRATEGY.md) and
[`PRODUCT_REVIEW.md`](PRODUCT_REVIEW.md). Tick items off here as they land.

## Now: back on GitHub, hosting stays on Cloudflare

GitHub restored the account on 25 Nov. Code, reviews and checks are back on
GitHub; the sites stay on Cloudflare Pages, deployed by GitHub Actions.

**Owner (one-off, about 20 minutes)**
- [ ] Create a Cloudflare API token with one permission, **Account ·
      Cloudflare Pages · Edit**, for this account only, expiring in 1 year,
      no IP filter (My Profile → API Tokens → Create Token → Custom token).
      Calendar reminder to replace it in November 2027.
- [ ] In each of `ai-risk-training`, `ai-risk-baseline` and `ai-risk-kb`:
      Settings → Environments → **production** → Deployment branches and
      tags → **Selected branches** → add `main`. Then, on the same page,
      Environment secrets → add `CLOUDFLARE_API_TOKEN` (the token) and
      `CLOUDFLARE_ACCOUNT_ID` (shown on the Workers & Pages overview page).
      Not as repository secrets: environment secrets can only be read by
      the deploy job on `main`.
- [ ] In the same three repos: Settings → Pages → turn GitHub Pages off and
      remove the custom domain, so GitHub stops expecting the old DNS.
- [ ] Check after the first deploy from Actions that Cloudflare marks it
      **Production** (Workers & Pages → project → Deployments).

**Claude**
- [x] `_headers` and `404.html` in the build; deploy workflow switched to
      Cloudflare (this repo).
- [x] Front-door fixes 1 to 8 from `PRODUCT_REVIEW.md` §1.
- [x] Dependency updates and audit fixes.
- [ ] The same hosting changes in the Baseline and library repos.
- [ ] Library PR #77 (four new incident entries): owner reads, then merge.

## Next: the engine (December)

See `STRATEGY.md` §4. Each step needs the owner's yes where it spends money
or commits to outside people.

1. **Decide** (owner): the challenges lead; a score in the challenges only;
   research panel budget (about £1,000 to £1,500); ad seed (about A$800, no
   pixels); voice clips from consenting volunteers only; the gates.
2. **Voice challenge** ("Is that really Mum?"): spec and words first, then
   build. Share button with WhatsApp; `?ref=share` for counting.
3. **Per-country "where to report"** block, chosen in the browser.
4. **Research studies** on Prolific: a 20-person pilot, then the two full
   studies.
5. **Five think-aloud tests** on the challenge and one scenario; fix.
6. **Findings page** and press release; partners briefed (GASA, national
   anti-scam and seniors' bodies, libraries).
7. **Launch**, aiming for the week of 10 December on "agree a family safe
   word before Christmas"; fallback Safer Internet Day, 9 February 2027.
8. **Gate 1** about three weeks after launch.

## Then (if gate 1 passes)

- Citation challenge ("Real or invented?") for the work door.
- Teams page (`PRODUCT_REVIEW.md` §3); presenter mode.
- Confidence tap; calendar reminder; evidence flagging; paths-not-taken map.
- Translations of the two challenges (Spanish, Portuguese, French, German,
  Hindi).
- New scenarios, home door first.
- Randomised study; accessibility audit; outside review.

## Every week and month

| When | What |
|---|---|
| Monday | One row: visitors, challenge plays, scenario starts and completions, share-link visits, by country and source |
| Monthly | Dependency updates; Baseline date and URL checks; library citation ledger (the library's own source monitoring runs on Actions) |
| Quarterly | Review scenarios against new incidents; refresh "where to report" links |
