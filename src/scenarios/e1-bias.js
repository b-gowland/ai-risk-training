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
  determinacy: `clean`,

  kb_url: `https://library.airiskpractice.org/docs/domain-e-fairness/e1-algorithmic-bias`,
  regulatory_tags: [`eu-ai-act-article-10`, `eu-ai-act-annex-iii`, `jurisdiction-eu`, `jurisdiction-au`],
  mit_subdomain: `mit-1.1`,

  coldOpen: [
    `You coordinate hiring for a mid-size team, and three months ago the company brought in an AI tool that produces candidate shortlists from the applicant pool.`,
    `It's been fast and popular. But across ten roles now, the shortlists keep returning the same narrow profile, and a colleague in your team noticed it before you did. She's been quietly tracking it for three weeks.`,
    `This morning she showed you her notes. Now you're seeing it too.`,
  ],

  standing: `Hiring coordinator, part of the team that runs the tool day to day`,
  authority: `You can raise a concern and recommend a pause. You can't run the bias analysis yourself, access demographic data, or suspend the tool on your own authority.`,
  ending: `You find out whether a pattern you noticed becomes a concern the right people investigate, and how much the timing mattered.`,

  begin: `Look at the shortlists`,

  entry: `start`,

  nodes: {
    start: {
      prose: [
        `Ten shortlists. The same narrow profile, across very different roles. What stopped your colleague was the same shape repeating, more than any one odd list.`,
        `Before you decide what to do, you have to decide what a repeated pattern like this tells you.`,
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
        prompt: `Ten shortlists, one shape. What have you got?`,
        choices: [
          { id: `a`, label: `Something is narrowing the field, and it is testable. The pool is wider than the lists.`, quality: `good`,
            consequence: `You write it down in one line, without the word bias in it. It reads like something a person with the data could go and check.` },
          { id: `b`, label: `Maybe the best candidates really do share a profile`, quality: `poor`,
            consequence: `Every name on those lists is a real, qualified person. That was never the question. The question is who is not on them, and nothing in front of you answers it.` },
          { id: `c`, label: `The model is biased. Ten lists like this is not a coincidence.`, quality: `partial`,
            consequence: `It probably is not a coincidence. Said in that shape it is also a finding you have not made, and the first person you say it to will ask how you know.` },
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
          { id: `a`, label: `Raise it with your manager now: describe the pattern and say it warrants a look`, quality: `good`,
            consequence: `You send four lines and the shortlist summary. She reads it in front of you and asks whether your colleague would mind her notes being attached.` },
          { id: `b`, label: `Gather more shortlists yourself first. You want to be sure before raising it`, quality: `partial`,
            consequence: `You start a spreadsheet. Two more roles close while you are building it.` },
          { id: `c`, label: `Leave it. The tool was approved by the business, so it's not your place`, quality: `poor`,
            consequence: `Your colleague raises it in a team meeting the following week. You say nothing, and it is minuted.` },
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
          { id: `a`, label: `Yes. Pause it for active roles until analytics can run the numbers`, quality: `good`,
            consequence: `Two live roles go back to manual shortlisting that afternoon. It costs about a day and a half of somebody's week.` },
          { id: `b`, label: `Keep it running while analytics investigates. Pausing slows hiring`, quality: `partial`,
            consequence: `Hiring keeps moving. Three more shortlists come out of the tool while analytics is still setting up, and they look like the other ten.` },
        ],
      },
      branches: { a: `n_pause_comms`, b: `n_pause_comms` },
    },

    n_pause_comms: {
      prose: [
        `The decision's made: paused, or running under review. Either way there are live roles mid-process and hiring managers who were relying on the tool this week.`,
        `Your manager asks how to handle them, because "the AI tool is under investigation for bias" is a sentence that travels.`,
      ],
      decision: {
        prompt: `What do you advise telling the affected managers?`,
        choices: [
          { id: `a`, label: `The plain version: the tool's under review for a possible pattern, here's the interim manual process`, quality: `good`,
            consequence: `Two of the four ask to see their recent shortlists again. One of them finds a candidate she had passed over and rings her.` },
          { id: `b`, label: `Just say there's a technical issue and shortlists will be a bit slower`, quality: `partial`,
            consequence: `Nobody asks a follow-up question, which is what you wanted. Nobody re-reads a shortlist either.` },
        ],
      },
      branches: { a: `n_evidence`, b: `n_evidence` },
    },

    n2_investigate_more: {
      prose: [
        `You decide to build the case yourself first. Twenty shortlists now, and the pattern holds: consistently narrow profiles. But you don't have demographic data, so you can confirm the shape and not the bias.`,
        `Three more weeks have passed. The tool is still running.`,
      ],
      decision: {
        prompt: `You've done the preliminary work. Now what?`,
        choices: [
          { id: `a`, label: `Escalate now. Twenty shortlists is more than enough for a proper investigation`, quality: `good`,
            consequence: `Twenty roles' worth of summary, sent in one email. Analytics reply the same day asking why nobody flagged it in March.` },
          { id: `b`, label: `Try to get demographic data yourself to prove it before raising it`, quality: `poor`,
            consequence: `You ask a friend in the people team to pull the fields for you as a favour. She hesitates, and then does it.` },
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
          { id: `a`, label: `Be honest. You saw the pattern three months ago and didn't raise it`, quality: `partial`,
            consequence: `You say three months out loud in a small room. The investigator writes the date down and asks what you saw first.` },
          { id: `b`, label: `Say you didn't notice anything unusual`, quality: `poor`,
            consequence: `The minutes from your colleague's team meeting are already in the bundle. Your name is in the attendance list on that page.` },
        ],
      },
      branches: { a: `n_ignored_now`, b: `outcome_bad` },
    },

    n_ignored_now: {
      prose: [
        `You've told HR the truth: you saw it, and you didn't raise it. The investigation is underway regardless, and it's bigger than you now.`,
        `The investigator asks one more thing, because you're the person who watched this longest. What would have caught it sooner?`,
      ],
      decision: {
        prompt: `What do you tell them?`,
        choices: [
          { id: `a`, label: `That the pattern was visible in the aggregate from early on, and nobody was tasked to look. Name that gap`, quality: `good`,
            consequence: `You describe what the aggregate looked like in week one and who would have had to be looking to see it. It ends up as two paragraphs in the finding.` },
          { id: `b`, label: `That it's hard to say. These things are complicated`, quality: `partial`,
            consequence: `The investigator waits, and then moves on to the next question. Nothing you saw over three months makes it into the report.` },
        ],
      },
      branches: { a: `outcome_warn`, b: `outcome_warn` },
    },

    n_evidence: {
      prose: [
        `The concern is now formally in analytics' hands. While they set up, your manager asks what the investigation needs from you and the colleague who first spotted it.`,
        `You realise the honest answer involves how much of this rests on her three weeks of notes.`,
      ],
      decision: {
        prompt: `What do you make sure happens?`,
        choices: [
          { id: `a`, label: `Hand analytics the full record (her notes, the ten roles, the pool comparison) and credit her for spotting it`, quality: `good`,
            consequence: `Her three weeks of notes go across with her name on the file. Analytics start from week three rather than week nought.` },
          { id: `b`, label: `Let analytics start fresh. Cleaner if the numbers come from them, not from us`, quality: `partial`,
            consequence: `Analytics start from scratch, which adds about a fortnight. Your colleague's notes stay in her drawer.` },
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
            consequence: `It lands as a line item with an owner's name against it. The first monthly report comes out six weeks later and takes someone forty minutes.` },
          { id: `b`, label: `Ask everyone to keep an eye on the shortlists`, quality: `partial`,
            consequence: `Everyone agrees to keep an eye out. This is the arrangement that was in place for the last three months.` },
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
      reaction: `Saying "something looks off" before you can prove it takes nerve, and it was the most useful thing anyone did here.`,
      description: [
        `The tool was paused while analytics ran the numbers. They confirmed a significant disparity, and the vendor was told to fix it.`,
        `The monitoring you recommended means the next drift gets caught in week one, not by luck three months in.`,
      ],
      judgement: `You treated the pattern as something to test, neither dismissed nor assumed, and raised it before you could prove it. That's a valid trigger. Monitoring turns a lucky catch into a system that doesn't need luck.`,
    },

    outcome_good: {
      heading: `Raised and investigated. Still leaning on luck.`,
      tone: `good`,
      score: 70,
      reaction: `You noticed, raised it and got it paused. "Keep an eye out" as the fix is where it slips. That only worked by chance.`,
      description: [
        `The tool was paused and the investigation run properly.`,
        `But the safeguard you left is the same informal vigilance that let this run for three months. It worked because one colleague tracked it in her own time. The next team might not have her.`,
      ],
      judgement: `Bias in AI output stays invisible until someone looks at the aggregate on purpose. The lasting fix is scheduled monitoring with a named owner. Asking everyone to stay alert relies on the alertness that nearly failed.`,
    },

    outcome_warn: {
      heading: `Honest, late, in an investigation`,
      tone: `warn`,
      score: 30,
      reaction: `Telling the truth about a three-month silence is uncomfortable, and still the right call.`,
      description: [
        `You were honest about what you knew and when. The finding didn't pin it on you. The failure was bigger than one coordinator staying quiet.`,
        `But the three-month gap between noticing and raising is in the record, and it didn't need to be.`,
      ],
      judgement: `"Not my place" is no defence in a discrimination investigation, and it isn't true. Raising a problem is everyone's job. The pattern was catchable in week one, and the cost of waiting fell mostly on the candidates screened out meanwhile.`,
    },

    outcome_bad: {
      heading: `Not raised, or raised the wrong way, and it starts with you`,
      tone: `bad`,
      score: 5,
      reaction: `Both roads felt safer than they were: staying quiet, or trying to prove it alone with data you weren't cleared to touch.`,
      description: [
        `Either a complaint surfaced the pattern you'd chosen not to raise, or pulling demographic data informally created a second breach while the first carried on.`,
        `The investigation asks what you knew and when, and now the story is partly about you.`,
      ],
      judgement: `Demographic data is governed for good reasons, and going around that is its own incident. "It wasn't my place" is a weak answer in any discrimination case. Raise it early and let the people with the data and clearance do the proving.`,
    },
  },

  debrief: {
    frame: [
      `AI bias doesn't look like bias from inside the work. Every shortlist was defensible on its own. The pattern only showed across ten roles, to someone who looked on purpose, which is why it ran for three months.`,
      `"Maybe the best candidates really do look alike" is a fair thought, and exactly the one that stops an investigation. A narrow output from a varied pool is a hypothesis to test. Your job is to notice and raise it early.`,
    ],
  },

  recall: {
    id: `e1-recall`,
    prompt: `A different team says their AI shortlisting tool "can't be biased. We removed name, age, gender and postcode from the inputs." Is that reassurance sound?`,
    options: [
      { id: `a`, quality: `poor`, label: `Yes. With those fields removed, the model has nothing to be biased on`,
        note: `Models rebuild removed attributes from proxies: university, career gaps, hobbies, phrasing. "We stripped the obvious fields" is the false reassurance this scenario warns about.` },
      { id: `b`, quality: `good`, label: `No. Models infer removed attributes from proxies, so it still needs output monitoring`,
        note: `Right. The only way to know is to look at the outputs in aggregate, broken down by group. Clean inputs don't guarantee clean results.` },
      { id: `c`, quality: `partial`, label: `Mostly. Removing those fields helps a lot, though edge cases might slip through`,
        note: `It can help, and it's no guarantee. Rebuilding attributes from proxies is the normal case, not the edge, which is why you check the outputs.` },
    ],
  },

  act: [
    { id: `a1`, label: `If you work with an AI tool that ranks or filters people, ask whether its outputs are monitored in aggregate` },
    { id: `a2`, label: `Next time you notice a pattern that "looks off", raise it before you can fully prove it` },
    { id: `a3`, label: `Find out who owns bias monitoring for an AI tool your team uses, and whether anyone does` },
  ],

  controls_summary: [
    { id: `c1`, label: `Scheduled disaggregated monitoring of AI ranking outputs`, effort: `Medium`, owner: `HR / analytics`, go_live: true,
      context: `Bias is invisible per-decision and only shows in the aggregate. Monitoring you schedule catches it; vigilance you hope for caught this one three months late.` },
    { id: `c2`, label: `A low-bar escalation route for "this looks off"`, effort: `Low`, owner: `Team lead`, go_live: true,
      context: `The single best signal here came from a coordinator noticing. Make raising a hunch cheap and safe, because proof is not the raiser's job.` },
    { id: `c3`, label: `Governed access to demographic data for bias analysis`, effort: `Medium`, owner: `Data governance`, go_live: false,
      context: `Confirming bias needs protected data handled properly. The bad ending came partly from someone trying to get it informally. Give the investigation a sanctioned path.` },
  ],

  tell: `AI bias is invisible one decision at a time. It only shows in the aggregate, so someone has to look on purpose.`,
};
