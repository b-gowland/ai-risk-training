# Scheduled routines

The repeat work in [`OPERATING_MODEL.md`](OPERATING_MODEL.md) runs as a
scheduled task that starts a fresh Claude Code session each time. Creating
one needs the owner's approval, so it is kept here ready to create.

**To create it:** in any Claude Code session, ask: "Create the weekly upkeep
routine from ai-risk-training docs/ROUTINES.md". Settings: a new session on
each run, every Monday at 7:28 Sydney time
(`CRON_TZ=Australia/Sydney 28 7 * * 1`), push notification on finish.

## Weekly upkeep: the stored prompt

> Weekly upkeep for the AI Risk Practice sites. The owner (GitHub b-gowland)
> has authorised you to review, fix and merge low-risk maintenance yourself;
> anything that needs spending, outreach, legal or employment judgement, or
> hosting, DNS or Cloudflare changes goes on the owner list instead.
>
> Repos (attach each with add_repo, push access, then clone with
> `--depth 50`): b-gowland/ai-risk-training (app.airiskpractice.org),
> b-gowland/ai-risk-kb (library.airiskpractice.org),
> b-gowland/ai-risk-baseline (baseline.airiskpractice.org),
> b-gowland/narrated-self (narratedself.airiskpractice.org), and the private
> commercial repo, which stays separate: nothing from it goes into the
> public repos. Read each repo's CLAUDE.md and follow it, including its
> checks before pushing. Cross-site standards are in ai-risk-training
> docs/OPERATING_MODEL.md.
>
> Each week:
> 1. Dependabot PRs in every repo: merge patch and minor updates whose checks
>    are green. For majors, read the changelog against the code, fix if
>    needed, and merge only when tests cover the change; otherwise comment
>    and list it for the owner.
> 2. Red CI on main or on a scheduled workflow: find the root cause and fix
>    it in a PR. Sites such as ISO, OAIC and EU pages refuse automated
>    checkers with 403: treat that as "check by hand", not a broken link.
> 3. Library source monitoring: for each open issue labelled
>    source-monitoring, verify the recommended incident updates against
>    sources you can reach; add the verified ones to their entries in the
>    existing style (plain language, Australian English, allegations worded
>    as allegations, a dated source in brackets); run `npm ci && npm run
>    build` and the citation ledger; open a PR that closes the issue, and
>    merge it when checks are green.
> 4. On the first Monday of a month, also: triage the library's
>    monthly-maintenance issue (apply only corrections confirmed at a
>    primary source; reject or defer the rest with reasons; record the
>    triage under automation/reviews/), and run `npm audit` in each Node
>    repo.
> 5. Check the four free sites load (home 200, a junk path 404, security
>    headers present) and that each scheduled workflow ran this week; if one
>    hasn't, dispatch it once.
> 6. Add a dated one-line summary of the week to ai-risk-training
>    docs/STATUS.md, in a PR.
>
> Rules: branches named claude/weekly-YYYY-MM-DD, one PR per repo per topic;
> commits end with the attribution lines your environment specifies; never
> push to main directly; never delete branches; push before stopping; no
> model identifiers in commits or PRs.
>
> Finish with a short report: what you merged (with links), what failed and
> why, and an "Owner" list of anything only the owner can do.
