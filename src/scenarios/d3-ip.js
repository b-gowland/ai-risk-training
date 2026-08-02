// d3-ip.js — Who Owns This?
// At Work. Migrated to the four-beat schema (FREE_PRODUCT §4) July 2026.
// Perspective: the developer who accepted an AI-suggested function that turns
// out to match GPL-licensed source — a staff decision about disclosure and
// what "review" actually caught.
//
// Discrimination note (CONTENT_STYLE_GUIDE): the code was reviewed carefully
// and it works. The scenario is not "AI code is bad" — it's that functional
// review answers correctness, not provenance, and those are different
// questions. The competent developer here did nothing lazy; they checked the
// wrong thing because the right thing is invisible without tooling.

export const scenario = {
  id: `d3-ip`,
  door: `work`,
  risk_ref: `D3`,
  title: `Who Owns This?`,
  shelfLine: `Legal says a function you wrote with AI matches GPL-licensed code. You reviewed it carefully.`,
  hook: `Legal flags a function you shipped as near-identical to GPL code. You wrote it with an AI assistant.`,
  scene: `desk-working`,
  determinacy: `clean`,

  kb_url: `https://library.airiskpractice.org/docs/domain-d-data/d3-intellectual-property`,
  regulatory_tags: [`eu-ai-act-article-53`, `jurisdiction-global`, `jurisdiction-eu`],
  mit_subdomain: `mit-6.3`,

  coldOpen: [
    `The message from Legal is open on your screen. Three months ago you used the AI coding assistant on a data-transformation function — reviewed it, it worked first time, you merged it and moved on.`,
    `Legal's automated licence scan has flagged it as near-identical to a function published under GPL-3.0. The note links to guidance on licence contamination.`,
    `Before you reply, you have to decide how seriously to take it.`,
  ],

  standing: `Developer on a product team that ships proprietary software`,
  authority: `You can disclose, provide context, and recommend process changes. You can't decide the firm's licence position or speak for Legal on what the obligation is.`,
  ending: `You find out whether a licence problem gets scoped and closed, or whether "the tool did it" and a quick review let it spread.`,

  begin: `Open Legal's message`,

  entry: `start`,

  nodes: {
    start: {
      prose: [
        `You remember the function. It was clean, it passed review, it's been in production for three months without a hiccup. None of which is what Legal is asking about.`,
      ],
      artefact: {
        type: `system_output`,
        caption: `The scan result attached to Legal's message`,
        system: `Composition analysis · licence scan`,
        status: `Review required`,
        headline: `transform_records() matches published GPL-3.0 source`,
        fields: [
          { label: `Similarity`, value: `94% to a public GPL-3.0 repository` },
          { label: `Origin`, value: `AI-assisted commit, three months ago` },
          { label: `Product licence`, value: `Proprietary` },
          { label: `Obligation`, value: `Potential copyleft` },
        ],
        rationale: `A functional review confirms the code works. It does not reveal where the code came from.`,
      },
      decision: {
        prompt: `How do you regard the function you wrote with AI assistance?`,
        choices: [
          { id: `a`, label: `As something that could carry a licence obligation you never checked for — worth flagging however clean it looked`, quality: `good`,
            consequence: `You reply to Legal within the hour with the commit hash in it. Nothing about the function has changed; what you know about it has.` },
          { id: `b`, label: `As probably fine — you reviewed it carefully and it worked first time`, quality: `partial`,
            consequence: `You say so in the reply, twice. Legal's response does not mention correctness at all.` },
          { id: `c`, label: `As the tool's output — if there's a licence problem, that's the AI vendor's`, quality: `poor`,
            consequence: `Legal forwards you the vendor terms with two clauses highlighted. Neither of them says what you assumed they said.` },
        ],
      },
      branches: { a: `n_response`, b: `n_response`, c: `n_response` },
    },

    n_response: {
      prose: [
        `Legal has asked every developer who used AI code generation to self-identify. The message is unambiguous: this is a real exposure, and they want to scope it fast.`,
        `You know you used AI on that function.`,
      ],
      decision: {
        prompt: `What do you do?`,
        choices: [
          { id: `a`, label: `Flag it now with the pull-request link and date`, quality: `good`,
            consequence: `Four lines and a link, sent before lunch. You are the second person to reply and there are eleven developers on the list.` },
          { id: `b`, label: `Flag it, but note that you reviewed it thoroughly and it looked correct`, quality: `partial`,
            consequence: `You add a paragraph defending the review. Legal reads the first two lines, which are the ones with the date and the link.` },
          { id: `c`, label: `Wait for the scanning tool — it might not flag your function`, quality: `poor`,
            consequence: `Nothing happens for six days, which is long enough to stop thinking about it.` },
        ],
      },
      branches: { a: `n2_flagged`, b: `n2_flagged`, c: `n_recover` },
    },

    n_recover: {
      prose: [
        `You decided to wait. A week later the scan flags your function anyway, and Legal follows up — the commit history shows you were among the AI-assistance users who didn't respond to the disclosure request.`,
      ],
      decision: {
        prompt: `Legal asks why you didn't flag it. What do you do?`,
        choices: [
          { id: `a`, label: `Own it — confirm the AI use, share the PR and what you remember`, quality: `good`,
            consequence: `You send everything you have, a week later than eleven other people did. They take it and use it.` },
          { id: `b`, label: `Say you assumed the scan would catch anything, and point to your review`, quality: `partial`,
            consequence: `"We know it caught it. We asked people to tell us." Then they move on and ask for the pull request.` },
          { id: `c`, label: `Frame it as a non-issue — the scan found it, so the process worked`, quality: `poor`,
            consequence: `There is a short silence on the call. Somebody types something.` },
        ],
      },
      branches: { a: `n2_flagged`, b: `n2_flagged`, c: `outcome_wait` },
    },

    n2_flagged: {
      prose: [
        `You've flagged it, and Legal confirms the match to the GPL-3.0 source. Then a question you weren't expecting: do you remember the prompt you used?`,
      ],
      decision: {
        prompt: `Why does the prompt matter, and what do you tell them?`,
        choices: [
          { id: `a`, label: `Share what you remember — it helps them see whether similar prompts were used elsewhere`, quality: `good`,
            consequence: `You find roughly what you asked for in an old branch description. It turns out two other people phrased it almost identically.` },
          { id: `b`, label: `You can't recall exactly — it was three months ago and you don't keep prompt records`, quality: `partial`,
            consequence: `Nobody was ever asked to keep them. Legal writes down that nothing in the repository distinguishes AI-suggested code from anything else.` },
          { id: `c`, label: `The prompt doesn't matter — the tool is responsible for what it generated`, quality: `poor`,
            consequence: `They send you the indemnity clause. It has three conditions on it and the team meets one.` },
        ],
      },
      branches: { a: `n_scope`, b: `n_scope`, c: `n_scope` },
    },

    n_scope: {
      prose: [
        `Your function is being remediated. The larger question is the one that decides how big this is: if AI generation reproduced licensed code once, in a codebase that was never scanned for it, how much else is in there?`,
      ],
      decision: {
        prompt: `Legal asks what the scope of the check should be. What do you recommend?`,
        choices: [
          { id: `a`, label: `Scan the whole codebase for licence matches, not just your function`, quality: `good`,
            consequence: `The scan takes four hours to configure and eleven minutes to run against nine years of commits.` },
          { id: `b`, label: `Check the other functions you personally wrote with AI first, then decide`, quality: `partial`,
            consequence: `Your own commits come back clean apart from the one. The same assistant has been on eleven other machines since March.` },
          { id: `c`, label: `Just remediate the one confirmed function — no evidence of others`, quality: `poor`,
            consequence: `The one function is rewritten and closed out by Thursday. Nobody has looked at anything else.` },
        ],
      },
      branches: { a: `n_remediate`, b: `n_remediate`, c: `n_remediate` },
    },

    n_remediate: {
      prose: [
        `The scan comes back with a handful of findings at different severities — a couple of GPL-3.0 matches, one weak-copyleft LGPL match, and some permissive-licence hits that don't need action.`,
        `Legal asks how you'd handle the confirmed copyleft ones, since you know the code.`,
      ],
      decision: {
        prompt: `What do you recommend for the GPL-matched functions?`,
        choices: [
          { id: `a`, label: `Rewrite them from scratch without AI, and route the LGPL one to Legal rather than guessing`, quality: `good`,
            consequence: `Two rewrites, half a day each, no assistant. Legal comes back on the LGPL one with a set of steps you would not have guessed at.` },
          { id: `b`, label: `Heavily refactor the GPL functions — rename, restructure — so they're not the original anymore`, quality: `partial`,
            consequence: `You rename and restructure until the diff looks unrecognisable. Legal asks how much of the original logic survived, and you find you cannot answer that in a way that settles anything.` },
          { id: `c`, label: `Treat the LGPL and permissive findings as no-action, and just fix the two GPL ones`, quality: `poor`,
            consequence: `The two GPL functions get rewritten. The LGPL finding sits in the no-action column, alongside the MIT and Apache hits.` },
        ],
      },
      branches: { a: `n_control`, b: `n_control`, c: `n_control` },
    },

    n_control: {
      prose: [
        `The scope is decided. The last question is the one that determines whether this happens again: the code-review process predates AI assistants, and it has no step that checks provenance.`,
        `Your lead asks what should change.`,
      ],
      decision: {
        prompt: `What do you recommend as the durable control?`,
        choices: [
          { id: `a`, label: `A blocking licence scan in CI/CD, plus a short briefing on why it's there`, quality: `good`,
            consequence: `The gate goes into the pipeline in a fortnight. The briefing takes five minutes at a stand-up and half the room has questions.` },
          { id: `b`, label: `A blocking licence scan in CI/CD, and leave it at that`, quality: `partial`,
            consequence: `The gate goes in and starts failing builds on day two. Nobody has explained to anyone why it is there.` },
          { id: `c`, label: `A reminder to developers to consider licences, and a declaration checkbox`, quality: `poor`,
            consequence: `The checkbox is added to the pull-request template. Everybody ticks it, because everybody believes it when they tick it.` },
        ],
      },
      branches: { a: `outcome_great`, b: `outcome_good`, c: `outcome_bad` },
    },
  },

  outcomes: {
    outcome_great: {
      heading: `Scoped fully, gated properly`,
      tone: `good`,
      score: 100,
      reaction: `Recommending a whole-codebase scan when your own function was already being fixed is the harder, slower call — and it's the one that stops this becoming a headline.`,
      description: [
        `The full scan found two more functions with licence findings, both remediated. A blocking licence scan now sits in CI/CD, and a short briefing meant developers understood why rather than working around it.`,
        `Your self-identification and prompt context let Legal scope the whole thing quickly. The exposure is closed, not just the one function.`,
      ],
      judgement: `Licence contamination from AI code needs two controls: a technical gate that catches what humans can't see, and enough awareness that people don't treat the gate as friction. You disclosed early, scoped past your own work, and named both halves. The temptation at every step was to make the problem smaller — one function, your functions, a reminder — and you resisted it each time.`,
    },

    outcome_good: {
      heading: `Gated, but understanding left thin`,
      tone: `warn`,
      score: 68,
      reaction: `A blocking scan is genuinely the right control. Leaving out the "why" is the small gap that shows up later as someone reformatting code to beat the gate.`,
      description: [
        `The exposure was scoped and a CI/CD licence gate went in. It works — it caught further findings over the following months.`,
        `But with no briefing, two developers treated the gate as an obstacle and tried to reformat code around it, not understanding what it protected against. The briefing got added later, after that surfaced.`,
      ],
      judgement: `Technical controls are most robust when the people subject to them understand the point. A licence gate with no accompanying awareness creates a quieter gap: developers who read it as friction rather than protection look for ways around it. The gate was right; pairing it with a five-minute explanation is what makes it hold.`,
    },

    outcome_wait: {
      heading: `The scan found it; you didn't flag it`,
      tone: `warn`,
      score: 35,
      reaction: `Waiting for the scan feels like it costs nothing when the outcome is the same either way. The thing it costs is trust, and that shows up later.`,
      description: [
        `The automated scan flagged your function. By not self-identifying when the request went out, you slowed the scoping and made the compliance team chase you individually.`,
        `The remediation was the same. The non-response is in the record, and it colours how much the team trusts the next self-report.`,
      ],
      judgement: `Voluntary disclosure when you have direct knowledge is faster than waiting for a tool, and it signals the transparency a compliance process runs on. Scanning doesn't catch everything — human memory is part of the evidence — so a developer who knows and waits is withholding a piece of the picture, even when the scan happens to find it anyway.`,
    },

    outcome_bad: {
      heading: `A checkbox where a gate was needed`,
      tone: `bad`,
      score: 15,
      reaction: `A declaration checkbox feels like a control because it produces a record. What it records is that the team knew the risk and didn't tool for it.`,
      description: [
        `The reminder-and-declaration approach left the actual gap open. Two months later a developer under deadline pressure, confident the code looked original, merged another function with a high-risk licence finding.`,
        `They looked carefully and didn't spot it, because licence contamination isn't visible without a tool. The scan requirement went in after that second finding.`,
      ],
      judgement: `A human reviewer cannot see licence risk in generated code, however careful they are. Matching a function against public GPL source takes composition analysis. Attention will never do it. So a declaration checkbox sitting on top of an unscanned merge produces a record that the organisation understood the risk and picked a process incapable of catching it, which is worse than having neither.`,
    },
  },

  debrief: {
    frame: [
      `The developer in this scenario did nothing careless. They reviewed the function, it was correct, it worked in production for three months. The problem is that they checked the thing they could see — does it work — and the risk lived in the thing they couldn't: where did it come from. Functional review and provenance are different questions, and AI coding assistants can reproduce licensed source with none of the markers that would tip off a human reader.`,
      `That's why the durable answer here is tooling, not diligence. You can't ask a reviewer to notice that a function matches a public GPL repository, because that match is invisible without composition analysis — it's not a matter of looking harder. Every good ending ran through a blocking scan in the pipeline, and every weak one substituted human attention for it: a reminder, a checkbox, a resolution to be careful. The organisation using the AI carries the licence obligation, not the vendor, and the only control that meets an invisible risk is one that doesn't depend on anyone seeing it.`,
    ],
  },

  recall: {
    id: `d3-recall`,
    prompt: `A teammate says they've made AI-suggested code safe by "refactoring it heavily — renamed everything, restructured the logic, so it's not the original code anymore." Does that resolve the GPL concern?`,
    options: [
      { id: `a`, quality: `poor`, label: `Yes — if it's been substantially rewritten, it's no longer the licensed code`,
        note: `How much rewriting breaks a copyleft obligation is a question of copyright law. It turns on how much structure and logic survived, which is assessed against precedent rather than against a diff. An engineer's estimate of "enough" has no standing here, so this one goes to Legal.` },
      { id: `b`, quality: `good`, label: `Not necessarily — whether refactoring breaks the licence chain is a legal question for Legal`,
        note: `Right. Where the similarity threshold sits is settled by law and precedent. "I changed it enough" is an engineering answer to a legal question, so GPL-origin code goes to Legal however heavily it was rewritten.` },
      { id: `c`, quality: `partial`, label: `Mostly — heavy refactoring usually breaks it, though edge cases exist`,
        note: `"Usually" is doing a lot of work, and it's not the developer's call to make. Retained structure and logic can carry the obligation through a heavy rewrite, so the safe path is referral to Legal rather than an estimate of how much survived.` },
    ],
  },

  act: [
    { id: `a1`, label: `Find out whether your CI/CD runs a licence or composition scan on merges` },
    { id: `a2`, label: `Next time you accept AI-suggested code, note it — a commit tag is enough to make it traceable later` },
    { id: `a3`, label: `If AI-origin code raises a GPL question, route it to Legal rather than judging the rewrite yourself` },
  ],

  controls_summary: [
    { id: `c1`, label: `Blocking licence/composition scan in CI/CD`, effort: `Medium`, owner: `Platform / eng lead`, go_live: true,
      context: `Licence contamination is invisible to human review. A gate that doesn't depend on anyone seeing it is the only control that meets the risk.` },
    { id: `c2`, label: `A lightweight AI-assisted commit tag`, effort: `Low`, owner: `Dev team`, go_live: true,
      context: `The prompt-recall gap in this scenario becomes a recommendation every time. A commit tag makes AI-origin code traceable without disrupting flow.` },
    { id: `c3`, label: `Short briefing on why the gate exists`, effort: `Low`, owner: `Eng lead`, go_live: true,
      context: `A gate people don't understand gets reformatted around. Five minutes on the purpose is what stops the gate becoming friction to defeat.` },
  ],

  tell: `AI can hand you licensed code with no trace of where it came from — review shows it works, only a scan shows what it is.`,
};
