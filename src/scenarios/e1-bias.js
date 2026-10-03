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
    `You coordinate hiring for a mid-size team, and three months ago the company brought in an AI tool that picks a shortlist from everyone who applies.`,
    `It's been fast and popular. But across ten jobs now, the shortlists keep showing the same narrow type of person. A colleague in your team noticed before you did, and she's been keeping notes for three weeks.`,
    `This morning she showed you her notes. Now you're seeing it too.`,
  ],

  standing: `Hiring coordinator, part of the team that runs the tool day to day`,
  authority: `You can raise a concern and recommend a pause. You can't run the bias analysis yourself, see data on candidates' age, gender or background, or switch the tool off on your own.`,
  ending: `You find out whether a pattern you noticed becomes a concern the right people investigate, and how much the timing mattered.`,

  begin: `Look at the shortlists`,

  entry: `start`,

  nodes: {
    start: {
      prose: [
        `Ten shortlists, for very different jobs, all showing the same narrow type of person. No single list stood out. The repeat did.`,
        `Before you act, decide what this pattern tells you.`,
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
          { id: `a`, label: `Something is narrowing the field, and it can be checked. The applicants are more varied than the lists.`, quality: `good`,
            consequence: `You write it down in one line, without the word bias in it. It reads like something a person with the data could go and check.` },
          { id: `b`, label: `Maybe the best candidates really do share a profile`, quality: `poor`,
            consequence: `Every name on those lists is a real, qualified person. What matters is who is missing, and you can't tell that from here.` },
          { id: `c`, label: `The model is biased. Ten lists like this is not a coincidence.`, quality: `partial`,
            consequence: `It probably isn't a coincidence. But you haven't proved it's bias, and the first person you tell will ask how you know.` },
        ],
      },
      branches: { a: `n_response`, b: `n_response`, c: `n_response` },
    },

    n_response: {
      prose: [
        `Whatever the cause, it looks like a pattern, and your colleague thinks it's worth raising.`,
      ],
      decision: {
        prompt: `What do you do about what you've seen?`,
        choices: [
          { id: `a`, label: `Raise it with your manager now: describe the pattern and say it needs looking into`, quality: `good`,
            consequence: `You send four lines and the shortlist summary. She reads it in front of you and asks whether your colleague would mind her notes being attached.` },
          { id: `b`, label: `Gather more shortlists yourself first. You want to be sure before raising it`, quality: `partial`,
            consequence: `You start a spreadsheet. Two more roles close while you are building it.` },
          { id: `c`, label: `Leave it. The tool was approved by the business, so it's not your place`, quality: `poor`,
            consequence: `Your colleague raises it in a team meeting the following week. You say nothing, and that goes in the meeting notes.` },
        ],
      },
      branches: { a: `n2_concern_raised`, b: `n2_investigate_more`, c: `n2_ignored` },
    },

    n2_concern_raised: {
      prose: [
        `Your manager looks at the shortlists with you and agrees it needs looking into. Then she asks the question that decides the next three months.`,
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
        `Paused or not, there are jobs mid-recruitment and hiring managers who were relying on the tool this week.`,
        `Your manager asks how to handle them, because "the AI tool is under investigation for bias" is the kind of news that spreads fast.`,
      ],
      decision: {
        prompt: `What do you advise telling the affected managers?`,
        choices: [
          { id: `a`, label: `The plain version: the tool is being checked for a possible problem, and here's how to shortlist by hand meanwhile`, quality: `good`,
            consequence: `Two of the four ask to see their recent shortlists again. One of them finds a candidate she had passed over and rings her.` },
          { id: `b`, label: `Just say there's a technical issue and shortlists will be a bit slower`, quality: `partial`,
            consequence: `Nobody asks questions. Nobody rechecks a shortlist either.` },
        ],
      },
      branches: { a: `n_evidence`, b: `n_evidence` },
    },

    n2_investigate_more: {
      prose: [
        `You decide to build the case yourself first. Twenty shortlists now, and the pattern holds. But without data on age, gender or background, you can show the pattern but not prove bias.`,
        `Three more weeks have passed. The tool is still running.`,
      ],
      decision: {
        prompt: `You've done the groundwork. Now what?`,
        choices: [
          { id: `a`, label: `Raise it now. Twenty shortlists is more than enough for a proper investigation`, quality: `good`,
            consequence: `Twenty roles' worth of summary, sent in one email. Analytics reply the same day asking why nobody flagged it in March.` },
          { id: `b`, label: `Get candidates' age and background data yourself to prove it first`, quality: `poor`,
            consequence: `You ask a friend in HR to pull the data for you as a favour. She hesitates, and then does it.` },
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
            consequence: `You say "three months" out loud in a small room. The investigator writes the date down and asks what you saw first.` },
          { id: `b`, label: `Say you didn't notice anything unusual`, quality: `poor`,
            consequence: `The minutes from your colleague's team meeting are already in the file. Your name is in the attendance list on that page.` },
        ],
      },
      branches: { a: `n_ignored_now`, b: `outcome_bad` },
    },

    n_ignored_now: {
      prose: [
        `You've told HR the truth: you saw it, and you didn't raise it. The investigation is going ahead, and it's about more than you now.`,
        `The investigator asks one more thing, because you're the person who watched this longest. What would have caught it sooner?`,
      ],
      decision: {
        prompt: `What do you tell them?`,
        choices: [
          { id: `a`, label: `That the pattern showed up early across all the lists, and nobody's job was to look`, quality: `good`,
            consequence: `You describe what the lists looked like together in week one, and whose job it should have been to look. It ends up in the final report.` },
          { id: `b`, label: `That it's hard to say. These things are complicated`, quality: `partial`,
            consequence: `The investigator waits, and then moves on to the next question. Nothing you saw over three months makes it into the report.` },
        ],
      },
      branches: { a: `outcome_warn`, b: `outcome_warn` },
    },

    n_evidence: {
      prose: [
        `The analytics team now officially has the case. While they set up, your manager asks what the investigation needs from you and the colleague who first spotted it.`,
        `Most of it rests on her three weeks of notes.`,
      ],
      decision: {
        prompt: `What do you make sure happens?`,
        choices: [
          { id: `a`, label: `Hand analytics the full record (her notes, the ten jobs, the comparison with all applicants) and credit her for spotting it`, quality: `good`,
            consequence: `Her three weeks of notes go across with her name on the file. Analytics start three weeks ahead instead of from zero.` },
          { id: `b`, label: `Let analytics start fresh. Cleaner if the numbers come from them, not from us`, quality: `partial`,
            consequence: `Analytics start from scratch, which adds about a fortnight. Your colleague's notes stay in her drawer.` },
        ],
      },
      branches: { a: `n_close`, b: `n_close` },
    },

    n_close: {
      prose: [
        `Analytics will take weeks to report back. Your manager asks what should change so a pattern like this gets caught in week one, not month three.`,
      ],
      decision: {
        prompt: `What do you recommend?`,
        choices: [
          { id: `a`, label: `Regular checks of who the tool shortlists, broken down by group, from day one, with a named owner`, quality: `good`,
            consequence: `It goes into the plan with an owner's name next to it. The first monthly report comes out six weeks later and takes someone forty minutes.` },
          { id: `b`, label: `Ask everyone to keep an eye on the shortlists`, quality: `partial`,
            consequence: `Everyone agrees to keep an eye out. Nothing has changed from the last three months.` },
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
        `The tool was paused while analytics ran the numbers. They confirmed a significant gap between groups, and the vendor was told to fix it.`,
        `The monitoring you recommended means the next problem gets caught in week one, not by luck three months in.`,
      ],
      judgement: `You treated the pattern as something to check, without dismissing it or jumping to conclusions, and raised it before you could prove it. Regular checks turn a lucky catch into a system that doesn't need luck.`,
    },

    outcome_good: {
      heading: `Raised and investigated. Still leaning on luck.`,
      tone: `good`,
      score: 70,
      reaction: `You noticed, raised it and got it paused. "Keep an eye out" as the fix is where it slips. That only worked by chance.`,
      description: [
        `The tool was paused and the investigation run properly.`,
        `But you left the same "someone will notice" approach that let this run for three months. It worked because one colleague kept notes in her own time. The next team might not have her.`,
      ],
      judgement: `Bias in an AI tool stays invisible until someone looks at all its results together, on purpose. The lasting fix is scheduled monitoring with a named owner. Asking everyone to stay alert relies on the alertness that nearly failed.`,
    },

    outcome_warn: {
      heading: `Honest, late, in an investigation`,
      tone: `warn`,
      score: 30,
      reaction: `Telling the truth about a three-month silence is uncomfortable, and still the right call.`,
      description: [
        `You were honest about what you knew and when. The final report didn't blame you. The failure was bigger than one coordinator staying quiet.`,
        `But the three-month gap between noticing and raising is in the record, and it didn't need to be.`,
      ],
      judgement: `"Not my place" is no defence in a discrimination investigation, and it isn't true. Raising a problem is everyone's job. The pattern was catchable in week one, and the cost of waiting fell mostly on the candidates screened out meanwhile.`,
    },

    outcome_bad: {
      heading: `Not raised, or raised the wrong way, and it starts with you`,
      tone: `bad`,
      score: 5,
      reaction: `Both roads felt safer than they were: staying quiet, or trying to prove it alone with data you weren't allowed to see.`,
      description: [
        `Either a complaint surfaced the pattern you'd chosen not to raise, or pulling personal data without permission created a second problem while the first carried on.`,
        `The investigation asks what you knew and when, and now the story is partly about you.`,
      ],
      judgement: `Personal data like age and gender is protected for good reasons. Going around that is its own breach. "It wasn't my place" is a weak answer in any discrimination case. Raise it early and let the people with the data do the proving.`,
    },
  },

  debrief: {
    frame: [
      `AI bias doesn't look like bias from inside the work. Every shortlist was defensible on its own. The pattern only showed across ten roles, to someone who looked on purpose, which is why it ran for three months.`,
      `"Maybe the best candidates really do look alike" is a fair thought, and exactly the one that stops an investigation. A narrow shortlist from a varied pool of applicants is something to check. Your job is to notice and raise it early.`,
    ],
  },

  recall: {
    id: `e1-recall`,
    prompt: `A different team says their AI shortlisting tool "can't be biased. We removed name, age, gender and postcode from the inputs." Does that settle it?`,
    options: [
      { id: `a`, quality: `poor`, label: `Yes. With those fields removed, the model has nothing to be biased on`,
        note: `Models can work out removed details from other clues, like university, career gaps, hobbies and phrasing. "We stripped the obvious fields" is the false reassurance this scenario warns about.` },
      { id: `b`, quality: `good`, label: `No. Models can guess removed details from other clues, so the results still need checking`,
        note: `Right. The only way to know is to look at all the results together, broken down by group. Clean inputs don't guarantee clean results.` },
      { id: `c`, quality: `partial`, label: `Mostly. Removing those fields helps a lot, though edge cases might slip through`,
        note: `It can help, and it's no guarantee. Models guessing removed details from other clues is normal, not an edge case, which is why you check the results.` },
    ],
  },

  act: [
    { id: `a1`, label: `If you work with an AI tool that ranks or filters people, ask whether anyone checks its results across groups` },
    { id: `a2`, label: `Next time you notice a pattern that "looks off", raise it before you can fully prove it` },
    { id: `a3`, label: `Find out who owns bias monitoring for an AI tool your team uses, and whether anyone does` },
  ],

  controls_summary: [
    { id: `c1`, label: `Regular checks of AI ranking results, broken down by group`, effort: `Medium`, owner: `HR / analytics`, go_live: true,
      context: `Bias is invisible in single decisions and only shows across many. Scheduled checks catch it. Hoping someone notices caught this one three months late.` },
    { id: `c2`, label: `An easy way to raise "this looks off"`, effort: `Low`, owner: `Team lead`, go_live: true,
      context: `The single best signal here came from a coordinator noticing. Make raising a hunch cheap and safe, because proof is not the raiser's job.` },
    { id: `c3`, label: `A proper process for using personal data to check for bias`, effort: `Medium`, owner: `Data governance`, go_live: false,
      context: `Confirming bias needs protected data handled properly. The bad ending came partly from someone trying to get it informally. Give investigations an approved way to get it.` },
  ],

  tell: `AI bias is invisible one decision at a time. It only shows when you look at many together, so someone has to look on purpose.`,
};
