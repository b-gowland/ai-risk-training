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
  determinacy: `open`,

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

  entry: `start`,

  nodes: {
    start: {
      prose: [
        `You remember the function. It was clean, it passed review, it's been in production for three months without a hiccup. None of which is what Legal is asking about.`,
      ],
      artefact: {
        type: `system_output`,
        source: `Licence scan — composition analysis`,
        lines: [
          `Match: transform_records() → 94% similar to public GPL-3.0 source`,
          `Origin: AI-assisted commit, 3 months ago`,
          `Product licence: proprietary`,
          `Status: potential copyleft obligation — review required`,
        ],
        note: `A functional review confirms the code works. It does not reveal where the code came from.`,
      },
      decision: {
        prompt: `How do you regard the function you wrote with AI assistance?`,
        choices: [
          { id: `a`, label: `As something that could carry a licence obligation you never checked for — worth flagging however clean it looked`, quality: `good`,
            consequence: `AI suggestions can reproduce licensed source, and functional review doesn't catch provenance. Treating it as flaggable is the right read of what the scan is telling you.` },
          { id: `b`, label: `As probably fine — you reviewed it carefully and it worked first time`, quality: `partial`,
            consequence: `Careful review confirms correctness, not where the code came from. Those are different questions, and only one of them is what Legal is asking.` },
          { id: `c`, label: `As the tool's output — if there's a licence problem, that's the AI vendor's`, quality: `poor`,
            consequence: `The organisation that ships AI output in its product carries the obligation, not the tool. That exact misunderstanding is what the review exists to correct.` },
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
            consequence: `Self-identifying is the fastest way to scope the exposure, and the PR link lets Legal trace the code path immediately instead of hunting for it.` },
          { id: `b`, label: `Flag it, but note that you reviewed it thoroughly and it looked correct`, quality: `partial`,
            consequence: `Self-identifying is right. The note slightly misses the point — the issue is provenance, not correctness — but both can be true, and flagging is what matters.` },
          { id: `c`, label: `Wait for the scanning tool — it might not flag your function`, quality: `poor`,
            consequence: `Waiting for a scan when you know you used AI generation isn't disclosure; it's hoping not to be found. The request exists precisely because scanning misses things.` },
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
            consequence: `Late disclosure still helps scope the related risk, and candour now matters more than the delay does. It's recoverable.` },
          { id: `b`, label: `Say you assumed the scan would catch anything, and point to your review`, quality: `partial`,
            consequence: `The scan did catch it, and waiting for it wasn't disclosure. Engaging properly now still beats not.` },
          { id: `c`, label: `Frame it as a non-issue — the scan found it, so the process worked`, quality: `poor`,
            consequence: `Calling the delay "the process working" ignores that voluntary disclosure was the ask. The non-response is the thing that gets noted.` },
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
            consequence: `Prompt context lets the team assess whether the same generation pattern produced similar output across the codebase, and shapes the guidance that follows.` },
          { id: `b`, label: `You can't recall exactly — it was three months ago and you don't keep prompt records`, quality: `partial`,
            consequence: `Reasonable — records weren't required. It surfaces a real gap: nothing tracks which AI generated which code, and that gap becomes a recommendation.` },
          { id: `c`, label: `The prompt doesn't matter — the tool is responsible for what it generated`, quality: `poor`,
            consequence: `The organisation shipping the code owns the obligation. Vendor indemnification has conditions and doesn't move the compliance duty off the team.` },
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
            consequence: `One confirmed finding in an un-scanned codebase is evidence of a process gap, not an isolated event. Scoping fully is far cheaper than a second finding surfacing publicly.` },
          { id: `b`, label: `Check the other functions you personally wrote with AI first, then decide`, quality: `partial`,
            consequence: `A sensible start that stops at your own work. The same tool was used across the team, so your functions aren't the boundary of the exposure.` },
          { id: `c`, label: `Just remediate the one confirmed function — no evidence of others`, quality: `poor`,
            consequence: `"No evidence" here means "nobody has looked". The narrow fix is how a second contaminated function gets found later by someone outside the company.` },
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
            consequence: `Rewriting removes the GPL-origin code cleanly, and treating the LGPL finding as a real obligation rather than a lesser one is exactly the distinction that trips teams up.` },
          { id: `b`, label: `Heavily refactor the GPL functions — rename, restructure — so they're not the original anymore`, quality: `partial`,
            consequence: `Whether refactoring breaks a copyleft obligation is a legal question, not a line-count one. Retained structure can carry the obligation through a rewrite, so this needs Legal, not an engineering call.` },
          { id: `c`, label: `Treat the LGPL and permissive findings as no-action, and just fix the two GPL ones`, quality: `poor`,
            consequence: `LGPL is weak copyleft — it does carry compliance steps, just not full-codebase disclosure. Lumping it with permissive licences understates a real obligation.` },
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
            consequence: `The gate catches what people can't see, and the briefing stops people treating it as friction to route around. Both halves, because either alone leaves a gap.` },
          { id: `b`, label: `A blocking licence scan in CI/CD, and leave it at that`, quality: `partial`,
            consequence: `The gate works, and developers who don't understand it will eventually try to reformat code around it. The tooling holds; the understanding is what's thin.` },
          { id: `c`, label: `A reminder to developers to consider licences, and a declaration checkbox`, quality: `poor`,
            consequence: `Licence contamination isn't visible to a careful human reviewer — it needs a tool. A declaration on top of an unscanned merge is documentation that the risk was known, not a control.` },
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
      judgement: `Licence risk in AI-generated code cannot be seen by a human reviewer, however careful — matching a function to public GPL source requires composition analysis, not attention. A declaration checkbox on top of an unscanned merge is not a control; it's evidence the organisation understood the risk and chose a process that couldn't catch it. The fix has to be the tool.`,
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
        note: `Whether refactoring breaks a GPL obligation is a legal question, not a line-count one. Substantial refactoring of GPL-origin code can still carry the obligation depending on how much structure and logic is retained — that's determined by copyright law, not by how much was changed. It needs Legal, not an engineering judgement.` },
      { id: `b`, quality: `good`, label: `Not necessarily — whether refactoring breaks the licence chain is a legal question for Legal`,
        note: `Right. The degree of similarity that triggers the copyleft obligation is a matter of law and precedent, not engineering. "I changed it enough" is an engineering call on a legal question — GPL-origin code goes to Legal regardless of how much it was modified.` },
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
