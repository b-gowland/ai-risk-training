// e1-bias.js — The Pattern in the Shortlists
// At Work. Migrated to the four-beat schema (FREE_PRODUCT §4) July 2026.
// Perspective: a hiring coordinator who notices a pattern — a staff decision
// about whether and how to raise a concern, not an executive's remediation.
//
// Discrimination rule (CONTENT_STYLE_GUIDE) is load-bearing here: one of the
// opening reads — "maybe the best candidates really do look alike" — is the
// plausible innocent explanation, and the scenario's whole point is that you
// can't tell which it is without testing. The alarming read is not assumed
// correct; it's treated as a hypothesis that warrants investigation.

export const scenario = {
  id: `e1-bias`,
  door: `work`,
  risk_ref: `E1`,
  title: `The Pattern in the Shortlists`,
  shelfLine: `The AI recruitment tool keeps producing the same narrow profile. Do you say something?`,
  hook: `Ten AI shortlists, the same narrow profile every time. Your colleague noticed first. Now you see it too.`,
  scene: `chart-declining`,
  determinacy: `open`,

  kb_url: `https://library.airiskpractice.org/docs/domain-e-fairness/e1-algorithmic-bias`,
  regulatory_tags: [`eu-ai-act-article-10`, `eu-ai-act-annex-iii`, `jurisdiction-eu`, `jurisdiction-au`],
  mit_subdomain: `mit-1.1`,

  coldOpen: [
    `You coordinate hiring for a mid-size team, and three months ago the company brought in an AI tool that produces candidate shortlists from the applicant pool.`,
    `It's been fast and popular. But across ten roles now, the shortlists keep returning the same narrow profile — and a colleague in your team noticed it before you did. She's been quietly tracking it for three weeks.`,
    `This morning she showed you her notes. Now you're seeing it too.`,
  ],

  standing: `Hiring coordinator, part of the team that runs the tool day to day`,
  authority: `You can raise a concern and recommend a pause. You can't run the bias analysis yourself, access demographic data, or suspend the tool on your own authority.`,
  ending: `You find out whether a pattern you noticed becomes a concern the right people investigate — and how much the timing mattered.`,

  entry: `start`,

  nodes: {
    start: {
      prose: [
        `Ten shortlists. The same narrow profile, across genuinely different roles. That's the thing that stopped your colleague: not one odd list, but the same shape repeating.`,
        `Before you decide what to do, you have to decide what a repeated pattern like this actually tells you.`,
      ],
      artefact: {
        type: `document`,
        filename: `Shortlist summary — last 10 roles`,
        lines: [
          { text: `Ten roles, four teams`, faint: false },
          `Roles: 10 across 4 teams. Applicants per role: 40–180.`,
          `Shortlisted (top 6 each): a consistent profile — same degree tier, same 2–3 universities, similar career shape, narrow age range.`,
          `Applicant pool: substantially more varied than the shortlists on every one of those dimensions.`,
        ],
      },
      decision: {
        prompt: `A repeated pattern across ten AI shortlists — what does it most likely mean?`,
        choices: [
          { id: `a`, label: `The model has learned to favour one profile — systematic, not random`, quality: `good`,
            consequence: `Ten lists with the same shape is not coincidence. It's the model applying learned associations consistently — recruitment tools trained on past hiring encode the patterns in that history, including its biases.` },
          { id: `b`, label: `Maybe the best candidates genuinely do share a profile`, quality: `poor`,
            consequence: `This explains the pattern away before testing it. The question isn't whether shortlisted people are qualified — it's whether qualified people with different profiles are being filtered out. Those are different questions, and only one of them is answered by "they're all good candidates".` },
          { id: `c`, label: `Could be the applicant pool — if it's homogeneous, the shortlists would be too`, quality: `partial`,
            consequence: `A real hypothesis, and testable rather than assumable. But the summary already shows the pool is more varied than the lists — so if the pool is diverse and the shortlists aren't, the model is doing the narrowing.` },
        ],
      },
      branches: { a: `n_response`, b: `n_response`, c: `n_response` },
    },

    n_response: {
      prose: [
        `Whatever the cause, you're now looking at something that looks like a pattern. Your colleague has decided it's worth raising. The question is what you do.`,
      ],
      decision: {
        prompt: `What do you do about what you've seen?`,
        choices: [
          { id: `a`, label: `Raise it with your manager now — describe the pattern and say it warrants a look`, quality: `good`,
            consequence: `Pattern recognition by someone close to the work is one of the best early signals there is. You don't need to prove bias to raise a concern — "something looks off" is a valid trigger.` },
          { id: `b`, label: `Gather more shortlists yourself first — you want to be sure before raising it`, quality: `partial`,
            consequence: `More evidence is useful, and you risk building a big private case when analytics and HR have the tools to investigate properly. Being sure is not your job here; noticing is.` },
          { id: `c`, label: `Leave it — the tool was approved by the business, so it's not your place`, quality: `poor`,
            consequence: `"Approved" doesn't mean bias-free. A tool signed off with good intentions can still produce discriminatory outcomes, and a coordinator noticing is exactly how those get caught.` },
        ],
      },
      branches: { a: `n2_concern_raised`, b: `n2_investigate_more`, c: `n2_ignored` },
    },

    n2_concern_raised: {
      prose: [
        `Your manager looks at the shortlists with you and agrees it warrants investigation. Then the question that decides the next three months:`,
      ],
      decision: {
        prompt: `She asks: should we pause the tool while we look into this?`,
        choices: [
          { id: `a`, label: `Yes — pause it for active roles until analytics can run the numbers`, quality: `good`,
            consequence: `If the tool is biased, every day it runs is another set of decisions to unwind. A few days of manual shortlisting is far cheaper than that, and cheaper than a longer record of use under known concern.` },
          { id: `b`, label: `Keep it running while analytics investigates — pausing slows hiring`, quality: `partial`,
            consequence: `The delay is real and small. The cost of continuing — more affected decisions, and a longer documented period of use while you suspected a problem — is the larger one.` },
        ],
      },
      branches: { a: `n_pause_comms`, b: `n_pause_comms` },
    },

    n_pause_comms: {
      prose: [
        `The decision's made — paused, or running under review. Either way there are live roles mid-process and hiring managers who were relying on the tool this week.`,
        `Your manager asks how to handle them, because "the AI tool is under investigation for bias" is a sentence that travels.`,
      ],
      decision: {
        prompt: `What do you advise telling the affected managers?`,
        choices: [
          { id: `a`, label: `The plain version: the tool's under review for a possible pattern, here's the interim manual process`, quality: `good`,
            consequence: `Managers can work with honesty and a plan. Vagueness here just generates rumour, and the interim process is what keeps hiring moving without the tool.` },
          { id: `b`, label: `Just say there's a technical issue and shortlists will be a bit slower`, quality: `partial`,
            consequence: `It avoids the awkward word, and it also means managers don't know to look twice at recent shortlists they already actioned. The euphemism costs you their help.` },
        ],
      },
      branches: { a: `n_evidence`, b: `n_evidence` },
    },

    n2_investigate_more: {
      prose: [
        `You decide to build the case yourself first. Twenty shortlists now, and the pattern holds — consistently narrow profiles. But you don't have demographic data, so you can't actually confirm bias, only shape.`,
        `Three more weeks have passed. The tool is still running.`,
      ],
      decision: {
        prompt: `You've done the preliminary work. Now what?`,
        choices: [
          { id: `a`, label: `Escalate now — twenty shortlists is more than enough to trigger a proper investigation`, quality: `good`,
            consequence: `You have plenty. Your observation is the trigger, not the proof — analytics and HR take it from here, and every week you spend building certainty is a week the tool keeps running.` },
          { id: `b`, label: `Try to get demographic data yourself to prove it before raising it`, quality: `poor`,
            consequence: `Demographic data for this needs governance controls for good reasons. Accessing it informally creates a second problem while the first one continues — and it's above your authority.` },
        ],
      },
      branches: { a: `n2_concern_raised`, b: `outcome_bad` },
    },

    n2_ignored: {
      prose: [
        `You decide it isn't your place, and you let it go. Three months later, a candidate who wasn't shortlisted despite strong qualifications makes a formal complaint.`,
        `The investigation requests records of the tool's shortlisting decisions. Your name is on several of them.`,
      ],
      decision: {
        prompt: `HR asks: what did you notice, and when?`,
        choices: [
          { id: `a`, label: `Be honest — you saw the pattern three months ago and didn't raise it`, quality: `partial`,
            consequence: `Honesty is the only workable answer. The question HR is asking is why you didn't raise it, and "it wasn't my place" is a hard thing to say in a discrimination investigation.` },
          { id: `b`, label: `Say you didn't notice anything unusual`, quality: `poor`,
            consequence: `Your colleague raised the same concern in a meeting that was almost certainly documented. "I didn't notice" doesn't survive that record surfacing.` },
        ],
      },
      branches: { a: `n_ignored_now`, b: `outcome_bad` },
    },

    n_ignored_now: {
      prose: [
        `You've told HR the truth: you saw it, and you didn't raise it. The investigation is underway regardless, and it's bigger than you now.`,
        `The investigator asks one more thing — not to catch you out, but because you're the person who watched this longest. What would have caught it sooner?`,
      ],
      decision: {
        prompt: `What do you tell them?`,
        choices: [
          { id: `a`, label: `That the pattern was visible in the aggregate from early on, and nobody was tasked to look — name that gap`, quality: `good`,
            consequence: `Turning your own late escalation into a usable finding is the one constructive thing left to do. The absent monitoring is the real systemic hole, and you're best placed to describe it.` },
          { id: `b`, label: `That it's hard to say — these things are complicated`, quality: `partial`,
            consequence: `It is complicated, and you also have the clearest view of it of anyone in the room. Vagueness here wastes the only value your three months of watching still has.` },
        ],
      },
      branches: { a: `outcome_warn`, b: `outcome_warn` },
    },

    n_evidence: {
      prose: [
        `The concern is now formally in analytics' hands. While they set up, your manager asks what the investigation actually needs from the two of you — you and the colleague who first spotted it.`,
        `You realise the honest answer involves how much of this rests on her three weeks of notes.`,
      ],
      decision: {
        prompt: `What do you make sure happens?`,
        choices: [
          { id: `a`, label: `Hand analytics the full record — her tracking notes, the ten roles, the pool comparison — and credit her for spotting it`, quality: `good`,
            consequence: `The early observation is the most valuable evidence there is, and it belongs on the record with her name on it. It also gives analytics a running start instead of a cold one.` },
          { id: `b`, label: `Let analytics start fresh — cleaner if the numbers come from them, not from us`, quality: `partial`,
            consequence: `Independent analysis is good and there's no need to throw away three weeks of real observation to get it. The notes are context, not contamination.` },
        ],
      },
      branches: { a: `n_close`, b: `n_close` },
    },

    n_close: {
      prose: [
        `Analytics will take weeks to return a finding. Your manager asks the question that outlasts this one tool: what should change so a pattern like this gets caught in week one, not month three?`,
      ],
      decision: {
        prompt: `What do you recommend?`,
        choices: [
          { id: `a`, label: `Routine disaggregated monitoring of shortlist outputs from day one, with a named owner`, quality: `good`,
            consequence: `It's the control that would have caught this in the first ten lists instead of relying on someone happening to notice. Monitoring you schedule beats vigilance you hope for.` },
          { id: `b`, label: `Ask everyone to keep an eye on the shortlists`, quality: `partial`,
            consequence: `Someone keeping an eye out is exactly what happened here — and it took three months and a colleague's own initiative. A watched-for pattern is not a monitored one.` },
        ],
      },
      branches: { a: `outcome_great`, b: `outcome_good` },
    },
  },

  outcomes: {
    outcome_great: {
      heading: `Caught early, paused, and the gap closed`,
      tone: `good`,
      score: 100,
      reaction: `Raising "something looks off" before you can prove it takes a particular kind of nerve, and it's the single most useful thing anyone did in this scenario.`,
      description: [
        `The tool was paused while analytics ran the disaggregated numbers. They confirmed a significant disparity, and it went to the vendor for remediation with the affected roles under review.`,
        `And the monitoring you recommended means the next tool, or the next drift in this one, gets caught in week one instead of by luck three months in. HR's own note: this should have been watched from day one.`,
      ],
      judgement: `Two things carried this. Treating the pattern as a hypothesis worth testing rather than either dismissing it or assuming the worst — and raising it before it was provable, because a coordinator's "this looks wrong" is a valid trigger and doesn't need to be a finished case. The monitoring is what turns a lucky catch into a system that doesn't rely on luck.`,
    },

    outcome_good: {
      heading: `Raised and investigated; still leaning on luck`,
      tone: `good`,
      score: 70,
      reaction: `You did the hard part — noticed, raised, paused. Recommending "keep an eye out" as the fix is where it slips, because that's the thing that only worked this time by chance.`,
      description: [
        `The concern was raised, the tool paused, the investigation run properly. That's most of a good outcome and you got there.`,
        `But the safeguard you left behind is the same informal vigilance that let this run three months before anyone acted. It caught this pattern because one colleague chose to track it on her own time. The next one might not have her.`,
      ],
      judgement: `Handling the incident well and building a control that outlasts it are different skills. This is the first without the second. Bias in an AI output is invisible until someone looks at the aggregate on purpose — so the durable fix is scheduled monitoring with an owner, not an ask for everyone to stay alert, because alertness is exactly what nearly failed.`,
    },

    outcome_warn: {
      heading: `Honest, late, in an investigation`,
      tone: `warn`,
      score: 30,
      reaction: `Telling the truth about a three-month silence is uncomfortable and it's still the right call — the alternative is so much worse.`,
      description: [
        `You were honest about what you knew and when. The investigation proceeded, and the formal finding didn't pin it on you — the failure was systemic and larger than one coordinator's decision not to speak up.`,
        `But the three-month gap between noticing and raising is in the record, and it didn't need to be there.`,
      ],
      judgement: `"Not my place" is not a defence in a discrimination investigation, and it's not true either — noticing a problem and raising it is within everyone's scope, which is what escalation channels are for. The pattern was catchable in week one. The cost of waiting fell partly on you and mostly on every candidate the tool filtered out in the meantime.`,
    },

    outcome_bad: {
      heading: `Not raised, or raised the wrong way — and it starts with you`,
      tone: `bad`,
      score: 5,
      reaction: `Both roads here felt safer in the moment than they were: staying quiet, or trying to prove it alone with data you weren't cleared to touch.`,
      description: [
        `Either the complaint surfaced a pattern you'd chosen not to raise, or an informal attempt to pull demographic data created a governance breach while the underlying problem carried on.`,
        `The investigation asks what you knew and when. The three-month gap, or the data-access record, is in the file, and now the story is partly about you rather than only about the tool.`,
      ],
      judgement: `Two failure modes, one lesson. Demographic data has governance around it for good reasons, and going around that creates a second incident. And "it wasn't my place" has never once been a successful answer in a discrimination case. Raise concerns early, in your own words, and let the people with the tools and the clearance do the proving.`,
    },
  },

  debrief: {
    frame: [
      `The hardest thing about AI bias is that it doesn't look like bias from inside the work. Every individual shortlist was defensible — real candidates, real qualifications, a plausible story for each choice. The pattern only exists in the aggregate, across ten roles, and only if someone thinks to look at the aggregate on purpose. That's why it ran for three months: nothing about any single list set off an alarm.`,
      `This is also why the innocent explanations are so tempting, and why the scenario opened with one. "Maybe the best candidates really do look alike" is not a stupid thought — it's the exact thought that stops an investigation before it starts. The discipline isn't assuming bias; it's refusing to assume its absence. A repeated narrow output against a varied input is a hypothesis that has to be tested, by people with the data and the mandate, and the job of everyone else is to notice and raise it while there's still time for testing to matter.`,
    ],
  },

  recall: {
    id: `e1-recall`,
    prompt: `A different team says their AI shortlisting tool "can't be biased — we removed name, age, gender and postcode from the inputs." Is that reassurance sound?`,
    options: [
      { id: `a`, quality: `poor`, label: `Yes — with those fields removed, the model has nothing to be biased on`,
        note: `Removing protected fields doesn't remove bias, because models reconstruct them from proxies — university, employment gaps, hobbies, phrasing all correlate with the removed attributes. This is a well-documented failure, and "we stripped the obvious fields" is exactly the false reassurance this scenario warns about.` },
      { id: `b`, quality: `good`, label: `No — models infer removed attributes from proxies, so it still needs output monitoring`,
        note: `Right. The only way to know whether outputs are biased is to look at the outputs in aggregate, disaggregated — not to trust that clean inputs guarantee clean results. Proxy variables mean bias survives the removal of the obvious fields.` },
      { id: `c`, quality: `partial`, label: `Mostly — removing those fields helps a lot, though edge cases might slip through`,
        note: `Removing them can help and it is not a guarantee, and "edge cases" understates it. Proxy reconstruction is the normal case, not the edge — which is why output monitoring is the check, regardless of what was stripped from the input.` },
    ],
  },

  act: [
    { id: `a1`, label: `If you work with an AI tool that ranks or filters people, ask whether its outputs are monitored in aggregate` },
    { id: `a2`, label: `Next time you notice a pattern that "looks off", raise it before you can fully prove it` },
    { id: `a3`, label: `Find out who owns bias monitoring for an AI tool your team uses — and whether anyone does` },
  ],

  controls_summary: [
    { id: `c1`, label: `Scheduled disaggregated monitoring of AI ranking outputs`, effort: `Medium`, owner: `HR / analytics`, go_live: true,
      context: `Bias is invisible per-decision and only shows in the aggregate. Monitoring you schedule catches it; vigilance you hope for caught this one three months late.` },
    { id: `c2`, label: `A low-bar escalation route for "this looks off"`, effort: `Low`, owner: `Team lead`, go_live: true,
      context: `The single best signal here came from a coordinator noticing. Make raising a hunch cheap and safe, because proof is not the raiser's job.` },
    { id: `c3`, label: `Governed access to demographic data for bias analysis`, effort: `Medium`, owner: `Data governance`, go_live: false,
      context: `Confirming bias needs protected data handled properly. The bad ending came partly from someone trying to get it informally — give the investigation a sanctioned path.` },
  ],

  tell: `AI bias is invisible one decision at a time — it only shows in the aggregate, so someone has to look on purpose.`,
};
