// f1-automation-bias.js — Trust the Machine
// At Work. Migrated to the four-beat schema (FREE_PRODUCT §4) July 2026.
// Perspective: the radiologist reading scan 75 of the day — a staff decision
// about whether to exercise judgement against a confident AI, under real time
// pressure.
//
// The aid is accurate on most studies, and deferring to it is normally the
// efficient, correct choice. The scenario is not "never trust AI": it is about
// the specific moment your own reading diverges from a confident output, and
// how a workflow should be built so that divergence gets acted on rather than
// swallowed.
//
// OUTSTANDING (FREE_PRODUCT B1): this scenario is designated a discrimination
// scenario and the discrimination authoring has not been done. Every played
// path currently vindicates the alarming read. Closing that needs a benign
// resolution authored into the tree, which is new authoring, not a correction.

export const scenario = {
  id: `f1-automation-bias`,
  door: `work`,
  risk_ref: `F1`,
  title: `Trust the Machine`,
  shelfLine: `The AI flags the scan as normal. Your own eye caught something. You have six more to read.`,
  hook: `The AI says the scan is normal, 91% confidence. Your eye caught something. You have six more to read.`,
  scene: `xray-ai`,
  determinacy: `clean`,

  kb_url: `https://library.airiskpractice.org/docs/domain-f-deployment/f1-automation-bias`,
  regulatory_tags: [`eu-ai-act-article-14`, `eu-ai-act-annex-iii`, `jurisdiction-eu`, `jurisdiction-global`],
  mit_subdomain: `mit-5.1`,

  coldOpen: [
    `Scan 75 of 80 for the day. The AI diagnostic aid returns its result before you've finished your own read: Normal, 91% confidence.`,
    `But your eye caught something in the lower right lobe. Subtle. Probably nothing. The AI has been right all week, and it's overruled your doubts three times already.`,
    `91% is not 100%. And the AI has seen 74 scans today. You've seen all 75.`,
  ],

  standing: `Radiologist, mid-career, in a department that runs AI-assisted reads`,
  authority: `You can flag a scan, request a second opinion, and raise a process concern. You can't redesign the tool or change how the department works on your own.`,
  ending: `You find out whether you trust your own eyes when it matters, and whether the setup that nearly hid the problem gets fixed.`,

  begin: `Open scan 75`,

  entry: `start`,

  nodes: {
    start: {
      prose: [
        `The AI's confidence score is sitting there at 91%, and it's making you doubt yourself. It has overruled you three times this week, and been right each time.`,
        `Before you decide what to do with this scan, be clear about what that 91% tells you.`,
      ],
      artefact: {
        type: `system_output`,
        caption: `The AI read, on screen before yours`,
        system: `RadAssist AI · study 75 of 80`,
        status: `Normal`,
        headline: `No regions flagged`,
        fields: [
          { label: `Result`, value: `Normal` },
          { label: `Confidence`, value: `91%` },
          { label: `Regions flagged`, value: `None` },
          { label: `Validation`, value: `94% overall accuracy; 88% sensitivity on abnormal studies` },
        ],
        rationale: `Confidence is the model's own output, not an audited probability that this result is right. Models tend to report high confidence on studies that resemble their training data.`,
        trail: [
          `Result returned automatically when the study loaded.`,
          `Displayed before the reporting radiologist enters their own read.`,
        ],
      },
      decision: {
        prompt: `What does that 91% tell you?`,
        choices: [
          { id: `a`, label: `Less than it feels like. It's the AI's own estimate, not a checked chance that this scan is normal`, quality: `good`,
            consequence: `You look at the line underneath it. The AI is right 94% of the time overall, but only catches 88% of abnormal scans. That second number is the one that matters if this scan is abnormal.` },
          { id: `b`, label: `91% is strong evidence it's right. Overruling a confident AI is the riskier move`, quality: `poor`,
            consequence: `You've ignored your doubts three times this week and been right to. You can't tell from the inside whether this is the fourth time, or the time you're wrong.` },
          { id: `c`, label: `The AI has seen far more scans than you have`, quality: `partial`,
            consequence: `It has, but only before today. Whatever it missed in training, it still misses, and the score can't tell you if this is one of those.` },
        ],
      },
      branches: { a: `n_response`, b: `n_response`, c: `n_response` },
    },

    n_response: {
      prose: [
        `When you look again, the shadow is still there in the lower right lung. It could be a glitch in the image. The AI says normal, and there are five scans behind this one.`,
      ],
      decision: {
        prompt: `The AI says normal. Your instinct says look again. What do you do?`,
        choices: [
          { id: `a`, label: `Flag it: write down what you see and ask for a second opinion before signing off`, quality: `good`,
            consequence: `You write two lines describing what you can see and send it for a second read. It takes ninety seconds you did not have.` },
          { id: `b`, label: `Spend another two minutes on the image yourself before deciding`, quality: `partial`,
            consequence: `You zoom in twice. What you can see doesn't change, and nothing is written down yet.` },
          { id: `c`, label: `Accept the AI result. 91% confidence, and six more to get through`, quality: `poor`,
            consequence: `Twelve seconds, signed, next scan. The one after is a simple fracture and you're back in rhythm.` },
        ],
      },
      branches: { a: `n2_flagged`, b: `n2_reviewed`, c: `n2_accepted` },
    },

    n2_flagged: {
      prose: [
        `You flag it and request a second opinion. A senior colleague looks at it without being told what you saw. She spots the same shadow, and orders a follow-up CT scan.`,
        `The CT shows a small tumour that can be removed. It's early, and the outlook is good.`,
      ],
      decision: {
        prompt: `The patient is fine. But you're thinking about the other 74 scans, and the screen layout that nearly hid this one. What do you do with that?`,
        choices: [
          { id: `a`, label: `Raise it formally: the AI's answer shows before you've done your own read, which nudges you to accept it`, quality: `good`,
            consequence: `You write it up properly, which takes longer than the flag did. The department lead reads it that afternoon and asks you to come and explain the display order to him.` },
          { id: `b`, label: `Note it in your own records as a reminder to be more careful`, quality: `partial`,
            consequence: `You note it in your own file and mean it. Nobody else's screen changes.` },
        ],
      },
      branches: { a: `n_others`, b: `n_others` },
    },

    n2_reviewed: {
      prose: [
        `Two more minutes. The shadow is still there, faint but real, and you're now fairly sure it isn't a glitch.`,
        `Now you have to act on what you can see.`,
      ],
      decision: {
        prompt: `Looking longer has made you more sure. Now what?`,
        choices: [
          { id: `a`, label: `Flag it for a second opinion`, quality: `good`,
            consequence: `Your colleague finds the same thing within a minute, without being told where to look.` },
          { id: `b`, label: `Override the AI yourself and document your finding. No second opinion needed`, quality: `partial`,
            consequence: `You write your own report against the aid's result and sign it. It's your name and your call alone on scan 75 of 80.` },
          { id: `c`, label: `It's 91% confidence and your read could still be wrong. Accept normal`, quality: `poor`,
            consequence: `You spent four minutes looking, then signed off what the AI said. There are five scans left and it is twenty past six.` },
        ],
      },
      branches: { a: `n_others`, b: `n_others`, c: `outcome_bad` },
    },

    n2_accepted: {
      prose: [
        `You sign it off as normal. Twelve seconds on scan 75 of 80.`,
        `Three months later the patient returns with symptoms. A new scan confirms early-stage lung cancer, and the original X-ray is reviewed. The tumour was visible. The AI missed it, and so did your sign-off.`,
      ],
      decision: {
        prompt: `The review board asks whether anything on the original scan gave you pause. What do you tell them?`,
        choices: [
          { id: `a`, label: `The truth: you noticed something, the AI said normal, and you went along with it under time pressure`, quality: `partial`,
            consequence: `You tell them about the hesitation, the score, and the clock. It's hard to say, and the room goes quiet.` },
          { id: `b`, label: `That the AI result was normal and your review confirmed it`, quality: `poor`,
            consequence: `The system log shows you signed off in twelve seconds. It's on the screen behind you as you speak.` },
        ],
      },
      branches: { a: `n_board`, b: `outcome_bad` },
    },

    n_design: {
      prose: [
        `This scan is dealt with. What's left is the problem you noticed: the AI's answer appears before you've done your own read, so every scan starts from its answer, not yours.`,
        `The department lead asks what would change that.`,
      ],
      decision: {
        prompt: `What do you recommend?`,
        choices: [
          { id: `a`, label: `Change the order: radiologists do their own read before the AI's answer is shown`, quality: `good`,
            consequence: `The supplier says the setting can be changed. IT says it will take four weeks, and asks who will approve doing fewer scans a day.` },
          { id: `b`, label: `Add a mandatory second opinion on every AI-normal finding`, quality: `partial`,
            consequence: `It's in place within a fortnight, which is fast for here. But every first read still opens on the AI's answer.` },
          { id: `c`, label: `Run extra training on over-trusting AI, and add a tick-box to confirm you checked`, quality: `poor`,
            consequence: `Ninety minutes of online training and a tick-box after every session. Nobody learns anything they didn't already know.` },
        ],
      },
      branches: { a: `n_tradeoff`, b: `n_tradeoff`, c: `outcome_warn` },
    },

    n_tradeoff: {
      prose: [
        `Your suggestion runs into a real problem. Changing the order, or adding second reads, means fewer scans a day, and the department is judged on that number.`,
        `The lead is sympathetic and under pressure: "I can take this up, but I'll be asked what it costs us."`,
      ],
      decision: {
        prompt: `How do you explain the trade-off so it gets approved?`,
        choices: [
          { id: `a`, label: `Say it plainly: a few fewer scans a day against the risk of missed cancers, and let the hospital's safety committee decide`, quality: `good`,
            consequence: `He writes down your two sentences almost word for word and takes them upstairs. It's now their decision, which is where it belongs.` },
          { id: `b`, label: `Play down the cost to get it approved. Say the slowdown is tiny`, quality: `partial`,
            consequence: `It is approved in a week. Six weeks later, in a bad fortnight, the list backs up and the first thing people blame is your change.` },
        ],
      },
      branches: { a: `outcome_great`, b: `outcome_good` },
    },

    n_board: {
      prose: [
        `You gave the board a straight account. The cancer was diagnosed later than it should have been. Because you were honest, the review can look for the cause instead of stopping at you.`,
        `They ask you directly: what would have made the difference?`,
      ],
      decision: {
        prompt: `What do you tell them went wrong?`,
        choices: [
          { id: `a`, label: `Seeing the AI's answer first pushed me into a twelve-second read. It's a design failure, not just my error`, quality: `good`,
            consequence: `Saying it with your own name on the report is not comfortable. One of the board members asks the clinical systems lead to bring the screen layout to the next meeting.` },
          { id: `b`, label: `That I should have been more careful, and I'll pay more attention`, quality: `partial`,
            consequence: `The board accepts it and records it as your mistake. The screen is the same on Monday.` },
        ],
      },
      branches: { a: `n_others`, b: `n_others` },
    },

    n_others: {
      prose: [
        `Whether this scan was caught or missed, the same uncomfortable thought hits you: you've already read 74 scans today the same way, at the same pace, with the AI's answer showing first each time.`,
        `Some of them were scans the AI called normal, which you signed off quickly.`,
      ],
      decision: {
        prompt: `What do you do about the scans you've already read today?`,
        choices: [
          { id: `a`, label: `Ask for today's AI-normal scans to be re-checked, starting with the fastest sign-offs`, quality: `good`,
            consequence: `Nineteen of the day's sign-offs come back under twenty seconds. Two of those get a second read and one of the two gets a follow-up.` },
          { id: `b`, label: `Assume the rest were fine. This was the one that happened to catch your eye`, quality: `partial`,
            consequence: `You go home at seven. The other seventy-four sit in the system exactly as you left them.` },
          { id: `c`, label: `Say nothing about the others. Reopening them puts your whole day under the microscope`, quality: `poor`,
            consequence: `Nobody asks. Today's scans stay as they are, each with its sign-off time on record.` },
        ],
      },
      branches: { a: `n_design`, b: `n_design`, c: `n_design` },
    },
  },

  outcomes: {
    outcome_great: {
      heading: `You trusted your eyes, and fixed the screen`,
      tone: `good`,
      score: 100,
      reaction: `Flagging a scan the AI called normal, at scan 75 of the day, takes a pause that time pressure wears away. You held on.`,
      description: [
        `The tumour was caught early and the patient did well.`,
        `Your concern about the screen was acted on. Radiologists now finish their own read before the AI's answer appears, and more cancers were caught early the next quarter.`,
      ],
      judgement: `Over-trusting AI is a design problem as much as a personal one. An answer shown first pulls your read towards it. You caught the case and fixed the screen that nearly hid it.`,
    },

    outcome_good: {
      heading: `Caught it. Reached for the net, not the cause.`,
      tone: `good`,
      score: 72,
      reaction: `A second opinion on every AI-normal read does catch cases. It's also the expensive way to fix a problem caused by a screen layout.`,
      description: [
        `The tumour was caught and the patient did well. The second-read rule you recommended went in and caught two more cases in six months.`,
        `It's better than before, and costlier than it needed to be, because the AI's answer still shows first.`,
      ],
      judgement: `Changing the display order fixes the cause. A second opinion on every scan catches what slips through. Both work, but one fixes the problem and the other pays for it on every scan, forever.`,
    },

    outcome_warn: {
      heading: `Handled, but the fix stopped at the person`,
      tone: `warn`,
      score: 35,
      reaction: `"I'll be more careful" and "more training" both feel responsible. Both put the problem in the person, not the screen that nudged them.`,
      description: [
        `Caught or missed, the response was to try harder: a tick-box, a reminder, a promise to concentrate. The AI-first display stayed as it was.`,
        `The next radiologist meets the same screen on their own 75th scan, with the same twelve seconds.`,
      ],
      judgement: `Nobody was careless, so being careful was never the fix. Showing the AI's answer first set up the error. A tick-box on top records the risk without reducing it.`,
    },

    outcome_bad: {
      heading: `You went along with the AI, then described a check you didn't do`,
      tone: `bad`,
      score: 5,
      reaction: `Saying "my review confirmed it" after a missed diagnosis is a human flinch. It makes the investigation about you instead of the design.`,
      description: [
        `The cancer was diagnosed late. Your account to the review board described a review the records contradict: a twelve-second sign-off on scan 75 of 80.`,
        `The mismatch became the focus, and the screen layout that caused it stayed in place.`,
      ],
      judgement: `Over-trusting AI under time pressure is predictable, and a review board exists to find what went wrong in the system. A false account turns a design failure it could fix into a question about your honesty.`,
    },
  },

  debrief: {
    frame: [
      `The AI didn't malfunction. It's accurate on most scans, which is the problem: a tool that's usually right trains you to stop looking. Its confidence figure is its own estimate, so a confident misread looks the same as a confident correct one.`,
      `The cause was the order on screen. The AI's answer arrived first, so every scan started from it. That pull is called anchoring. Training alone doesn't remove it. Reading first, then seeing the AI, does.`,
    ],
  },

  recall: {
    id: `f1-recall`,
    prompt: `A different team defends showing the AI's answer first: "our staff are trained professionals. They're told to use their own judgement and not just go along with the AI." Is that enough?`,
    options: [
      { id: `a`, quality: `poor`, label: `Yes. Trained professionals told to use their judgement will catch the AI's errors`,
        note: `The radiologist here was a trained professional using their judgement, and seeing the AI's answer first still led to a twelve-second sign-off. Telling people to resist doesn't remove the pull.` },
      { id: `b`, quality: `good`, label: `No. Telling people to resist the pull doesn't remove it. Changing the display order does`,
        note: `Right. Showing a confident answer first, under time pressure, predictably sways people. Human first, AI second is what makes the human check real.` },
      { id: `c`, quality: `partial`, label: `Partly. Training helps, but a second-opinion requirement would make it safer`,
        note: `Both help, but neither stops the pull. Changing the display order does. The rest makes up for leaving the problem in place.` },
    ],
  },

  act: [
    { id: `a1`, label: `If you use an AI aid, notice whether its answer shows before or after your own assessment` },
    { id: `a2`, label: `Next time you disagree with an AI, treat that as a warning sign, not something to explain away` },
    { id: `a3`, label: `Ask whether the human check in your work is real, or a rubber stamp on the AI's answer` },
  ],

  controls_summary: [
    { id: `c1`, label: `People do their own assessment before the AI's answer shows`, effort: `Medium`, owner: `Clinical systems`, go_live: true,
      context: `Removes the pull instead of asking people to resist it. It's the fix every good ending here names.` },
    { id: `c2`, label: `When a person and the AI disagree, a second person checks`, effort: `Medium`, owner: `Department lead`, go_live: true,
      context: `When your read and the AI's differ, that's the signal. Send it to someone, instead of leaving it to one tired person.` },
    { id: `c3`, label: `Check how an AI tool presents its answers before buying it`, effort: `Low`, owner: `Procurement`, go_live: false,
      context: `How an AI output is presented to a time-pressured reviewer decides whether the human check is real. Check it before buying, not after an incident.` },
  ],

  tell: `A confident AI answer shown before you've formed your own pulls your judgement towards it. Look first, then check the AI.`,
};
